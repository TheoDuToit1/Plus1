// plus1-rewards/src/pages/MemberRegister.tsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput, AuthButton, AuthError, AuthLink } from '../components/auth/AuthComponents';
import { Notification, useNotification } from '../components/Notification';

const BLUE = '#1a558b'

export default function MemberRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get('platform') || 'rewards'; // 'rewards' or 'go'
  
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const { notification, showSuccess, showError, hideNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pin: '',
    terms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate terms first with clear error
    if (!formData.terms) { 
      setError('You must agree to the Terms of Service and Privacy Policy to create an account'); 
      // Scroll to error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return; 
    }
    
    if (formData.pin.length !== 6) { setError('PIN must be exactly 6 digits'); return; }
    if (!/^\d{6}$/.test(formData.pin)) { setError('PIN must contain only numbers'); return; }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) { setError('Phone number must be exactly 10 digits'); return; }

    setLoading(true);

    try {
      // Check if phone already exists in users table
      const { data: existingUser } = await supabase
        .from('users').select('id').eq('mobile_number', phoneDigits).maybeSingle();

      if (existingUser) { 
        setError('This phone number is already registered'); 
        setLoading(false); 
        return; 
      }

      // Check if phone already exists in members table
      const { data: existingMember } = await supabase
        .from('members').select('id').eq('phone', phoneDigits).maybeSingle();

      if (existingMember) { 
        setError('This phone number is already registered'); 
        setLoading(false); 
        return; 
      }

      // Get default cover plan (Day to Day Single - R385)
      const { data: defaultPlan, error: planError } = await supabase
        .from('cover_plans')
        .select('id, plan_name, monthly_target_amount')
        .eq('status', 'active')
        .eq('monthly_target_amount', 385)
        .limit(1)
        .single();

      if (planError || !defaultPlan) {
        setError('System error: Default cover plan not found. Please contact support.');
        setLoading(false);
        return;
      }

      // Create user in users table (centralized auth)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          role: 'member',
          full_name: formData.name,
          mobile_number: phoneDigits,
          pin_code: formData.pin,
          status: 'active'
        })
        .select()
        .single();

      if (userError) throw userError;

      // Generate unique QR code
      const qrCode = `PLUS1-${phoneDigits}-${Date.now()}`;

      // Create member in members table
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .insert({
          id: userData.id,
          user_id: userData.id,
          full_name: formData.name,
          phone: phoneDigits,
          qr_code: qrCode,
          status: 'active'
        })
        .select()
        .single();

      if (memberError) throw memberError;

      // Create member's first cover plan in member_cover_plans table
      const { error: coverPlanError } = await supabase
        .from('member_cover_plans')
        .insert({
          member_id: memberData.id,
          cover_plan_id: defaultPlan.id,
          creation_order: 1,
          target_amount: defaultPlan.monthly_target_amount,
          funded_amount: 0,
          status: 'in_progress'
        });

      if (coverPlanError) throw coverPlanError;

      showSuccess(
        'Account Created Successfully!',
        `You can now log in with your mobile number and PIN. Redirecting to ${platform === 'go' ? 'Go' : 'Rewards'}...`
      );
      
      setTimeout(() => {
        navigate(`/member/login?platform=${platform}`);
      }, 2000);
    } catch (err: any) {
      if (err.message?.includes('already registered') || err.message?.includes('duplicate')) {
        setError('This phone number is already registered');
      } else {
        setError('Registration failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      portalIcon="add_circle"
      portalName="+1 Rewards"
      headline={<>Start earning <span style={{ color: '#93c5fd' }}>healthcare</span> rewards today.</>}
      subheadline="Join thousands of members who fund their health insurance through everyday shopping at local partners."
      stats={[
        { value: 'R0', label: 'Joining Fee' },
        { value: '3%', label: 'Rewards Rate' },
        { value: 'R385', label: 'Monthly Target' },
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
          <h2 className="text-2xl font-black text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-500 mt-1">Free to join — no credit card required</p>
        </div>

        {/* Benefits strip */}
        <div className="grid grid-cols-3 gap-2">
          {['R0 Fee', 'Works Offline', 'Day1 Health'].map((b) => (
            <div key={b} className="flex flex-col items-center gap-1 py-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(26,85,139,0.06)' }}>
              <span className="text-xs font-bold" style={{ color: BLUE }}>{b}</span>
            </div>
          ))}
        </div>

        <AuthError message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="Full Name"
            icon="person"
            id="name"
            name="name"
            type="text"
            placeholder="Sarah Dlamini"
            value={formData.name}
            onChange={handleInputChange}
            autoComplete="name"
            required
          />
          <AuthInput
            label="Cell Phone Number (10 digits)"
            icon="phone"
            id="phone"
            name="phone"
            type="tel"
            placeholder="082 555 1234"
            value={formData.phone}
            onChange={handleInputChange}
            autoComplete="tel"
            required
          />
          <AuthInput
            label="6-Digit PIN"
            icon="pin"
            id="pin"
            name="pin"
            type={showPin ? 'text' : 'password'}
            placeholder="Enter 6-digit PIN"
            value={formData.pin}
            onChange={handleInputChange}
            autoComplete="new-password"
            required
            maxLength={6}
            pattern="\d{6}"
            suffix={
              <button type="button" onClick={() => setShowPin(!showPin)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-xl">{showPin ? 'visibility_off' : 'visibility'}</span>
              </button>
            }
          />
          <p className="text-xs text-gray-500 -mt-2">Your PIN will be used with your mobile number to log in</p>

          <label className={`flex items-start gap-2.5 text-sm text-gray-600 cursor-pointer p-3 rounded-lg transition-colors ${
            error.includes('Terms of Service') ? 'bg-red-50 border-2 border-red-300' : ''
          }`}>
            <div className="checkbox-container mt-0.5">
              <input
                type="checkbox"
                id="member-terms-cbx"
                name="terms"
                checked={formData.terms}
                onChange={handleInputChange}
                style={{ display: 'none' }}
                required
              />
              <label htmlFor="member-terms-cbx" className="check">
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                  <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                  <polyline points="1 9 7 14 15 4"></polyline>
                </svg>
              </label>
            </div>
            <span className={error.includes('Terms of Service') ? 'text-red-700 font-semibold' : ''}>
              I agree to the{' '}
              <a 
                href="/terms-of-service" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold hover:underline" 
                style={{ color: BLUE }}
              >
                Terms of Service
              </a>
              {' '}and{' '}
              <a 
                href="/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold hover:underline" 
                style={{ color: BLUE }}
              >
                Privacy Policy
              </a>
            </span>
          </label>

          <AuthButton type="submit" loading={loading} loadingText="Creating Account...">
            Create My Account
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </AuthButton>
        </form>

        <p className="text-center text-sm text-gray-500 pt-2">
          Already have an account?{' '}
          <AuthLink onClick={() => navigate(`/member/login?platform=${platform}`)}>Sign In</AuthLink>
        </p>
      </div>
    </AuthLayout>
  );
}