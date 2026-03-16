// plus1-rewards/src/components/mobile/BottomNav.tsx
export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-primary/10 bg-background-dark/95 backdrop-blur-md px-4 pb-6 pt-2">
      <a className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" href="#">
        <span className="material-symbols-outlined fill-1">home</span>
        <p className="text-[10px] font-bold uppercase tracking-widest">Home</p>
      </a>
      <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500" href="#">
        <span className="material-symbols-outlined">loyalty</span>
        <p className="text-[10px] font-bold uppercase tracking-widest">Rewards</p>
      </a>
      <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500" href="#">
        <span className="material-symbols-outlined">storefront</span>
        <p className="text-[10px] font-bold uppercase tracking-widest">Partners</p>
      </a>
      <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500" href="#">
        <span className="material-symbols-outlined">person</span>
        <p className="text-[10px] font-bold uppercase tracking-widest">Profile</p>
      </a>
    </nav>
  );
}
