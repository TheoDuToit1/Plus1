// plus1-rewards/src/components/dashboard/QuickActions.tsx
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();

  const handleAction = (action: string) => {
    switch (action) {
      case 'invoices':
        // Navigate to shops page where invoices can be managed
        navigate('/admin/shops');
        break;
      case 'suspensions':
        // Navigate to members page for account management
        navigate('/admin/members');
        break;
      case 'payouts':
        // Navigate to agents page for commission management
        navigate('/admin/agents');
        break;
      case 'export':
        // Trigger export functionality
        handleExport();
        break;
      case 'providers':
        // Navigate to policy providers page
        navigate('/admin/providers');
        break;
      case 'policies':
        // Navigate to policies page
        navigate('/admin/policies');
        break;
      case 'transactions':
        // Navigate to transactions page
        navigate('/admin/transactions');
        break;
      case 'members':
        // Navigate to members page
        navigate('/admin/members');
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  const handleExport = async () => {
    try {
      // This would typically generate and download a CSV/Excel file
      // For now, we'll show a notification
      alert('Export functionality will be implemented. This would generate a CSV/Excel file with system data.');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">bolt</span>
        <h2 className="text-xl font-bold tracking-tight">Quick Actions</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <button 
          onClick={() => handleAction('invoices')}
          className="flex items-center justify-between w-full p-4 bg-white dark:bg-background-dark/60 rounded-xl hover:border-primary transition-all group text-left" 
          style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}
        >
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
              <span className="material-symbols-outlined">receipt</span>
            </div>
            <div>
              <p className="font-bold text-sm">Generate Invoices</p>
              <p className="text-[11px] text-slate-500">Bulk process billing</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all">chevron_right</span>
        </button>
        
        <button 
          onClick={() => handleAction('suspensions')}
          className="flex items-center justify-between w-full p-4 bg-white dark:bg-background-dark/60 rounded-xl hover:border-primary transition-all group text-left" 
          style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}
        >
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
              <span className="material-symbols-outlined">block</span>
            </div>
            <div>
              <p className="font-bold text-sm">Manage Suspensions</p>
              <p className="text-[11px] text-slate-500">Handle restricted accounts</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all">chevron_right</span>
        </button>
        
        <button 
          onClick={() => handleAction('payouts')}
          className="flex items-center justify-between w-full p-4 bg-white dark:bg-background-dark/60 rounded-xl hover:border-primary transition-all group text-left" 
          style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}
        >
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
              <span className="material-symbols-outlined">paid</span>
            </div>
            <div>
              <p className="font-bold text-sm">Agent Payouts</p>
              <p className="text-[11px] text-slate-500">Process commission batch</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all">chevron_right</span>
        </button>
        
        <button 
          onClick={() => handleAction('export')}
          className="flex items-center justify-between w-full p-4 bg-white dark:bg-background-dark/60 rounded-xl hover:border-primary transition-all group text-left" 
          style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}
        >
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
              <span className="material-symbols-outlined">ios_share</span>
            </div>
            <div>
              <p className="font-bold text-sm">Export System Data</p>
              <p className="text-[11px] text-slate-500">CSV/Excel system export</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all">chevron_right</span>
        </button>
        
        <button 
          onClick={() => handleAction('providers')}
          className="flex items-center justify-between w-full p-4 bg-white dark:bg-background-dark/60 rounded-xl hover:border-primary transition-all group text-left" 
          style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}
        >
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
              <span className="material-symbols-outlined">corporate_fare</span>
            </div>
            <div>
              <p className="font-bold text-sm">Policy Providers</p>
              <p className="text-[11px] text-slate-500">Edit insurance partners</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all">chevron_right</span>
        </button>
        
        <button 
          onClick={() => handleAction('policies')}
          className="flex items-center justify-between w-full p-4 bg-white dark:bg-background-dark/60 rounded-xl hover:border-primary transition-all group text-left" 
          style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}
        >
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
              <span className="material-symbols-outlined">settings_suggest</span>
            </div>
            <div>
              <p className="font-bold text-sm">Policy Management</p>
              <p className="text-[11px] text-slate-500">Configuration &amp; pricing</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all">chevron_right</span>
        </button>
        
        <button 
          onClick={() => handleAction('transactions')}
          className="flex items-center justify-between w-full p-4 bg-white dark:bg-background-dark/60 rounded-xl hover:border-primary transition-all" 
          style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}
        >
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
              <span className="material-symbols-outlined">monitoring</span>
            </div>
            <div>
              <p className="font-bold text-sm">Transaction Monitor</p>
              <p className="text-[11px] text-slate-500">Real-time flow audit</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all">chevron_right</span>
        </button>
        
        <button 
          onClick={() => handleAction('members')}
          className="flex items-center justify-between w-full p-4 bg-white dark:bg-background-dark/60 rounded-xl hover:border-primary transition-all group text-left" 
          style={{border: '0.2px solid rgba(148, 163, 184, 0.2)'}}
        >
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
              <span className="material-symbols-outlined">person_search</span>
            </div>
            <div>
              <p className="font-bold text-sm">Member Management</p>
              <p className="text-[11px] text-slate-500">Profiles &amp; rewards history</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
