// plus1-rewards/src/pages/PolicyProviderLogin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput, AuthButton, AuthError } from '../components/auth/AuthComponents';

const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.08)'

// Hardcoded Day1Health credentials
const DAY1_HEALTH_EMAIL = 'provider@day1health.co.za';
const DAY1_HEALTH_PASSWORD = 'Day1Health2024!';

export default function PolicyProviderLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.querySelector('#email') as HTMLInputElement)?.value;
    const password = (form.querySelector('#password') as HTMLInputElement)?.value;

    if (!email || !password) { 
      setError('Please enter email and password'); 
      return; 
    }

    setLoading(true);
    setError('');

    try {
      // Check against hardcoded Day1Health credentials
      if (email === DAY1_HEALTH_EMAIL && password === DAY1_HEALTH_PASSWORD) {
        // Store Day1Health provider info
        localStorage.setItem('currentProvider', JSON.stringify({
          id: 'day1health',
          name: 'Day1Health',
          email: DAY1_HEALTH_EMAIL,
          company_name: 'Day1Health',
          status: 'active'
        }));

        // Navigate to provider dashboard
        navigate('/provider/dashboard');
      } else {
        setError('Invalid email or password. Only Day1Health is authorized.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      portalIcon="health_and_safety"
      portalName="Provider Portal"
      headline={<>Partner with <span style={{ color: '#93c5fd' }}>innovative</span> healthcare rewards.</>}
      subheadline="Access comprehensive policy management tools and track member activations through our integrated platform."
      stats={[
        { value: 'R385', label: 'Monthly Premium' },
        { value: 'Auto', label: 'Policy Activation' },
        { value: '24/7', label: 'System Access' },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Policy Provider Login</h2>
          <p className="text-sm text-gray-500 mt-1">Day1Health - Access your policy management dashboard.</p>
        </div>

        <AuthError message={error} />

        <form onSubmit={handleLogin} className="space-y-4">
          <AuthInput
            label="Provider Email Address"
            icon="health_and_safety"
            id="email"
            type="email"
            placeholder="provider@day1health.co.za"
            disabled={loading}
            required
          />

          <AuthInput
            label="Password"
            icon="lock"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={loading}
            required
            suffix={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600" disabled={loading}>
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            }
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="provider-remember-cbx"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  style={{ display: 'none' }}
                />
                <label htmlFor="provider-remember-cbx" className="check">
                  <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </label>
              </div>
              Keep me signed in
            </label>
            <a href="#" className="text-sm font-semibold" style={{ color: BLUE }}>Forgot password?</a>
          </div>

          <AuthButton type="submit" loading={loading} loadingText="Authenticating...">
            Access Provider Dashboard
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </AuthButton>
        </form>

        {/* Info box */}
        <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: '#e5e7eb', backgroundColor: BLUE_LIGHT }}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl" style={{ color: BLUE }}>security</span>
            <span className="font-bold text-sm text-gray-900">Day1Health Authorized Access</span>
          </div>
          <p className="text-xs text-gray-500">This portal is exclusively for Day1Health policy provider. Contact admin for access credentials.</p>
        </div>
      </div>
    </AuthLayout>
  );
}