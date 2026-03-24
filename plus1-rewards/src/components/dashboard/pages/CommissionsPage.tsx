// plus1-rewards/src/components/dashboard/pages/CommissionsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabaseAdmin } from '../../../lib/supabase';

export default function CommissionsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [commissions, setCommissions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCommissions: 0,
    paid: 0,
    pending: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get all agent commissions with agent user info
      const { data: commissionsData } = await supabaseAdmin
        .from('agent_commissions')
        .select(`
          *,
          agents(
            id,
            users!agents_user_id_fkey(full_name, mobile_number, email)
          )
        `)
        .order('created_at', { ascending: false });

      const totalCommissions = commissionsData?.length || 0;
      const paid = commissionsData?.filter(c => c.payout_status === 'paid').length || 0;
      const pending = commissionsData?.filter(c => c.payout_status === 'pending').length || 0;
      const totalAmount = commissionsData?.reduce((sum, c) => sum + (parseFloat(c.total_amount) || 0), 0) || 0;

      setStats({ totalCommissions, paid, pending, totalAmount });
      setCommissions(commissionsData || []);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkPaid = async (commissionId: string, amount: number) => {
    if (confirm(`Mark commission of R${amount.toFixed(2)} as paid?`)) {
      try {
        const { error } = await supabaseAdmin
          .from('agent_commissions')
          .update({ 
            payout_status: 'paid',
            paid_at: new Date().toISOString()
          })
          .eq('id', commissionId);

        if (error) throw error;
        alert('Commission marked as paid');
        fetchData();
      } catch (error) {
        console.error('Error marking commission as paid:', error);
        alert('Failed to update commission');
      }
    }
  };

  const handleRefresh = () => fetchData();
  const handleLogout = () => navigate('/');

  const filteredCommissions = commissions.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    return searchLower === '' ||
      c.agent_name?.toLowerCase().includes(searchLower) ||
      c.agent_phone?.includes(searchLower);
  });

  const statsData = [
    { icon: 'account_balance_wallet', title: 'Total Agents', value: stats.totalCommissions.toString(), change: '', description: 'Earning commissions' },
    { icon: 'check_circle', title: 'Paid Out', value: stats.paid.toString(), change: '', description: 'This month' },
    { icon: 'pending', title: 'Pending', value: stats.pending.toString(), change: '', description: 'Below threshold' },
    { icon: 'payments', title: 'Total Amount', value: `R${stats.totalAmount.toFixed(2)}`, change: '', description: 'All commissions' }
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-[#f5f8fc]">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a558b] focus:border-[#1a558b] outline-none transition-all placeholder:text-gray-400"
                placeholder="Search by agent name or phone..."
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
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Agent Commission Management</h2>
            <p className="text-gray-600 mt-1">Track and manage agent commission payouts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsData.map((stat, index) => (
              <StatCard key={index} icon={stat.icon} title={stat.title} value={stat.value} change={stat.change} description={stat.description} />
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a558b]">list_alt</span>
                Agent Commissions ({filteredCommissions.length})
              </h3>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">Loading commissions...</p>
              </div>
            ) : filteredCommissions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">No commission data found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Agent</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Contact</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Transactions</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Commission Earned</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Payout Status</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCommissions.map((commission) => (
                      <tr key={commission.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="text-sm font-semibold text-gray-900">{commission.agent_name}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-xs text-gray-700">{commission.agent_phone}</div>
                          <div className="text-xs text-gray-600">{commission.agent_email}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-bold text-gray-900">{commission.transaction_count}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-bold text-[#1a558b]">R{commission.total_amount.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            commission.payout_status === 'ready'
                              ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30'
                          }`}>
                            <span className={`size-1.5 rounded-full ${
                              commission.payout_status === 'ready' ? 'bg-green-600' : 'bg-yellow-500'
                            }`}></span>
                            {commission.payout_status === 'ready' ? 'Ready for Payout' : 'Below Threshold'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {commission.payout_status === 'ready' && (
                              <button
                                onClick={() => handleMarkPaid(commission.id, commission.total_amount)}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors"
                              >
                                Mark Paid
                              </button>
                            )}
                            <button
                              className="p-2 text-gray-600 hover:text-[#1a558b] transition-colors rounded-lg bg-gray-100 hover:bg-[#1a558b]/10"
                              title="View Breakdown"
                            >
                              <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-[10px] text-gray-600 font-medium uppercase tracking-widest text-center">
                Showing {filteredCommissions.length} of {commissions.length} total agents
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600">info</span>
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-1">Commission Rules</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Agents earn 1% from all partner transactions they manage</li>
                <li>• Minimum payout threshold: R100</li>
                <li>• Commissions calculated monthly</li>
                <li>• Payouts processed after month end</li>
              </ul>
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
