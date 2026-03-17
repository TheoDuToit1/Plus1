// src/components/shop/components/RecentTransactions.tsx
interface Transaction {
  id: string;
  member_id: string;
  purchase_amount: number;
  member_reward: number;
  created_at: string;
  status: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col rounded-2xl bg-[#162d1e] border border-[#1a3324] overflow-hidden shadow-2xl" style={{ borderWidth: '0.2px' }}>
      <div className="px-6 py-4 border-b border-[#1a3324] flex justify-between items-center bg-[#193322]" style={{ borderWidth: '0.2px' }}>
        <h3 className="text-white font-bold">Recent Transactions</h3>
        <button className="text-primary text-xs font-bold uppercase tracking-widest hover:text-primary/80 transition-colors">See All</button>
      </div>
      {transactions.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="size-16 rounded-full bg-[#0a1a10] flex items-center justify-center border-2 border-dashed border-[#1a3324]">
            <span className="material-symbols-outlined text-slate-400 text-3xl">receipt_long</span>
          </div>
          <div>
            <p className="text-white font-semibold">No transactions yet today</p>
            <p className="text-slate-400 text-sm">Once you issue rewards, they will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-[#1a3324]">
          {transactions.slice(0, 10).map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-[#193322]/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">shopping_cart</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">R{transaction.purchase_amount.toFixed(2)} Purchase</p>
                    <p className="text-slate-400 text-xs">{formatDate(transaction.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold">+R{transaction.member_reward.toFixed(2)}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    transaction.status === 'synced' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {transaction.status === 'synced' ? '✓ Synced' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
