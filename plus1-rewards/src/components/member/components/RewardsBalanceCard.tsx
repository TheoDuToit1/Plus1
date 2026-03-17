// plus1-rewards/src/components/member/components/RewardsBalanceCard.tsx
interface RewardsBalanceCardProps {
  balance: number;
  lastUpdated: string;
}

export default function RewardsBalanceCard({ balance, lastUpdated }: RewardsBalanceCardProps) {
  const handleDetailsClick = () => {
    console.log('Details clicked');
  };

  return (
    <div className="flex flex-col items-stretch justify-start rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#1a4d2e] via-[#0f2818] to-[#0a1a10] border border-[#1a3324] relative">
      {/* Decorative icon in top right */}
      <div className="absolute -top-12 -right-12 opacity-15">
        <span className="material-symbols-outlined text-primary block" style={{ fontSize: '240px', fontVariationSettings: '"FILL" 0, "wght" 200' }}>payments</span>
      </div>
      
      <div className="flex flex-col p-6 gap-2 relative z-10">
        <p className="text-primary text-xs font-bold uppercase tracking-[0.2em]">Rewards Overview</p>
        <div className="flex items-baseline gap-2 my-4">
          <p className="text-white text-5xl font-black leading-tight">R{balance.toFixed(2)}</p>
          <span className="material-symbols-outlined text-primary text-lg">trending_up</span>
        </div>
        <p className="text-slate-400 text-base font-normal mb-8">Total Rewards Balance</p>
        <div className="pt-4 border-t border-[#1a3324] flex justify-between items-center">
          <span className="text-xs text-slate-500 italic">Last updated: {lastUpdated}</span>
          <button 
            onClick={handleDetailsClick}
            className="text-primary text-sm font-bold hover:underline"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
