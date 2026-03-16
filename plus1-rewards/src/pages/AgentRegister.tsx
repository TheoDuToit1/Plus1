import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Step1Data {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface Step2Data {
  id_type: 'sa_id' | 'passport' | 'drivers_license';
  id_number: string;
  bank_name: string;
  bank_account: string;
}

export function AgentRegister() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data>({ name: '', email: '', phone: '', password: '' });
  const [step2Data, setStep2Data] = useState<Step2Data>({ id_type: 'sa_id', id_number: '', bank_name: '', bank_account: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate step 1 fields
    if (!step1Data.name || !step1Data.email || !step1Data.phone || !step1Data.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (step1Data.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setCurrentStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate step 2 fields
      if (!step2Data.id_number || !step2Data.bank_name || !step2Data.bank_account) {
        throw new Error('Please fill in all required fields');
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: step1Data.email,
        password: step1Data.password
      });

      if (authError) throw authError;

      if (authData.user) {
        // Insert agent record
        const { error: insertError } = await supabase.from('agents').insert([{
          id: authData.user.id,
          name: step1Data.name,
          email: step1Data.email,
          phone: step1Data.phone,
          id_type: step2Data.id_type,
          id_number: step2Data.id_number,
          bank_name: step2Data.bank_name,
          bank_account: step2Data.bank_account,
          total_commission: 0
        }]);

        if (insertError) throw insertError;

        // Store in localStorage and redirect
        localStorage.setItem('currentAgent', JSON.stringify({
          id: authData.user.id,
          name: step1Data.name,
          phone: step1Data.phone
        }));

        navigate('/agent/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStep1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStep1Data(prev => ({ ...prev, [name]: value }));
  };

  const handleStep2Change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStep2Data(prev => ({ ...prev, [name]: value }));
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
          
          {/* Progress Steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: currentStep >= 1 ? '#37d270' : 'rgba(255,255,255,0.2)', 
              color: currentStep >= 1 ? '#fff' : 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.875rem', fontWeight: 700
            }}>1</div>
            <div style={{ width: '24px', height: '2px', background: currentStep >= 2 ? '#37d270' : 'rgba(255,255,255,0.2)' }} />
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: currentStep >= 2 ? '#37d270' : 'rgba(255,255,255,0.2)', 
              color: currentStep >= 2 ? '#fff' : 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.875rem', fontWeight: 700
            }}>2</div>
          </div>

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

          {currentStep === 1 ? (
            <>
              <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>Basic Information</h2>
              <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Step 1 of 2 - Let's start with your contact details.</p>

              {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

              <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                <div>
                  <label className="input-label">Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="input" 
                    placeholder="Sipho Mkhize" 
                    value={step1Data.name} 
                    onChange={handleStep1Change} 
                    required 
                  />
                </div>

                <div>
                  <label className="input-label">Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="input" 
                    placeholder="agent@email.com" 
                    value={step1Data.email} 
                    onChange={handleStep1Change} 
                    required 
                  />
                </div>

                <div>
                  <label className="input-label">Mobile Number *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className="input" 
                    placeholder="082 555 0000" 
                    value={step1Data.phone} 
                    onChange={handleStep1Change} 
                    required 
                  />
                </div>

                <div>
                  <label className="input-label">Password *</label>
                  <input 
                    type="password" 
                    name="password" 
                    className="input" 
                    placeholder="Minimum 8 characters" 
                    value={step1Data.password} 
                    onChange={handleStep1Change} 
                    required 
                    minLength={8}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-block" 
                  style={{ height: '52px', fontSize: '1rem', borderRadius: '12px', background: '#0e7490', color: '#fff', marginTop: '0.5rem' }}
                >
                  Continue to Step 2 →
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>Verification & Banking</h2>
              <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', marginBottom: '2rem' }}>Step 2 of 2 - Identity verification and payout details.</p>

              {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

              <form onSubmit={handleStep2Submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                <div>
                  <label className="input-label">Identity Document Type *</label>
                  <select 
                    name="id_type" 
                    className="input" 
                    value={step2Data.id_type} 
                    onChange={handleStep2Change}
                    style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\'><polyline points=\'6,9 12,15 18,9\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                  >
                    <option value="sa_id">SA ID Number</option>
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">
                    {step2Data.id_type === 'sa_id' && 'SA ID Number *'}
                    {step2Data.id_type === 'passport' && 'Passport Number *'}
                    {step2Data.id_type === 'drivers_license' && 'Driver\'s License Number *'}
                  </label>
                  <input 
                    type="text" 
                    name="id_number" 
                    className="input" 
                    placeholder={
                      step2Data.id_type === 'sa_id' ? '0000000000000' :
                      step2Data.id_type === 'passport' ? 'A12345678' :
                      'AA00000000'
                    }
                    value={step2Data.id_number} 
                    onChange={handleStep2Change} 
                    required 
                  />
                </div>

                <div style={{ borderTop: '1px solid var(--gray-border)', paddingTop: '1.125rem', marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-text)', marginBottom: '1rem' }}>
                    💳 Banking Details (for commission payouts)
                  </p>
                </div>

                <div>
                  <label className="input-label">Bank Name *</label>
                  <input 
                    type="text" 
                    name="bank_name" 
                    className="input" 
                    placeholder="Standard Bank, FNB, Absa, Nedbank, etc." 
                    value={step2Data.bank_name} 
                    onChange={handleStep2Change} 
                    required 
                  />
                </div>

                <div>
                  <label className="input-label">Account Number *</label>
                  <input 
                    type="text" 
                    name="bank_account" 
                    className="input" 
                    placeholder="4055000000" 
                    value={step2Data.bank_account} 
                    onChange={handleStep2Change} 
                    required 
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(1)}
                    className="btn" 
                    style={{ 
                      flex: 1, height: '52px', fontSize: '1rem', borderRadius: '12px', 
                      background: 'transparent', color: '#0e7490', border: '2px solid #0e7490' 
                    }}
                  >
                    ← Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn" 
                    style={{ 
                      flex: 2, height: '52px', fontSize: '1rem', borderRadius: '12px', 
                      background: '#0e7490', color: '#fff' 
                    }}
                  >
                    {loading ? '⏳ Registering...' : '📊 Complete Registration'}
                  </button>
                </div>
              </form>
            </>
          )}

          <p style={{ textAlign: 'center', color: 'var(--gray-text)', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            Already an agent?{' '}
            <button onClick={() => navigate('/agent/login')} style={{ color: '#0e7490', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>Sign in →</button>
          </p>
        </div>
      </div>
    </div>
  );
}
