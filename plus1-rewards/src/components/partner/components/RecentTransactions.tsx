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
    <div className="flex flex-col rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="text-gray-900 font-bold">Recent Transactions</h3>
        <button className="text-[#1a558b] text-xs font-bold uppercase tracking-widest hover:text-[#1a558b]/80 transition-colors">See All</button>
      </div>
      {transactions.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
            <span className="material-symbols-outlined text-gray-400 text-3xl">receipt_long</span>
          </div>
          <div>
            <p className="text-gray-900 font-semibold">No transactions yet today</p>
            <p className="text-gray-600 text-sm">Once you issue rewards, they will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {transactions.slice(0, 10).map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-[#1a558b]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#1a558b] text-sm">shopping_cart</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">R{transaction.purchase_amount.toFixed(2)} Purchase</p>
                    <p className="text-gray-600 text-xs">{formatDate(transaction.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#1a558b] font-bold">+R{transaction.member_reward.toFixed(2)}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    transaction.status === 'synced' 
                      ? 'bg-[#1a558b]/10 text-[#1a558b]' 
                      : 'bg-yellow-50 text-yellow-600'
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
