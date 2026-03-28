// src/components/provider/components/FinancialSummary.tsx
import React from 'react';

interface FinancialSummaryProps {
  expectedRevenue?: string;
  paidToDate?: string;
  reconciliationPercent?: number;
}

export default function FinancialSummary({
  expectedRevenue = 'R85,545',
  paidToDate = 'R82,100',
  reconciliationPercent = 96,
}: FinancialSummaryProps) {
  return (
    <div className="flex flex-col items-stretch justify-start rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b from-[#1a4d2e] via-[#0f2818] to-[#0a1a10] border border-[#1a3324] relative">
      <div className="absolute -top-12 -right-12 opacity-10">
        <span className="material-symbols-outlined text-primary block" style={{ fontSize: '180px', fontVariationSettings: '"FILL" 0, "wght" 200' }}>account_balance</span>
      </div>
      <div className="flex flex-col p-6 gap-4 relative z-10">
        <h3 className="text-white text-lg font-bold flex items-center gap-2 border-b border-[#1a3324] pb-4">
          <span className="material-symbols-outlined text-primary">account_balance</span> Financial Summary
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center group">
            <span className="text-slate-400 text-sm font-medium">Expected Revenue</span>
            <span className="text-white font-mono font-bold">{expectedRevenue}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="text-slate-400 text-sm font-medium">Paid To Date</span>
            <span className="text-primary font-mono font-bold">{paidToDate}</span>
          </div>
          <div className="relative pt-2">
            <div className="h-2 w-full bg-[#1a3324] rounded-full">
              <div className="h-2 bg-primary rounded-full" style={{ width: `${reconciliationPercent}%` }}></div>
            </div>
            <p className="text-[10px] text-primary/70 mt-2 font-bold uppercase tracking-widest text-right">
              {reconciliationPercent}% Reconciled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
