import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSession, clearSession } from '../lib/session';
import MemberLayout from '../components/member/MemberLayout';

interface Transaction {
  id: string;
  partner_name: string;
  purchase_amount: number;
  rewards_issued: number;
  policy_name: string;
  created_at: string;
  type: 'earn' | 'spend';
}

interface MemberSummary {
  totalEarned: number;
  totalSpent: number;
  thisMonth: number;
}

interface Member {
  id: string;
  name: string;
  phone: string;
  qr_code: string;
}

export function MemberHistory() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<MemberSummary>({ totalEarned: 0, totalSpent: 0, thisMonth: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'month' | 'earn' | 'spend'>('month');

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const session = getSession();
      
      if (!session) { 
        navigate('/member/login'); 
        return; 
      }

      const { data: memberData, error: memberError } = await supabase.from('members').select('*').eq('id', session.user.id).single();
      
      if (memberError || !memberData) {
        console.log('Member not found, redirecting to login');
        clearSession();
        navigate('/member/login');
        return;
      }
      
      if (memberData) setMember(memberData);

      const { data: txData } = await supabase
        .from('transactions')
        .select('id, purchase_amount, member_reward, policy_filled, created_at, partners(name)')
        .eq('member_id', session.user.id)
        .order('created_at', { ascending: false });

      const formatted: Transaction[] = (txData || []).map(tx => ({
        id: tx.id,
        partner_name: (Array.isArray(tx.partners) ? (tx.partners[0] as any)?.name : (tx.partners as any)?.name) || 'Unknown Partner',
        purchase_amount: tx.purchase_amount,
        rewards_issued: tx.member_reward || 0,
        policy_name: (tx as any).policy_filled || 'Day-to-Day',
        created_at: tx.created_at,
        type: 'earn',
      }));

      setTransactions(formatted);
      const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
      setSummary({
        totalEarned: formatted.reduce((s, t) => s + t.rewards_issued, 0),
        totalSpent: 0,
        thisMonth: formatted.filter(t => new Date(t.created_at) >= monthStart).reduce((s, t) => s + t.rewards_issued, 0),
      });
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const filtered = (() => {
    let f = transactions;
    if (filter === 'month') { const m = new Date(); m.setDate(1); m.setHours(0,0,0,0); f = f.filter(t => new Date(t.created_at) >= m); }
    if (filter === 'earn') f = f.filter(t => t.type === 'earn');
    if (filter === 'spend') f = f.filter(t => t.type === 'spend');
    return f;
  })();

  if (loading) {
    return (
      <div className="bg-[#f5f8fc] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <MemberLayout 
      member={member}
      isOnline={navigator.onLine}
      pendingTransactions={0}
      onSignOut={() => supabase.auth.signOut().then(() => navigate('/member/login'))}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rewards History</h1>
          <p className="text-gray-600">Track your earnings and spending</p>
        </div>
        <button 
          onClick={() => navigate('/member/dashboard')}
          className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-4 py-2 rounded-xl transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500 text-2xl">trending_up</span>
            <div>
              <p className="text-gray-900 font-bold text-xl">R{summary.totalEarned.toFixed(2)}</p>
              <p className="text-gray-600 text-sm">Total Earned</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl">calendar_month</span>
            <div>
              <p className="text-gray-900 font-bold text-xl">R{summary.thisMonth.toFixed(2)}</p>
              <p className="text-gray-600 text-sm">This Month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl">receipt</span>
            <div>
              <p className="text-gray-900 font-bold text-xl">{transactions.length}</p>
              <p className="text-gray-600 text-sm">Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex gap-2">
          {[
            { id: 'month', label: 'This Month', icon: 'calendar_month' },
            { id: 'all', label: 'All Time', icon: 'history' },
            { id: 'earn', label: 'Earned', icon: 'add_circle' },
            { id: 'spend', label: 'Spent', icon: 'remove_circle' },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === tab.id 
                  ? 'bg-[#1a558b] text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Transactions ({filtered.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">receipt_long</span>
            <h3 className="text-gray-900 font-bold text-lg mb-2">No transactions yet</h3>
            <p className="text-gray-600 mb-6">Start shopping at partner stores to earn rewards!</p>
            <button
              onClick={() => navigate('/member/find-partners')}
              className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Find Partner Shops
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filtered.map((tx) => (
              <div key={tx.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1a558b]/10 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#1a558b] text-xl">store</span>
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold">{tx.partner_name}</h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(tx.created_at).toLocaleDateString('en-ZA', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })} • {tx.policy_name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-green-500 font-bold text-lg">+R{tx.rewards_issued.toFixed(2)}</p>
                    <p className="text-gray-600 text-sm">R{tx.purchase_amount.toFixed(2)} purchase</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MemberLayout>
  );
}
