// plus1-rewards/src/components/dashboard/PlatformStatus.tsx
import { useEffect, useState } from 'react';
import { supabaseAdmin } from '../../lib/supabase';

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
      const { data: transactionData } = await supabaseAdmin
        .from('transactions')
        .select('status');
      
      const totalTransactions = transactionData?.length || 0;
      const pendingTransactions = transactionData?.filter(t => t.status === 'pending_sync').length || 0;

      // Fetch overdue invoices
      const { data: invoiceData } = await supabaseAdmin
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
          <span className="material-symbols-outlined text-[#1a558b]">hub</span>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Platform Status</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 rounded-xl text-center animate-pulse bg-white border border-gray-200">
              <div className="h-8 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[#1a558b]">hub</span>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Platform Status</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl text-center bg-white border border-gray-200">
          <p className="text-3xl font-black mb-1 text-gray-900">{platformData.totalTransactions}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Transactions</p>
        </div>
        
        <div className="p-5 rounded-xl text-center bg-white border border-gray-200">
          <p className={`text-3xl font-black mb-1 ${platformData.overdueInvoices > 0 ? 'text-red-500' : 'text-gray-900'}`}>{platformData.overdueInvoices}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Overdue</p>
        </div>
        
        <div className="p-5 rounded-xl text-center bg-white border border-gray-200">
          <p className={`text-3xl font-black mb-1 ${platformData.pendingTransactions > 0 ? 'text-yellow-500' : 'text-gray-900'}`}>{platformData.pendingTransactions}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Pending</p>
        </div>
        
        <div className={`p-5 rounded-xl text-center ${platformData.systemHealth >= 90 ? 'bg-[#1a558b]/10 border-[#1a558b]' : platformData.systemHealth >= 70 ? 'bg-yellow-500/10 border-yellow-500' : 'bg-red-500/10 border-red-500'} border`}>
          <p className={`text-3xl font-black mb-1 ${platformData.systemHealth >= 90 ? 'text-[#1a558b]' : platformData.systemHealth >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>{platformData.systemHealth}%</p>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${platformData.systemHealth >= 90 ? 'text-[#1a558b]' : platformData.systemHealth >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>Health</p>
        </div>
      </div>
    </section>
  );
}
