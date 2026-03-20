// plus1-rewards/src/components/member/components/PartnerShopsSection.tsx
interface Wallet {
  id: string;
  member_id: string;
  partner_id: string;
  rewards_total?: number;
  balance?: number;
  policies: { name: string; current: number; target: number; status: 'active' | 'suspended' } | null;
}

interface Partner {
  id: string;
  name: string;
  status: 'active' | 'suspended';
}

interface PartnerShopsSectionProps {
  shopCount: number;
  wallets: Wallet[];
  shops: Map<string, Partner>;
  syncing: boolean;
  onSync: () => void;
  onFindShops: () => void;
}

const BLUE = '#1a558b';

export default function PartnerShopsSection({ shopCount, wallets, shops, syncing, onSync, onFindShops }: PartnerShopsSectionProps) {
  return (
    <section className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
      <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg tracking-tight" style={{ color: '#111827' }}>Partner Shops</h3>
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(26, 85, 139, 0.1)', color: BLUE }}>{shopCount}</span>
        </div>
        <button 
          onClick={onSync}
          disabled={syncing}
          className="flex items-center gap-2 transition-colors disabled:opacity-50 hover:opacity-80"
          style={{ color: BLUE }}
        >
          <span className={`material-symbols-outlined text-sm ${syncing ? 'animate-spin' : ''}`}>sync</span>
          <span className="text-xs font-bold uppercase tracking-wider">{syncing ? 'Syncing...' : 'Sync'}</span>
        </button>
      </div>
      
      {wallets.length === 0 ? (
        <div className="p-10 flex flex-col items-center text-center">
          <div className="size-20 rounded-full flex items-center justify-center mb-6 border-2 border-dashed" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: 'rgba(26, 85, 139, 0.3)' }}>
            <span className="material-symbols-outlined text-5xl">storefront</span>
          </div>
          <p className="max-w-sm mb-8 leading-relaxed" style={{ color: '#6b7280' }}>
            No partner shops yet. Visit any <span className="font-bold" style={{ color: BLUE }}>+1 partner shop</span> to start earning!
          </p>
          <button 
            onClick={onFindShops}
            className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-12 px-8 text-sm font-black transition-transform active:scale-95 text-white"
            style={{ backgroundColor: BLUE }}
          >
            Find Active Shops
          </button>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-col gap-3 mb-4">
            {wallets.map(wallet => {
              const partner = shops.get(wallet.partner_id);
              const bal = wallet.rewards_total ?? wallet.balance ?? 0;
              const isActive = partner?.status === 'active';
              return (
                <div key={wallet.id} className="rounded-xl p-4 flex items-center justify-between" style={{ border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <div>
                    <p className="font-bold mb-1" style={{ color: '#111827' }}>{partner?.name || 'Unknown Shop'}</p>
                    <p className="text-sm font-bold" style={{ color: BLUE }}>R{Number(bal).toFixed(2)} rewards</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold`} style={{
                    backgroundColor: isActive ? 'rgba(26, 85, 139, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                    color: isActive ? BLUE : '#f97316'
                  }}>
                    {isActive ? '✓ Active' : '⚠ Suspended'}
                  </span>
                </div>
              );
            })}
          </div>
          <button 
            onClick={onFindShops}
            className="w-full flex items-center justify-center rounded-xl h-12 px-8 text-sm font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: 'rgba(26, 85, 139, 0.1)', color: BLUE, border: `1px solid ${BLUE}40` }}
          >
            🔍 Find Active Shops
          </button>
        </div>
      )}
    </section>
  );
}
