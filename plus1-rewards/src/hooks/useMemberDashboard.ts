// src/hooks/useMemberDashboard.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface MemberData {
  id: string;
  name: string;
  phone: string;
  qr_code: string;
  active_policy: string | null;
  created_at: string;
}

interface Wallet {
  id: string;
  partner_id: string;
  rewards_total: number;
  balance: number;
  commission_rate: number;
  status: string;
}

interface Partner {
  id: string;
  name: string;
  phone: string;
  location: string;
  status: string;
}

interface Transaction {
  id: string;
  partner_id: string;
  purchase_amount: number;
  member_reward: number;
  created_at: string;
  status: string;
}

interface MemberStats {
  totalRewards: number;
  totalBalance: number;
  partnerShops: number;
  pendingTransactions: number;
}

export const useMemberDashboard = (memberId: string | null) => {
  const [member, setMember] = useState<MemberData | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [partners, setPartners] = useState<Map<string, Partner>>(new Map());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<MemberStats>({
    totalRewards: 0,
    totalBalance: 0,
    partnerShops: 0,
    pendingTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemberData = async () => {
    if (!memberId) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch member data
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', memberId)
        .single();

      if (memberError) throw memberError;
      setMember(memberData);

      // Fetch wallets
      const { data: walletsData, error: walletsError } = await supabase
        .from('wallets')
        .select('*')
        .eq('member_id', memberId);

      if (walletsError) throw walletsError;
      setWallets(walletsData || []);

      // Fetch partners for wallets
      if (walletsData && walletsData.length > 0) {
        const partnerIds = walletsData.map(w => w.partner_id);
        const { data: partnersData, error: partnersError } = await supabase
          .from('partners')
          .select('*')
          .in('id', partnerIds);

        if (partnersError) throw partnersError;

        const partnersMap = new Map(partnersData?.map(s => [s.id, s]) || []);
        setPartners(partnersMap);
      }

      // Fetch transactions
      const { data: transactionsData, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transError) throw transError;
      setTransactions(transactionsData || []);

      // Calculate stats
      const totalRewards = (walletsData || []).reduce((sum, w) => sum + (w.rewards_total || 0), 0);
      const totalBalance = (walletsData || []).reduce((sum, w) => sum + (w.balance || 0), 0);
      const pendingTransactions = (transactionsData || []).filter(t => t.status === 'pending_sync').length;

      setStats({
        totalRewards,
        totalBalance,
        partnerShops: walletsData?.length || 0,
        pendingTransactions
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch member data');
      console.error('Error fetching member data:', err);
    } finally {
      setLoading(false);
    }
  };

  const spendRewards = async (partnerId: string, amount: number) => {
    try {
      const wallet = wallets.find(w => w.partner_id === partnerId);
      if (!wallet) throw new Error('Wallet not found');
      if (wallet.balance < amount) throw new Error('Insufficient balance');

      // Create spend transaction
      const { data: transaction, error: transError } = await supabase
        .from('transactions')
        .insert({
          member_id: memberId,
          partner_id: partnerId,
          purchase_amount: amount,
          member_reward: -amount,
          partner_contribution: 0,
          agent_commission: 0,
          platform_fee: 0,
          is_spend: true,
          status: 'pending_sync'
        })
        .select()
        .single();

      if (transError) throw transError;

      // Update wallet
      await supabase
        .from('wallets')
        .update({
          balance: wallet.balance - amount
        })
        .eq('id', wallet.id);

      // Refresh data
      await fetchMemberData();
      return transaction;
    } catch (err: any) {
      setError(err.message || 'Failed to spend rewards');
      throw err;
    }
  };

  const syncPendingTransactions = async () => {
    try {
      const pendingTransactions = transactions.filter(t => t.status === 'pending_sync');
      
      for (const transaction of pendingTransactions) {
        await supabase
          .from('transactions')
          .update({ status: 'synced', synced_at: new Date().toISOString() })
          .eq('id', transaction.id);
      }

      await fetchMemberData();
    } catch (err: any) {
      setError(err.message || 'Failed to sync transactions');
      throw err;
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, [memberId]);

  return {
    member,
    wallets,
    partners,
    transactions,
    stats,
    loading,
    error,
    spendRewards,
    syncPendingTransactions,
    refetch: fetchMemberData
  };
};
