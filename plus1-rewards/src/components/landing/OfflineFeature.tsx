// plus1-rewards/src/components/landing/OfflineFeature.tsx
export default function OfflineFeature() {
  return (
    <section className="py-24 px-6 lg:px-20 bg-background-dark relative overflow-hidden" id="features">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full"></div>
          <img 
            alt="Customer scanning QR code in a local shop" 
            className="rounded-3xl shadow-2xl relative z-10 border border-white/5" 
            data-alt="Close up of scanning QR code at counter" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrChp-rJw6gwciGLXkYyh6v8Sf0Pbu42DOiuN12h8xMQtitpDrR2WE68lVzoAwCjuvqsUf4ghwaRh3yCAFlJLn-9H5MM-I-mXllz59_xWXA74wV3UpnoT0mK-ST-F-4o0mVUcmvx6tV1aY8BwMfKw_DwOd9Fn5xJ0kzM99Q4pYZQ2zDzYXGNHL2xoDZJdZsw72j8f5S96nZUYAmgFB0AfrKpN5QkacJcNvO_LUiptUqTLUttbTqYi9E8WQ7_vYHdiWWE1FqwmMjtcB" 
          />
          <div className="absolute -bottom-6 -right-6 bg-primary p-6 rounded-2xl shadow-xl z-20 max-w-[200px]">
            <span className="material-symbols-outlined text-background-dark text-4xl mb-2">offline_pin</span>
            <p className="text-background-dark font-black text-lg leading-tight">Works 100% Offline</p>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">No data? No problem.</h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            Our proprietary QR technology is built for the African market. We know data can be expensive or unavailable. That&apos;s why our system works perfectly even when you&apos;re completely offline.
          </p>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <p className="text-slate-300">Instant validation without an active internet connection.</p>
            </div>
            <div className="flex gap-4">
              <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <p className="text-slate-300">Syncs automatically when your device finds a signal.</p>
            </div>
            <div className="flex gap-4">
              <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <p className="text-slate-300">Secure, encrypted transactions that protect your data.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}