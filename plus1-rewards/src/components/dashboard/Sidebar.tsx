// plus1-rewards/src/components/dashboard/Sidebar.tsx
import { useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const getLinkClasses = (path: string) => {
    return isActive(path)
      ? "flex items-center gap-3 px-3 py-2 rounded-lg bg-[#1a558b]/10 text-[#1a558b] group"
      : "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#1a558b] transition-colors";
  };

  const getTextClasses = (path: string) => {
    return isActive(path) ? "text-sm font-semibold" : "text-sm font-medium";
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="size-8 bg-[#1a558b] rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined font-bold">add</span>
        </div>
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900">+1 Rewards</h2>
      </div>
      
      <nav className="px-4 space-y-1">
        <a className={getLinkClasses('/admin/dashboard')} href="/admin/dashboard">
          <span className="material-symbols-outlined">dashboard</span>
          <span className={getTextClasses('/admin/dashboard')}>Dashboard Home</span>
        </a>
        
        <a className={getLinkClasses('/admin/approvals')} href="/admin/approvals">
          <span className="material-symbols-outlined">approval</span>
          <span className={getTextClasses('/admin/approvals')}>Approvals</span>
        </a>
        
        <a className={getLinkClasses('/admin/members')} href="/admin/members">
          <span className="material-symbols-outlined">group</span>
          <span className={getTextClasses('/admin/members')}>Members</span>
        </a>
        
        <a className={getLinkClasses('/admin/cover-plans')} href="/admin/cover-plans">
          <span className="material-symbols-outlined">health_and_safety</span>
          <span className={getTextClasses('/admin/cover-plans')}>Member Cover Plans</span>
        </a>
        
        <a className={getLinkClasses('/admin/partners')} href="/admin/partners">
          <span className="material-symbols-outlined">storefront</span>
          <span className={getTextClasses('/admin/partners')}>Partners</span>
        </a>
        
        <a className={getLinkClasses('/admin/invoices')} href="/admin/invoices">
          <span className="material-symbols-outlined">receipt</span>
          <span className={getTextClasses('/admin/invoices')}>Partner Billing</span>
        </a>
        
        <a className={getLinkClasses('/admin/agents')} href="/admin/agents">
          <span className="material-symbols-outlined">support_agent</span>
          <span className={getTextClasses('/admin/agents')}>Agents</span>
        </a>
        
        <a className={getLinkClasses('/admin/commissions')} href="/admin/commissions">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className={getTextClasses('/admin/commissions')}>Agent Commission</span>
        </a>
        
        <a className={getLinkClasses('/admin/providers')} href="/admin/providers">
          <span className="material-symbols-outlined">business</span>
          <span className={getTextClasses('/admin/providers')}>Providers</span>
        </a>
        
        <a className={getLinkClasses('/admin/transactions')} href="/admin/transactions">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className={getTextClasses('/admin/transactions')}>Transactions</span>
        </a>
        
        <a className={getLinkClasses('/admin/disputes')} href="/admin/disputes">
          <span className="material-symbols-outlined">report_problem</span>
          <span className={getTextClasses('/admin/disputes')}>Disputes</span>
        </a>
        
        <a className={getLinkClasses('/admin/top-ups')} href="/admin/top-ups">
          <span className="material-symbols-outlined">add_card</span>
          <span className={getTextClasses('/admin/top-ups')}>Top-Ups</span>
        </a>
        
        <a className={getLinkClasses('/admin/exports')} href="/admin/exports">
          <span className="material-symbols-outlined">upload_file</span>
          <span className={getTextClasses('/admin/exports')}>Exports</span>
        </a>
        
        <a className={getLinkClasses('/admin/audit-logs')} href="/admin/audit-logs">
          <span className="material-symbols-outlined">history</span>
          <span className={getTextClasses('/admin/audit-logs')}>Audit Logs</span>
        </a>
        
        <a className={getLinkClasses('/admin/settings')} href="/admin/settings">
          <span className="material-symbols-outlined">settings</span>
          <span className={getTextClasses('/admin/settings')}>Settings / Config</span>
        </a>
      </nav>
      
      <div className="mt-10 px-4">
        <div className="p-4 rounded-xl bg-[#1a558b]/5 border border-[#1a558b]/10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#1a558b] mb-2">System Health</p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">All Entities Active</span>
            <span className="text-xs font-bold text-[#1a558b]">100%</span>
          </div>
          <div className="w-full bg-[#1a558b]/10 rounded-full h-1.5">
            <div className="bg-[#1a558b] h-1.5 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
