// plus1-rewards/src/components/dashboard/FinancialOverview.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface FinancialData {
  totalPolicyValue: number;
  totalFunded: number;
  revenueThisMonth: number;
  allTimeRevenue: number;
  totalRewardsIssued: number;
  agentCommissions: number;
}

export default function FinancialOverview() {
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalPolicyValue: 0,
    totalFunded: 0,
    revenueThisMonth: 0,
    allTimeRevenue: 0,
    totalRewardsIssued: 0,
    agentCommissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);

      // Fetch policy values
      const { data: policyData } = await supabase
        .from('policy_holders')
        .select('monthly_premium, amount_funded');
      
      const totalPolicyValue = policyData?.reduce((sum, policy) => sum + (policy.monthly_premium || 0), 0) || 0;
      const totalFunded = policyData?.reduce((sum, policy) => sum + (policy.amount_funded || 0), 0) || 0;

      // Fetch transaction data for revenue calculations
      const { data: transactionData } = await supabase
        .from('transactions')
        .select('platform_fee, agent_commission, member_reward, created_at');

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const revenueThisMonth = transactionData?.filter(t => {
        const transactionDate = new Date(t.created_at);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
      }).reduce((sum, t) => sum + (t.platform_fee || 0), 0) || 0;

      const allTimeRevenue = transactionData?.reduce((sum, t) => sum + (t.platform_fee || 0), 0) || 0;
      const totalRewardsIssued = transactionData?.reduce((sum, t) => sum + (t.member_reward || 0), 0) || 0;
      const agentCommissions = transactionData?.reduce((sum, t) => sum + (t.agent_commission || 0), 0) || 0;

      setFinancialData({
        totalPolicyValue,
        totalFunded,
        revenueThisMonth,
        allTimeRevenue,
        totalRewardsIssued,
        agentCommissions,
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">monetization_on</span>
          <h2 className="text-xl font-bold tracking-tight">Financial Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-background-dark/40 p-6 rounded-xl animate-pulse" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">monetization_on</span>
        <h2 className="text-xl font-bold tracking-tight">Financial Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Total Policy Value</p>
            <p className="text-2xl font-black mt-1">{formatCurrency(financialData.totalPolicyValue)}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Monthly premiums</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/5 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">payments</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Total Funded</p>
            <p className="text-2xl font-black mt-1">{formatCurrency(financialData.totalFunded)}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Via rewards pool</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/5 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">wallet</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Revenue This Month</p>
            <p className={`text-2xl font-black mt-1 ${financialData.revenueThisMonth > 0 ? 'text-primary' : ''}`}>{formatCurrency(financialData.revenueThisMonth)}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Platform fees collected</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">analytics</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">All-Time Revenue</p>
            <p className="text-2xl font-black mt-1">{formatCurrency(financialData.allTimeRevenue)}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Total platform fees</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/5 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">history_edu</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Total Rewards Issued</p>
            <p className="text-2xl font-black mt-1">{formatCurrency(financialData.totalRewardsIssued)}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Allocated to members</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/5 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">stars</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Agent Commissions</p>
            <p className="text-2xl font-black mt-1">{formatCurrency(financialData.agentCommissions)}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Total paid out</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/5 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
        </div>
      </div>
    </section>
  );
}
