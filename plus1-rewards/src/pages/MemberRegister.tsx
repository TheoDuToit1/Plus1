import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function MemberRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: '', name: '', email: '', password: '' });
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (authError) throw authError;
      if (authData.user) {
        await supabase.from('members').insert([{
          id: authData.user.id,
          phone: formData.phone,
          name: formData.name,
          qr_code: authData.user.id,
        }]);
        navigate('/member/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── LEFT PANEL ── */}
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div className="logo-mark-white">
              <span className="logo-text">+1</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>+1 Rewards</span>
          </div>

          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            Start earning rewards today
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Join thousands of members who fund their health insurance through everyday shopping.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '🛍️', title: 'Shop at partner stores', desc: 'Earn 3% on every purchase' },
              { icon: '💳', title: 'Build your policy', desc: 'Rewards auto-fund Day1 Health' },
              { icon: '✅', title: 'Get covered', desc: 'Policy activates when target is met' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.875rem', textAlign: 'left',
                background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{s.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{s.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-panel-right" style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
        <div className="auth-form animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div className="logo-mark">
              <span className="logo-text">+1</span>
            </div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827' }}>+1 Rewards</span>
          </div>

          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>
            Create your account
          </h2>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
            Free to join. Start earning in minutes.
          </p>

          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div>
              <label className="input-label" htmlFor="name">Full Name</label>
              <input id="name" type="text" name="name" className="input" placeholder="Sarah Mitchell"
                value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="input-label" htmlFor="phone">Mobile Number</label>
              <input id="phone" type="tel" name="phone" className="input" placeholder="082 555 1234"
                value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
              <label className="input-label" htmlFor="reg-email">Email Address</label>
              <input id="reg-email" type="email" name="email" className="input" placeholder="sarah@gmail.com"
                value={formData.email} onChange={handleChange} required autoComplete="email" />
            </div>
            <div>
              <label className="input-label" htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" name="password" className="input" placeholder="Min. 8 characters"
                value={formData.password} onChange={handleChange} required autoComplete="new-password" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-green btn-block"
              style={{ marginTop: '0.5rem', height: '52px', fontSize: '1rem', borderRadius: '12px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                  Creating account...
                </span>
              ) : '🎉 Create My Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--gray-text)', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            Already a member?{' '}
            <button onClick={() => navigate('/member/login')}
              style={{ color: 'var(--blue)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>
              Sign in →
            </button>
          </p>

          <p style={{ textAlign: 'center', color: 'var(--gray-light)', marginTop: '1rem', fontSize: '0.75rem', lineHeight: 1.5 }}>
            By registering you agree to our Terms of Service &amp; Privacy Policy (POPIA compliant)
          </p>
        </div>
      </div>
    </div>
  );
}
