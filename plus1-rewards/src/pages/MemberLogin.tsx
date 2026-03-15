import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function MemberLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (authError) throw authError;
      if (data.user) navigate('/member/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── LEFT PANEL ── */}
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '340px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div className="logo-mark-white">
              <span className="logo-text">+1</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>+1 Rewards</span>
          </div>

          {/* Tagline */}
          <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.5px' }}>
            Shop. Earn.<br />Cover your health.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Every rand you spend at partner shops builds your Day1 Health insurance policy — automatically.
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { value: '3%', label: 'Rewards per purchase' },
              { value: 'R385', label: 'Monthly policy target' },
              { value: '100%', label: 'Offline capable' },
              { value: 'Day1', label: 'Health insurance partner' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '0.25rem', color: '#37d270' }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-panel-right" style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
        <div className="auth-form animate-fade-up">
          {/* Mobile logo (hidden on desktop via auth-panel-left display:none) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div className="logo-mark">
              <span className="logo-text">+1</span>
            </div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827' }}>+1 Rewards</span>
          </div>

          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem', letterSpacing: '-0.3px' }}>
            Welcome back, member
          </h2>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
            Sign in to view your rewards &amp; policy progress.
          </p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="input-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                className="input"
                placeholder="sarah@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="input-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                className="input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{ marginTop: '0.5rem', height: '52px', fontSize: '1rem', borderRadius: '12px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                  Signing in...
                </span>
              ) : 'Sign In to My Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--gray-text)', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/member/register')}
              style={{ color: 'var(--blue)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
            >
              Register for free →
            </button>
          </p>

          <div style={{ borderTop: '1px solid var(--gray-border)', marginTop: '1.5rem', paddingTop: '1.25rem' }}>
            <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--gray-light)', marginBottom: '0.75rem' }}>
              Not a member?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/shop/login')}
                className="btn btn-ghost btn-block"
                style={{ fontSize: '0.8125rem', borderRadius: '10px', padding: '0.625rem' }}
              >
                🏪 Shop Login
              </button>
              <button
                onClick={() => navigate('/agent/login')}
                className="btn btn-ghost btn-block"
                style={{ fontSize: '0.8125rem', borderRadius: '10px', padding: '0.625rem' }}
              >
                📊 Agent Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
