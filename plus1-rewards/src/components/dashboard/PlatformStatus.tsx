// plus1-rewards/src/components/dashboard/PlatformStatus.tsx
export default function PlatformStatus() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">hub</span>
        <h2 className="text-xl font-bold tracking-tight">Platform Status</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl text-center" style={{backgroundColor: '#10351c', border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <p className="text-3xl font-black mb-1">0</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Transactions</p>
        </div>
        
        <div className="p-5 rounded-xl text-center" style={{backgroundColor: '#10351c', border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <p className="text-3xl font-black mb-1">0</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Overdue</p>
        </div>
        
        <div className="p-5 rounded-xl text-center" style={{backgroundColor: '#10351c', border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <p className="text-3xl font-black mb-1">0</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pending</p>
        </div>
        
        <div className="bg-primary/20 p-5 rounded-xl text-center" style={{border: '0.2px solid rgba(17, 212, 82, 0.3)'}}>
          <p className="text-3xl font-black text-primary mb-1">100%</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Health</p>
        </div>
      </div>
    </section>
  );
}
