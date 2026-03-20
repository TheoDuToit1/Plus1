// plus1-rewards/src/components/mobile/HeroSection.tsx
const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.12)'

export default function HeroSection() {
  return (
    <section className="px-4 py-6" style={{ backgroundColor: '#f5f8fc' }}>
      <div
        className="relative rounded-2xl overflow-hidden min-h-[400px] flex flex-col justify-end p-6 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(26, 85, 139, 0.92), rgba(26, 85, 139, 0.15)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsMkIY7LdWeKdI3jEu-u1IdhyJXk6fwyNZ3oPAQuK4mXq8V9xpNGz_ZNRRpydT7s486XqinfErDMqQSm_llcqhgV82MbDh1LvJp-PVgiKLYmkj7GDKYzkjp3hLrbKB9J8bTgzaXhXWOV6mxY_5j8sXUgt15g1HekbCnbYfo7vPZSUnJH5UsfULxITgmTQkLmFjMYN9cemmBsvuHQ7rAeH9RQSxc6WUjncwhdRkC7n_gSOPAO8V0FCg8RPubJHItbwHsBgLCfG1-74q')`,
        }}
      >
        <div className="space-y-4">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
          >
            Health for Everyone
          </span>
          <h1 className="text-3xl font-bold text-white leading-tight">
            Health Cover for All. Shop local. Earn rands. Get covered.
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Join +1 Rewards and earn cashback in rands — not points — at participating businesses near you. Your cashback pays directly toward your Day1Health medical cover plan.
          </p>
          <button
            className="w-full py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-transform"
            style={{ backgroundColor: BLUE, color: '#fff' }}
            onClick={() => window.location.href = '/member/register'}
          >
            Get Started Now
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { icon: 'payments', label: 'R0 Fee' },
          { icon: 'signal_wifi_off', label: 'Offline' },
          { icon: 'verified_user', label: 'FSP' },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1 py-3 rounded-xl"
            style={{ backgroundColor: BLUE_LIGHT }}
          >
            <span className="material-symbols-outlined text-2xl" style={{ color: BLUE }}>{s.icon}</span>
            <span className="text-xs font-bold" style={{ color: BLUE }}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
