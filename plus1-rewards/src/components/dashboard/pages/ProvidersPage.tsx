// plus1-rewards/src/components/dashboard/pages/ProvidersPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabaseAdmin } from '../../../lib/supabase';

export default function ProvidersPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, exports: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await supabaseAdmin
        .from('providers')
        .select('*')
        .order('created_at', { ascending: false });

      const total = data?.length || 0;
      const active = data?.filter(p => p.status === 'active').length || 0;
      const pending = data?.filter(p => p.status === 'pending').length || 0;

      setStats({ total, active, pending, exports: 0 });
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statsData = [
    { icon: 'business', title: 'Total Providers', value: stats.total.toString(), change: '', description: 'All providers' },
    { icon: 'check_circle', title: 'Active', value: stats.active.toString(), change: '', description: 'With access' },
    { icon: 'pending', title: 'Pending', value: stats.pending.toString(), change: '', description: 'Awaiting approval' },
    { icon: 'upload_file', title: 'Exports', value: stats.exports.toString(), change: '', description: 'This month' }
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-[#f5f8fc]">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Providers Management</h1>
            <p className="text-gray-600 mt-1">Manage medical cover provider access and exports</p>
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
                All Providers ({providers.length})
              </h3>
            </div>
            
            {loading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">Loading providers...</p>
              </div>
            ) : providers.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">business</span>
                <p className="text-gray-600 text-lg font-bold">No providers found</p>
                <p className="text-sm text-gray-500 mt-2">Medical cover providers will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Provider</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Company</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Status</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Last Export</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {providers.map((provider) => (
                      <tr key={provider.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="text-sm font-semibold text-gray-900">{provider.name}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-900">{provider.company_name || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            provider.status === 'active'
                              ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30'
                          }`}>
                            <span className={`size-1.5 rounded-full ${provider.status === 'active' ? 'bg-green-600' : 'bg-yellow-500'}`}></span>
                            {provider.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-gray-600">Never</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 hover:text-[#1a558b] transition-colors rounded-lg bg-gray-100 hover:bg-[#1a558b]/10" title="View Details">
                              <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg bg-gray-100 hover:bg-blue-50" title="Create Export">
                              <span className="material-symbols-outlined text-sm">upload_file</span>
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
              <h4 className="text-sm font-bold text-blue-900 mb-1">Provider Dashboard Access</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Providers can log in to view active cover plans</li>
                <li>• Access to approved member data for processing</li>
                <li>• Export functionality for monthly batches</li>
                <li>• View-only access (no editing capabilities)</li>
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
