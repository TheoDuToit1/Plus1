// plus1-rewards/src/pages/MemberRegister.tsx
export default function MemberRegister() {
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
              alt="Happy family shopping together" 
              className="w-full h-full object-cover" 
              data-alt="Family enjoying shopping with rewards benefits" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs0NJvdFopFrHzhlnAatUu3wtcZ5HH0frFV3JuGfICUVtpraRhtig6O1WHOTnpmsLzDyNUFW6WWhY4a3_V8J-_iy2rIhwd_ifsQs_w6bs4TR9w_aVmCUzGY65N4y02OuDtcVM6Fu7q6RsIOUGD87zx6YktI6Xe478iBBrEcMjQcPpMZt-_D2DjIw4TtN6lm5KmVXR74LblHmi3jIWkP4_dBbQFhN6W-CnxQGljxRaRESt0AN8e1FaKgAs2uKKWBPQJ3Hoi2TCSPz50" 
            />
          </div>
          <div className="relative z-20">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-background-dark">
                <span className="material-symbols-outlined text-3xl font-bold">add_circle</span>
              </div>
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">+1 Rewards</h2>
            </div>
          </div>
          <div className="relative z-20 max-w-lg">
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white mb-6">
              Start earning <span className="text-primary italic">healthcare</span> rewards today.
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Join thousands of members who fund their health insurance through everyday shopping at local partners.
            </p>
          </div>
          <div className="relative z-20 flex gap-8">
            <div className="flex flex-col">
              <span className="text-primary text-2xl font-bold">R0</span>
              <span className="text-slate-400 text-sm">Joining Fee</span>
            </div>
            <div className="flex flex-col">
              <span className="text-primary text-2xl font-bold">3%</span>
              <span className="text-slate-400 text-sm">Rewards Rate</span>
            </div>
            <div className="flex flex-col">
              <span className="text-primary text-2xl font-bold">R385</span>
              <span className="text-slate-400 text-sm">Monthly Target</span>
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
                <span className="material-symbols-outlined text-xl font-bold">add_circle</span>
              </div>
              <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">+1 Rewards</h2>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create Your Account</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Join for free and start earning healthcare rewards.</p>
            </div>
            <form action="#" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="name">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-xl">person</span>
                    </div>
                    <input 
                      className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                      id="name" 
                      placeholder="Sarah Mitchell" 
                      type="text"
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
                      placeholder="082 555 1234" 
                      type="tel"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="email">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-xl">mail</span>
                    </div>
                    <input 
                      className="block w-full pl-11 pr-4 py-4 bg-transparent border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white placeholder-white/60" 
                      id="email" 
                      placeholder="sarah@gmail.com" 
                      type="email"
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
                      placeholder="Min. 8 characters" 
                      type="password"
                    />
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 cursor-pointer">
                      <span className="material-symbols-outlined">visibility</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-primary/30 rounded bg-white dark:bg-background-dark" 
                  id="terms" 
                  name="terms" 
                  type="checkbox"
                />
                <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400" htmlFor="terms">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </label>
              </div>
              <button 
                className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group" 
                type="submit"
              >
                Create My Account
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-primary/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background-light dark:bg-background-dark text-slate-500 uppercase tracking-widest text-xs font-bold">Or sign up with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all">
                <img 
                  alt="Google" 
                  className="size-5" 
                  data-alt="Google colorful logo" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCML5hztAD2sCYGPFi5oE5EiI2O5uuLrOmgRKTYiBveKvruVR25HUvpqazjFQ1GSXhlYysjCwO_T-QhJkDUKlMIEZ-Src2WVWE3sJGbWbsWe3H1iiumuDu8aL1YhyCbA8UQdwWnAzuNu7l_gkaGVltz_zhRnb6KGMBQHSq357M3plsG25Vv0OMG5YFEo6ntXkVjUOi7beYK-_DB_cq7zKbRI9pKdnRyiiWl12i9a2P6YVrquulbDVvoaJyiNiBef9KvS4aifZObO8of" 
                />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all">
                <span className="material-symbols-outlined text-slate-900 dark:text-white text-xl">ios</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Apple</span>
              </button>
            </div>
            <p className="text-center text-slate-600 dark:text-slate-400 mt-8">
              Already have an account? <a onClick={() => handleNavigation('/member/login')} className="text-primary font-bold hover:underline cursor-pointer">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}