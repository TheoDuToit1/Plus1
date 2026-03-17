import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function PolicyProviderRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.company_name || !formData.contact_person || !formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`);
      }

      // Insert policy provider
      const { data, error: insertError } = await supabase
        .from('policy_providers')
        .insert([{
          id: authData.user.id,
          name: formData.company_name,
          company_name: formData.company_name,
          email: formData.email,
          phone: formData.phone || null,
          contact_person: formData.contact_person,
          status: 'pending'
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Show success message and redirect to login
      alert('Registration submitted successfully! Your account is pending approval. You will be contacted within 2 business days.');
      navigate('/');
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

  const handleNavigation = (path: string) => {
    window.location.href = path;
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
              alt="Healthcare professionals collaborating" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs0NJvdFopFrHzhlnAatUu3wtcZ5HH0frFV3JuGfICUVtpraRhtig6O1WHOTnpmsLzDyNUFW6WWhY4a3_V8J-_iy2rIhwd_ifsQs_w6bs4TR9w_aVmCUzGY65N4y02OuDtcVM6Fu7q6RsIOUGD87zx6YktI6Xe478iBBrEcMjQcPpMZt-_D2DjIw4TtN6lm5KmVXR74LblHmi3jIWkP4_dBbQFhN6W-CnxQGljxRaRESt0AN8e1FaKgAs2uKKWBPQJ3Hoi2TCSPz50" 
            />
          </div>
          <div className="relative z-20">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-background-dark">
                <span className="material-symbols-outlined text-3xl font-bold">health_and_safety</span>
              </div>
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">Provider Portal</h2>
            </div>
          </div>
          <div className="relative z-20 max-w-lg">
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white mb-6">
              Join Our <span className="text-primary italic">Partner Network</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Expand your reach and streamline policy management with transparent partner integration.
            </p>
          </div>
          <div className="relative z-20 flex gap-8">
            <div className="flex flex-col">
              <span className="text-primary text-2xl font-bold">Real-time</span>
              <span className="text-slate-400 text-sm">Policy Tracking</span>
            </div>
            <div className="flex flex-col">
              <span className="text-primary text-2xl font-bold">Auto</span>
              <span className="text-slate-400 text-sm">Reconciliation</span>
            </div>
            <div className="flex flex-col">
              <span className="text-primary text-2xl font-bold">24/7</span>
              <span className="text-slate-400 text-sm">System Access</span>
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
                <span className="material-symbols-outlined text-xl font-bold">health_and_safety</span>
              </div>
              <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Provider Portal</h2>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create Your Account</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Join for free and start partnering with +1 Rewards.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="company_name">Company Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-xl">business</span>
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                    id="company_name" 
                    name="company_name"
                    placeholder="Day1 Health Insurance" 
                    type="text"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="contact_person">Contact Person Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-xl">person</span>
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                    id="contact_person" 
                    name="contact_person"
                    placeholder="John Smith" 
                    type="text"
                    value={formData.contact_person}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="phone">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-xl">phone</span>
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                    id="phone" 
                    name="phone"
                    placeholder="+27123456789" 
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-xl">mail</span>
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                    id="email" 
                    name="email"
                    placeholder="partnerships@company.co.za" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

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
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
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
                    placeholder="••••••••" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
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

              <div className="flex items-center">
                <input 
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-primary/30 rounded bg-white dark:bg-background-dark" 
                  id="agree" 
                  name="agree" 
                  type="checkbox"
                  required
                />
                <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400" htmlFor="agree">I agree to the Terms of Service and Privacy Policy</label>
              </div>

              <button 
                className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create My Account'}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-primary/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background-light dark:bg-background-dark text-slate-500 uppercase tracking-widest text-xs font-bold">Registration Required</span>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary text-xl">security</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Pending Approval</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Your registration will be reviewed by our team. You&apos;ll receive login credentials within 2 business days.
              </p>
            </div>

            <p className="text-center text-slate-600 dark:text-slate-400 mt-8">
              Already have an account? <a className="text-primary font-bold hover:underline" href="/provider/login">Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
