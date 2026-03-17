// plus1-rewards/src/components/dashboard/PlatformStatus.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface PlatformData {
  totalTransactions: number;
  overdueInvoices: number;
  pendingTransactions: number;
  systemHealth: number;
}

export default function PlatformStatus() {
  const [platformData, setPlatformData] = useState<PlatformData>({
    totalTransactions: 0,
    overdueInvoices: 0,
    pendingTransactions: 0,
    systemHealth: 100,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const fetchPlatformData = async () => {
    try {
      setLoading(true);

      // Fetch transaction data
      const { data: transactionData } = await supabase
        .from('transactions')
        .select('status');
      
      const totalTransactions = transactionData?.length || 0;
      const pendingTransactions = transactionData?.filter(t => t.status === 'pending_sync').length || 0;

      // Fetch overdue invoices
      const { data: invoiceData } = await supabase
        .from('monthly_invoices')
        .select('status, due_date')
        .eq('status', 'overdue');
      
      const overdueInvoices = invoiceData?.length || 0;

      // Calculate system health (simple metric based on pending vs total)
      let systemHealth = 100;
      if (totalTransactions > 0) {
        const pendingRatio = pendingTransactions / totalTransactions;
        systemHealth = Math.max(0, Math.round((1 - pendingRatio) * 100));
      }

      setPlatformData({
        totalTransactions,
        overdueInvoices,
        pendingTransactions,
        systemHealth,
      });
    } catch (error) {
      console.error('Error fetching platform data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">hub</span>
          <h2 className="text-xl font-bold tracking-tight">Platform Status</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 rounded-xl text-center animate-pulse" style={{backgroundColor: '#10351c', border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">hub</span>
        <h2 className="text-xl font-bold tracking-tight">Platform Status</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl text-center" style={{backgroundColor: '#10351c', border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <p className="text-3xl font-black mb-1">{platformData.totalTransactions}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Transactions</p>
        </div>
        
        <div className="p-5 rounded-xl text-center" style={{backgroundColor: '#10351c', border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <p className={`text-3xl font-black mb-1 ${platformData.overdueInvoices > 0 ? 'text-red-400' : ''}`}>{platformData.overdueInvoices}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Overdue</p>
        </div>
        
        <div className="p-5 rounded-xl text-center" style={{backgroundColor: '#10351c', border: '0.2px solid rgba(148, 163, 184, 0.2)'}}>
          <p className={`text-3xl font-black mb-1 ${platformData.pendingTransactions > 0 ? 'text-yellow-400' : ''}`}>{platformData.pendingTransactions}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pending</p>
        </div>
        
        <div className={`p-5 rounded-xl text-center ${platformData.systemHealth >= 90 ? 'bg-primary/20' : platformData.systemHealth >= 70 ? 'bg-yellow-500/20' : 'bg-red-500/20'}`} style={{border: `0.2px solid ${platformData.systemHealth >= 90 ? 'rgba(17, 212, 82, 0.3)' : platformData.systemHealth >= 70 ? 'rgba(234, 179, 8, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`}}>
          <p className={`text-3xl font-black mb-1 ${platformData.systemHealth >= 90 ? 'text-primary' : platformData.systemHealth >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>{platformData.systemHealth}%</p>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${platformData.systemHealth >= 90 ? 'text-primary/80' : platformData.systemHealth >= 70 ? 'text-yellow-500/80' : 'text-red-500/80'}`}>Health</p>
        </div>
      </div>
    </section>
  );
}
