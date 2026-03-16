// plus1-rewards/src/components/mobile/HowItWorks.tsx
export default function HowItWorks() {
  return (
    <section className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-primary material-symbols-outlined">auto_awesome</span>
        How It Works
      </h2>
      <div className="space-y-6">
        <div className="flex gap-4 group">
          <div className="flex flex-col items-center shrink-0">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary">shopping_basket</span>
            </div>
            <div className="w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent my-2"></div>
          </div>
          <div className="pb-6">
            <h3 className="text-lg font-bold text-slate-100">Shop at partners</h3>
            <p className="text-slate-400 mt-1">Visit any of our 500+ registered local shops and vendors in your neighborhood.</p>
          </div>
        </div>
        <div className="flex gap-4 group">
          <div className="flex flex-col items-center shrink-0">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary">monetization_on</span>
            </div>
            <div className="w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent my-2"></div>
          </div>
          <div className="pb-6">
            <h3 className="text-lg font-bold text-slate-100">Earn +1 points</h3>
            <p className="text-slate-400 mt-1">Scan your unique QR code at checkout to collect rewards on every purchase you make.</p>
          </div>
        </div>
        <div className="flex gap-4 group">
          <div className="flex flex-col items-center shrink-0">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary">health_and_safety</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Activate health cover</h3>
            <p className="text-slate-400 mt-1">Once you reach your monthly goal, your Day1 Health insurance is automatically activated.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
