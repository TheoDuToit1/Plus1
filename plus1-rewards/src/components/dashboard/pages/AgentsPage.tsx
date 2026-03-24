// plus1-rewards/src/components/dashboard/pages/AgentsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabaseAdmin } from '../../../lib/supabase';

export default function AgentsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalAgents: 0, verified: 0, pending: 0, sales: 0, commissions: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Join agents with users table to get full_name
      const { data, error } = await supabaseAdmin
        .from('agents')
        .select('*, users!agents_user_id_fkey(full_name, mobile_number, email)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      const totalAgents = data?.length || 0;
      const verified = data?.filter(a => a.status === 'active')?.length || 0;
      const pending = data?.filter(a => a.status === 'pending')?.length || 0;
      
      // Get commission totals from agent_commissions table
      const { data: commissionsData } = await supabaseAdmin
        .from('agent_commissions')
        .select('total_amount');
      const commissions = commissionsData?.reduce((sum, c) => sum + (parseFloat(c.total_amount) || 0), 0) || 0;
      
      setStats({ totalAgents, verified, pending, sales: 0, commissions });
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAgent = async (agentId: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('agents')
        .update({ 
          status: 'active', 
          approved_at: new Date().toISOString(),
          approved_by: null
        })
        .eq('id', agentId);

      if (error) throw error;
      
      alert('Agent approved successfully!');
      fetchData();
    } catch (error) {
      console.error('Error approving agent:', error);
      alert('Failed to approve agent. Please try again.');
    }
  };

  const handleRejectAgent = async (agentId: string) => {
    if (confirm('Are you sure you want to reject this agent application?')) {
      try {
        const { error } = await supabaseAdmin
          .from('agents')
          .update({ status: 'suspended' })
          .eq('id', agentId);

        if (error) throw error;
        
        alert('Agent application rejected.');
        fetchData();
      } catch (error) {
        console.error('Error rejecting agent:', error);
        alert('Failed to reject agent. Please try again.');
      }
    }
  };

  const handleRefresh = () => { fetchData(); };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const statsData = [
    { icon: 'support_agent', title: 'Total Agents', value: stats.totalAgents.toString(), change: '+0%', description: 'All agents' },
    { icon: 'verified_user', title: 'Active', value: stats.verified.toString(), change: '+0%', description: 'Approved agents' },
    { icon: 'pending', title: 'Pending Approval', value: stats.pending.toString(), change: '+0%', description: 'Awaiting approval' },
    { icon: 'account_balance_wallet', title: 'Commissions Paid', value: `R${stats.commissions.toFixed(2)}`, change: '+0%', description: 'Total payouts' }
  ];

  const filteredAgents = agents.filter(a => {
    // Advanced Search
    const searchLower = searchTerm.toLowerCase().trim();
    const searchTerms = searchLower.split(/\s+/);
    
    const matchesSearch = searchLower === '' || searchTerms.every(term => 
      a.users?.full_name?.toLowerCase().includes(term) ||
      a.users?.email?.toLowerCase().includes(term) ||
      a.users?.mobile_number?.includes(term) ||
      a.id?.toLowerCase().includes(term) ||
      a.id_number?.includes(term)
    );

    // Filters
    const matchesStatus = filters.status === '' || a.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-[#f5f8fc]">
        {/* Topbar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a558b] focus:border-[#1a558b] outline-none transition-all placeholder:text-gray-400"
                placeholder="Search agents, contact info or IDs..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg border border-[#1a558b] bg-white text-[#1a558b] hover:bg-[#1a558b] hover:text-white transition-all text-sm"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a558b] text-white rounded-lg hover:opacity-90 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Logout
            </button>
          </div>
        </header>

        <div className="px-6 md:px-10 pb-10">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Agents Management</h2>
            <p className="text-gray-600 mt-1">Manage sales agents and their commissions</p>
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
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a558b]">list_alt</span>
                All Agents ({filteredAgents.length})
              </h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`text-xs flex items-center gap-1 font-medium transition-colors ${showFilters ? 'text-[#1a558b]' : 'text-gray-600 hover:text-[#1a558b]'}`}
                >
                  <span className="material-symbols-outlined text-sm">{showFilters ? 'filter_list_off' : 'filter_list'}</span>
                  {showFilters ? 'Hide Filters' : 'Filter'}
                </button>
                <button 
                  onClick={() => {}} 
                  className="text-xs text-gray-600 hover:text-[#1a558b] flex items-center gap-1 font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export CSV
                </button>
              </div>
            </div>

            {/* Advanced Filter Bar */}
            {showFilters && (
              <div className="px-6 py-4 border-b border-gray-200 bg-white grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top duration-200">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Agent Status</label>
                  <select 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-900 focus:ring-1 focus:ring-[#1a558b] outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button 
                    onClick={() => setFilters({ status: '' })}
                    className="text-[10px] font-bold text-[#1a558b] hover:underline uppercase tracking-widest"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600">Agent ID</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600">Name</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 font-center">Sales</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 font-center">Commission</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr><td className="px-6 py-12 text-center" colSpan={6}><p className="text-gray-600">Loading agents...</p></td></tr>
                  ) : filteredAgents.length === 0 ? (
                    <tr><td className="px-6 py-4" colSpan={6}><p className="text-sm text-gray-600 text-center">No agents found</p></td></tr>
                  ) : (
                    filteredAgents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4"><span className="text-xs font-mono font-bold text-[#1a558b] px-2 py-1 bg-[#1a558b]/10 rounded">{agent.id.substring(0, 8).toUpperCase()}</span></td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="text-sm font-semibold text-gray-900">{agent.users?.full_name || 'No name'}</span>
                            <div className="text-xs text-gray-600">{agent.users?.mobile_number || 'No phone'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            agent.status === 'active' 
                              ? 'bg-[#1a558b]/20 text-[#1a558b] border border-[#1a558b]/30' 
                              : agent.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30'
                              : 'bg-red-500/20 text-red-600 border border-red-500/30'
                          }`}>
                            <span className={`size-1.5 rounded-full ${
                              agent.status === 'active' ? 'bg-[#1a558b]' : 
                              agent.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></span>
                            {agent.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center"><span className="text-sm font-bold text-gray-900">0</span></td>
                        <td className="px-6 py-4 text-center"><span className="text-sm font-bold text-gray-900">R0.00</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {agent.status === 'pending' ? (
                              <>
                                <button 
                                  onClick={() => handleApproveAgent(agent.id)}
                                  className="p-2 text-gray-600 hover:text-[#1a558b] transition-colors rounded-lg bg-gray-100 hover:bg-[#1a558b]/10" 
                                  title="Approve Agent"
                                >
                                  <span className="material-symbols-outlined text-sm">check_circle</span>
                                </button>
                                <button 
                                  onClick={() => handleRejectAgent(agent.id)}
                                  className="p-2 text-gray-600 hover:text-red-500 transition-colors rounded-lg bg-gray-100 hover:bg-red-50" 
                                  title="Reject Agent"
                                >
                                  <span className="material-symbols-outlined text-sm">cancel</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button className="p-2 text-gray-600 hover:text-[#1a558b] transition-colors rounded-lg bg-gray-100 hover:bg-[#1a558b]/10" title="View Details"><span className="material-symbols-outlined text-sm">visibility</span></button>
                                <button className="p-2 text-gray-600 hover:text-[#1a558b] transition-colors rounded-lg bg-gray-100 hover:bg-[#1a558b]/10" title="Edit Agent"><span className="material-symbols-outlined text-sm">edit</span></button>
                                <button className="p-2 text-gray-600 hover:text-red-500 transition-colors rounded-lg bg-gray-100 hover:bg-red-50" title="Suspend Agent"><span className="material-symbols-outlined text-sm">block</span></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-center" colSpan={6}>
                      <p className="text-[10px] text-gray-600 font-medium uppercase tracking-widest">Showing {filteredAgents.length} of {agents.length} total records</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase">
              © 2024 +1 Rewards Platform Management • Secured Admin Access
            </p>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
