// plus1-rewards/src/components/dashboard/StatsCards.tsx
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { supabase } from '../../lib/supabase';

interface Stats {
  totalMembers: number;
  membersWithQR: number;
  totalShops: number;
  activeShops: number;
  suspendedShops: number;
  totalAgents: number;
  activeAgents: number;
  totalPolicyProviders: number;
  totalPolicies: number;
  activePolicies: number;
  inProgressPolicies: number;
}

export interface StatsCardsRef {
  refresh: () => void;
}

const StatsCards = forwardRef<StatsCardsRef>((props, ref) => {
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    membersWithQR: 0,
    totalShops: 0,
    activeShops: 0,
    suspendedShops: 0,
    totalAgents: 0,
    activeAgents: 0,
    totalPolicyProviders: 0,
    totalPolicies: 0,
    activePolicies: 0,
    inProgressPolicies: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch members stats
      const { data: membersData } = await supabase
        .from('members')
        .select('qr_code');
      
      const totalMembers = membersData?.length || 0;
      const membersWithQR = membersData?.filter(m => m.qr_code).length || 0;

      // Fetch shops stats
      const { data: shopsData } = await supabase
        .from('shops')
        .select('status');
      
      const totalShops = shopsData?.length || 0;
      const activeShops = shopsData?.filter(s => s.status === 'active').length || 0;
      const suspendedShops = shopsData?.filter(s => s.status === 'suspended').length || 0;

      // Fetch agents stats
      const { data: agentsData } = await supabase
        .from('agents')
        .select('status');
      
      const totalAgents = agentsData?.length || 0;
      const activeAgents = agentsData?.filter(a => a.status === 'active').length || 0;

      // Fetch policy providers stats
      const { data: providersData } = await supabase
        .from('policy_providers')
        .select('id');
      
      const totalPolicyProviders = providersData?.length || 0;

      // Fetch policies stats
      const { data: policiesData } = await supabase
        .from('policy_holders')
        .select('status');
      
      const totalPolicies = policiesData?.length || 0;
      const activePolicies = policiesData?.filter(p => p.status === 'active').length || 0;
      const inProgressPolicies = policiesData?.filter(p => p.status === 'pending').length || 0;

      setStats({
        totalMembers,
        membersWithQR,
        totalShops,
        activeShops,
        suspendedShops,
        totalAgents,
        activeAgents,
        totalPolicyProviders,
        totalPolicies,
        activePolicies,
        inProgressPolicies,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchStats
  }));

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-background-dark/40 p-5 rounded-xl animate-pulse" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">group</span>
          <span className="text-[10px] font-bold py-0.5 px-2 rounded bg-primary/10 text-primary uppercase">Active</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Members</p>
        <h3 className="text-3xl font-black mt-1">{stats.totalMembers}</h3>
        <p className="text-[11px] text-slate-400 mt-2">{stats.membersWithQR} with QR codes issued</p>
      </div>
      
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">storefront</span>
          {stats.activeShops > 0 && (
            <span className="text-[10px] font-bold py-0.5 px-2 rounded bg-primary/10 text-primary uppercase">Active</span>
          )}
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Shops</p>
        <h3 className="text-3xl font-black mt-1">{stats.totalShops}</h3>
        <p className="text-[11px] text-slate-400 mt-2">{stats.activeShops} active, {stats.suspendedShops} suspended</p>
      </div>
      
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className={`material-symbols-outlined p-2 rounded-lg ${stats.totalAgents > 0 ? 'text-primary bg-primary/10' : 'text-slate-400 bg-slate-400/10'}`}>support_agent</span>
          {stats.activeAgents > 0 && (
            <span className="text-[10px] font-bold py-0.5 px-2 rounded bg-primary/10 text-primary uppercase">Active</span>
          )}
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Agents</p>
        <h3 className={`text-3xl font-black mt-1 ${stats.totalAgents > 0 ? '' : 'text-slate-400'}`}>{stats.totalAgents}</h3>
        <p className="text-[11px] text-slate-400 mt-2">{stats.activeAgents} active agents</p>
      </div>
      
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">handshake</span>
          {stats.totalPolicyProviders > 0 && (
            <span className="text-[10px] font-bold py-0.5 px-2 rounded bg-primary/10 text-primary uppercase">Active</span>
          )}
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Policy Providers</p>
        <h3 className="text-3xl font-black mt-1">{stats.totalPolicyProviders}</h3>
        <p className="text-[11px] text-slate-400 mt-2">Insurance partners</p>
      </div>
      
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className={`material-symbols-outlined p-2 rounded-lg ${stats.totalPolicies > 0 ? 'text-primary bg-primary/10' : 'text-slate-400 bg-slate-400/10'}`}>description</span>
          {stats.activePolicies > 0 && (
            <span className="text-[10px] font-bold py-0.5 px-2 rounded bg-primary/10 text-primary uppercase">Active</span>
          )}
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Policies</p>
        <h3 className={`text-3xl font-black mt-1 ${stats.totalPolicies > 0 ? '' : 'text-slate-400'}`}>{stats.totalPolicies}</h3>
        <p className="text-[11px] text-slate-400 mt-2">{stats.activePolicies} active globally</p>
      </div>
      
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className={`material-symbols-outlined p-2 rounded-lg ${stats.inProgressPolicies > 0 ? 'text-primary bg-primary/10' : 'text-slate-400 bg-slate-400/10'}`}>pending_actions</span>
          {stats.inProgressPolicies > 0 && (
            <span className="text-[10px] font-bold py-0.5 px-2 rounded bg-primary/10 text-primary uppercase">In Progress</span>
          )}
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">In Progress</p>
        <h3 className={`text-3xl font-black mt-1 ${stats.inProgressPolicies > 0 ? '' : 'text-slate-400'}`}>{stats.inProgressPolicies}</h3>
        <p className="text-[11px] text-slate-400 mt-2">Being funded</p>
      </div>
    </div>
  );
});

StatsCards.displayName = 'StatsCards';

export default StatsCards;
