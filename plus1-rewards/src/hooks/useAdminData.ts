// plus1-rewards/src/hooks/useAdminData.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAdminData = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    members: [] as any[],
    shops: [] as any[],
    agents: [] as any[],
    providers: [] as any[],
    policies: [] as any[],
    transactions: [] as any[]
  });

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [members, shops, agents, providers, policies, transactions] = await Promise.all([
        supabase.from('members').select('*, wallets(balance, rewards_total)'),
        supabase.from('shops').select('*'),
        supabase.from('agents').select('*'),
        supabase.from('policy_providers').select('*'),
        supabase.from('policy_holders').select('*, policy_plans(*), policy_providers(*), members(*)'),
        supabase.from('transactions').select('*')
      ]);

      setData({
        members: members.data || [],
        shops: shops.data || [],
        agents: agents.data || [],
        providers: providers.data || [],
        policies: policies.data || [],
        transactions: transactions.data || []
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return { ...data, loading, refetch: fetchAllData };
};
