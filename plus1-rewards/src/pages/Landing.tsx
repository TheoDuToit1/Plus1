import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Landing() {
  const navigate = useNavigate()
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  const roles = [
    { id: 'member', icon: '👤', title: 'Member', desc: 'Earn rewards & fund your health policy with everyday shopping', path: '/member/register', loginPath: '/member/login', color: 'var(--blue)', loginOnly: false },
    { id: 'shop', icon: '🏪', title: 'Shop Owner', desc: 'Issue rewards to members & grow your loyal customer base', path: '/shop/register', loginPath: '/shop/login', color: 'var(--green-dark)', loginOnly: false },
    { id: 'agent', icon: '📊', title: 'Sales Agent', desc: 'Recruit shops to the network & earn 1% commission on every transaction', path: '/agent/register', loginPath: '/agent/login', color: '#0891b2', loginOnly: false },
    { id: 'provider', icon: '🏥', title: 'Policy Provider', desc: 'Day1 Health — access monthly batch files of activated member policies', path: '', loginPath: '/provider/login', color: '#064e3b', loginOnly: true },
    { id: 'admin', icon: '⚙️', title: 'Admin', desc: 'Monitor the platform, manage invoices, suspensions & agent payouts', path: '', loginPath: '/admin/login', color: '#7c3aed', loginOnly: true },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid var(--gray-border)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div className="logo-mark"><span className="logo-text">+1</span></div>
            <div>
              <span style={{ fontWeight: 800, color: '#111827', fontSize: '1.0625rem' }}>+1 Rewards</span>
              <div style={{ fontSize: '0.6875rem', color: 'var(--gray-light)', marginTop: '-2px' }}>Shop. Earn. Get covered.</div>
            </div>
          </div>
          <button onClick={() => navigate('/member/login')} className="btn btn-primary" style={{ borderRadius: '10px', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
            Sign In
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--blue) 0%, var(--blue-dark) 60%, #0a2d52 100%)', color: '#fff', padding: '5rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'rgba(55,210,112,0.08)', borderRadius: '50%', top: '-150px', right: '-100px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', bottom: '-80px', left: '-60px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '72rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(55,210,112,0.15)', border: '1px solid rgba(55,210,112,0.3)', borderRadius: '20px', padding: '0.375rem 0.875rem', marginBottom: '1.5rem', fontSize: '0.8125rem', color: '#37d270', fontWeight: 600 }}>
              🚀 Now partnered with Day1 Health Insurance
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-1px' }}>
              Shop. Earn.<br />
              <span style={{ color: '#37d270' }}>Cover your health.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '480px' }}>
              Every purchase at a +1 partner shop earns you rewards that automatically fund your Day1 Health insurance policy. Zero effort. Real coverage.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/member/register')} className="btn btn-green" style={{ borderRadius: '12px', height: '52px', fontSize: '1rem', padding: '0 1.75rem' }}>
                🎉 Join for Free
              </button>
              <button onClick={() => navigate('/member/login')} className="btn" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '12px', height: '52px', fontSize: '1rem', padding: '0 1.75rem' }}>
                Sign In →
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3.5rem', flexWrap: 'wrap' }}>
            {[
              { value: '3%', label: 'Rewards per purchase' },
              { value: 'R385', label: 'Min monthly target' },
              { value: '100%', label: 'Works offline' },
              { value: 'Day1', label: 'Insurance partner' },
            ].map((s, i) => (
              <div key={i} style={{ borderLeft: '2px solid rgba(55,210,112,0.4)', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#37d270' }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#fff', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>How +1 Rewards Works</h2>
            <p style={{ color: 'var(--gray-text)', fontSize: '1.0625rem' }}>Three simple steps to health coverage</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '01', icon: '🛍️', title: 'Shop at Partners', desc: 'Visit any +1 partner shop and show your QR code at checkout.' },
              { step: '02', icon: '💰', title: 'Earn Rewards', desc: 'Get 3% of your purchase value added to your rewards balance instantly.' },
              { step: '03', icon: '🏥', title: 'Fund Your Policy', desc: 'Rewards automatically fill your Day1 Health plan. Once full, your policy activates.' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--bg)', borderRadius: '16px', padding: '1.75rem', border: '1px solid var(--gray-border)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontWeight: 800, color: 'var(--blue)', opacity: 0.2, position: 'absolute', top: '1rem', right: '1.25rem', fontSize: '4rem', lineHeight: 1 }}>{s.step}</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-text)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section style={{ background: 'var(--bg)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Choose Your Role</h2>
            <p style={{ color: 'var(--gray-text)', fontSize: '1.0625rem' }}>Select how you participate in +1 Rewards</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {roles.map(role => (
              <div
                key={role.id}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                style={{
                  background: hoveredRole === role.id ? '#fff' : '#fff',
                  borderRadius: '16px', padding: '1.5rem',
                  border: hoveredRole === role.id ? `2px solid ${role.color}` : '2px solid var(--gray-border)',
                  boxShadow: hoveredRole === role.id ? `0 8px 24px rgba(0,0,0,0.1)` : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s', cursor: 'pointer',
                  transform: hoveredRole === role.id ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.875rem' }}>{role.icon}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>{role.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-text)', lineHeight: 1.5, marginBottom: '1.25rem' }}>{role.desc}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!role.loginOnly && (
                    <button onClick={() => navigate(role.path)} style={{ flex: 1, background: role.color, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.625rem 0.5rem', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}>
                      Register
                    </button>
                  )}
                  <button onClick={() => navigate(role.loginPath)} style={{ flex: 1, background: role.loginOnly ? role.color : 'transparent', color: role.loginOnly ? '#fff' : role.color, border: `1.5px solid ${role.color}`, borderRadius: '8px', padding: '0.625rem 0.5rem', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}>
                    {role.loginOnly ? '🔐 Sign In' : 'Sign In'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Ready to get covered?</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.0625rem', marginBottom: '2rem' }}>Join thousands of members turning everyday shopping into real health insurance.</p>
          <button onClick={() => navigate('/member/register')} className="btn btn-green" style={{ borderRadius: '12px', height: '54px', fontSize: '1.0625rem', padding: '0 2.5rem' }}>
            🎉 Start Earning Rewards
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#fff', borderTop: '1px solid var(--gray-border)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="logo-mark"><span className="logo-text">+1</span></div>
            <span style={{ fontWeight: 700, color: '#111827' }}>+1 Rewards</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
            <a href="#" style={{ color: 'var(--gray-text)', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: 'var(--gray-text)', textDecoration: 'none' }}>Privacy (POPIA)</a>
            <a href="#" style={{ color: 'var(--gray-text)', textDecoration: 'none' }}>Contact</a>
          </div>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.8125rem' }}>© 2026 +1 Rewards. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
