import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hardcoded admin credentials
  const ADMIN_EMAIL = 'admin@plus1rewards.co.za';
  const ADMIN_PASSWORD = 'Plus1Admin2026!';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('currentAdmin', JSON.stringify({ id: 'admin', email: ADMIN_EMAIL, role: 'admin' }));
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div className="logo-mark-white"><span className="logo-text">+1</span></div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Admin Portal</span>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>Platform control centre</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Manage shops, invoices, suspensions, agent payouts, and policy provider batches from one secure dashboard.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              { icon: '🏪', title: 'Shop Management', desc: 'Monitor all partner shops & invoices' },
              { icon: '👥', title: 'Agent Payouts', desc: 'Process monthly commission payments' },
              { icon: '🏥', title: 'Day1 Health Batches', desc: 'Export activated policy data' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.875rem', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'left' }}>
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

      <div className="auth-panel-right">
        <div className="auth-form animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div className="logo-mark"><span className="logo-text">+1</span></div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827' }}>Admin Access</span>
          </div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>Sign in</h2>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Restricted to authorised +1 Rewards staff only.</p>

          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div>
              <label className="input-label">Admin Email</label>
              <input type="email" className="input" placeholder="admin@plus1rewards.co.za" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input type="password" className="input" placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ height: '52px', fontSize: '1rem', borderRadius: '12px', marginTop: '0.25rem' }}>
              {loading ? '⏳ Signing in...' : '🔐 Sign In to Admin Panel'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: '10px', border: '1px solid var(--gray-border)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', textAlign: 'center', margin: 0 }}>
              🔒 This portal is for authorised administrators only.<br />Unauthorised access attempts are logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
