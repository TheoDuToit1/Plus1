// plus1-rewards/src/components/landing/Hero.tsx
const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.10)'
const BLUE_BORDER = 'rgba(26,85,139,0.25)'

export default function Hero() {
  return (
    <section
      className="relative flex items-center overflow-hidden px-6 lg:px-20 min-h-[90vh] pt-20"
      style={{ backgroundColor: '#f5f8fc' }}
    >
      {/* Right image panel */}
      <div className="absolute top-0 right-0 w-[52%] h-full z-0 overflow-hidden rounded-bl-[80px]">
        <img
          alt="Diverse South African community interaction"
          className="w-full h-full object-cover"
          src="/background hero section.png"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f8fc] via-[#f5f8fc]/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto py-24">
        <div className="flex flex-col gap-8 max-w-2xl">
          {/* Badge */}
          <span
            className="inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
            style={{ backgroundColor: BLUE_LIGHT, color: BLUE, borderColor: BLUE_BORDER }}
          >
            <span className="material-symbols-outlined text-sm" style={{ color: BLUE }}>health_and_safety</span>
            Revolutionizing Healthcare Access
          </span>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight text-gray-900">
            Health Cover for All.<br />
            <span style={{ color: BLUE }}>Shop local. </span>
            <span style={{ color: BLUE }}>Earn rands. </span>
            <br />
            <span style={{ color: BLUE }}>Get covered.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            Join +1 Rewards and earn cashback in rands — not points — at participating businesses near you. Your cashback pays directly toward your Day1Health medical cover plan.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md text-white hover:opacity-90"
              style={{ backgroundColor: BLUE }}
              onClick={() => window.location.href = '/member/register'}
            >
              Get Started Now
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all border-2 hover:bg-blue-50"
              style={{ borderColor: BLUE, color: BLUE }}
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-6 mt-1">
            {['No joining fee', 'Works 100% offline', 'FSP Licensed'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-500">
                <span className="material-symbols-outlined text-base" style={{ color: BLUE }}>check_circle</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}