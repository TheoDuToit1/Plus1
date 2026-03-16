// plus1-rewards/src/components/landing/Roles.tsx
export default function Roles() {
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <section className="py-24 px-6 lg:px-20 bg-background-light dark:bg-[#0a160e]" id="roles">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold text-white mb-4">A Solution for Everyone</h2>
            <p className="text-slate-400">+1 Rewards benefits members, retailers, and dedicated agents alike.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Members Card */}
          <div className="bg-background-dark border border-primary/10 p-8 rounded-2xl hover:border-primary/40 transition-all flex flex-col">
            <span className="material-symbols-outlined text-primary text-4xl mb-6">group</span>
            <h3 className="text-2xl font-bold text-white mb-4">Members</h3>
            <p className="text-slate-400 mb-8 flex-grow">Earn comprehensive healthcare coverage simply by doing your everyday shopping at local partners.</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                R0 joining fee
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Secure your family
              </li>
            </ul>
            <div className="flex gap-3">
              <button 
                onClick={() => handleNavigation('/member/login')}
                className="flex-1 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all"
              >
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/member/register')}
                className="flex-1 py-3 border border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-background-dark transition-all"
              >
                Register
              </button>
            </div>
          </div>
          {/* Shop Owners Card */}
          <div className="bg-background-dark border border-primary/10 p-8 rounded-2xl hover:border-primary/40 transition-all flex flex-col">
            <span className="material-symbols-outlined text-primary text-4xl mb-6">storefront</span>
            <h3 className="text-2xl font-bold text-white mb-4">Shop Owners</h3>
            <p className="text-slate-400 mb-8 flex-grow">Build intense customer loyalty and attract new shoppers by offering a life-changing rewards program.</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Increase foot traffic
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Better customer retention
              </li>
            </ul>
            <div className="flex gap-3">
              <button 
                onClick={() => handleNavigation('/shop/login')}
                className="flex-1 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all"
              >
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/shop/register')}
                className="flex-1 py-3 border border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-background-dark transition-all"
              >
                Register
              </button>
            </div>
          </div>
          {/* Sales Agents Card */}
          <div className="bg-background-dark border border-primary/10 p-8 rounded-2xl hover:border-primary/40 transition-all flex flex-col">
            <span className="material-symbols-outlined text-primary text-4xl mb-6">assignment_ind</span>
            <h3 className="text-2xl font-bold text-white mb-4">Sales Agents</h3>
            <p className="text-slate-400 mb-8 flex-grow">Earn competitive commissions by onboarding new shops and helping community members sign up.</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Flexible earnings
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Empower your community
              </li>
            </ul>
            <div className="flex gap-3">
              <button 
                onClick={() => handleNavigation('/agent/login')}
                className="flex-1 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all"
              >
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/agent/register')}
                className="flex-1 py-3 border border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-background-dark transition-all"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}