// plus1-rewards/src/components/member/components/PartnerShopsSection.tsx
interface Wallet {
  id: string;
  member_id: string;
  shop_id: string;
  rewards_total?: number;
  balance?: number;
  policies: { name: string; current: number; target: number; status: 'active' | 'suspended' } | null;
}

interface Shop {
  id: string;
  name: string;
  status: 'active' | 'suspended';
}

interface PartnerShopsSectionProps {
  shopCount: number;
  wallets: Wallet[];
  shops: Map<string, Shop>;
  syncing: boolean;
  onSync: () => void;
  onFindShops: () => void;
}

export default function PartnerShopsSection({ shopCount, wallets, shops, syncing, onSync, onFindShops }: PartnerShopsSectionProps) {
  return (
    <section className="bg-[#162d1e] rounded-2xl border border-[#1a3324] overflow-hidden shadow-xl">
      <div className="px-6 py-4 border-b border-[#1a3324] flex justify-between items-center bg-[#193322]">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-bold text-lg tracking-tight">Partner Shops</h3>
          <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">{shopCount}</span>
        </div>
        <button 
          onClick={onSync}
          disabled={syncing}
          className="flex items-center gap-2 text-primary hover:text-white transition-colors disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-sm ${syncing ? 'animate-spin' : ''}`}>sync</span>
          <span className="text-xs font-bold uppercase tracking-wider">{syncing ? 'Syncing...' : 'Sync'}</span>
        </button>
      </div>
      
      {wallets.length === 0 ? (
        <div className="p-10 flex flex-col items-center text-center">
          <div className="size-20 bg-[#0a1a10] rounded-full flex items-center justify-center mb-6 text-primary/30 border-2 border-dashed border-[#1a3324]">
            <span className="material-symbols-outlined text-5xl">storefront</span>
          </div>
          <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
            No partner shops yet. Visit any <span className="text-primary font-bold">+1 partner shop</span> to start earning!
          </p>
          <button 
            onClick={onFindShops}
            className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-12 px-8 bg-primary text-background-dark text-sm font-black transition-transform active:scale-95 hover:shadow-[0_0_20px_rgba(17,212,82,0.3)]"
          >
            Find Active Shops
          </button>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-col gap-3 mb-4">
            {wallets.map(wallet => {
              const shop = shops.get(wallet.shop_id);
              const bal = wallet.rewards_total ?? wallet.balance ?? 0;
              const isActive = shop?.status === 'active';
              return (
                <div key={wallet.id} className="border-2 border-[#1a3324] rounded-xl p-4 flex items-center justify-between bg-[#0a1a10]">
                  <div>
                    <p className="text-white font-bold mb-1">{shop?.name || 'Unknown Shop'}</p>
                    <p className="text-primary text-sm font-bold">R{Number(bal).toFixed(2)} rewards</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-primary/20 text-primary' : 'bg-orange-500/20 text-orange-400'}`}>
                    {isActive ? '✓ Active' : '⚠ Suspended'}
                  </span>
                </div>
              );
            })}
          </div>
          <button 
            onClick={onFindShops}
            className="w-full flex items-center justify-center rounded-xl h-12 px-8 bg-[#1a3324] text-white text-sm font-bold hover:bg-[#23482f] transition-all"
          >
            🔍 Find Active Shops
          </button>
        </div>
      )}
    </section>
  );
}
