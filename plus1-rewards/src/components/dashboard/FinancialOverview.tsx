// plus1-rewards/src/components/dashboard/FinancialOverview.tsx
export default function FinancialOverview() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">monetization_on</span>
        <h2 className="text-xl font-bold tracking-tight">Financial Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Total Policy Value</p>
            <p className="text-2xl font-black mt-1">R0.00</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Monthly premiums</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/5 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">payments</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Total Funded</p>
            <p className="text-2xl font-black mt-1">R0.00</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Via rewards pool</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/5 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">wallet</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Revenue This Month</p>
            <p className="text-2xl font-black mt-1 text-primary">R0.00</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Platform fees collected</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">analytics</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">All-Time Revenue</p>
            <p className="text-2xl font-black mt-1">R0.00</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Total platform fees</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/5 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">history_edu</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Total Rewards Issued</p>
            <p className="text-2xl font-black mt-1">R0.00</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Allocated to members</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/5 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">stars</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-background-dark/40 p-6 rounded-xl flex items-center justify-between" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Agent Commissions</p>
            <p className="text-2xl font-black mt-1">R0.00</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">Total paid out</p>
          </div>
          <div className="size-10 flex items-center justify-center rounded-full bg-primary/5 text-primary" style={{border: '0.2px solid rgba(17, 212, 82, 0.2)'}}>
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
        </div>
      </div>
    </section>
  );
}
