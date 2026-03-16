// plus1-rewards/src/components/dashboard/StatsCards.tsx
export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">group</span>
          <span className="text-[10px] font-bold py-0.5 px-2 rounded bg-primary/10 text-primary uppercase">Active</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Members</p>
        <h3 className="text-3xl font-black mt-1">1</h3>
        <p className="text-[11px] text-slate-400 mt-2">1 with QR codes issued</p>
      </div>
      
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">storefront</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Shops</p>
        <h3 className="text-3xl font-black mt-1">1</h3>
        <p className="text-[11px] text-slate-400 mt-2">1 active, 0 suspended</p>
      </div>
      
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-slate-400 bg-slate-400/10 p-2 rounded-lg">support_agent</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Agents</p>
        <h3 className="text-3xl font-black mt-1 text-slate-400">0</h3>
        <p className="text-[11px] text-slate-400 mt-2">Sales representatives</p>
      </div>
      
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">handshake</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Policy Providers</p>
        <h3 className="text-3xl font-black mt-1">1</h3>
        <p className="text-[11px] text-slate-400 mt-2">Insurance partners</p>
      </div>
      
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-slate-400 bg-slate-400/10 p-2 rounded-lg">description</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Policies</p>
        <h3 className="text-3xl font-black mt-1 text-slate-400">0</h3>
        <p className="text-[11px] text-slate-400 mt-2">0 active globally</p>
      </div>
      
      <div className="bg-white dark:bg-background-dark/40 p-5 rounded-xl" style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-slate-400 bg-slate-400/10 p-2 rounded-lg">pending_actions</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">In Progress</p>
        <h3 className="text-3xl font-black mt-1 text-slate-400">0</h3>
        <p className="text-[11px] text-slate-400 mt-2">Being funded</p>
      </div>
    </div>
  );
}
