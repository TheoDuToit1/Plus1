import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface PolicyBatch {
  member_id: string; member_name: string; member_phone: string;
  plan_name: string; monthly_target: number; amount_funded: number;
  activation_date: string; status: 'activated' | 'in_progress';
}

export function AdminDay1Batch() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<PolicyBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'activated' | 'in_progress'>('activated');
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: wallets } = await supabase.from('wallets').select('member_id, policies, partner_id');
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
            plan_name: pol.name || key, monthly_target: pol.target || 0,
            amount_funded: pol.current || 0,
            activation_date: pol.paid_date || new Date().toISOString(),
            status: (pol.current || 0) >= (pol.target || 1) ? 'activated' : 'in_progress',
          });
        });
      });
      setBatches(batchData);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const exportCSV = () => {
    setExporting(true);
    const filtered = batches.filter(b => filter === 'all' || b.status === filter);
    const headers = ['Member ID', 'Member Name', 'Phone', 'Plan Name', 'Monthly Premium', 'Amount Funded', 'Status', 'Date'];
    const rows = filtered.map(b => [b.member_id, b.member_name, b.member_phone, b.plan_name, `R${b.monthly_target}`, `R${b.amount_funded}`, b.status, new Date(b.activation_date).toLocaleDateString('en-ZA')]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `day1health_batch_${currentMonth}.csv`; a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const filtered = batches.filter(b => filter === 'all' || b.status === filter);
  const activatedCount = batches.filter(b => b.status === 'activated').length;
  const totalValue = batches.filter(b => b.status === 'activated').reduce((s, b) => s + b.monthly_target, 0);

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>🏥 Day1 Health — Policy Export</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Monthly batch file for policy provider · {currentMonth}</p>
          </div>
          <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Provider Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', color: '#fff', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>🏥</div>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: '1.125rem', margin: '0 0 0.25rem' }}>Day1 Health (Pty) Ltd</h2>
                  <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.875rem' }}>Policy Provider · Batch submitted Day 10 monthly</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 2px', fontSize: '0.8125rem' }}>Total batch value (90%)</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#6ee7b7' }}>R{(totalValue * 0.9).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--green-dark)' }}>
              <p className="stat-label">Activated Policies</p>
              <p className="stat-value" style={{ color: 'var(--green-dark)' }}>{activatedCount}</p>
              <p className="stat-sub">Ready for batch</p>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--blue)' }}>
              <p className="stat-label">Total Premium Value</p>
              <p className="stat-value" style={{ color: 'var(--blue)' }}>R{totalValue.toFixed(2)}</p>
              <p className="stat-sub">This month</p>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid #0e7490' }}>
              <p className="stat-label">Day1 Health Receives</p>
              <p className="stat-value" style={{ color: '#0e7490' }}>R{(totalValue * 0.9).toFixed(2)}</p>
              <p className="stat-sub">90% of activated value</p>
            </div>
          </div>

          <div className="alert alert-info">
            📅 This batch is due to Day1 Health on the <strong>10th of each month</strong>. Export CSV and submit via the provider portal at <strong>portal.day1health.co.za</strong>
          </div>

          {/* Filter + Export */}
          <div className="card" style={{ padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '10px', padding: '3px', flex: 1, minWidth: '200px' }}>
              {[
                { id: 'activated', label: `✓ Activated (${batches.filter(b => b.status === 'activated').length})` },
                { id: 'in_progress', label: `⏳ In Progress (${batches.filter(b => b.status === 'in_progress').length})` },
                { id: 'all', label: 'All' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setFilter(tab.id as typeof filter)} style={{ flex: 1, padding: '0.5rem 0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', background: filter === tab.id ? '#fff' : 'transparent', color: filter === tab.id ? 'var(--blue)' : 'var(--gray-text)', boxShadow: filter === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>
                  {tab.label}
                </button>
              ))}
            </div>
            <button onClick={exportCSV} disabled={exporting || filtered.length === 0} className="btn btn-green" style={{ borderRadius: '10px', flexShrink: 0 }}>
              {exporting ? '⏳ Exporting...' : `📥 Export CSV (${filtered.length} records)`}
            </button>
          </div>

          {/* Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto', animation: 'spin 1s linear infinite' }} /></div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Plan</th>
                      <th>Monthly Premium</th>
                      <th>Funded</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-light)' }}>No records found</td></tr>
                    ) : filtered.map((b, i) => (
                      <tr key={i}>
                        <td>
                          <p style={{ fontWeight: 700, margin: '0 0 2px' }}>{b.member_name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: 0, fontFamily: 'monospace' }}>{b.member_phone}</p>
                        </td>
                        <td style={{ fontWeight: 600 }}>{b.plan_name}</td>
                        <td style={{ fontWeight: 700 }}>R{b.monthly_target.toFixed(2)}</td>
                        <td>
                          <div className="progress-track" style={{ width: '80px', height: '6px' }}>
                            <div className="progress-fill" style={{ width: `${Math.min((b.amount_funded / b.monthly_target) * 100, 100)}%` }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-text)' }}>R{b.amount_funded.toFixed(2)}</span>
                        </td>
                        <td>
                          {b.status === 'activated'
                            ? <span className="badge badge-green">✓ Activated</span>
                            : <span className="badge badge-blue">⏳ In Progress</span>}
                        </td>
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
