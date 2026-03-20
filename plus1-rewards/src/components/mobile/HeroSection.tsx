// plus1-rewards/src/components/mobile/HeroSection.tsx
import { FeaturesSectionWithHoverEffects } from '../ui/feature-section-with-hover-effects';

export default function HeroSection() {
  return (
    <section className="px-4 pt-20 pb-28 min-h-screen flex flex-col" style={{ backgroundColor: '#f5f8fc' }}>
      <div
        className="relative rounded-2xl overflow-hidden flex-1 flex flex-col justify-end p-6 bg-cover bg-center"
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
            className="uiverse-button w-full"
            onClick={() => window.location.href = '/member/register'}
          >
            <span>Start Earning Free Cover &rarr;</span>
          </button>
        </div>
      </div>

      {/* Features from Shadcn */}
      <div className="-mx-4">
        <FeaturesSectionWithHoverEffects />
      </div>
    </section>
  );
}
