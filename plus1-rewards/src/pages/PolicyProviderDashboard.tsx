// plus1-rewards/src/pages/PolicyProviderDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const BLUE = '#1a558b';

interface Provider {
  id: string;
  provider_name: string;
  email: string;
  status: string;
}

interface CoverPlan {
  id: string;
  member_id: string;
  member_name: string;
  member_phone: string;
  plan_name: string;
  target_amount: number;
  funded_amount: number;
  status: 'active' | 'suspended' | 'in_progress';
  active_from: string | null;
  active_to: string | null;
  suspended_at: string | null;
  linked_people_count: number;
}

export function PolicyProviderDashboard() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [activePlans, setActivePlans] = useState<CoverPlan[]>([]);
  const [suspendedPlans, setSuspendedPlans] = useState<CoverPlan[]>([]);
  const [inProgressPlans, setInProgressPlans] = useState<CoverPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'suspended' | 'in_progress'>('active');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check session storage first, then localStorage
      const providerDataStr = sessionStorage.getItem('currentProvider') || localStorage.getItem('currentProvider');
      
      if (!providerDataStr) {
        navigate('/provider/login');
        return;
      }

      const providerData = JSON.parse(providerDataStr);
      
      // Verify it's Day1Health with active status (local auth, no database check)
      if (providerData.id !== 'day1health' || providerData.status !== 'active') {
        sessionStorage.removeItem('currentProvider');
        localStorage.removeItem('currentProvider');
        navigate('/provider/login');
        return;
      }

      setProvider(providerData);
      await loadCoverPlans();
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/provider/login');
    }
  };

  const loadCoverPlans = async () => {
    setLoading(true);
    try {
      // Load all member cover plans (Day1Health sees all plans)
      const { data: memberCoverPlans, error } = await supabase
        .from('member_cover_plans')
        .select(`
          *,
          members (
            id,
            full_name,
            phone
          ),
          cover_plans (
            plan_name,
            monthly_target_amount
          )
        `);

      if (error) {
        console.error('Error loading cover plans:', error);
        setActivePlans([]);
        setSuspendedPlans([]);
        return;
      }

      // Count linked people separately for each member_cover_plan
      const plansWithLinkedPeople = await Promise.all((memberCoverPlans || []).map(async (mcp: any) => {
        const { data: linkedPeople } = await supabase
          .from('linked_people')
          .select('id')
          .eq('member_cover_plan_id', mcp.id);

        return {
          id: mcp.id,
          member_id: mcp.member_id,
          member_name: mcp.members?.full_name || 'Unknown',
          member_phone: mcp.members?.phone || 'N/A',
          plan_name: mcp.cover_plans?.plan_name || 'Unknown Plan',
          target_amount: parseFloat(mcp.target_amount || mcp.cover_plans?.monthly_target_amount || 0),
          funded_amount: parseFloat(mcp.funded_amount || 0),
          status: mcp.status,
          active_from: mcp.active_from,
          active_to: mcp.active_to,
          suspended_at: mcp.suspended_at,
          linked_people_count: linkedPeople?.length || 0
        };
      }));

      // Separate by status
      setActivePlans(plansWithLinkedPeople.filter(p => p.status === 'active'));
      setSuspendedPlans(plansWithLinkedPeople.filter(p => p.status === 'suspended'));
      setInProgressPlans(plansWithLinkedPeople.filter(p => p.status === 'in_progress'));
    } catch (error) {
      console.error('Error loading cover plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const headers = ['Member ID', 'Member Name', 'Phone', 'Plan Name', 'Monthly Premium (R)', 'Funded Amount (R)', 'Status', 'Active From', 'Active To', 'Linked People', 'Month'];
      const rows = activePlans.map(plan => [
        plan.member_id,
        plan.member_name,
        plan.member_phone,
        plan.plan_name,
        plan.target_amount.toFixed(2),
        plan.funded_amount.toFixed(2),
        'ACTIVE',
        plan.active_from || 'N/A',
        plan.active_to || 'N/A',
        plan.linked_people_count.toString(),
        currentMonth
      ]);

      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${provider?.provider_name.replace(/\s+/g, '_')}_active_plans_${currentMonth}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentProvider');
    localStorage.removeItem('currentProvider');
    navigate('/provider/login');
  };

  const totalActivePremium = activePlans.reduce((sum, p) => sum + p.target_amount, 0);
  const totalSuspendedPremium = suspendedPlans.reduce((sum, p) => sum + p.target_amount, 0);
  const totalInProgressPremium = inProgressPlans.reduce((sum, p) => sum + p.target_amount, 0);
  const currentMonth = new Date().toISOString().slice(0, 7);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin mx-auto mb-4" style={{ borderTopColor: BLUE }}></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const displayPlans = activeTab === 'active' ? activePlans : activeTab === 'suspended' ? suspendedPlans : inProgressPlans;

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
              <h1 className="text-xl font-black text-gray-900">{provider?.provider_name || 'Provider Dashboard'}</h1>
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
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Plans</span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{activePlans.length}</p>
            <p className="text-sm text-gray-600">Ready for coverage</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-blue-600 text-2xl">hourglass_empty</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">In Progress</span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{inProgressPlans.length}</p>
            <p className="text-sm text-gray-600">Building up funds</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-orange-600 text-2xl">pending</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Suspended</span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{suspendedPlans.length}</p>
            <p className="text-sm text-gray-600">Awaiting funding</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-cyan-600 text-2xl">account_balance</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Premium</span>
            </div>
            <p className="text-3xl font-black text-cyan-600 mb-1">R{(totalActivePremium + totalInProgressPremium).toFixed(2)}</p>
            <p className="text-sm text-gray-600">Active + In Progress</p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-600 text-xl flex-shrink-0">info</span>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Monthly Batch Submission</p>
            <p>Active cover plans are submitted on the <strong>10th of each month</strong>. Download your CSV export for integration into your policy management system.</p>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-1">Monthly Batch Export</h2>
              <p className="text-sm text-gray-600">{activePlans.length} active cover plans · {currentMonth}</p>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={exporting || activePlans.length === 0}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: BLUE }}
            >
              <span className="material-symbols-outlined text-lg">download</span>
              {exporting ? 'Exporting...' : `Export CSV (${activePlans.length} plans)`}
            </button>
          </div>
        </div>

        {/* Cover Plans Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 px-6 py-4 text-sm font-bold transition-all ${
                activeTab === 'active'
                  ? 'border-b-2 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ borderColor: activeTab === 'active' ? BLUE : 'transparent' }}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">verified</span>
                Active ({activePlans.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`flex-1 px-6 py-4 text-sm font-bold transition-all ${
                activeTab === 'in_progress'
                  ? 'border-b-2 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ borderColor: activeTab === 'in_progress' ? BLUE : 'transparent' }}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">hourglass_empty</span>
                In Progress ({inProgressPlans.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('suspended')}
              className={`flex-1 px-6 py-4 text-sm font-bold transition-all ${
                activeTab === 'suspended'
                  ? 'border-b-2 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ borderColor: activeTab === 'suspended' ? BLUE : 'transparent' }}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">pending</span>
                Suspended ({suspendedPlans.length})
              </span>
            </button>
          </div>

          {/* Table Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              {activeTab === 'active' ? 'Active' : activeTab === 'in_progress' ? 'In Progress' : 'Suspended'} Cover Plans
            </h3>
            <button
              onClick={() => loadCoverPlans()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh
            </button>
          </div>

          {/* Table Content */}
          {displayPlans.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">policy</span>
              <p className="text-gray-600">No {activeTab} cover plans</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Member</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Plan</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Target Amount</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Funded</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Status</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Dates</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Linked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-900">{plan.member_name}</p>
                        <p className="text-xs text-gray-600">{plan.member_phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-gray-900">{plan.plan_name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-gray-900">R{plan.target_amount.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-bold ${plan.status === 'active' ? 'text-green-600' : 'text-orange-600'}`}>
                          R{plan.funded_amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          plan.status === 'active'
                            ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                            : plan.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-600 border border-blue-500/30'
                            : 'bg-orange-500/20 text-orange-600 border border-orange-500/30'
                        }`}>
                          <span className={`size-1.5 rounded-full ${
                            plan.status === 'active' ? 'bg-green-600' : plan.status === 'in_progress' ? 'bg-blue-600' : 'bg-orange-600'
                          }`}></span>
                          {plan.status === 'active' ? 'Active' : plan.status === 'in_progress' ? 'In Progress' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {plan.status === 'active' ? (
                          <div className="text-xs text-gray-600">
                            <p>From: {plan.active_from ? new Date(plan.active_from).toLocaleDateString() : 'N/A'}</p>
                            <p>To: {plan.active_to ? new Date(plan.active_to).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-600">
                            <p>Suspended: {plan.suspended_at ? new Date(plan.suspended_at).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-gray-900">{plan.linked_people_count}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-[10px] text-gray-600 font-medium uppercase tracking-widest text-center">
              Showing {displayPlans.length} {activeTab} cover plans for {currentMonth}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">© 2026 +1 Rewards · Provider Portal</p>
        </div>
      </footer>
    </div>
  );
}
