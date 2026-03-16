import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function PolicyProviderRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    registration_number: '',
    contact_person: '',
    bank_name: '',
    bank_account: '',
    account_holder: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.company_name) {
        throw new Error('Please fill in all required fields');
      }

      // Insert policy provider
      const { data, error: insertError } = await supabase
        .from('policy_providers')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company_name: formData.company_name,
          registration_number: formData.registration_number || null,
          contact_person: formData.contact_person || null,
          bank_name: formData.bank_name || null,
          bank_account: formData.bank_account || null,
          account_holder: formData.account_holder || null,
          status: 'pending' // Requires admin approval
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Success - redirect to login with message
      navigate('/provider/login', { 
        state: { 
          message: 'Registration submitted successfully! Your account is pending approval. You will be contacted within 2 business days.' 
        }
      });

    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div className="logo-mark-white"><span className="logo-text">+1</span></div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Policy Provider</span>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            Partner with +1 Rewards
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Join our network of health insurance providers and reach more customers through our rewards platform.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              { icon: '🎯', title: 'Targeted Reach', desc: 'Access customers actively saving for health coverage' },
              { icon: '📊', title: 'Real-time Data', desc: 'Track policy activations and member engagement' },
              { icon: '💰', title: 'Revenue Growth', desc: 'Earn from every policy funded through our platform' },
              { icon: '🤝', title: 'Partnership Support', desc: 'Dedicated account management and integration help' }
            ].map((feature, i) => (
              <div key={i} style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', 
                background: 'rgba(255,255,255,0.1)', borderRadius: '10px', 
                padding: '0.875rem', border: '1px solid rgba(255,255,255,0.15)', 
                textAlign: 'left' 
              }}>
                <span style={{ fontSize: '1.375rem', flexShrink: 0 }}>{feature.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{feature.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem' }}>{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => navigate('/')} 
            style={{ 
              marginTop: '2rem', background: 'none', border: '1px solid rgba(255,255,255,0.35)', 
              color: '#fff', borderRadius: '8px', padding: '0.5rem 1rem', 
              cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' 
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{ 
              width: '36px', height: '36px', background: '#064e3b', 
              borderRadius: '10px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', fontSize: '1.125rem' 
            }}>
              🏥
            </div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#064e3b' }}>
              Provider Registration
            </span>
          </div>
          
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>
            Join Our Network
          </h2>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
            Register your health insurance company to start partnering with +1 Rewards.
          </p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {/* Company Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="input-label">Company Name *</label>
                <input
                  type="text"
                  name="company_name"
                  className="input"
                  placeholder="Health Insurance Co."
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="input-label">Registration Number</label>
                <input
                  type="text"
                  name="registration_number"
                  className="input"
                  placeholder="2023/123456/07"
                  value={formData.registration_number}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact Person */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="input-label">Contact Person Name *</label>
                <input
                  type="text"
                  name="name"
                  className="input"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="input-label">Job Title</label>
                <input
                  type="text"
                  name="contact_person"
                  className="input"
                  placeholder="Business Development Manager"
                  value={formData.contact_person}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="input-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="input"
                  placeholder="partnerships@company.co.za"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="input-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="input"
                  placeholder="+27123456789"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Banking Details */}
            <div style={{ 
              padding: '1rem', background: '#f8fafc', borderRadius: '8px', 
              border: '1px solid #e2e8f0', marginTop: '0.5rem' 
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.75rem' }}>
                Banking Details (Optional - can be added later)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="input-label">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    className="input"
                    placeholder="Standard Bank"
                    value={formData.bank_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="input-label">Account Number</label>
                  <input
                    type="text"
                    name="bank_account"
                    className="input"
                    placeholder="123456789"
                    value={formData.bank_account}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Account Holder Name</label>
                <input
                  type="text"
                  name="account_holder"
                  className="input"
                  placeholder="Company Name (Pty) Ltd"
                  value={formData.account_holder}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                height: '52px', fontSize: '1rem', borderRadius: '12px', 
                border: 'none', background: 'linear-gradient(135deg, #064e3b, #065f46)', 
                color: '#fff', fontWeight: 800, cursor: 'pointer' 
              }}
            >
              {loading ? '⏳ Submitting...' : '🏥 Submit Registration'}
            </button>
          </form>

          <div style={{ 
            marginTop: '2rem', padding: '1rem', background: '#fef3c7', 
            borderRadius: '10px', border: '1px solid #f59e0b' 
          }}>
            <p style={{ fontSize: '0.75rem', color: '#92400e', textAlign: 'center', margin: 0 }}>
              ⚠️ Registration requires admin approval.<br />
              You'll receive login credentials within <strong>2 business days</strong>.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-text)' }}>
              Already have an account?{' '}
              <button
                onClick={() => navigate('/provider/login')}
                style={{ 
                  background: 'none', border: 'none', color: 'var(--primary)', 
                  fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' 
                }}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}