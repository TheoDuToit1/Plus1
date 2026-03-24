// plus1-rewards/src/components/dashboard/pages/TopUpsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabaseAdmin } from '../../../lib/supabase';

export default function TopUpsPage() {
  const navigate = useNavigate();
  const [topUps, setTopUps] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await supabaseAdmin
        .from('top_ups')
        .select(`
          *,
          member_cover_plan:member_cover_plans(
            member:members(full_name, phone),
            cover_plan:cover_plans(plan_name)
          )
        `)
        .order('created_at', { ascending: false });

      const topUpsList = data || [];
      const total = topUpsList.length;
      const pending = topUpsList.filter(t => !t.approved_by).length;
      const approved = topUpsList.filter(t => t.approved_by).length;
      const totalAmount = topUpsList.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

      setStats({ total, pending, approved, totalAmount });
      setTopUps(topUpsList);
    } catch (error) {
      console.error('Error fetching top-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statsData = [
    { icon: 'add_card', title: 'Total Top-Ups', value: stats.total.toString(), change: '', description: 'All requests' },
    { icon: 'pending', title: 'Pending Approval', value: stats.pending.toString(), change: '', description: 'Awaiting review' },
    { icon: 'check_circle', title: 'Approved', value: stats.approved.toString(), change: '', description: 'Processed' },
    { icon: 'payments', title: 'Total Amount', value: `R${stats.totalAmount.toFixed(2)}`, change: '', description: 'All top-ups' }
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-[#f5f8fc]">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Top-Ups Management</h1>
            <p className="text-gray-600 mt-1">Review and approve member and partner top-up payments</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => fetchData()} className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg border border-[#1a558b] bg-white text-[#1a558b] hover:bg-[#1a558b] hover:text-white transition-all text-sm">
              <span className="material-symbols-outlined text-lg">refresh</span>Refresh
            </button>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 px-5 py-2.5 bg-[#1a558b] text-white rounded-lg hover:opacity-90 transition-all text-sm">
              <span className="material-symbols-outlined text-lg">logout</span>Logout
            </button>
          </div>
        </header>

        <div className="px-6 md:px-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsData.map((stat, index) => (
              <StatCard key={index} icon={stat.icon} title={stat.title} value={stat.value} change={stat.change} description={stat.description} />
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a558b]">list_alt</span>
                All Top-Up Requests ({topUps.length})
              </h3>
            </div>
            
            {loading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">Loading top-ups...</p>
              </div>
            ) : topUps.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">add_card</span>
                <p className="text-gray-600 text-lg font-bold">No top-up requests</p>
                <p className="text-sm text-gray-500 mt-2">Member and partner top-up requests will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Payer</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Cover Plan</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Amount</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Method</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Status</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Date</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topUps.map((topUp) => (
                      <tr key={topUp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900 capitalize">{topUp.payer_type}</div>
                            <div className="text-xs text-gray-600">{topUp.member_cover_plan?.member?.full_name || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-900">{topUp.member_cover_plan?.cover_plan?.plan_name || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-bold text-[#1a558b]">R{parseFloat(topUp.amount).toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-gray-600 uppercase">{topUp.payment_method || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            topUp.approved_by
                              ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30'
                          }`}>
                            <span className={`size-1.5 rounded-full ${topUp.approved_by ? 'bg-green-600' : 'bg-yellow-500'}`}></span>
                            {topUp.approved_by ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-gray-600">{new Date(topUp.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 hover:text-[#1a558b] transition-colors rounded-lg bg-gray-100 hover:bg-[#1a558b]/10" title="View Details">
                              <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                            {!topUp.approved_by && (
                              <button className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg bg-gray-100 hover:bg-green-50" title="Approve">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600">info</span>
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-1">Top-Up Process</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Members can top up cover plan shortfalls via EFT</li>
                <li>• Partners can top up to settle outstanding invoices</li>
                <li>• Admin reviews proof of payment</li>
                <li>• Approved top-ups are added to cover plans or invoices</li>
                <li>• Top-ups can be full or partial amounts</li>
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
