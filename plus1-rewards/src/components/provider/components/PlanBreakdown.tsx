// src/components/provider/components/PlanBreakdown.tsx
import React from 'react';

interface PlanRow {
  planType: string;
  policies: number;
  grossValue: number;
  payoutValue: number;
  status: string;
}

interface PlanBreakdownProps {
  plans?: PlanRow[];
}

export default function PlanBreakdown({ plans }: PlanBreakdownProps) {
  const defaultPlans: PlanRow[] = [
    {
      planType: 'Day-to-Day Single',
      policies: 0,
      grossValue: 0,
      payoutValue: 0,
      status: 'Active',
    },
  ];

  const displayPlans = plans && plans.length > 0 ? plans : defaultPlans;

  const handleViewAllPlans = () => {
    console.log('View All Plans clicked');
  };

  return (
    <section className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">list_alt</span> Plan Breakdown
        </h2>
        <button onClick={handleViewAllPlans} className="text-primary text-sm font-semibold hover:underline">
          View All Plans
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#1a3324] bg-gradient-to-b from-[#1a4d2e] via-[#0f2818] to-[#0a1a10] shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0f2818] border-b border-[#1a3324]">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">Plan Type</th>
              <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">Policies</th>
              <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">Gross Value</th>
              <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">90% Payout</th>
              <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a3324]">
            {displayPlans.map((plan, index) => (
              <tr key={index} className="hover:bg-[#1a3324]/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-semibold text-white">{plan.planType}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{plan.policies}</td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">R{plan.grossValue.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-primary font-bold font-mono">R{plan.payoutValue.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                    {plan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
