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
  // Member gets commission rate minus 2% (1% agent + 1% platform)
  const memberRewardRate = Math.max(0, stats.commissionRate - 2);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start">
          <p className="text-[#1a558b] text-xs font-semibold uppercase tracking-wider">Today&apos;s Rewards Issued</p>
          <span className="material-symbols-outlined text-[#1a558b]">payments</span>
        </div>
        <p className="text-gray-900 tracking-tighter text-4xl font-black">R{stats.todayRewards.toFixed(2)}</p>
        <p className="text-[#1a558b] text-sm font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">trending_up</span>
          {stats.totalTransactions} transactions today
        </p>
      </div>
      <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start">
          <p className="text-[#1a558b] text-xs font-semibold uppercase tracking-wider">Commission Rate</p>
          <span className="material-symbols-outlined text-[#1a558b]/60">percent</span>
        </div>
        <p className="text-gray-900 tracking-tighter text-4xl font-black">{stats.commissionRate}%</p>
        <p className="text-gray-600 text-sm font-medium">Your members earn {memberRewardRate}% back</p>
      </div>
    </div>
  );
}
