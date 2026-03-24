// plus1-rewards/src/components/landing/Roles.tsx
import { useState } from 'react';

const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.08)'
const BLUE_BORDER = 'rgba(26,85,139,0.35)'
const BLUE_ICON_BG = 'rgba(26,85,139,0.12)'

export default function Roles() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % roles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + roles.length) % roles.length);
  };

  const roles = [
    {
      icon: 'group',
      title: 'Members',
      headline: 'Your shopping already covers your family.',
      desc: 'Shop at +1 Rewards partners. Earn 3% cashback in real rands on every purchase. When your cashback hits R385, your Day1Health medical cover activates automatically — with nothing extra to pay.',
      features: ['R0 joining fee', 'No change to your shopping habits', 'Cover starts from Day 1', 'Secure your family\'s health'],
      loginPath: '/member/login',
      registerPath: '/member/register',
      highlight: true,
      hasButtons: true,
      buttonType: 'login-register',
    },
    {
      icon: 'storefront',
      title: 'Shop Owners',
      headline: 'Give your customers a reason to come back — every single day.',
      desc: 'Join the +1 Rewards partner network. Your customers earn cashback toward their medical cover every time they shop with you. No cost to your business. Stronger loyalty. And your shop becomes part of something that genuinely changes lives.',
      features: ['No setup costs', 'Increase foot traffic', 'Better customer retention', 'Your shop powers the community'],
      loginPath: '/partner/login',
      registerPath: '/partner/register',
      highlight: false,
      hasButtons: true,
      buttonType: 'login-register',
    },
  ]

  return (
    <section className="py-24 px-6 lg:px-20" style={{ backgroundColor: '#ffffff' }} id="roles">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
          <div className="max-w-xl">
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
              style={{ backgroundColor: BLUE_ICON_BG, color: BLUE }}
            >
              For Everyone
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">Built for every side of the community</h2>
            <p className="text-lg text-gray-600 leading-relaxed">Whether you shop, sell, or spread the word — +1 Rewards works for you.</p>
          </div>
        </div>

        {/* Cards - Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {roles.map((role, i) => (
            <div
              key={i}
              className="border rounded-3xl p-8 flex flex-col transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl"
              style={{
                backgroundColor: role.highlight ? BLUE_LIGHT : '#fff',
                borderColor: role.highlight ? BLUE_BORDER : '#e5e7eb',
              }}
            >
              <div
                className="size-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm"
                style={{ backgroundColor: BLUE_ICON_BG, color: BLUE }}
              >
                <span className="material-symbols-outlined text-4xl">{role.icon}</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-2" style={{color: BLUE}}>{role.title}</h3>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{role.headline}</h4>
              <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">{role.desc}</p>
              
              {role.features.length > 0 && (
                <ul className="space-y-3 mb-8">
                  {role.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                      <span className="material-symbols-outlined text-base mt-0.5" style={{ color: BLUE }}>check_circle</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {role.hasButtons && role.buttonType === 'login-register' && (
                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleNavigation(role.loginPath)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:shadow-lg hover:opacity-90"
                    style={{ backgroundColor: BLUE }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation(role.registerPath)}
                    className="flex-1 py-3 border-2 rounded-xl font-bold text-sm transition-all hover:bg-blue-50"
                    style={{ borderColor: BLUE, color: BLUE }}
                  >
                    Register
                  </button>
                </div>
              )}

              {role.hasButtons && role.buttonType === 'agent' && (
                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleNavigation(role.registerPath)}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:shadow-lg hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ backgroundColor: BLUE }}
                  >
                    <span>Become an Agent</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cards - Mobile Carousel */}
        <div className="md:hidden relative max-w-md mx-auto">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {roles.map((role, i) => (
                <div key={i} className="w-full flex-shrink-0 px-2">
                  <div
                    className="border rounded-3xl p-6 flex flex-col"
                    style={{
                      backgroundColor: role.highlight ? BLUE_LIGHT : '#fff',
                      borderColor: role.highlight ? BLUE_BORDER : '#e5e7eb',
                    }}
                  >
                    <div
                      className="size-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
                      style={{ backgroundColor: BLUE_ICON_BG, color: BLUE }}
                    >
                      <span className="material-symbols-outlined text-3xl">{role.icon}</span>
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{color: BLUE}}>{role.title}</h3>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">{role.headline}</h4>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{role.desc}</p>
                    
                    {role.features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {role.features.map((f, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                            <span className="material-symbols-outlined text-sm mt-0.5" style={{ color: BLUE }}>check_circle</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {role.hasButtons && role.buttonType === 'login-register' && (
                      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleNavigation(role.loginPath)}
                          className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md"
                          style={{ backgroundColor: BLUE }}
                        >
                          Login
                        </button>
                        <button
                          onClick={() => handleNavigation(role.registerPath)}
                          className="flex-1 py-2.5 border-2 rounded-xl font-bold text-sm transition-all"
                          style={{ borderColor: BLUE, color: BLUE }}
                        >
                          Register
                        </button>
                      </div>
                    )}

                    {role.hasButtons && role.buttonType === 'agent' && (
                      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleNavigation(role.registerPath)}
                          className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2"
                          style={{ backgroundColor: BLUE }}
                        >
                          <span>Become an Agent</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
            style={{ color: BLUE }}
            aria-label="Previous slide"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
            style={{ color: BLUE }}
            aria-label="Next slide"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {roles.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: currentSlide === i ? BLUE : '#d1d5db',
                  width: currentSlide === i ? '24px' : '8px',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}