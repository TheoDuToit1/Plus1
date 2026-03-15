import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function ShopLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: formData.username, password: formData.password });
      if (authError) { setError('Invalid email or password'); setLoading(false); return; }
      const { data: shopData } = await supabase.from('shops').select('id, name, phone, status').eq('email', formData.username).single();
      if (!shopData) { setError('Shop not found for this email.'); setLoading(false); return; }
      if (shopData.status === 'suspended') { setError('This shop is suspended. Contact support.'); setLoading(false); return; }
      localStorage.setItem('currentShop', JSON.stringify({ id: shopData.id, name: shopData.name, phone: shopData.phone }));
      navigate('/shop/dashboard');
    } catch (err) { setError(err instanceof Error ? err.message : 'Login failed'); setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.25rem' }}>🏪</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Shop Portal</span>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>Run your rewards program</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Issue rewards to customers, track transactions, and manage your monthly invoice — all in one place.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '📱', title: 'Scan member QR codes', desc: 'Identify customers instantly' },
              { icon: '💰', title: 'Issue rewards instantly', desc: 'Auto-calculated commission split' },
              { icon: '📄', title: 'Manage monthly invoices', desc: 'Pay and stay active' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.875rem', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'left' }}>
                <span style={{ fontSize: '1.375rem', flexShrink: 0 }}>{s.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{s.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-panel-right" style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
        <div className="auth-form animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--green-dark)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>🏪</div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827' }}>Shop Owner Login</span>
          </div>

          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>Welcome back</h2>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Sign in to your shop dashboard.</p>

          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="input-label" htmlFor="shop-email">Shop Email</label>
              <input id="shop-email" type="email" name="username" className="input" placeholder="shop@example.com"
                value={formData.username} onChange={handleChange} required autoComplete="email" />
            </div>
            <div>
              <label className="input-label" htmlFor="shop-password">Password</label>
              <input id="shop-password" type="password" name="password" className="input" placeholder="••••••••"
                value={formData.password} onChange={handleChange} required autoComplete="current-password" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-block"
              style={{ marginTop: '0.5rem', height: '52px', fontSize: '1rem', borderRadius: '12px', background: 'var(--green-dark)', color: '#fff' }}>
              {loading ? '⏳ Signing in...' : '🏪 Sign In to Shop'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--gray-text)', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            No shop account?{' '}
            <button onClick={() => navigate('/shop/register')} style={{ color: 'var(--green-dark)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>
              Register your shop →
            </button>
          </p>

          <div style={{ borderTop: '1px solid var(--gray-border)', marginTop: '1.5rem', paddingTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigate('/member/login')} className="btn btn-ghost btn-block" style={{ fontSize: '0.8125rem', borderRadius: '10px', padding: '0.625rem' }}>
              👤 Member Login
            </button>
            <button onClick={() => navigate('/agent/login')} className="btn btn-ghost btn-block" style={{ fontSize: '0.8125rem', borderRadius: '10px', padding: '0.625rem' }}>
              📊 Agent Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
