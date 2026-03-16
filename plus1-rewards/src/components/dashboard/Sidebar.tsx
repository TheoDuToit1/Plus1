// plus1-rewards/src/components/dashboard/Sidebar.tsx
import { useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const getLinkClasses = (path: string) => {
    return isActive(path)
      ? "flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary group"
      : "flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 hover:text-primary transition-colors";
  };

  const getTextClasses = (path: string) => {
    return isActive(path) ? "text-sm font-semibold" : "text-sm font-medium";
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-50 dark:bg-background-dark/50 overflow-y-auto hidden md:block" style={{borderRight: '0.2px solid rgba(17, 212, 82, 0.1)'}}>
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
          <span className="material-symbols-outlined font-bold">add</span>
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">+1 Rewards</h2>
      </div>
      
      <nav className="px-4 space-y-1">
        <a className={getLinkClasses('/admin/dashboard')} href="/admin/dashboard">
          <span className="material-symbols-outlined">dashboard</span>
          <span className={getTextClasses('/admin/dashboard')}>Overview</span>
        </a>
        
        <a className={getLinkClasses('/admin/members')} href="/admin/members">
          <span className="material-symbols-outlined">group</span>
          <span className={getTextClasses('/admin/members')}>Members</span>
        </a>
        
        <a className={getLinkClasses('/admin/shops')} href="/admin/shops">
          <span className="material-symbols-outlined">storefront</span>
          <span className={getTextClasses('/admin/shops')}>Shops</span>
        </a>
        
        <a className={getLinkClasses('/admin/agents')} href="/admin/agents">
          <span className="material-symbols-outlined">support_agent</span>
          <span className={getTextClasses('/admin/agents')}>Agents</span>
        </a>
        
        <a className={getLinkClasses('/admin/providers')} href="/admin/providers">
          <span className="material-symbols-outlined">handshake</span>
          <span className={getTextClasses('/admin/providers')}>Policy Providers</span>
        </a>
        
        <a className={getLinkClasses('/admin/policies')} href="/admin/policies">
          <span className="material-symbols-outlined">description</span>
          <span className={getTextClasses('/admin/policies')}>Policies</span>
        </a>
        
        <a className={getLinkClasses('/admin/transactions')} href="/admin/transactions">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className={getTextClasses('/admin/transactions')}>Transactions</span>
        </a>
      </nav>
      
      <div className="mt-10 px-4">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">System Health</p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">All Entities Active</span>
            <span className="text-xs font-bold text-primary">100%</span>
          </div>
          <div className="w-full bg-primary/10 rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
