import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AgentLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password });
      if (authError) { setError('Invalid email or password'); setLoading(false); return; }
      const { data: agentData } = await supabase.from('agents').select('id, name, phone').eq('email', formData.email).single();
      if (!agentData) { setError('No agent account found for this email.'); setLoading(false); return; }
      localStorage.setItem('currentAgent', JSON.stringify({ id: agentData.id, name: agentData.name, phone: agentData.phone }));
      navigate('/agent/dashboard');
    } catch (err) { setError(err instanceof Error ? err.message : 'Login failed'); setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📊</div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Agent Portal</span>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>Grow your network, earn more</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Recruit shops to +1 Rewards and earn 1% on every transaction they process — month after month.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            {[
              { value: '1%', label: 'Per transaction' },
              { value: 'Monthly', label: 'Commission payout' },
              { value: 'Unlimited', label: 'Shops to recruit' },
              { value: 'Real-time', label: 'Earnings tracker' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.875rem', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#22d3ee' }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-panel-right" style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
        <div className="auth-form animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', background: '#0e7490', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📊</div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827' }}>Sales Agent Login</span>
          </div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>Welcome back, Agent</h2>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Sign in to view your commissions & recruited shops.</p>

          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="input-label" htmlFor="agent-email">Email Address</label>
              <input id="agent-email" type="email" className="input" placeholder="agent@example.com" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="input-label" htmlFor="agent-password">Password</label>
              <input id="agent-password" type="password" className="input" placeholder="••••••••" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-block" style={{ marginTop: '0.5rem', height: '52px', fontSize: '1rem', borderRadius: '12px', background: '#0e7490', color: '#fff' }}>
              {loading ? '⏳ Signing in...' : '📊 Sign In to Agent Portal'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--gray-text)', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            Not an agent?{' '}
            <button onClick={() => navigate('/agent/register')} style={{ color: '#0e7490', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>Register →</button>
          </p>
          <div style={{ borderTop: '1px solid var(--gray-border)', marginTop: '1.5rem', paddingTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigate('/member/login')} className="btn btn-ghost btn-block" style={{ fontSize: '0.8125rem', borderRadius: '10px', padding: '0.625rem' }}>👤 Member</button>
            <button onClick={() => navigate('/shop/login')} className="btn btn-ghost btn-block" style={{ fontSize: '0.8125rem', borderRadius: '10px', padding: '0.625rem' }}>🏪 Shop</button>
          </div>
        </div>
      </div>
    </div>
  );
}
