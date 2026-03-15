import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AgentRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', id_number: '', bank_name: '', bank_account: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: formData.email, password: formData.password });
      if (authError) throw authError;
      if (authData.user) {
        await supabase.from('agents').insert([{ id: authData.user.id, name: formData.name, email: formData.email, phone: formData.phone, id_number: formData.id_number, bank_name: formData.bank_name, bank_account: formData.bank_account, total_commission: 0 }]);
        localStorage.setItem('currentAgent', JSON.stringify({ id: authData.user.id, name: formData.name, phone: formData.phone }));
        navigate('/agent/dashboard');
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Registration failed'); }
    finally { setLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📊</div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Become an Agent</span>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>Your business, your earnings</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Recruit shops to +1 Rewards. Earn 1% on every transaction they process — indefinitely.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              { icon: '💼', title: 'Recruit shops', desc: 'Share your agent code with any shop' },
              { icon: '💰', title: 'Earn 1% forever', desc: 'Commission on every purchase processed' },
              { icon: '📱', title: 'Track in real-time', desc: 'See earnings and shop stats live' },
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

      <div className="auth-panel-right" style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
        <div className="auth-form animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', background: '#0e7490', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📊</div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827' }}>Register as Agent</span>
          </div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>Create agent account</h2>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Start earning commission from shop transactions.</p>

          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Full Name</label>
                <input type="text" name="name" className="input" placeholder="Sipho Mkhize" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="input-label">Email</label>
                <input type="email" name="email" className="input" placeholder="agent@email.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="input-label">Mobile</label>
                <input type="tel" name="phone" className="input" placeholder="082 555 0000" value={formData.phone} onChange={handleChange} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">SA ID Number</label>
                <input type="text" name="id_number" className="input" placeholder="000000 0000 000" value={formData.id_number} onChange={handleChange} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Password</label>
                <input type="password" name="password" className="input" placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} required />
              </div>
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--gray-border)', paddingTop: '0.875rem', marginTop: '0.25rem' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-text)', marginBottom: '0.75rem' }}>Banking Details (for commission payouts)</p>
              </div>
              <div>
                <label className="input-label">Bank Name</label>
                <input type="text" name="bank_name" className="input" placeholder="Absa" value={formData.bank_name} onChange={handleChange} required />
              </div>
              <div>
                <label className="input-label">Account Number</label>
                <input type="text" name="bank_account" className="input" placeholder="4055000000" value={formData.bank_account} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-block" style={{ height: '52px', fontSize: '1rem', borderRadius: '12px', background: '#0e7490', color: '#fff', marginTop: '0.25rem' }}>
              {loading ? '⏳ Registering...' : '📊 Register as Agent'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--gray-text)', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            Already an agent?{' '}
            <button onClick={() => navigate('/agent/login')} style={{ color: '#0e7490', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>Sign in →</button>
          </p>
        </div>
      </div>
    </div>
  );
}
