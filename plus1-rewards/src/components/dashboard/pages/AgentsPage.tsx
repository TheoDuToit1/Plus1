// plus1-rewards/src/components/dashboard/pages/AgentsPage.tsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabase } from '../../../lib/supabase';

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalAgents: 0, verified: 0, sales: 0, commissions: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      const totalAgents = data?.length || 0;
      const verified = data?.filter(a => a.status === 'active')?.length || 0;
      const commissions = data?.reduce((sum, a) => sum + (parseFloat(a.total_commission) || 0), 0) || 0;
      
      setStats({ totalAgents, verified, sales: 0, commissions });
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => { fetchData(); };

  const handleLogout = () => {
    console.log('Logout triggered');
  };

  const handleFilter = () => {
    console.log('Filter triggered');
  };

  const handleExport = () => {
    console.log('Export CSV triggered');
  };

  const statsData = [
    { icon: 'support_agent', title: 'Total Agents', value: stats.totalAgents.toString(), change: '+0%', description: 'Sales representatives' },
    { icon: 'verified_user', title: 'Verified', value: stats.verified.toString(), change: '+0%', description: 'Verified agents' },
    { icon: 'trending_up', title: 'Total Sales', value: stats.sales.toString(), change: '+0%', description: 'Policies sold' },
    { icon: 'account_balance_wallet', title: 'Commissions Paid', value: `R${stats.commissions.toFixed(2)}`, change: '+0%', description: 'Total payouts' }
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        {/* Topbar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-primary/5 border border-primary/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-600"
                placeholder="Search agents, sales or IDs..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg border transition-all text-sm"
              style={{backgroundColor: '#10351c', color: '#109b43', borderColor: '#109b43', borderWidth: '0.2px'}}
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh All Data
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-lg hover:opacity-90 transition-all text-sm"
              style={{color: '#000000'}}
            >
              <span className="material-symbols-outlined text-lg" style={{color: '#000000'}}>logout</span>
              Logout
            </button>

            <div className="size-11 rounded-full border-2 border-primary p-0.5 ml-2">
              <div className="w-full h-full rounded-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZTVGWF5d9bUsTI1U_LA3u4Y-VW_tV7rVaCbr2bBcopKZ6aUEHak7Ad9ln4DGdmBcA4N_9IKOEwo_ZTgYugg0o3iWvRKoqrWDyBrw7mtjHatTwJ33VZI6nS8OIhyQl1DNFVnLMy5g9mboPCvWqWHPBke7YtYx4A7Ny8R8SF3z24w7nM33LYsSZVYbQQMyEhfI9bUKhfbdf6UBFROSXG5deW8I1Twmv3QDRJbOGQADi06UdXRXlEIqzBN95vQGSGpy4mn-lBnbfZr0r')"}}></div>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-10 pb-10">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-100 tracking-tight">Agents Management</h2>
            <p className="text-slate-400 mt-1">Manage sales agents and their commissions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsData.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                description={stat.description}
              />
            ))}
          </div>

          {/* Agents List Table */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-primary/10 flex items-center justify-between bg-primary/5">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">list_alt</span>
                Agents List
              </h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleFilter}
                  className="text-xs text-slate-400 hover:text-primary flex items-center gap-1 font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  Filter
                </button>
                <button 
                  onClick={handleExport}
                  className="text-xs text-slate-400 hover:text-primary flex items-center gap-1 font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export CSV
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Agent ID</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Name</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Sales</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Commission</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {loading ? (
                    <tr><td className="px-6 py-12 text-center" colSpan={6}><p className="text-slate-400">Loading agents...</p></td></tr>
                  ) : agents.length === 0 ? (
                    <tr><td className="px-6 py-4" colSpan={6}><p className="text-sm text-slate-400 text-center">No agents yet</p></td></tr>
                  ) : (
                    agents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-primary/10 transition-colors group">
                        <td className="px-6 py-4"><span className="text-xs font-mono font-bold text-primary px-2 py-1 bg-primary/10 rounded">{agent.id.substring(0, 8).toUpperCase()}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-200">{agent.name} {agent.surname}</span></td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            agent.status === 'active' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            <span className={`size-1.5 rounded-full ${agent.status === 'active' ? 'bg-primary' : 'bg-yellow-400'}`}></span>
                            {agent.status}
                          </span>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm font-bold text-slate-200">0</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-bold text-slate-200">R{parseFloat(agent.total_commission || 0).toFixed(2)}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg bg-slate-800/50 hover:bg-primary/10" title="View Details"><span className="material-symbols-outlined text-sm">visibility</span></button>
                            <button className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg bg-slate-800/50 hover:bg-primary/10" title="Edit Agent"><span className="material-symbols-outlined text-sm">edit</span></button>
                            <button className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg bg-slate-800/50 hover:bg-red-400/10" title="Block Agent"><span className="material-symbols-outlined text-sm">block</span></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-primary/5">
                    <td className="px-6 py-3 text-center" colSpan={6}>
                      <p className="text-[10px] text-slate-600 font-medium uppercase tracking-widest">Showing {agents.length} of {agents.length} total records</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-slate-600 font-bold tracking-[0.2em] uppercase">
              © 2024 +1 Rewards Platform Management • Secured Admin Access
            </p>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
