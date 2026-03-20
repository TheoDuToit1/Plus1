// plus1-rewards/src/pages/AgentRegister.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput, AuthButton, AuthError, AuthLink } from '../components/auth/AuthComponents';

const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.08)'

export default function AgentRegister() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    surname: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    idNumber: '',
    documentFile: null as File | null,
    agreementSigned: false
  });

  const handleNavigation = (path: string) => { window.location.href = path; };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] || null : value
    }));
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      setIsSubmitting(true);
      try {
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return; }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) { setError(`Authentication error: ${authError.message}`); return; }

        const { error } = await supabase.from('agents').insert([{
          id: authData.user.id,
          name: formData.fullName,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phoneNumber,
          address: formData.address,
          status: 'pending'
        }]).select();

        if (error) {
          if (error.message.includes('email')) setError('This email is already registered.');
          else if (error.message.includes('phone')) setError('This phone number is already registered.');
          else setError(`Registration failed: ${error.message}`);
        } else {
          alert('Registration submitted! Your application is pending admin approval.');
          handleNavigation('/');
        }
      } catch {
        alert('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const downloadAgreement = () => {
    const link = document.createElement('a');
    link.href = '/plus1_rewards_sales_agent_agreement.pdf';
    link.download = 'plus1_rewards_sales_agent_agreement.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const steps = ['Personal Info', 'Verification & Agreement'];

  return (
    <AuthLayout
      portalIcon="assignment_ind"
      portalName="Agent Portal"
      headline={<>Build your <span style={{ color: '#93c5fd' }}>sales</span> empire.</>}
      subheadline="Become a +1 Rewards sales agent and earn recurring commissions by connecting local businesses with our platform."
      stats={[
        { value: '1%', label: 'Commission Rate' },
        { value: 'Monthly', label: 'Payouts' },
        { value: '∞', label: 'Earning Potential' },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-gray-900">Become an Agent</h2>
          <p className="text-sm text-gray-500 mt-1">Step {currentStep} of 2 — {steps[currentStep - 1]}</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col gap-1">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ backgroundColor: i < currentStep ? BLUE : '#e5e7eb' }}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: i < currentStep ? BLUE : '#9ca3af' }}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <AuthError message={error} />

        {currentStep === 1 ? (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <AuthInput label="First Name" icon="person" id="fullName" name="fullName" type="text" placeholder="Michael" value={formData.fullName} onChange={handleInputChange} required />
              <AuthInput label="Surname" icon="person" id="surname" name="surname" type="text" placeholder="Johnson" value={formData.surname} onChange={handleInputChange} required />
            </div>
            <AuthInput label="Address" icon="location_on" id="address" name="address" type="text" placeholder="123 Main Street, Johannesburg" value={formData.address} onChange={handleInputChange} required />
            <div className="grid grid-cols-2 gap-3">
              <AuthInput label="Phone Number" icon="phone" id="phoneNumber" name="phoneNumber" type="tel" placeholder="082 555 1234" value={formData.phoneNumber} onChange={handleInputChange} required />
              <AuthInput label="Email" icon="mail" id="email" name="email" type="email" placeholder="michael@example.com" value={formData.email} onChange={handleInputChange} required />
            </div>
            <AuthButton type="submit">
              Continue to Step 2
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </AuthButton>
          </form>
        ) : (
          <form onSubmit={handleNextStep} className="space-y-4">
            <AuthInput label="ID Number" icon="badge" id="idNumber" name="idNumber" type="text" placeholder="8001015009087" value={formData.idNumber} onChange={handleInputChange} required />

            {/* ID Document upload */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Upload ID / Passport / Driver's License</label>
              <label
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-6 cursor-pointer transition-all"
                style={{ borderColor: formData.documentFile ? BLUE : '#e5e7eb', backgroundColor: formData.documentFile ? BLUE_LIGHT : '#fafafa' }}
              >
                <span className="material-symbols-outlined text-3xl" style={{ color: formData.documentFile ? BLUE : '#9ca3af' }}>upload_file</span>
                <span className="text-sm font-semibold" style={{ color: formData.documentFile ? BLUE : '#6b7280' }}>
                  {formData.documentFile ? formData.documentFile.name : 'Click to upload file'}
                </span>
                <span className="text-xs text-gray-400">JPG, PNG or PDF — max 5MB</span>
                <input type="file" name="documentFile" accept="image/*,.pdf" onChange={handleInputChange} className="hidden" required />
              </label>
            </div>

            {/* Passwords */}
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

            {/* Agreement section */}
            <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: '#e5e7eb', backgroundColor: BLUE_LIGHT }}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl" style={{ color: BLUE }}>description</span>
                <span className="font-bold text-sm text-gray-900">Sales Agent Agreement</span>
              </div>
              <p className="text-xs text-gray-500">Download, read, sign, and upload the completed agreement below.</p>
              <button type="button" onClick={downloadAgreement}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: BLUE }}>
                <span className="material-symbols-outlined text-sm">download</span>
                Download Agreement
              </button>
            </div>

            {/* Upload signed agreement */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Upload Signed Agreement</label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-5 cursor-pointer hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
                <span className="material-symbols-outlined text-2xl text-gray-400">upload_file</span>
                <span className="text-sm text-gray-500">Click to upload signed agreement (PDF or image)</span>
                <input type="file" name="agreementFile" accept=".pdf,image/*" className="hidden" required />
              </label>
            </div>

            <label className="flex items-start gap-2.5 text-sm text-gray-600 cursor-pointer">
              <div className="checkbox-container mt-0.5">
                <input
                  type="checkbox"
                  id="agent-agreement-cbx"
                  name="agreementSigned"
                  checked={formData.agreementSigned}
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                  required
                />
                <label htmlFor="agent-agreement-cbx" className="check">
                  <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </label>
              </div>
              <span>I have read, understood, and signed the Sales Agent Agreement</span>
            </label>

            {/* Info box */}
            <div className="rounded-xl border p-4 flex gap-3" style={{ borderColor: '#e5e7eb', backgroundColor: '#f0f9ff' }}>
              <span className="material-symbols-outlined text-xl flex-shrink-0" style={{ color: BLUE }}>info</span>
              <div>
                <p className="text-sm font-bold text-gray-800">Application Review</p>
                <p className="text-xs text-gray-500 mt-0.5">All applications are reviewed within 48 hours. You'll receive an email with next steps.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setCurrentStep(1)} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                <span className="material-symbols-outlined text-base">arrow_back</span> Back
              </button>
              <AuthButton type="submit" loading={isSubmitting} loadingText="Submitting...">
                Submit Application
              </AuthButton>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 pt-2">
          Already an agent? <AuthLink href="/agent/login">Sign In</AuthLink>
        </p>
      </div>
    </AuthLayout>
  );
}