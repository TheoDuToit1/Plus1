// plus1-rewards/src/components/landing/HowItWorks.tsx
export default function HowItWorks() {
  return (
    <section className="py-24 px-6 lg:px-20 bg-background-dark" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-white mb-4">How it works in 3 Simple Steps</h2>
          <p className="text-slate-400">Turning your daily spending into security has never been easier. We&apos;ve simplified the path to healthcare.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center group">
            <div className="size-20 rounded-full bg-primary flex items-center justify-center text-background-dark mb-6 relative z-10 border-8 border-background-dark">
              <span className="material-symbols-outlined text-4xl">storefront</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">1. Shop at partner stores</h3>
            <p className="text-slate-400 leading-relaxed">Visit any participating local retailer in your community for your regular shopping.</p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center group">
            <div className="size-20 rounded-full bg-primary flex items-center justify-center text-background-dark mb-6 relative z-10 border-8 border-background-dark">
              <span className="material-symbols-outlined text-4xl">qr_code_2</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">2. Earn 3% Rewards</h3>
            <p className="text-slate-400 leading-relaxed">Scan your unique QR code at checkout to earn 3% back on every single purchase.</p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="size-20 rounded-full bg-primary flex items-center justify-center text-background-dark mb-6 relative z-10 border-8 border-background-dark">
              <span className="material-symbols-outlined text-4xl">health_and_safety</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">3. Policy Activates at R385</h3>
            <p className="text-slate-400 leading-relaxed">Once your rewards reach R385, your Day1 Health coverage starts automatically.</p>
          </div>
          {/* Connector Line */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-primary/20 -z-0"></div>
        </div>
      </div>
    </section>
  )
}