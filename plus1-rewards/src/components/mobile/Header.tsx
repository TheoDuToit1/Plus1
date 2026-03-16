// plus1-rewards/src/components/mobile/Header.tsx
export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center bg-background-dark/90 backdrop-blur-md p-4 justify-between border-b border-primary/10">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-3xl">add_circle</span>
        <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight">+1 Rewards</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined text-slate-100">search</span>
        </button>
        <button className="flex items-center justify-center p-2 rounded-full bg-primary text-background-dark">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
