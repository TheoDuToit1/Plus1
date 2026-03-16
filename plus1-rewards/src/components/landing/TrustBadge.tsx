// plus1-rewards/src/components/landing/TrustBadge.tsx
export default function TrustBadge() {
  return (
    <section className="py-20 bg-background-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 text-center">
        <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-12">Our Trusted Insurance Partner</h4>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-80 mb-12">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-white rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-background-dark text-3xl font-bold">shield</span>
            </div>
            <span className="text-2xl font-black text-white">Day1 Health</span>
          </div>
          <div className="h-12 w-px bg-slate-700 hidden md:block"></div>
          <div className="flex flex-col text-left">
            <span className="text-slate-300 font-bold">FSP Licensed</span>
            <span className="text-slate-500 text-xs">Regulated by the FSCA</span>
          </div>
        </div>
        <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed italic">
          &ldquo;+1 Rewards acts as a facilitator for community-based rewards. All healthcare policies are underwritten and managed by Day1 Health (Pty) Ltd, an authorized financial services provider.&rdquo;
        </p>
      </div>
    </section>
  )
}