import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface PolicyBatch {
  member_id: string; member_name: string; member_phone: string;
  plan_name: string; monthly_target: number; amount_funded: number; status: 'activated' | 'in_progress';
}

const BLUE = '#1a558b';

export function PolicyProviderDashboard() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<PolicyBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => { 
    checkAuthAndLoadData(); 
  }, []);

  const checkAuthAndLoadData = () => {
    try {
      // Check if Day1Health provider is logged in via localStorage
      const providerData = localStorage.getItem('currentProvider');
      
      if (!providerData) {
        navigate('/provider/login');
        return;
      }

      const providerInfo = JSON.parse(providerData);
      
      // Verify it's Day1Health and status is active
      if (providerInfo.id !== 'day1health' || providerInfo.status !== 'active') {
        localStorage.removeItem('currentProvider');
        navigate('/provider/login');
        return;
      }

      setProvider(providerInfo);
      loadData();
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('currentProvider');
      navigate('/provider/login');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Query policy_holders with related data
      const { data: policyHolders, error } = await supabase
        .from('policy_holders')
        .select(`
          *,
          members(id, name, phone),
          policy_plans(name, monthly_target)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading policy holders:', error);
        setBatches([]);
        return;
      }

      // Transform the data into the batch format
      const batchData: PolicyBatch[] = (policyHolders || []).map((holder: any) => ({
        member_id: holder.member_id,
        member_name: holder.members?.name || 'Unknown',
        member_phone: holder.members?.phone || 'N/A',
        plan_name: holder.policy_plans?.name || 'Unknown Plan',
        monthly_target: parseFloat(holder.monthly_premium || holder.policy_plans?.monthly_target || 0),
        amount_funded: parseFloat(holder.amount_funded || 0),
        status: (parseFloat(holder.amount_funded || 0) >= parseFloat(holder.monthly_premium || holder.policy_plans?.monthly_target || 1)) 
          ? 'activated' 
          : 'in_progress',
      }));

      setBatches(batchData);
    } catch (error) {
      console.error('Error loading data:', error);
      setBatches([]);
    } finally { 
      setLoading(false); 
    }
  };

  const exportCSV = () => {
    setExporting(true);
    const activated = batches.filter(b => b.status === 'activated');
    const headers = ['Member ID', 'Member Name', 'Phone', 'Plan Name', 'Monthly Premium (R)', 'Status', 'Month'];
    const rows = activated.map(b => [b.member_id, b.member_name, b.member_phone, b.plan_name, b.monthly_target.toFixed(2), 'ACTIVATED', currentMonth]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `day1health_batch_${currentMonth}.csv`; a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentProvider');
    navigate('/provider/login');
  };

  const activated = batches.filter(b => b.status === 'activated');
  const inProgress = batches.filter(b => b.status === 'in_progress');
  const totalValue = activated.reduce((s, b) => s + b.monthly_target, 0);

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: BLUE }}>
              <span className="material-symbols-outlined text-2xl">health_and_safety</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">{provider?.company_name || 'Day1Health'}</h1>
              <p className="text-sm text-gray-600">Policy Provider Dashboard · {currentMonth}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Activated</span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{activated.length}</p>
            <p className="text-sm text-gray-600">Ready for coverage</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-yellow-600 text-2xl">pending</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">In Progress</span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{inProgress.length}</p>
            <p className="text-sm text-gray-600">Still accumulating</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-2xl" style={{ color: BLUE }}>payments</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Premium</span>
            </div>
            <p className="text-3xl font-black mb-1" style={{ color: BLUE }}>R{totalValue.toFixed(2)}</p>
            <p className="text-sm text-gray-600">From activated only</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-cyan-600 text-2xl">account_balance</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Day1 Receives</span>
            </div>
            <p className="text-3xl font-black text-cyan-600 mb-1">R{(totalValue * 0.9).toFixed(2)}</p>
            <p className="text-sm text-gray-600">Net of platform fee (90%)</p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-600 text-xl flex-shrink-0">info</span>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Monthly Batch Submission</p>
            <p>Batch submitted by +1 Rewards on the <strong>10th of each month</strong>. Please download your CSV for integration into your policy management system.</p>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-1">Monthly Batch Export</h2>
              <p className="text-sm text-gray-600">{activated.length} activated members · {currentMonth}</p>
            </div>
            <button
              onClick={exportCSV}
              disabled={exporting || activated.length === 0}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: BLUE }}
            >
              <span className="material-symbols-outlined text-lg">download</span>
              {exporting ? 'Exporting...' : `Export CSV (${activated.length} members)`}
            </button>
          </div>
        </div>

        {/* Activated Policies Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: BLUE }}>verified</span>
              Activated Policies ({activated.length})
            </h3>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading policies...</p>
            </div>
          ) : activated.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">policy</span>
              <p className="text-gray-600">No activated policies yet this month</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Member</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Plan</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Monthly Premium</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Funded</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activated.map((b, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-900">{b.member_name}</p>
                        <p className="text-xs text-gray-600">{b.member_phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-gray-900">{b.plan_name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-gray-900">R{b.monthly_target.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-green-600">R{b.amount_funded.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-500/20 text-green-600 border border-green-500/30">
                          <span className="size-1.5 rounded-full bg-green-600"></span>
                          Activated
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-[10px] text-gray-600 font-medium uppercase tracking-widest text-center">
              Showing {activated.length} activated policies for {currentMonth}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
