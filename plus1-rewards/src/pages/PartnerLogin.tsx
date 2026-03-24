// plus1-rewards/src/pages/PartnerLogin.tsx
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput, AuthButton, AuthDivider, AuthError, AuthLink } from '../components/auth/AuthComponents';
import { useNotification, Notification } from '../components/Notification';

const BLUE = '#1a558b'

export default function PartnerLogin() {
  const navigate = useNavigate();
  const { showNotification, hideNotification, notification } = useNotification();
  const [identifier, setIdentifier] = useState(''); // mobile number OR email
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate PIN is 6 digits
      if (!/^\d{6}$/.test(pin)) {
        showNotification('error', 'Invalid PIN', 'PIN must be exactly 6 digits');
        setLoading(false);
        return;
      }

      // Determine if identifier is mobile number or email
      const isMobile = /^\d{10}$/.test(identifier);
      const isEmail = identifier.includes('@');

      if (!isMobile && !isEmail) {
        showNotification('error', 'Invalid Input', 'Please enter a valid 10-digit mobile number or email address');
        setLoading(false);
        return;
      }

      // Query users table first (centralized auth)
      let userQuery = supabase
        .from('users')
        .select('*')
        .eq('role', 'partner');

      if (isMobile) {
        userQuery = userQuery.eq('mobile_number', identifier);
      } else {
        // For email, we need to check partners table since email is there
        const { data: partnerByEmail } = await supabase
          .from('partners')
          .select('user_id')
          .eq('email', identifier)
          .single();
        
        if (!partnerByEmail) {
          showNotification('error', 'Account Not Found', 'Partner account not found');
          setLoading(false);
          return;
        }
        
        userQuery = userQuery.eq('id', partnerByEmail.user_id);
      }

      const { data: userData, error: userError } = await userQuery.single();

      if (userError || !userData) {
        showNotification('error', 'Account Not Found', 'Partner account not found');
        setLoading(false);
        return;
      }

      // Verify PIN
      if (userData.pin_code !== pin) {
        showNotification('error', 'Incorrect PIN', 'The PIN you entered is incorrect');
        setLoading(false);
        return;
      }

      // Get partner data
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (partnerError || !partnerData) {
        showNotification('error', 'Partner Data Not Found', 'Partner profile not found');
        setLoading(false);
        return;
      }

      // Check partner status
      if (partnerData.status === 'pending') {
        showNotification('warning', 'Pending Approval', `Your business "${partnerData.shop_name}" is still pending admin approval.`);
        setLoading(false);
        return;
      }
      if (partnerData.status === 'suspended') {
        showNotification('error', 'Account Suspended', `Your business "${partnerData.shop_name}" has been suspended. Please contact admin.`);
        setLoading(false);
        return;
      }

      // Only allow active partners to login
      if (partnerData.status !== 'active') {
        showNotification('error', 'Login Not Allowed', 'Your account status does not allow login. Please contact admin.');
        setLoading(false);
        return;
      }

      // Create session
      const sessionData = {
        user: {
          id: userData.id,
          role: userData.role,
          full_name: userData.full_name,
          mobile_number: userData.mobile_number,
          status: userData.status
        },
        partner: partnerData,
        loggedInAt: new Date().toISOString(),
        expiresAt: rememberMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        rememberMe
      };

      // Store session
      if (rememberMe) {
        localStorage.setItem('partnerSession', JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem('partnerSession', JSON.stringify(sessionData));
      }

      showNotification('success', 'Welcome Back!', `Welcome back, ${partnerData.shop_name}!`);
      navigate('/partner/dashboard');
    } catch (err: any) {
      showNotification('error', 'Login Failed', err.message || 'Failed to sign in');
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
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={hideNotification}
        />
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Partner Login</h2>
          <p className="text-sm text-gray-500 mt-1">Access your business dashboard and manage customer rewards.</p>
        </div>

        <AuthError message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="Mobile Number or Email"
            icon="storefront"
            id="identifier"
            type="text"
            placeholder="0812345678 or partner@example.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <AuthInput
            label="6-Digit PIN"
            icon="pin"
            id="pin"
            type={showPin ? 'text' : 'password'}
            placeholder="••••••"
            value={pin}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setPin(value);
            }}
            required
            suffix={
              <button type="button" onClick={() => setShowPin(!showPin)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-xl">{showPin ? 'visibility_off' : 'visibility'}</span>
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
              Keep me signed in for 30 days
            </label>
            <a href="#" className="text-sm font-semibold" style={{ color: BLUE }}>Forgot PIN?</a>
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