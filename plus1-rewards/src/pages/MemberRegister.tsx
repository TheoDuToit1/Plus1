// plus1-rewards/src/pages/MemberRegister.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput, AuthButton, AuthError, AuthLink } from '../components/auth/AuthComponents';

const BLUE = '#1a558b'

export default function MemberRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    terms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.terms) { setError('Please agree to the Terms of Service and Privacy Policy'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters long'); return; }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) { setError('Phone number must be exactly 10 digits'); return; }

    setLoading(true);

    try {
      const { data: existingPhone } = await supabase
        .from('members').select('id').eq('phone', phoneDigits).maybeSingle();

      if (existingPhone) { setError('This phone number is already registered'); setLoading(false); return; }

      const tempEmail = `member_${phoneDigits}_${Date.now()}@plus1rewards.local`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tempEmail,
        password: formData.password,
        options: { data: { name: formData.name, phone: formData.phone } }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { data: planData, error: planError } = await supabase
          .from('policy_plans').select('id').eq('name', 'day_to_day_single').eq('monthly_target', 385).single();
        if (planError) throw new Error('Could not find default plan');

        const { data: providerData } = await supabase
          .from('policy_providers').select('id').eq('company_name', 'Day1Health').single();

        const { error: memberError } = await supabase.from('members').insert({
          id: authData.user.id,
          name: formData.name,
          phone: phoneDigits,
          email: tempEmail,
          qr_code: `${phoneDigits}-${Date.now()}`,
          active_policy: planData.id
        });

        if (memberError) throw memberError;

        if (providerData) {
          await supabase.from('policy_holders').insert({
            member_id: authData.user.id,
            policy_plan_id: planData.id,
            policy_provider_id: providerData.id,
            policy_number: `POL-${phoneDigits}-${Date.now()}`,
            status: 'active',
            start_date: new Date().toISOString().split('T')[0],
            monthly_premium: 385,
            amount_funded: 0
          });
        }

        alert('Account created successfully!');
        navigate('/member/dashboard');
      }
    } catch (err: any) {
      if (err.message?.includes('already registered') || err.message?.includes('User already exists')) {
        setError('This email is already registered');
      } else if (err.message?.includes('phone')) {
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
            required
          />
          <AuthInput
            label="Password"
            icon="lock"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength={8}
            suffix={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            }
          />

          <label className="flex items-start gap-2.5 text-sm text-gray-600 cursor-pointer">
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
            <span>
              I agree to the{' '}
              <a href="#" className="font-semibold" style={{ color: BLUE }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="font-semibold" style={{ color: BLUE }}>Privacy Policy</a>
            </span>
          </label>

          <AuthButton type="submit" loading={loading} loadingText="Creating Account...">
            Create My Account
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </AuthButton>
        </form>

        <p className="text-center text-sm text-gray-500 pt-2">
          Already have an account?{' '}
          <AuthLink onClick={() => navigate('/member/login')}>Sign In</AuthLink>
        </p>
      </div>
    </AuthLayout>
  );
}