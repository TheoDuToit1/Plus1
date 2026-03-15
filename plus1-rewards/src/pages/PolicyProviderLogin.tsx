import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function PolicyProviderLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hardcoded Day1 Health credentials
  const PROVIDER_EMAIL = 'day1health@plus1rewards.co.za';
  const PROVIDER_PASSWORD = 'Day1Health2026!';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    setTimeout(() => {
      if (email === PROVIDER_EMAIL && password === PROVIDER_PASSWORD) {
        localStorage.setItem('currentProvider', JSON.stringify({ id: 'day1health', name: 'Day1 Health', email: PROVIDER_EMAIL }));
        navigate('/provider/dashboard');
      } else {
        setError('Invalid credentials. Contact +1 Rewards admin for access.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div className="logo-mark-white"><span className="logo-text">+1</span></div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Policy Provider Portal</span>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>Health policy partner hub</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Receive monthly policy batch files, track activated policies and member coverage in one place.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              { icon: '📥', title: 'Batch Downloads', desc: 'Monthly CSV with all activated members' },
              { icon: '📊', title: 'Policy Analytics', desc: 'Track coverage and activation stats' },
              { icon: '✅', title: 'Activation Status', desc: 'View funded & active policies' },
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
          <button onClick={() => navigate('/')} style={{ marginTop: '2rem', background: 'none', border: '1px solid rgba(255,255,255,0.35)', color: '#fff', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', background: '#064e3b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem' }}>🏥</div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#064e3b' }}>Day1 Health</span>
          </div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>Partner Sign In</h2>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Access your +1 Rewards policy batch data.</p>

          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div>
              <label className="input-label">Provider Email</label>
              <input type="email" className="input" placeholder="provider@day1health.co.za" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input type="password" className="input" placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} style={{ height: '52px', fontSize: '1rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #064e3b, #065f46)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
              {loading ? '⏳ Signing in...' : '🏥 Access Provider Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
            <p style={{ fontSize: '0.75rem', color: '#166534', textAlign: 'center', margin: 0 }}>
              🔒 Authorised Day1 Health partners only.<br />Contact <strong>admin@plus1rewards.co.za</strong> to request access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
