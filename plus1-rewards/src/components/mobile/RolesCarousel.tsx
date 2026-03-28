// plus1-rewards/src/components/mobile/RolesCarousel.tsx
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.08)'
const BLUE_BORDER = 'rgba(26,85,139,0.20)'

export default function RolesCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth;
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const cards = [
    {
      icon: 'person',
      title: 'For Members',
      desc: 'Shop as usual and get premium private healthcare without monthly cash premiums.',
      loginPath: '/login',
      registerPath: '/register',
    },
    {
      icon: 'storefront',
      title: 'For Partners',
      desc: 'Increase customer loyalty and attract new customers by offering +1 health rewards.',
      loginPath: '/partner/login',
      registerPath: '/partner/register',
    },
    {
      icon: 'groups',
      title: 'For Agents',
      desc: 'Help your community stay healthy while earning commissions for onboarding stores.',
      loginPath: '/agent/login',
      registerPath: '/agent/register',
    },
  ]

  return (
    <section className="py-8 border-y" style={{ backgroundColor: '#f5f8fc', borderColor: '#e5e7eb' }}>
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold text-gray-900">Built for You</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="size-10 rounded-full border flex items-center justify-center hover:bg-blue-50 transition-colors"
            style={{ borderColor: BLUE_BORDER }}
            aria-label="Previous"
          >
            <span className="material-symbols-outlined" style={{ color: BLUE }}>chevron_left</span>
          </button>
          <button
            onClick={() => scroll('right')}
            className="size-10 rounded-full border flex items-center justify-center hover:bg-blue-50 transition-colors"
            style={{ borderColor: BLUE_BORDER }}
            aria-label="Next"
          >
            <span className="material-symbols-outlined" style={{ color: BLUE }}>chevron_right</span>
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-0 pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        {cards.map((card, i) => (
          <div key={i} className="w-full flex-shrink-0 px-4 snap-center">
            <div
              className="border rounded-2xl p-6 flex flex-col gap-5"
              style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
            >
              <div
                className="size-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: BLUE_LIGHT }}
              >
                <span className="material-symbols-outlined" style={{ color: BLUE }}>{card.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                <p className="text-gray-500 mt-2 text-sm">{card.desc}</p>
              </div>
              <div className="flex gap-3 mt-1">
                <button
                  onClick={() => navigate(card.registerPath)}
                  className="flex-1 py-3 rounded-xl font-bold text-base text-white active:scale-[0.98] transition-transform"
                  style={{ backgroundColor: BLUE }}
                >
                  Register
                </button>
                <button
                  onClick={() => navigate(card.loginPath)}
                  className="flex-1 py-3 rounded-xl font-bold text-base border active:scale-[0.98] transition-transform"
                  style={{ borderColor: BLUE, color: BLUE, backgroundColor: 'transparent' }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
