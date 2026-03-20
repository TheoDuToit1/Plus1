// plus1-rewards/src/pages/PartnerRegister.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput, AuthButton, AuthError, AuthLink } from '../components/auth/AuthComponents';

const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.08)'

export default function PartnerRegister() {
  const [currentStep, setCurrentStep] = useState(1);
  const [commissionRate, setCommissionRate] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    businessName: '', address: '', contactName: '', contactNumber: '',
    email: '', bankName: '', bankHolder: '', bankAccount: '',
    password: '', confirmPassword: '', commissionRate: 3, agreementSigned: false
  });

  const handleNavigation = (path: string) => { window.location.href = path; };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCommissionRate(value);
    setFormData(prev => ({ ...prev, commissionRate: value }));
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (currentStep < 3) { setCurrentStep(currentStep + 1); return; }

    setIsSubmitting(true);
    try {
      if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
      if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return; }

      const phoneDigits = formData.contactNumber.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) { setError('Phone number must be 10–15 digits'); return; }

      // Check existing
      const { data: existingByEmail } = await supabase.from('partners').select('id, status').eq('email', formData.email).maybeSingle();
      if (existingByEmail) {
        setError(existingByEmail.status === 'active' ? 'This email already has an active account.' : 'This email is already registered.');
        return;
      }
      const { data: existingByPhone } = await supabase.from('partners').select('id').eq('phone', formData.contactNumber).maybeSingle();
      if (existingByPhone) { setError('This phone number is already registered.'); return; }

      const { data: authData, error: authError } = await supabase.auth.signUp({ email: formData.email, password: formData.password });
      if (authError) { setError(`Authentication error: ${authError.message}`); return; }
      if (!authData.user) { setError('Registration failed. Please try again.'); return; }

      const { error: insertError } = await supabase.from('partners').insert([{
        id: authData.user.id, name: formData.businessName, phone: formData.contactNumber,
        commission_rate: formData.commissionRate, location: formData.address, email: formData.email,
        status: 'pending', bank_name: formData.bankName || null,
        bank_account: formData.bankAccount || null, account_holder: formData.bankHolder || null
      }]);

      if (insertError) { setError(`Registration failed: ${insertError.message}`); return; }

      alert('Registration submitted! Your application is pending admin approval.');
      await supabase.auth.signOut();
      handleNavigation('/');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadAgreement = () => {
    const link = document.createElement('a');
    link.href = '/plus1_rewards_partner_agreement.pdf';
    link.download = 'plus1_rewards_partner_agreement.pdf';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const steps = ['Business Info', 'Contact & Banking', 'Commission & Agreement'];

  return (
    <AuthLayout
      portalIcon="storefront"
      portalName="Partner Portal"
      headline={<>Join the <span style={{ color: '#93c5fd' }}>rewards</span> revolution.</>}
      subheadline="Partner with +1 Rewards to offer your customers life-changing healthcare benefits while growing your business."
      stats={[
        { value: 'Free', label: 'To Join' },
        { value: '+25%', label: 'Customer Retention' },
        { value: '100%', label: 'Offline Ready' },
      ]}
    >
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-gray-900">Register Your Business</h2>
          <p className="text-sm text-gray-500 mt-1">Step {currentStep} of 3 — {steps[currentStep - 1]}</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col gap-1">
              <div className="h-1.5 rounded-full transition-all duration-300" style={{ backgroundColor: i < currentStep ? BLUE : '#e5e7eb' }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: i < currentStep ? BLUE : '#9ca3af' }}>{step}</span>
            </div>
          ))}
        </div>

        <AuthError message={error} />

        {/* Step 1 */}
        {currentStep === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <AuthInput label="Business Name" icon="storefront" id="businessName" name="businessName" type="text" placeholder="Mitchell's Store" value={formData.businessName} onChange={handleInputChange} required />
              <AuthInput label="Business Address" icon="location_on" id="address" name="address" type="text" placeholder="123 Main St, Joburg" value={formData.address} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AuthInput label="Contact Name" icon="person" id="contactName" name="contactName" type="text" placeholder="John Mitchell" value={formData.contactName} onChange={handleInputChange} required />
              <AuthInput label="Contact Number" icon="phone" id="contactNumber" name="contactNumber" type="tel" placeholder="011 555 1234" value={formData.contactNumber} onChange={handleInputChange} required />
            </div>
            <AuthButton type="submit">
              Continue to Step 2
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </AuthButton>
          </form>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <AuthInput label="Email Address" icon="mail" id="email" name="email" type="email" placeholder="john@mitchellstore.co.za" value={formData.email} onChange={handleInputChange} required />
            <AuthInput label="Bank Name" icon="account_balance" id="bankName" name="bankName" type="text" placeholder="Standard Bank" value={formData.bankName} onChange={handleInputChange} required />
            <div className="grid grid-cols-2 gap-3">
              <AuthInput label="Account Holder" icon="person" id="bankHolder" name="bankHolder" type="text" placeholder="John Mitchell" value={formData.bankHolder} onChange={handleInputChange} required />
              <AuthInput label="Account Number" icon="credit_card" id="bankAccount" name="bankAccount" type="text" placeholder="1234567890" value={formData.bankAccount} onChange={handleInputChange} required />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setCurrentStep(1)} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                <span className="material-symbols-outlined text-base">arrow_back</span> Back
              </button>
              <AuthButton type="submit">
                Continue to Step 3
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </AuthButton>
            </div>
          </form>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <AuthInput
                label="Password" icon="lock" id="password" name="password" type={showPassword ? 'text' : 'password'}
                placeholder="••••••••" value={formData.password} onChange={handleInputChange} required minLength={8}
                suffix={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span></button>}
              />
              <AuthInput
                label="Confirm Password" icon="lock" id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} required minLength={8}
                suffix={<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined text-xl">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span></button>}
              />
            </div>

            {/* Commission Slider */}
            <div className="space-y-3 rounded-xl border p-4" style={{ borderColor: '#e5e7eb', backgroundColor: BLUE_LIGHT }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-gray-900">Rewards Rate for Customers</p>
                  <p className="text-xs text-gray-500">% of each purchase credited as points</p>
                </div>
                <span className="text-3xl font-black" style={{ color: BLUE }}>{commissionRate}%</span>
              </div>
              <input
                type="range" min="1" max="40" value={commissionRate} onChange={handleCommissionChange}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${BLUE} 0%, ${BLUE} ${(commissionRate - 1) * 2.56}%, #e5e7eb ${(commissionRate - 1) * 2.56}%, #e5e7eb 100%)` }}
              />
              <div className="flex justify-between text-xs text-gray-400 font-medium">
                <span>1%</span><span>20%</span><span>40%</span>
              </div>
            </div>

            {/* Agreement section */}
            <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: '#e5e7eb', backgroundColor: '#f0f9ff' }}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl" style={{ color: BLUE }}>description</span>
                <span className="font-bold text-sm text-gray-900">Partner Agreement</span>
              </div>
              <p className="text-xs text-gray-500">Download, read, sign, and upload the completed partnership agreement.</p>
              <button type="button" onClick={downloadAgreement} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ backgroundColor: BLUE }}>
                <span className="material-symbols-outlined text-sm">download</span>
                Download Agreement
              </button>
            </div>

            {/* Upload signed agreement */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Upload Signed Agreement</label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-5 cursor-pointer hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
                <span className="material-symbols-outlined text-2xl text-gray-400">upload_file</span>
                <span className="text-sm text-gray-500">Click to upload (PDF or image)</span>
                <input type="file" name="agreementFile" accept=".pdf,image/*" className="hidden" required />
              </label>
            </div>

            <label className="flex items-start gap-2.5 text-sm text-gray-600 cursor-pointer">
              <div className="checkbox-container mt-0.5">
                <input
                  type="checkbox"
                  id="partner-agreement-cbx"
                  name="agreementSigned"
                  checked={formData.agreementSigned}
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                  required
                />
                <label htmlFor="partner-agreement-cbx" className="check">
                  <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </label>
              </div>
              <span>I confirm I have read, understood, and signed the Partnership Agreement</span>
            </label>

            <div className="flex gap-3">
              <button type="button" onClick={() => setCurrentStep(2)} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                <span className="material-symbols-outlined text-base">arrow_back</span> Back
              </button>
              <AuthButton type="submit" loading={isSubmitting} loadingText="Registering...">
                Register My Business
              </AuthButton>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 pt-2">
          Already have an account?{' '}
          <AuthLink href="/partner/login">Sign In</AuthLink>
        </p>
      </div>
    </AuthLayout>
  );
}