import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface PolicyBatch {
  member_id: string; member_name: string; member_phone: string;
  plan_name: string; monthly_target: number; amount_funded: number; status: 'activated' | 'in_progress';
}

export function PolicyProviderDashboard() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<PolicyBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const provider = (() => { try { return JSON.parse(localStorage.getItem('currentProvider') || '{}'); } catch { return {}; } })();
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => { if (!provider.id) { navigate('/provider/login'); return; } loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: wallets } = await supabase.from('wallets').select('member_id, policies');
      const { data: members } = await supabase.from('members').select('id, name, phone');
      const memberMap = new Map(members?.map(m => [m.id, m]) || []);
      const batchData: PolicyBatch[] = [];
      (wallets || []).forEach(wallet => {
        const member = memberMap.get(wallet.member_id);
        if (!member) return;
        const policies = wallet.policies || {};
        Object.entries(policies).forEach(([key, pol]: [string, any]) => {
          if (!pol.target) return;
          batchData.push({
            member_id: wallet.member_id, member_name: member.name, member_phone: member.phone,
            plan_name: pol.name || key, monthly_target: pol.target || 0, amount_funded: pol.current || 0,
            status: (pol.current || 0) >= (pol.target || 1) ? 'activated' : 'in_progress',
          });
        });
      });
      setBatches(batchData);
    } catch { /* silent */ } finally { setLoading(false); }
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

  const activated = batches.filter(b => b.status === 'activated');
  const inProgress = batches.filter(b => b.status === 'in_progress');
  const totalValue = activated.reduce((s, b) => s + b.monthly_target, 0);

  return (
    <div className="page-wrapper">
      <header style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', color: '#fff', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>🏥</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>Day1 Health — Partner Dashboard</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Policy batch data · {currentMonth}</div>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('currentProvider'); navigate('/provider/login'); }} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Activated Policies', value: String(activated.length), sub: 'Ready for coverage', color: 'var(--green-dark)' },
              { label: 'In Progress', value: String(inProgress.length), sub: 'Still accumulating', color: 'var(--blue)' },
              { label: 'Monthly Premium', value: `R${totalValue.toFixed(2)}`, sub: 'From activated only', color: '#064e3b' },
              { label: 'Day1 Receives (90%)', value: `R${(totalValue * 0.9).toFixed(2)}`, sub: 'Net of platform fee', color: '#0e7490' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
                <p className="stat-label">{s.label}</p>
                <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
                <p className="stat-sub">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="alert alert-info">
            📅 Batch submitted by +1 Rewards on the <strong>10th of each month</strong>. Please download your CSV for integration into your policy management system.
          </div>

          {/* Export */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="section-title" style={{ margin: '0 0 0.25rem' }}>Monthly Batch Export</h2>
              <p style={{ color: 'var(--gray-text)', fontSize: '0.875rem', margin: 0 }}>{activated.length} activated members · {currentMonth}</p>
            </div>
            <button onClick={exportCSV} disabled={exporting || activated.length === 0} style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.875rem 1.5rem', fontWeight: 800, fontSize: '0.9375rem', cursor: 'pointer', minWidth: '180px' }}>
              {exporting ? '⏳ Exporting...' : `📥 Export CSV (${activated.length} members)`}
            </button>
          </div>

          {/* Activated policies */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="section-title" style={{ margin: 0 }}>✅ Activated Policies ({activated.length})</h2>
              <button onClick={loadData} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh</button>
            </div>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid #a7f3d0', borderTopColor: '#064e3b', margin: '0 auto', animation: 'spin 1s linear infinite' }} /></div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr><th>Member</th><th>Plan</th><th>Monthly Premium</th><th>Funded</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {activated.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-light)' }}>No activated policies yet this month</td></tr>
                    ) : activated.map((b, i) => (
                      <tr key={i}>
                        <td>
                          <p style={{ fontWeight: 700, margin: '0 0 2px' }}>{b.member_name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: 0 }}>{b.member_phone}</p>
                        </td>
                        <td style={{ fontWeight: 600 }}>{b.plan_name}</td>
                        <td style={{ fontWeight: 700 }}>R{b.monthly_target.toFixed(2)}</td>
                        <td style={{ fontWeight: 700, color: 'var(--green-dark)' }}>R{b.amount_funded.toFixed(2)}</td>
                        <td><span className="badge badge-green">✓ Activated</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
