import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Transaction {
  id: string;
  shop_name: string;
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

export function MemberHistory() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<MemberSummary>({ totalEarned: 0, totalSpent: 0, thisMonth: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'month' | 'earn' | 'spend'>('month');
  const [memberName, setMemberName] = useState('');

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/member/login'); return; }

      const { data: memberData } = await supabase.from('members').select('name').eq('id', user.id).single();
      if (memberData) setMemberName(memberData.name);

      const { data: txData } = await supabase
        .from('transactions')
        .select('id, purchase_amount, member_reward, policy_filled, created_at, shops(name)')
        .eq('member_id', user.id)
        .order('created_at', { ascending: false });

      const formatted: Transaction[] = (txData || []).map(tx => ({
        id: tx.id,
        shop_name: (Array.isArray(tx.shops) ? (tx.shops[0] as any)?.name : (tx.shops as any)?.name) || 'Unknown Shop',
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

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>📋 Rewards History</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{memberName}</p>
          </div>
          <button onClick={() => navigate('/member/dashboard')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <p className="stat-label">Total Earned</p>
              <p className="stat-value" style={{ color: 'var(--green-dark)', fontSize: '1.375rem' }}>R{summary.totalEarned.toFixed(2)}</p>
              <p className="stat-sub">All time</p>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <p className="stat-label">This Month</p>
              <p className="stat-value" style={{ color: 'var(--blue)', fontSize: '1.375rem' }}>R{summary.thisMonth.toFixed(2)}</p>
              <p className="stat-sub">Rewards earned</p>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <p className="stat-label">Transactions</p>
              <p className="stat-value" style={{ color: 'var(--gray-text)', fontSize: '1.375rem' }}>{transactions.length}</p>
              <p className="stat-sub">Total visits</p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="card" style={{ padding: '0.875rem' }}>
            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '10px', padding: '3px', gap: '2px' }}>
              {[
                { id: 'month', label: 'This Month' },
                { id: 'all', label: 'All Time' },
                { id: 'earn', label: '💚 Earned' },
                { id: 'spend', label: '🛍 Spent' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setFilter(tab.id as typeof filter)} style={{
                  flex: 1, padding: '0.5rem 0.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.8rem',
                  background: filter === tab.id ? '#fff' : 'transparent',
                  color: filter === tab.id ? 'var(--blue)' : 'var(--gray-text)',
                  boxShadow: filter === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction list */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-border)' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Transactions ({filtered.length})</h2>
            </div>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-light)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛍️</div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No transactions yet</p>
                <p style={{ fontSize: '0.875rem' }}>Start shopping at partner stores to earn rewards!</p>
              </div>
            ) : (
              <div>
                {filtered.map((tx, i) => (
                  <div key={tx.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1rem 1.5rem',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--gray-border)' : 'none',
                    background: i % 2 === 0 ? '#fff' : '#fafbff',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', flexShrink: 0 }}>
                        🏪
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{tx.shop_name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: 0 }}>
                          {new Date(tx.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })} · {tx.policy_name}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 800, color: 'var(--green-dark)', margin: '0 0 2px' }}>+R{tx.rewards_issued.toFixed(2)}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: 0 }}>R{tx.purchase_amount.toFixed(2)} purchase</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={{ background: '#fff', borderTop: '1px solid var(--gray-border)', padding: '1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.8125rem' }}>© 2026 +1 Rewards · Shop. Earn. Cover your health.</p>
      </footer>
    </div>
  );
}
