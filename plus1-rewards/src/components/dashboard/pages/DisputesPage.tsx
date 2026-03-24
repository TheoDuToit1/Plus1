// plus1-rewards/src/components/dashboard/pages/DisputesPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabaseAdmin } from '../../../lib/supabase';

export default function DisputesPage() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: disputesData } = await supabaseAdmin
        .from('disputes')
        .select(`
          *,
          members(full_name, phone),
          partners(shop_name),
          transactions(purchase_amount)
        `)
        .order('created_at', { ascending: false });

      const total = disputesData?.length || 0;
      const open = disputesData?.filter(d => d.status === 'open').length || 0;
      const resolved = disputesData?.filter(d => d.status === 'resolved').length || 0;
      const rejected = disputesData?.filter(d => d.status === 'rejected').length || 0;

      setDisputes(disputesData || []);
      setStats({ total, open, resolved, rejected });
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statsData = [
    { icon: 'report_problem', title: 'Total Disputes', value: stats.total.toString(), change: '', description: 'All time' },
    { icon: 'pending', title: 'Open', value: stats.open.toString(), change: '', description: 'Awaiting resolution' },
    { icon: 'check_circle', title: 'Resolved', value: stats.resolved.toString(), change: '', description: 'Successfully resolved' },
    { icon: 'cancel', title: 'Rejected', value: stats.rejected.toString(), change: '', description: 'Invalid disputes' }
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-[#f5f8fc]">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Disputes Management</h1>
            <p className="text-gray-600 mt-1">Handle transaction disputes and complaints</p>
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
                All Disputes (0)
              </h3>
            </div>
            
            <div className="px-6 py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">check_circle</span>
              <p className="text-gray-600 text-lg font-bold">No disputes found</p>
              <p className="text-sm text-gray-500 mt-2">Disputes will appear here when members or partners report issues</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600">info</span>
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-1">Dispute Resolution Process</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Review dispute details and supporting evidence</li>
                <li>• Contact member and partner for clarification</li>
                <li>• Reverse transaction if necessary</li>
                <li>• Add manual adjustments to correct balances</li>
                <li>• Document resolution notes for audit trail</li>
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
