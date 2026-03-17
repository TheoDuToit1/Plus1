import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Shop {
  id: string;
  name: string;
  commission_rate: number;
  status: 'active' | 'suspended';
  phone?: string;
}

export function MemberFindShops() {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [connectedShopIds, setConnectedShopIds] = useState<Set<string>>(new Set());
  const [pendingRequestIds, setPendingRequestIds] = useState<Set<string>>(new Set());
  const [requestingShopId, setRequestingShopId] = useState<string | null>(null);

  useEffect(() => { loadShops(); }, []);

  const loadShops = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Get all active shops
      const { data: shopsData } = await supabase
        .from('shops')
        .select('id, name, commission_rate, status, phone')
        .eq('status', 'active')
        .order('name');

      if (shopsData) setShops(shopsData);

      // Get member's already-connected shop IDs
      if (user) {
        const { data: wallets } = await supabase
          .from('wallets')
          .select('shop_id')
          .eq('member_id', user.id);
        if (wallets) setConnectedShopIds(new Set(wallets.map(w => w.shop_id)));

        // Get pending join requests
        const { data: requests } = await supabase
          .from('join_requests')
          .select('shop_id')
          .eq('member_id', user.id)
          .eq('status', 'pending');
        if (requests) setPendingRequestIds(new Set(requests.map(r => r.shop_id)));
      }
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const filtered = shops.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const memberEarns = (rate: number) => Math.max(rate - 2, 1);

  const handleJoinRequest = async (shopId: string, shopName: string) => {
    try {
      setRequestingShopId(shopId);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please log in to request to join shops');
        return;
      }

      const { error } = await supabase
        .from('join_requests')
        .insert({
          member_id: user.id,
          shop_id: shopId,
          message: `Hi! I'd like to join ${shopName} to start earning rewards on my purchases.`
        });

      if (error) {
        if (error.code === '23505') {
          alert('You already have a pending request for this shop');
        } else {
          throw error;
        }
      } else {
        alert(`Join request sent to ${shopName}! They will be notified and can approve your request.`);
        setPendingRequestIds(prev => new Set([...prev, shopId]));
      }
    } catch (err: any) {
      alert('Failed to send join request: ' + err.message);
    } finally {
      setRequestingShopId(null);
    }
  };

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>🔍 Active Partner Shops</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{shops.length} shops in your area</p>
          </div>
          <button onClick={() => navigate('/member/dashboard')}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Scan CTA */}
          <div style={{
            background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%)',
            borderRadius: '16px', padding: '1.25rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: '0 0 0.25rem' }}>Visit a shop?</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', margin: 0 }}>Show your QR code or scan their shop code</p>
            </div>
            <button onClick={() => navigate('/member/scan-shop')} className="btn btn-green" style={{ borderRadius: '10px', flexShrink: 0 }}>
              📱 Scan Shop
            </button>
          </div>

          {/* Search */}
          <div className="card" style={{ padding: '0.875rem' }}>
            <input
              type="text" className="input" placeholder="Search shops by name..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <p className="stat-label">Active Shops</p>
              <p className="stat-value" style={{ color: 'var(--green-dark)' }}>{shops.length}</p>
              <p className="stat-sub">Earning locations</p>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <p className="stat-label">Connected</p>
              <p className="stat-value" style={{ color: 'var(--blue)' }}>{connectedShopIds.size}</p>
              <p className="stat-sub">Your shops</p>
            </div>
          </div>

          {/* Shop list */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-border)' }}>
              <h2 className="section-title" style={{ margin: 0 }}>
                {search ? `Results (${filtered.length})` : 'All Active Shops'}
              </h2>
            </div>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-light)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏪</div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                  {search ? 'No shops match your search' : 'No active shops yet'}
                </p>
              </div>
            ) : (
              <div>
                {filtered.map((shop, i) => {
                  const isConnected = connectedShopIds.has(shop.id);
                  const hasPendingRequest = pendingRequestIds.has(shop.id);
                  const isRequesting = requestingShopId === shop.id;
                  const earns = memberEarns(shop.commission_rate);
                  return (
                    <div key={shop.id} style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '1rem 1.5rem',
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--gray-border)' : 'none',
                      background: i % 2 === 0 ? '#fff' : '#fafbff',
                    }}>
                      {/* Icon */}
                      <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, var(--blue-light), #dce8f5)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                        🏪
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                          <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '0.9375rem' }}>{shop.name}</p>
                          {isConnected && <span className="badge badge-green" style={{ fontSize: '0.6875rem' }}>✓ Connected</span>}
                          {hasPendingRequest && <span className="badge badge-yellow" style={{ fontSize: '0.6875rem' }}>⏳ Pending</span>}
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--gray-text)', margin: 0 }}>
                          You earn <strong style={{ color: 'var(--green-dark)' }}>{earns}%</strong> rewards per purchase
                        </p>
                      </div>

                      {/* Commission badge + action button */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem', flexShrink: 0 }}>
                        <span className="badge badge-blue">{shop.commission_rate}% commission</span>
                        {isConnected ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--green-dark)', fontWeight: 600 }}>
                            ✓ Connected
                          </span>
                        ) : hasPendingRequest ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--yellow)', fontWeight: 600 }}>
                            ⏳ Request sent
                          </span>
                        ) : (
                          <button
                            onClick={() => handleJoinRequest(shop.id, shop.name)}
                            disabled={isRequesting}
                            style={{ 
                              fontSize: '0.75rem', 
                              fontWeight: 700, 
                              color: 'var(--blue)', 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer', 
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--blue-light)',
                              opacity: isRequesting ? 0.5 : 1
                            }}
                          >
                            {isRequesting ? 'Sending...' : '📝 Request to Join'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={{ background: '#fff', borderTop: '1px solid var(--gray-border)', padding: '1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.8125rem' }}>© 2026 +1 Rewards · Shop. Earn. Cover your health.</p>
      </footer>
    </div>
  );
}
