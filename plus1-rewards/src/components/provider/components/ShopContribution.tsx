// src/components/provider/components/ShopContribution.tsx
import React from 'react';

interface ShopContributionProps {
  percentage?: number;
  description?: string;
}

export default function ShopContribution({
  percentage = 75,
  description = 'In-shop promotions continue to drive the highest volume of Day-to-Day policy activations this quarter.',
}: ShopContributionProps) {
  return (
    <div className="flex flex-col items-stretch justify-start rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b from-[#1a4d2e] via-[#0f2818] to-[#0a1a10] border border-[#1a3324] relative p-6 space-y-4">
      <div className="absolute -top-12 -right-12 opacity-10">
        <span className="material-symbols-outlined text-primary block" style={{ fontSize: '180px', fontVariationSettings: '"FILL" 0, "wght" 200' }}>shopping_bag</span>
      </div>
      <div className="relative z-10">
        <h3 className="text-white text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">shopping_bag</span> Shop Contribution
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="relative size-40">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
              <circle className="stroke-[#1a3324]" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
              <circle
                className="stroke-primary transition-all duration-500"
                cx="18"
                cy="18"
                fill="none"
                r="16"
                strokeDasharray={`${percentage * 1.005}, 100`}
                strokeLinecap="round"
                strokeWidth="3"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-3xl font-black">{percentage}%</span>
              <span className="text-slate-400 text-xs font-semibold mt-1">Contribution</span>
            </div>
          </div>
        </div>
        <p className="text-slate-400 text-xs text-center leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
