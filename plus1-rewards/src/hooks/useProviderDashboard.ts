// src/hooks/useProviderDashboard.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface PolicyProvider {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface Plan {
  id: string;
  name: string;
  monthly_premium: number;
  provider_id: string;
}

interface Policy {
  id: string;
  member_id: string;
  plan_id: string;
  status: 'active' | 'pending' | 'suspended' | 'cancelled';
  created_at: string;
  activated_at?: string;
  monthly_premium: number;
  plan_name: string;
}

interface ProviderStats {
  totalPoliciesFunded: number;
  totalValue: number;
  netPayout: number;
  pendingReconciliation: number;
  activationRate: number;
  activatedCount: number;
  inProgressCount: number;
}

interface PlanBreakdownItem {
  planType: string;
  policies: number;
  grossValue: number;
  payoutValue: number;
  status: string;
}

export const useProviderDashboard = (providerId: string | null) => {
  const [provider, setProvider] = useState<PolicyProvider | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [stats, setStats] = useState<ProviderStats>({
    totalPoliciesFunded: 0,
    totalValue: 0,
    netPayout: 0,
    pendingReconciliation: 0,
    activationRate: 0,
    activatedCount: 0,
    inProgressCount: 0
  });
  const [planBreakdown, setPlanBreakdown] = useState<PlanBreakdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviderData = async () => {
    if (!providerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to fetch provider data, but don't fail if it doesn't exist
      const { data: providerData, error: providerError } = await supabase
        .from('policy_providers')
        .select('*')
        .eq('id', providerId)
        .single();

      if (!providerError && providerData) {
        setProvider(providerData);
      }

      // Fetch plans for this provider
      const { data: plansData, error: plansError } = await supabase
        .from('policy_plans')
        .select('*')
        .eq('provider_id', providerId);

      if (plansError) {
        console.error('Plans fetch error:', plansError);
      }

      setPlans(plansData || []);

      // Fetch all policies for this provider
      const { data: policiesData, error: policiesError } = await supabase
        .from('policies')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

      if (policiesError) {
        console.error('Policies fetch error:', policiesError);
      }

      const allPolicies = policiesData || [];
      setPolicies(allPolicies);

      // Calculate stats
      const activatedPolicies = allPolicies.filter(p => p.status === 'active');
      const inProgressPolicies = allPolicies.filter(p => p.status === 'pending');
      const totalPoliciesFunded = activatedPolicies.length;
      const totalValue = activatedPolicies.reduce((sum, p) => sum + (p.monthly_premium || 0), 0);
      const netPayout = totalValue * 0.9; // 90% payout
      const pendingValue = inProgressPolicies.reduce((sum, p) => sum + (p.monthly_premium || 0), 0);
      const activationRate = allPolicies.length > 0 ? Math.round((totalPoliciesFunded / allPolicies.length) * 100) : 0;

      setStats({
        totalPoliciesFunded,
        totalValue,
        netPayout,
        pendingReconciliation: pendingValue,
        activationRate,
        activatedCount: totalPoliciesFunded,
        inProgressCount: inProgressPolicies.length
      });

      // Calculate plan breakdown
      const breakdown: { [key: string]: PlanBreakdownItem } = {};

      allPolicies.forEach(policy => {
        const planName = policy.plan_name || 'Unknown Plan';
        if (!breakdown[planName]) {
          breakdown[planName] = {
            planType: planName,
            policies: 0,
            grossValue: 0,
            payoutValue: 0,
            status: 'Active'
          };
        }
        breakdown[planName].policies += 1;
        if (policy.status === 'active') {
          breakdown[planName].grossValue += policy.monthly_premium || 0;
          breakdown[planName].payoutValue += (policy.monthly_premium || 0) * 0.9;
        }
      });

      setPlanBreakdown(Object.values(breakdown));
    } catch (err: any) {
      console.error('Error fetching provider data:', err);
      // Don't set error state for UUID validation errors, just log them
      if (!err.message?.includes('invalid input syntax for type uuid')) {
        setError(err.message || 'Failed to fetch provider data');
      }
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const activatedPolicies = policies.filter(p => p.status === 'active');
      const headers = ['Member ID', 'Plan Name', 'Monthly Premium (R)', 'Status', 'Activated Date'];
      const rows = activatedPolicies.map(p => [
        p.member_id,
        p.plan_name,
        (p.monthly_premium || 0).toFixed(2),
        'ACTIVATED',
        p.activated_at ? new Date(p.activated_at).toLocaleDateString() : 'N/A'
      ]);

      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const currentMonth = new Date().toISOString().slice(0, 7);
      a.download = `day1health_batch_${currentMonth}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to export CSV');
      throw err;
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, [providerId]);

  return {
    provider,
    policies,
    plans,
    stats,
    planBreakdown,
    loading,
    error,
    exportCSV,
    refetch: fetchProviderData
  };
};
