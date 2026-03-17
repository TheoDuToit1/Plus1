// plus1-rewards/src/components/member/MemberFooter.tsx
export default function MemberFooter() {
  return (
    <footer className="border-t border-border-muted mt-12 px-6 py-10 bg-background-dark">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 text-primary/50">
          <span className="material-symbols-outlined">health_metrics</span>
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="material-symbols-outlined">verified_user</span>
        </div>
        <p className="text-slate-500 text-sm font-medium text-center leading-relaxed">
          © 2026 +1 Rewards · Shop. Earn. Cover your health.<br/>
          <span className="text-[10px] text-slate-600 mt-1 block uppercase tracking-widest">Built for the future of healthcare rewards</span>
        </p>
        <div className="flex gap-6 text-slate-500 text-xs font-bold">
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms</a>
          <a className="hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}
