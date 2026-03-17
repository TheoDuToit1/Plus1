// src/hooks/useShopDashboard.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ShopData {
  id: string;
  name: string;
  phone: string;
  commission_rate: number;
  status: string;
  created_at: string;
}

interface Transaction {
  id: string;
  member_id: string;
  purchase_amount: number;
  shop_contribution: number;
  member_reward: number;
  created_at: string;
  status: string;
}

interface ShopStats {
  todayRewards: number;
  totalMembers: number;
  totalTransactions: number;
  totalRevenue: number;
  commissionRate: number;
}

export const useShopDashboard = (shopId: string | null) => {
  const [shop, setShop] = useState<ShopData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<ShopStats>({
    todayRewards: 0,
    totalMembers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    commissionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShopData = async () => {
    if (!shopId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch shop data
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId);

      if (shopError) {
        console.error('Shop fetch error:', shopError);
        throw shopError;
      }
      
      if (shopData && shopData.length > 0) {
        setShop(shopData[0]);
      }

      // Fetch today's transactions
      const today = new Date().toISOString().split('T')[0];
      const { data: todayTransactions, error: todayError } = await supabase
        .from('transactions')
        .select('*')
        .eq('shop_id', shopId)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false });

      if (todayError) {
        console.error('Today transactions error:', todayError);
      }

      // Fetch all transactions for stats
      const { data: allTransactions, error: allError } = await supabase
        .from('transactions')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (allError) {
        console.error('All transactions error:', allError);
      }

      setTransactions(allTransactions || []);

      // Fetch unique members
      const { data: members, error: membersError } = await supabase
        .from('wallets')
        .select('member_id')
        .eq('shop_id', shopId);

      if (membersError) {
        console.error('Members error:', membersError);
      }

      const uniqueMembers = new Set(members?.map(m => m.member_id) || []).size;

      // Calculate stats
      const todayRewards = (todayTransactions || []).reduce((sum, t) => sum + (t.member_reward || 0), 0);
      const totalRevenue = (allTransactions || []).reduce((sum, t) => sum + (t.shop_contribution || 0), 0);

      setStats({
        todayRewards,
        totalMembers: uniqueMembers,
        totalTransactions: allTransactions?.length || 0,
        totalRevenue,
        commissionRate: shopData?.[0]?.commission_rate || 0
      });
    } catch (err: any) {
      console.error('Error fetching shop data:', err);
      setError(err.message || 'Failed to fetch shop data');
    } finally {
      setLoading(false);
    }
  };

  const issueRewards = async (memberId: string, purchaseAmount: number) => {
    if (!shopId) return;

    try {
      const commissionRate = shop?.commission_rate || 13;
      
      // Shop pays commission rate % of purchase
      const shopContribution = purchaseAmount * (commissionRate / 100);
      
      // Member gets commission rate minus 2% (1% agent + 1% platform)
      const memberRewardRate = Math.max(0, commissionRate - 2);
      const memberReward = purchaseAmount * (memberRewardRate / 100);
      
      // Agent gets 1% of purchase amount
      const agentCommission = purchaseAmount * 0.01;
      
      // Platform gets 1% of purchase amount
      const platformFee = purchaseAmount * 0.01;

      // Create transaction
      const { data: transaction, error: transError } = await supabase
        .from('transactions')
        .insert({
          shop_id: shopId,
          member_id: memberId,
          purchase_amount: purchaseAmount,
          shop_contribution: shopContribution,
          member_reward: memberReward,
          agent_commission: agentCommission,
          platform_fee: platformFee,
          status: 'pending_sync'
        })
        .select()
        .single();

      if (transError) throw transError;

      // Update wallet balance
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('member_id', memberId)
        .eq('shop_id', shopId)
        .single();

      if (!walletError && wallet) {
        await supabase
          .from('wallets')
          .update({
            rewards_total: (wallet.rewards_total || 0) + memberReward,
            balance: (wallet.balance || 0) + memberReward
          })
          .eq('id', wallet.id);
      }

      // Refresh data
      await fetchShopData();
      return transaction;
    } catch (err: any) {
      setError(err.message || 'Failed to issue rewards');
      throw err;
    }
  };

  const searchMember = async (phone: string) => {
    try {
      const { data: member, error } = await supabase
        .from('members')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error) throw error;
      return member;
    } catch (err: any) {
      setError(err.message || 'Member not found');
      throw err;
    }
  };

  useEffect(() => {
    fetchShopData();
  }, [shopId]);

  return {
    shop,
    transactions,
    stats,
    loading,
    error,
    issueRewards,
    searchMember,
    refetch: fetchShopData
  };
};
