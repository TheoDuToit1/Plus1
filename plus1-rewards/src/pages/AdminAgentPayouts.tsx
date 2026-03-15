import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Agent { id: string; name: string; phone: string; bank_name: string; bank_account: string; total_commission: number; email?: string }
interface PayoutRecord { agent_id: string; agent_name: string; amount: number; month: string; status: 'pending' | 'paid' }

export function AdminAgentPayouts() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: agentsData } = await supabase.from('agents').select('*').gt('total_commission', 0);
      if (agentsData) setAgents(agentsData);
      // Build payout records from agent commissions
      const records: PayoutRecord[] = (agentsData || []).map(a => ({
        agent_id: a.id, agent_name: a.name, amount: a.total_commission || 0,
        month: currentMonth, status: a.total_commission >= 500 ? 'pending' : 'pending',
      }));
      setPayouts(records);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const markPaid = async (agentId: string, amount: number) => {
    setProcessing(agentId);
    try {
      await supabase.from('agents').update({ total_commission: 0 }).eq('id', agentId);
      setSuccessMsg(`Payout of R${amount.toFixed(2)} marked as paid.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      loadData();
    } catch { /* silent */ } finally { setProcessing(null); }
  };

  const totalPending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>👥 Agent Payouts</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Monthly commission disbursements · {currentMonth}</p>
          </div>
          <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="stat-card" style={{ borderLeft: '3px solid #0e7490' }}>
              <p className="stat-label">Agents with Commission</p>
              <p className="stat-value" style={{ color: '#0e7490' }}>{agents.length}</p>
              <p className="stat-sub">Due this cycle</p>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--green-dark)' }}>
              <p className="stat-label">Total Pending Payout</p>
              <p className="stat-value" style={{ color: 'var(--green-dark)' }}>R{totalPending.toFixed(2)}</p>
              <p className="stat-sub">Across all agents</p>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--orange)' }}>
              <p className="stat-label">Due Date</p>
              <p className="stat-value" style={{ color: 'var(--orange)', fontSize: '1.25rem' }}>5th of Month</p>
              <p className="stat-sub">Per commission rules</p>
            </div>
          </div>

          <div className="alert alert-info">
            💡 Agent minimum payout is <strong>R500/month</strong>. Balances below R500 roll over to the next month automatically.
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Agent Commission Ledger</h2>
              <button onClick={loadData} style={{ background: 'var(--blue-light)', color: 'var(--blue)', border: 'none', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
                🔄 Refresh
              </button>
            </div>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto', animation: 'spin 1s linear infinite' }} /></div>
            ) : agents.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-light)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                <p style={{ fontWeight: 600 }}>No pending agent payouts</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Agent</th>
                      <th>Bank Details</th>
                      <th>Commission Earned</th>
                      <th>Eligible for Payout</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map(agent => {
                      const eligible = agent.total_commission >= 500;
                      return (
                        <tr key={agent.id}>
                          <td>
                            <p style={{ fontWeight: 700, margin: '0 0 2px' }}>{agent.name}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: 0 }}>{agent.phone}</p>
                          </td>
                          <td>
                            <p style={{ margin: '0 0 2px', fontSize: '0.875rem' }}>{agent.bank_name || '—'}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: 0, fontFamily: 'monospace' }}>{agent.bank_account || '—'}</p>
                          </td>
                          <td><span style={{ fontWeight: 800, color: 'var(--green-dark)' }}>R{(agent.total_commission || 0).toFixed(2)}</span></td>
                          <td>
                            {eligible
                              ? <span className="badge badge-green">✓ R500+ threshold met</span>
                              : <span className="badge badge-gray">Rolls over (under R500)</span>}
                          </td>
                          <td>
                            {eligible ? (
                              <button
                                onClick={() => markPaid(agent.id, agent.total_commission)}
                                disabled={processing === agent.id}
                                style={{ background: 'var(--green-dark)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.375rem 0.875rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>
                                {processing === agent.id ? '⏳' : '✓ Mark Paid'}
                              </button>
                            ) : (
                              <span style={{ color: 'var(--gray-light)', fontSize: '0.8125rem' }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
