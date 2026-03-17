// src/components/shop/components/TopStatsGrid.tsx
interface ShopStats {
  todayRewards: number;
  totalMembers: number;
  totalTransactions: number;
  totalRevenue: number;
  commissionRate: number;
}

interface TopStatsGridProps {
  stats: ShopStats;
}

export default function TopStatsGrid({ stats }: TopStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2 rounded-2xl p-6 bg-gradient-to-b from-[#1a4d2e] via-[#0f2818] to-[#0a1a10] border border-[#1a3324] shadow-2xl" style={{ borderWidth: '0.2px' }}>
        <div className="flex justify-between items-start">
          <p className="text-primary text-xs font-semibold uppercase tracking-wider">Today&apos;s Rewards Issued</p>
          <span className="material-symbols-outlined text-primary">payments</span>
        </div>
        <p className="text-white tracking-tighter text-4xl font-black">R{stats.todayRewards.toFixed(2)}</p>
        <p className="text-primary text-sm font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">trending_up</span>
          {stats.totalTransactions} transactions today
        </p>
      </div>
      <div className="flex flex-col gap-2 rounded-2xl p-6 bg-gradient-to-b from-[#1a4d2e] via-[#0f2818] to-[#0a1a10] border border-[#1a3324] shadow-2xl" style={{ borderWidth: '0.2px' }}>
        <div className="flex justify-between items-start">
          <p className="text-primary text-xs font-semibold uppercase tracking-wider">Commission Rate</p>
          <span className="material-symbols-outlined text-primary/60">percent</span>
        </div>
        <p className="text-white tracking-tighter text-4xl font-black">{stats.commissionRate}%</p>
        <p className="text-slate-400 text-sm font-medium">Your members earn 11% back</p>
      </div>
    </div>
  );
}
