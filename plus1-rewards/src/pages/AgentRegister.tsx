// plus1-rewards/src/pages/AgentRegister.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

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

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] || null : value
    }));
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      // Handle final submission to Supabase
      setIsSubmitting(true);
      try {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return;
        }

        // Create auth user first
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          console.error('Error creating auth user:', authError);
          setError(`Authentication error: ${authError.message}`);
          return;
        }

        // Create auth user with the same ID for the agent record
        const { data, error } = await supabase
          .from('agents')
          .insert([
            {
              id: authData.user.id,
              name: formData.fullName,
              surname: formData.surname,
              email: formData.email,
              phone: formData.phoneNumber,
              address: formData.address,
              status: 'pending'
            }
          ])
          .select();

        if (error) {
          console.error('Error registering agent:', error);
          if (error.message.includes('email')) {
            setError('This email address is already registered. Please use a different email address.');
          } else if (error.message.includes('phone')) {
            setError('This phone number is already registered. Please use a different phone number.');
          } else {
            setError(`Registration failed: ${error.message}`);
          }
        } else {
          console.log('Agent registered successfully:', data);
          alert('Registration submitted successfully! Your application is pending admin approval. You will be notified once approved.');
          handleNavigation('/');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const downloadAgreement = () => {
    const link = document.createElement('a');
    link.href = '/plus1_rewards_sales_agent_agreement.pdf';
    link.download = 'plus1_rewards_sales_agent_agreement.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
      <div className="flex min-h-screen">
        {/* Left Side: Value Proposition & Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-background-dark/90 via-background-dark/60 to-transparent z-10"></div>
            <img 
              alt="Professional sales agent networking" 
              className="w-full h-full object-cover" 
              data-alt="Confident sales agent building business relationships" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs0NJvdFopFrHzhlnAatUu3wtcZ5HH0frFV3JuGfICUVtpraRhtig6O1WHOTnpmsLzDyNUFW6WWhY4a3_V8J-_iy2rIhwd_ifsQs_w6bs4TR9w_aVmCUzGY65N4y02OuDtcVM6Fu7q6RsIOUGD87zx6YktI6Xe478iBBrEcMjQcPpMZt-_D2DjIw4TtN6lm5KmVXR74LblHmi3jIWkP4_dBbQFhN6W-CnxQGljxRaRESt0AN8e1FaKgAs2uKKWBPQJ3Hoi2TCSPz50" 
            />
          </div>
          <div className="relative z-20">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-background-dark">
                <span className="material-symbols-outlined text-3xl font-bold">assignment_ind</span>
              </div>
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">Agent Portal</h2>
            </div>
          </div>
          <div className="relative z-20 max-w-lg">
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white mb-6">
              Build your <span className="text-primary italic">sales</span> empire.
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Become a +1 Rewards sales agent and earn recurring commissions by connecting local businesses with our innovative platform.
            </p>
          </div>
          <div className="relative z-20 flex gap-8">
            <div className="flex flex-col">
              <span className="text-primary text-2xl font-bold">1%</span>
              <span className="text-slate-400 text-sm">Commission Rate</span>
            </div>
            <div className="flex flex-col">
              <span className="text-primary text-2xl font-bold">Monthly</span>
              <span className="text-slate-400 text-sm">Payouts</span>
            </div>
            <div className="flex flex-col">
              <span className="text-primary text-2xl font-bold">∞</span>
              <span className="text-slate-400 text-sm">Earning Potential</span>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-background-light dark:bg-background-dark border-l border-white/5">
          {/* Back Button */}
          <div className="w-full max-w-md mb-6">
            <button 
              onClick={() => handleNavigation('/')}
              className="bg-custom-dark text-center w-48 rounded-2xl h-14 relative text-white text-xl font-semibold group shadow-lg" 
              type="button"
            >
              <div className="bg-primary rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                  <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000000"></path>
                  <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000000"></path>
                </svg>
              </div>
              <p className="translate-x-2 text-white">Go Back</p>
            </button>
          </div>
          
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-12">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
                <span className="material-symbols-outlined text-xl font-bold">assignment_ind</span>
              </div>
              <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Agent Portal</h2>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Become an Agent</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Step {currentStep} of 2: {currentStep === 1 ? 'Basic Information' : 'Identity Verification & Agreement'}
              </p>
            </div>

            {/* Step Progress Indicator */}
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-background-dark' : 'bg-slate-300 text-slate-600'}`}>
                <span className="text-sm font-bold">1</span>
              </div>
              <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-primary' : 'bg-slate-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-background-dark' : 'bg-slate-300 text-slate-600'}`}>
                <span className="text-sm font-bold">2</span>
              </div>
            </div>

            {currentStep === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="fullName">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-xl">person</span>
                      </div>
                      <input 
                        className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Michael" 
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="surname">Surname</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-xl">person</span>
                      </div>
                      <input 
                        className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                        id="surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        placeholder="Johnson" 
                        type="text"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="address">Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-xl">location_on</span>
                    </div>
                    <input 
                      className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street, Johannesburg" 
                      type="text"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="phoneNumber">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-xl">phone</span>
                      </div>
                      <input 
                        className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="082 555 1234" 
                        type="tel"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="email">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-xl">mail</span>
                      </div>
                      <input 
                        className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="michael@example.com" 
                        type="email"
                        required
                      />
                    </div>
                  </div>
                </div>
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group" 
                  type="submit"
                >
                  Continue to Step 2
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleNextStep} className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-4">
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="idNumber">ID Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-xl">badge</span>
                    </div>
                    <input 
                      className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                      id="idNumber"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      placeholder="8001015009087" 
                      type="text"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="documentFile">Upload Picture of Passport, Driver's License OR ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-xl">upload_file</span>
                    </div>
                    <input 
                      className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background-dark hover:file:bg-primary/90" 
                      id="documentFile"
                      name="documentFile"
                      onChange={handleInputChange}
                      type="file"
                      accept="image/*,.pdf"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 ml-1">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="password">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-xl">lock</span>
                      </div>
                      <input 
                        className="block w-full pl-11 pr-12 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••" 
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 cursor-pointer"
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-xl">lock</span>
                      </div>
                      <input 
                        className="block w-full pl-11 pr-12 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••" 
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 cursor-pointer"
                      >
                        <span className="material-symbols-outlined">
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Agreement Download Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">description</span>
                    <span className="text-sm font-bold text-blue-800 dark:text-blue-300">Sales Agent Agreement</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-3">
                    Please download, read, sign, and upload the completed agreement.
                  </p>
                  <button 
                    type="button"
                    onClick={downloadAgreement}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Download Agreement
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="agreementFile">Upload Signed Agreement</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-xl">upload_file</span>
                    </div>
                    <input 
                      className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background-dark hover:file:bg-primary/90" 
                      id="agreementFile"
                      name="agreementFile"
                      type="file"
                      accept=".pdf,image/*"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 ml-1">Upload the signed agreement (PDF or image)</p>
                </div>

                <div className="flex items-center">
                  <input 
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-primary/30 rounded bg-white dark:bg-background-dark" 
                    id="terms" 
                    name="agreementSigned"
                    checked={formData.agreementSigned}
                    onChange={handleInputChange}
                    type="checkbox"
                    required
                  />
                  <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400" htmlFor="terms">
                    I confirm that I have read, understood, and signed the Sales Agent Agreement
                  </label>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back
                  </button>
                  <button 
                    className="flex-1 bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin material-symbols-outlined">refresh</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">info</span>
                <span className="text-sm font-bold text-blue-800 dark:text-blue-300">Application Review</span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                All agent applications are reviewed within 48 hours. You&apos;ll receive an email with next steps.
              </p>
            </div>
            <p className="text-center text-slate-600 dark:text-slate-400 mt-8">
              Already an agent? <a onClick={() => handleNavigation('/agent/login')} className="text-primary font-bold hover:underline cursor-pointer">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}