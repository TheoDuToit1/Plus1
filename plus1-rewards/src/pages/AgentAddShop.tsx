import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AgentAddShop() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', bank_name: '', bank_account: '', commission_rate: '5' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const agent = (() => { try { return JSON.parse(localStorage.getItem('currentAgent') || '{}'); } catch { return {}; } })();

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    if (!agent.id) { navigate('/agent/login'); return; }
    try {
      const { data, error: insertError } = await supabase.from('shops').insert([{
        name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
        address: form.address.trim(), bank_name: form.bank_name.trim(), bank_account: form.bank_account.trim(),
        commission_rate: parseFloat(form.commission_rate), agent_id: agent.id, status: 'active',
        password_hash: 'temp-' + Date.now(),
      }]).select().single();
      if (insertError) throw insertError;
      setSuccess(true);
      setTimeout(() => navigate('/agent/dashboard'), 2500);
    } catch (err: any) {
      setError(err?.message || 'Failed to register shop. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="page-wrapper" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏪</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534', marginBottom: '0.5rem' }}>Shop Registered!</h2>
      <p style={{ color: 'var(--gray-text)' }}>{form.name} is now part of your network. Redirecting...</p>
    </div>
  );

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>🏪 Recruit a Shop</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Register a new partner shop to your network</p>
          </div>
          <button onClick={() => navigate('/agent/dashboard')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="card">
              <h2 className="section-title">Shop Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="input-label">Shop / Business Name *</label>
                  <input type="text" className="input" placeholder="e.g. Pick n Pay Rosebank" value={form.name} onChange={e => update('name', e.target.value)} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div>
                    <label className="input-label">Shop Phone *</label>
                    <input type="tel" className="input" placeholder="011 555 0000" value={form.phone} onChange={e => update('phone', e.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">Shop Email</label>
                    <input type="email" className="input" placeholder="shop@email.co.za" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Physical Address *</label>
                  <input type="text" className="input" placeholder="123 Main Road, Johannesburg" value={form.address} onChange={e => update('address', e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="section-title">Commission Rate</h2>
              <div>
                <label className="input-label">Shop Allocates (%) to +1 Rewards *</label>
                <input type="number" className="input" placeholder="5" min="3" max="20" step="0.5" value={form.commission_rate} onChange={e => update('commission_rate', e.target.value)} required />
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-text)', marginTop: '0.5rem' }}>
                  ℹ️ Minimum 3%. Of this: member earns {Math.max(parseFloat(form.commission_rate || '0') - 2, 1)}%, you earn 1%, platform takes 1%.
                </p>
              </div>
            </div>

            <div className="card">
              <h2 className="section-title">Banking Details (for EFT invoicing)</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label className="input-label">Bank Name *</label>
                  <input type="text" className="input" placeholder="Standard Bank" value={form.bank_name} onChange={e => update('bank_name', e.target.value)} required />
                </div>
                <div>
                  <label className="input-label">Account Number *</label>
                  <input type="text" className="input" placeholder="012345678" value={form.bank_account} onChange={e => update('bank_account', e.target.value)} required />
                </div>
              </div>
            </div>

            <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '1rem 1.25rem', border: '1px solid #bfdbfe', fontSize: '0.875rem', color: '#1e40af' }}>
              💡 You earn <strong>1%</strong> of every transaction made by members at this shop, paid on the 5th of each month (minimum R500 payout).
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ height: '56px', fontSize: '1rem', borderRadius: '12px' }}>
              {loading ? '⏳ Registering Shop...' : '🏪 Register Shop to My Network'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
