// plus1-rewards/src/pages/MemberLogin.tsx
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput, AuthButton, AuthDivider, AuthError, AuthLink } from '../components/auth/AuthComponents';

const BLUE = '#1a558b'

export default function MemberLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let loginEmail = email;
      const isPhoneNumber = /^[\d+\s()-]+$/.test(email.trim());

      if (isPhoneNumber) {
        const cleanPhone = email.replace(/[\s()-]/g, '');
        const { data: emailData, error: lookupError } = await supabase
          .rpc('get_email_by_phone', { phone_number: cleanPhone });

        if (lookupError) { setError('Error looking up phone number: ' + lookupError.message); return; }
        if (!emailData) { setError(`No account found with phone number: ${cleanPhone}.`); return; }
        loginEmail = emailData;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
        options: { persistSession: rememberMe }
      });

      if (signInError) throw signInError;

      if (data.user) {
        if (!data.user.email_confirmed_at) {
          setError('Please verify your email address before logging in.');
          await supabase.auth.signOut();
          return;
        }
        navigate('/member/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      portalIcon="add_circle"
      portalName="+1 Rewards"
      headline={<>Secure your health through <span style={{ color: '#93c5fd' }}>everyday</span> shopping.</>}
      subheadline="Earn rewards on your groceries and automatically unlock comprehensive healthcare coverage."
      stats={[
        { value: '150k+', label: 'Active Members' },
        { value: '3%', label: 'Rewards Rate' },
        { value: 'R0', label: 'Joining Fee' },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your member account</p>
        </div>

        <AuthError message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="Email or Phone Number"
            icon="mail"
            id="email"
            type="text"
            placeholder="name@example.com or 082 555 1234"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <AuthInput
            label="Password"
            icon="lock"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            suffix={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            }
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="remember-me-cbx"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <label htmlFor="remember-me-cbx" className="check">
                  <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </label>
              </div>
              Remember me for 30 days
            </label>
            <a href="#" className="text-sm font-semibold" style={{ color: BLUE }}>Forgot password?</a>
          </div>

          <AuthButton type="submit" loading={loading} loadingText="Signing in...">
            Sign In
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </AuthButton>
        </form>

        <AuthDivider label="Or sign in as" />

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => navigate('/partner/login')}
            className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
          >
            <span className="material-symbols-outlined text-base" style={{ color: BLUE }}>storefront</span>
            Partner
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 pt-2">
          Don&apos;t have an account?{' '}
          <AuthLink onClick={() => navigate('/member/register')}>Register Now</AuthLink>
        </p>
      </div>
    </AuthLayout>
  );
}