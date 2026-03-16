// plus1-rewards/src/components/landing/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-background-dark border-t border-primary/10 py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-primary mb-6">
              <span className="material-symbols-outlined text-3xl">add_circle</span>
              <span className="text-xl font-extrabold tracking-tight text-slate-100">+1 Rewards</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              Bridging the gap between daily commerce and universal healthcare access for all South Africans.
            </p>
            <div className="flex gap-4">
              <a className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all" href="#">
                <span className="material-symbols-outlined">social_leaderboard</span>
              </a>
              <a className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all" href="#">
                <span className="material-symbols-outlined">share</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a className="hover:text-primary transition-colors" href="#">How it Works</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Partner Stores</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Become an Agent</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Day1 Health Details</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Insurance Disclosure</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">FAQ</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}