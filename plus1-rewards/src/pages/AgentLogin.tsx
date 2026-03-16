// plus1-rewards/src/pages/AgentLogin.tsx
export default function AgentLogin() {
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
              alt="Sales agent working with clients" 
              className="w-full h-full object-cover" 
              data-alt="Professional sales agent meeting with business owners" 
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
              Build your network, <span className="text-primary italic">earn</span> recurring income.
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Connect local businesses with +1 Rewards and earn competitive commissions on every transaction they process.
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

        {/* Right Side: Login Form */}
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Agent Login</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Access your commission dashboard and manage your network.</p>
            </div>
            <form action="#" className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="email">Agent Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-xl">assignment_ind</span>
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                    id="email" 
                    placeholder="agent@example.com" 
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                  <a className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors" href="#">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-xl">lock</span>
                  </div>
                  <input 
                    className="block w-full pl-11 pr-12 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                  />
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 cursor-pointer">
                    <span className="material-symbols-outlined">visibility</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-primary/30 rounded bg-white dark:bg-background-dark" 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox"
                />
                <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400" htmlFor="remember-me">Keep me signed in</label>
              </div>
              <button 
                className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group" 
                type="submit"
              >
                Access Agent Dashboard
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-primary/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background-light dark:bg-background-dark text-slate-500 uppercase tracking-widest text-xs font-bold">Quick Access</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleNavigation('/member/login')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/20 bg-transparent hover:bg-primary/10 hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined text-slate-300 text-xl">group</span>
                <span className="text-sm font-semibold text-slate-300">Member Login</span>
              </button>
              <button 
                onClick={() => handleNavigation('/shop/login')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/20 bg-transparent hover:bg-primary/10 hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined text-slate-300 text-xl">storefront</span>
                <span className="text-sm font-semibold text-slate-300">Shop Login</span>
              </button>
            </div>
            <p className="text-center text-slate-600 dark:text-slate-400 mt-8">
              Want to become an agent? <a onClick={() => handleNavigation('/agent/register')} className="text-primary font-bold hover:underline cursor-pointer">Apply Now</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}