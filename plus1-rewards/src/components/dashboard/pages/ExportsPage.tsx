// plus1-rewards/src/components/dashboard/pages/ExportsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabaseAdmin } from '../../../lib/supabase';

export default function ExportsPage() {
  const navigate = useNavigate();
  const [exports, setExports] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, totalPlans: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await supabaseAdmin
        .from('provider_exports')
        .select(`
          *,
          provider:providers(provider_name)
        `)
        .order('created_at', { ascending: false });

      const exportsList = data || [];
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      
      const total = exportsList.length;
      const thisMonth = exportsList.filter(e => e.export_month === currentMonth).length;
      const totalPlans = exportsList.reduce((sum, e) => sum + (e.total_cover_plans || 0), 0);
      const totalValue = exportsList.reduce((sum, e) => sum + parseFloat(e.total_value || 0), 0);

      setStats({ total, thisMonth, totalPlans, totalValue });
      setExports(exportsList);
    } catch (error) {
      console.error('Error fetching exports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statsData = [
    { icon: 'upload_file', title: 'Total Exports', value: stats.total.toString(), change: '', description: 'All time' },
    { icon: 'calendar_month', title: 'This Month', value: stats.thisMonth.toString(), change: '', description: 'Current period' },
    { icon: 'health_and_safety', title: 'Total Plans', value: stats.totalPlans.toString(), change: '', description: 'Exported' },
    { icon: 'payments', title: 'Total Value', value: `R${stats.totalValue.toFixed(2)}`, change: '', description: 'All exports' }
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-[#f5f8fc]">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Provider Exports</h1>
            <p className="text-gray-600 mt-1">Generate and manage cover plan exports for providers</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all text-sm">
              <span className="material-symbols-outlined text-lg">add</span>Create Export
            </button>
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
                Export History ({exports.length})
              </h3>
            </div>
            
            {loading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">Loading exports...</p>
              </div>
            ) : exports.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">upload_file</span>
                <p className="text-gray-600 text-lg font-bold">No exports created yet</p>
                <p className="text-sm text-gray-500 mt-2">Create your first export to send cover plan data to providers</p>
                <button className="mt-6 px-6 py-3 bg-[#1a558b] text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2 mx-auto">
                  <span className="material-symbols-outlined">add</span>
                  Create First Export
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Provider</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Month</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Cover Plans</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Total Value</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Status</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Exported</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {exports.map((exp) => (
                      <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="text-sm font-semibold text-gray-900">{exp.provider?.provider_name || 'Unknown'}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-900">{exp.export_month}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-bold text-gray-900">{exp.total_cover_plans || 0}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-bold text-[#1a558b]">R{parseFloat(exp.total_value || 0).toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            exp.status === 'completed'
                              ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                              : exp.status === 'failed'
                              ? 'bg-red-500/20 text-red-700 border border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30'
                          }`}>
                            <span className={`size-1.5 rounded-full ${
                              exp.status === 'completed' ? 'bg-green-600' : exp.status === 'failed' ? 'bg-red-600' : 'bg-yellow-500'
                            }`}></span>
                            {exp.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-gray-600">
                            {exp.exported_at ? new Date(exp.exported_at).toLocaleDateString() : 'Not yet'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 hover:text-[#1a558b] transition-colors rounded-lg bg-gray-100 hover:bg-[#1a558b]/10" title="View Details">
                              <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg bg-gray-100 hover:bg-blue-50" title="Download">
                              <span className="material-symbols-outlined text-sm">download</span>
                            </button>
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
              <h4 className="text-sm font-bold text-blue-900 mb-1">Export Process</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Exports include all active and approved cover plans</li>
                <li>• Member details and linked people are included</li>
                <li>• Providers can access exports through their dashboard</li>
                <li>• Export history is maintained for audit purposes</li>
                <li>• Failed records can be reviewed and corrected</li>
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
