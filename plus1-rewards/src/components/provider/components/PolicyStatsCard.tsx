// src/components/provider/components/PolicyStatsCard.tsx
import React from 'react';

interface PolicyStatsCardProps {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  trendIcon?: string;
  trendColor?: string;
  subtitle?: string;
  isPrimary?: boolean;
  progressValue?: number;
}

export default function PolicyStatsCard({
  label,
  value,
  icon,
  trend,
  trendIcon,
  trendColor = 'text-primary',
  subtitle,
  isPrimary = false,
  progressValue,
}: PolicyStatsCardProps) {
  if (isPrimary) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl p-6 bg-gradient-to-b from-[#1a4d2e] via-[#0f2818] to-[#0a1a10] border border-[#1a3324] group shadow-lg relative overflow-hidden">
        <div className="absolute -top-12 -right-12 opacity-10">
          <span className="material-symbols-outlined text-primary block" style={{ fontSize: '180px', fontVariationSettings: '"FILL" 0, "wght" 200' }}>
            {icon}
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-primary text-xs font-bold uppercase tracking-wider">{label}</p>
          <p className="text-white text-3xl font-black mt-2">{value}</p>
          {progressValue !== undefined && (
            <div className="mt-4 w-full bg-[#1a3324] h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: `${progressValue}%` }}></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl p-6 bg-gradient-to-b from-[#1a4d2e] via-[#0f2818] to-[#0a1a10] border border-[#1a3324] hover:border-primary/40 transition-all group shadow-lg relative overflow-hidden">
      <div className="absolute -top-12 -right-12 opacity-10">
        <span className="material-symbols-outlined text-primary block" style={{ fontSize: '180px', fontVariationSettings: '"FILL" 0, "wght" 200' }}>
          {icon}
        </span>
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <p className="text-primary text-xs font-bold uppercase tracking-wider">{label}</p>
          <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
            {icon}
          </span>
        </div>
        <p className="text-white text-3xl font-black mt-2">{value}</p>
        {subtitle && <p className="mt-2 text-slate-400 text-xs font-medium italic leading-none">{subtitle}</p>}
        {trend && (
          <div className={`mt-2 ${trendColor} text-xs font-semibold flex items-center gap-1`}>
            {trendIcon && <span className="material-symbols-outlined text-xs">{trendIcon}</span>}
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
