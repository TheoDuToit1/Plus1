// plus1-rewards/src/components/landing/Navbar.tsx
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-primary/10 bg-background-dark/80 backdrop-blur-md px-6 lg:px-20 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-3xl">add_circle</span>
          <span className="text-xl font-extrabold tracking-tight text-slate-100">+1 Rewards</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a className="hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
          <a className="hover:text-primary transition-colors" href="#roles">Roles</a>
          <a className="hover:text-primary transition-colors" href="#features">Offline Tech</a>
          <a className="hover:text-primary transition-colors" href="#faq">FAQ</a>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-background-dark px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20">
          Get Started
        </button>
      </div>
    </nav>
  )
}