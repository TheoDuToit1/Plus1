// plus1-rewards/src/pages/AgentCommission.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const BLUE = '#1a558b';

interface CommissionRecord {
  id: string;
  month: string;
  total_amount: number;
  payout_status: 'pending' | 'paid';
  paid_at: string | null;
  created_at: string;
}

interface PartnerCommission {
  partner_name: string;
  transaction_count: number;
  commission_earned: number;
}

export function AgentCommission() {
  const navigate = useNavigate();
  const [agent, setAgent] = useState<any>(null);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [currentMonthBreakdown, setCurrentMonthBreakdown] = useState<PartnerCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    loadCommissionData();
  }, []);

  const loadCommissionData = async () => {
    setLoading(true);
    try {
      const agentDataStr = sessionStorage.getItem('currentAgent') || localStorage.getItem('currentAgent');
      if (!agentDataStr) {
        navigate('/agent/login');
        return;
      }

      const agentData = JSON.parse(agentDataStr);
      setAgent(agentData);

      const agentId = agentData.agent_id || agentData.id;

      // Load commission records
      const { data: commissionData } = await supabase
        .from('agent_commissions')
        .select('*')
        .eq('agent_id', agentId)
        .order('month', { ascending: false });

      setCommissions(commissionData || []);

      // Calculate totals
      const total = (commissionData || []).reduce((sum, c) => sum + parseFloat(c.total_amount), 0);
      const paid = (commissionData || []).filter(c => c.payout_status === 'paid').reduce((sum, c) => sum + parseFloat(c.total_amount), 0);
      const pending = (commissionData || []).filter(c => c.payout_status === 'pending').reduce((sum, c) => sum + parseFloat(c.total_amount), 0);

      setTotalEarned(total);
      setTotalPaid(paid);
      setTotalPending(pending);

      // Load current month breakdown
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      // Get partner links
      const { data: links } = await supabase
        .from('partner_agent_links')
        .select('partner_id')
        .eq('agent_id', agentId)
        .eq('status', 'active');

      if (links && links.length > 0) {
        const partnerIds = links.map(l => l.partner_id);

        // Get transactions for this month
        const { data: transactions } = await supabase
          .from('transactions')
          .select('partner_id, agent_amount, partners(shop_name)')
          .in('partner_id', partnerIds)
          .gte('created_at', `${currentMonth}-01`)
          .lt('created_at', `${currentMonth}-32`);

        // Group by partner
        const breakdown: { [key: string]: PartnerCommission } = {};
        (transactions || []).forEach(t => {
          const partnerName = (t.partners as any)?.shop_name || 'Unknown';
          if (!breakdown[partnerName]) {
            breakdown[partnerName] = {
              partner_name: partnerName,
              transaction_count: 0,
              commission_earned: 0
            };
          }
          breakdown[partnerName].transaction_count++;
          breakdown[partnerName].commission_earned += parseFloat(t.agent_amount || '0');
        });

        setCurrentMonthBreakdown(Object.values(breakdown));
      }
    } catch (error) {
      console.error('Error loading commission data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin mx-auto mb-4" style={{ borderTopColor: BLUE }}></div>
          <p className="text-gray-600">Loading commission data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: BLUE }}>
              <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Commission Dashboard</h1>
              <p className="text-sm text-gray-600">Track your earnings and payouts</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/agent/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-2xl" style={{ color: BLUE }}>payments</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Earned</span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">R{totalEarned.toFixed(2)}</p>
            <p className="text-sm text-gray-600">All time</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Paid Out</span>
            </div>
            <p className="text-3xl font-black text-green-600 mb-1">R{totalPaid.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Received</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-orange-600 text-2xl">pending</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Pending</span>
            </div>
            <p className="text-3xl font-black text-orange-600 mb-1">R{totalPending.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Awaiting payout</p>
          </div>
        </div>

        {/* Current Month Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: BLUE }}>calendar_month</span>
              This Month's Breakdown
            </h3>
          </div>

          {currentMonthBreakdown.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">receipt_long</span>
              <p className="text-gray-600">No commissions earned this month yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600">Partner Shop</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 text-center">Transactions</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 text-right">Commission Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentMonthBreakdown.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">{item.partner_name}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-gray-900">{item.transaction_count}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold" style={{ color: BLUE }}>R{item.commission_earned.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Commission History */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: BLUE }}>history</span>
              Payout History
            </h3>
          </div>

          {commissions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">history</span>
              <p className="text-gray-600">No payout history yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600">Month</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600">Paid Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">{commission.month}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold" style={{ color: BLUE }}>R{parseFloat(commission.total_amount).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          commission.payout_status === 'paid'
                            ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                            : 'bg-orange-500/20 text-orange-600 border border-orange-500/30'
                        }`}>
                          <span className={`size-1.5 rounded-full ${commission.payout_status === 'paid' ? 'bg-green-600' : 'bg-orange-600'}`}></span>
                          {commission.payout_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {commission.paid_at ? new Date(commission.paid_at).toLocaleDateString() : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 text-2xl">info</span>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Payout Information</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Commissions are calculated monthly based on completed transactions</li>
                <li>• Minimum payout threshold: R500</li>
                <li>• Payouts are processed on the 5th of each month</li>
                <li>• You earn 1% of every transaction from your recruited partners</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
