// plus1-rewards/src/components/mobile/RolesCarousel.tsx
import { useRef } from 'react';

export default function RolesCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="py-8 bg-primary/5 border-y border-primary/10">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold">Built for You</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="size-10 rounded-full bg-background-dark border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition-colors"
            aria-label="Previous"
          >
            <span className="material-symbols-outlined text-primary">chevron_left</span>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="size-10 rounded-full bg-background-dark border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition-colors"
            aria-label="Next"
          >
            <span className="material-symbols-outlined text-primary">chevron_right</span>
          </button>
        </div>
      </div>
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-0 pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        <div className="w-full flex-shrink-0 px-4 snap-center">
          <div className="bg-background-dark border border-primary/10 p-6 rounded-2xl flex flex-col gap-6">
            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">For Members</h3>
              <p className="text-slate-400 mt-2 text-sm">Shop as usual and get premium private healthcare without monthly cash premiums.</p>
            </div>
            <div className="flex gap-3 mt-2">
              <button className="flex-1 bg-primary text-background-dark py-3 rounded-xl font-bold text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform">
                Register
              </button>
              <button className="flex-1 bg-transparent border border-primary text-primary py-3 rounded-xl font-bold text-base active:scale-[0.98] transition-transform">
                Login
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex-shrink-0 px-4 snap-center">
          <div className="bg-background-dark border border-primary/10 p-6 rounded-2xl flex flex-col gap-6">
            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">storefront</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">For Shop Owners</h3>
              <p className="text-slate-400 mt-2 text-sm">Increase customer loyalty and attract new shoppers by offering +1 health rewards.</p>
            </div>
            <div className="flex gap-3 mt-2">
              <button className="flex-1 bg-primary text-background-dark py-3 rounded-xl font-bold text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform">
                Register
              </button>
              <button className="flex-1 bg-transparent border border-primary text-primary py-3 rounded-xl font-bold text-base active:scale-[0.98] transition-transform">
                Login
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex-shrink-0 px-4 snap-center">
          <div className="bg-background-dark border border-primary/10 p-6 rounded-2xl flex flex-col gap-6">
            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">groups</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">For Agents</h3>
              <p className="text-slate-400 mt-2 text-sm">Help your community stay healthy while earning commissions for onboarding stores.</p>
            </div>
            <div className="flex gap-3 mt-2">
              <button className="flex-1 bg-primary text-background-dark py-3 rounded-xl font-bold text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform">
                Register
              </button>
              <button className="flex-1 bg-transparent border border-primary text-primary py-3 rounded-xl font-bold text-base active:scale-[0.98] transition-transform">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
