// plus1-rewards/src/components/landing/Hero.tsx
export default function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden px-6 lg:px-20 min-h-screen">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent z-10"></div>
        <img 
          alt="Diverse South African community interaction" 
          className="w-full h-full object-cover" 
          data-alt="Group of diverse South Africans smiling together" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfha4EBtr84DEQA3YUQQlyyGe9JSEYyv2QGO_dbyr4evkRYCmACGBW1m-NAIk_6WliSU0YtVSXBJ3k40ojpkqsN_ACJQdbO747qnhGTF7tD_juouqyHB0bKcj6SJPg-qWe4h_wdZsuZ4-YdY8R_PtBnzT7n4_sSqH_dGgii_EiXBvJZzFPeIKkaE4Cw3HMrtOKMs3QfKP6sddvqtgoKq34z3i2EJ7V5aNyZlfJNbGvEFgR7sRq_UDp9n41TnNif2xffMJfEPReOiui" 
        />
      </div>
      <div className="relative z-20 max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              Revolutionizing Healthcare
            </span>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white">
              Shop. Earn. <br/><span className="text-primary underline decoration-primary/30 underline-offset-8">Cover your health.</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-300 max-w-lg leading-relaxed">
              The innovative rewards program that turns your everyday grocery shopping into comprehensive healthcare coverage for your family.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-primary hover:bg-primary/90 text-background-dark px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
              Get Started Now
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}