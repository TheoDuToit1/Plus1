// src/components/shop/components/WelcomeSection.tsx
import { useState } from 'react';

interface WelcomeSectionProps {
  shopName?: string;
  shopId?: string;
}

export default function WelcomeSection({ shopName = 'Shop Owner', shopId }: WelcomeSectionProps) {
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const handleTransactionHistory = () => {
    setShowTransactionHistory(true);
    alert('Opening Transaction History...\n\nThis will show all your transactions for the selected period.');
  };

  const handleMonthlyInvoice = () => {
    setShowInvoice(true);
    alert('Opening Monthly Invoice...\n\nThis will show your billing summary for the current month.');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Welcome back, {shopName}</p>
        <div className="flex items-center gap-2">
          <span className="text-primary text-sm font-medium px-2 py-0.5 bg-primary/10 rounded border border-primary/30" style={{ borderWidth: '0.2px' }}>Shop ID: {shopId?.substring(0, 8).toUpperCase() || 'N/A'}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleTransactionHistory}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#1a3324] border border-[#1a3324] rounded-lg text-sm font-medium text-white hover:bg-[#23482f] transition-colors" 
          style={{ borderWidth: '0.2px' }}
          title="View all transactions"
        >
          <span className="material-symbols-outlined text-sm">history</span>
          Transaction History
        </button>
        <button
          onClick={handleMonthlyInvoice}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#1a3324] border border-[#1a3324] rounded-lg text-sm font-medium text-white hover:bg-[#23482f] transition-colors" 
          style={{ borderWidth: '0.2px' }}
          title="View monthly invoice"
        >
          <span className="material-symbols-outlined text-sm">description</span>
          Monthly Invoice
        </button>
      </div>
    </div>
  );
}
