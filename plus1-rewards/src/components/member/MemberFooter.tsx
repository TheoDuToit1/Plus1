// plus1-rewards/src/components/member/MemberFooter.tsx
export default function MemberFooter() {
  return (
    <footer className="border-t border-gray-200 mt-12 px-6 py-10 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 text-[#1a558b]/50">
          <span className="material-symbols-outlined">health_metrics</span>
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="material-symbols-outlined">verified_user</span>
        </div>
        <p className="text-gray-600 text-sm font-medium text-center leading-relaxed">
          © 2026 +1 Rewards · partner. Earn. Cover your health.<br/>
          <span className="text-[10px] text-gray-500 mt-1 block uppercase tracking-widest">Built for the future of healthcare rewards</span>
        </p>
        <div className="flex gap-6 text-gray-600 text-xs font-bold">
          <a className="hover:text-[#1a558b] transition-colors" href="#">Privacy</a>
          <a className="hover:text-[#1a558b] transition-colors" href="#">Terms</a>
          <a className="hover:text-[#1a558b] transition-colors" href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}
