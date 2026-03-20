// plus1-rewards/src/pages/PartnerLogin.tsx
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput, AuthButton, AuthDivider, AuthError, AuthLink } from '../components/auth/AuthComponents';

const BLUE = '#1a558b'

export default function PartnerLogin() {
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
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email, password, options: { persistSession: rememberMe }
      });

      if (signInError) throw signInError;

      if (data.user) {
        const { data: partnerData, error: partnerError } = await supabase
          .from('partners').select('status, name').eq('email', email).single();

        if (partnerError) { setError('No partner account found with this email address.'); return; }
        if (partnerData.status === 'pending') { setError(`Your business "${partnerData.name}" is still pending admin approval.`); return; }
        if (partnerData.status === 'suspended') { setError(`Your business "${partnerData.name}" has been suspended.`); return; }
        if (partnerData.status === 'active') { navigate('/partner/dashboard'); }
        else { setError('Your account status is unknown. Please contact support.'); }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      portalIcon="storefront"
      portalName="Partner Portal"
      headline={<>Grow your business with <span style={{ color: '#93c5fd' }}>customer</span> rewards.</>}
      subheadline="Attract loyal customers and increase sales with our innovative rewards program designed for local businesses."
      stats={[
        { value: '3%', label: 'Customer Rewards' },
        { value: '+25%', label: 'Customer Retention' },
        { value: '100%', label: 'Offline Ready' },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Partner Login</h2>
          <p className="text-sm text-gray-500 mt-1">Access your business dashboard and manage customer rewards.</p>
        </div>

        <AuthError message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="Partner Email Address"
            icon="storefront"
            id="email"
            type="email"
            placeholder="partner@example.com"
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
                  id="partner-remember-cbx"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <label htmlFor="partner-remember-cbx" className="check">
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

          <AuthButton type="submit" loading={loading} loadingText="Signing in...">
            Access Partner Dashboard
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </AuthButton>
        </form>

        <AuthDivider label="Quick Access" />

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => navigate('/member/login')}
            className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
          >
            <span className="material-symbols-outlined text-base" style={{ color: BLUE }}>group</span>
            Member Login
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 pt-2">
          Don&apos;t have a partner account?{' '}
          <AuthLink onClick={() => navigate('/partner/register')}>Register Your Business</AuthLink>
        </p>
      </div>
    </AuthLayout>
  );
}