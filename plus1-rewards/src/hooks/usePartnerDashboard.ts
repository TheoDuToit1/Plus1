// src/hooks/usePartnerDashboard.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface partnerData {
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
  partner_contribution: number;
  member_reward: number;
  created_at: string;
  status: string;
}

interface PartnerStats {
  todayRewards: number;
  totalMembers: number;
  totalTransactions: number;
  totalRevenue: number;
  commissionRate: number;
}

export const usePartnerDashboard = (partnerId: string | null) => {
  const [partner, setPartner] = useState<partnerData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<PartnerStats>({
    todayRewards: 0,
    totalMembers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    commissionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartnerData = async () => {
    if (!partnerId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch partner data
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('id', partnerId);

      if (partnerError) {
        console.error('Partner fetch error:', partnerError);
        throw partnerError;
      }
      
      if (partnerData && partnerData.length > 0) {
        setPartner(partnerData[0]);
      }

      // Fetch today's transactions
      const today = new Date().toISOString().split('T')[0];
      const { data: todayTransactions, error: todayError } = await supabase
        .from('transactions')
        .select('*')
        .eq('partner_id', partnerId)
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
        .eq('partner_id', partnerId)
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
        .eq('partner_id', partnerId);

      if (membersError) {
        console.error('Members error:', membersError);
      }

      const uniqueMembers = new Set(members?.map(m => m.member_id) || []).size;

      // Calculate stats
      const todayRewards = (todayTransactions || []).reduce((sum, t) => sum + (t.member_reward || 0), 0);
      const totalRevenue = (allTransactions || []).reduce((sum, t) => sum + (t.partner_contribution || 0), 0);

      setStats({
        todayRewards,
        totalMembers: uniqueMembers,
        totalTransactions: allTransactions?.length || 0,
        totalRevenue,
        commissionRate: partnerData?.[0]?.commission_rate || 0
      });
    } catch (err: any) {
      console.error('Error fetching partner data:', err);
      setError(err.message || 'Failed to fetch partner data');
    } finally {
      setLoading(false);
    }
  };

  const issueRewards = async (memberId: string, purchaseAmount: number) => {
    if (!partnerId) return;

    try {
      const commissionRate = partner?.commission_rate || 13;
      
      // Partner pays commission rate % of purchase
      const partnerContribution = purchaseAmount * (commissionRate / 100);
      
      // Member gets commission rate minus 2% (1% agent + 1% platform)
      const memberRewardRate = Math.max(0, commissionRate - 2);
      const memberReward = purchaseAmount * (memberRewardRate / 100);
      
      // Agent gets 1% of purchase amount
      const agentCommission = purchaseAmount * 0.01;
      
      // Platform gets 1% of purchase amount
      const platformFee = purchaseAmount * 0.01;

      // Create transaction with synced status (immediate transaction)
      const { data: transaction, error: transError } = await supabase
        .from('transactions')
        .insert({
          partner_id: partnerId,
          member_id: memberId,
          purchase_amount: purchaseAmount,
          partner_contribution: partnerContribution,
          member_reward: memberReward,
          agent_commission: agentCommission,
          platform_fee: platformFee,
          status: 'synced',
          synced_at: new Date().toISOString()
        })
        .select()
        .single();

      if (transError) throw transError;

      // Check if wallet exists, if not create it
      const { data: existingWallet, error: walletCheckError } = await supabase
        .from('wallets')
        .select('*')
        .eq('member_id', memberId)
        .eq('partner_id', partnerId)
        .maybeSingle();

      if (existingWallet) {
        // Update existing wallet
        const { error: updateError } = await supabase
          .from('wallets')
          .update({
            rewards_total: (existingWallet.rewards_total || 0) + memberReward,
            balance: (existingWallet.balance || 0) + memberReward
          })
          .eq('id', existingWallet.id);
        
        if (updateError) throw updateError;
      } else {
        // Create new wallet
        const { error: createError } = await supabase
          .from('wallets')
          .insert({
            member_id: memberId,
            partner_id: partnerId,
            rewards_total: memberReward,
            balance: memberReward
          });
        
        if (createError) throw createError;
      }

      // Refresh data
      await fetchPartnerData();
      return transaction;
    } catch (err: any) {
      setError(err.message || 'Failed to issue rewards');
      throw err;
    }
  };

  const searchMember = async (phone: string) => {
    try {
      // Clean phone number - remove spaces, dashes, parentheses
      const cleanPhone = phone.replace(/[\s()-]/g, '');
      
      const { data: members, error } = await supabase
        .from('members')
        .select('*')
        .eq('phone', cleanPhone);

      if (error) {
        console.error('Member search error:', error);
        throw error;
      }
      
      if (!members || members.length === 0) {
        throw new Error(`No member found with phone number: ${cleanPhone}`);
      }
      
      if (members.length > 1) {
        // If multiple members have the same phone, let user choose
        const memberNames = members.map((m, i) => `${i + 1}. ${m.name} (ID: ${m.id.slice(0, 8)}...)`).join('\n');
        throw new Error(`Multiple members found with phone ${cleanPhone}:\n${memberNames}\n\nPlease contact support to resolve duplicate phone numbers.`);
      }
      
      return members[0];
    } catch (err: any) {
      console.error('Search member error:', err);
      setError(err.message || 'Member search failed');
      throw err;
    }
  };

  useEffect(() => {
    fetchPartnerData();
  }, [partnerId]);

  return {
    shop: partner,
    transactions,
    stats,
    loading,
    error,
    issueRewards,
    searchMember,
    refetch: fetchPartnerData
  };
};
