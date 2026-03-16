import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import QRCode from 'qrcode';
import { encodeMemberQR, validateQRValue, createFallbackQR } from '../lib/config';

interface Wallet {
  id: string; member_id: string; shop_id: string;
  balance: number; points: number;
  policies: { name: string; current: number; target: number; status: 'active' | 'suspended' };
}
interface Shop { id: string; name: string; status: 'active' | 'suspended' }
interface Member { id: string; name: string; phone: string; email?: string; qr_code: string }

export function MemberDashboard() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [shops, setShops] = useState<Map<string, Shop>>(new Map());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [qrError, setQrError] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    loadDashboardData();
  }, []);

  // Separate useEffect for QR generation
  useEffect(() => {
    if (member && qrCanvasRef.current) {
      const generateQR = async () => {
        try {
          console.log('Member data for QR:', member); // Debug log
          const qrValue = encodeMemberQR(member.qr_code || member.id, member.phone);
          const safeQRValue = createFallbackQR(qrValue, member.phone);
          console.log('Generating QR for:', safeQRValue); // Debug log
          
          // Clear canvas first
          const ctx = qrCanvasRef.current?.getContext('2d');
          if (ctx && qrCanvasRef.current) {
            ctx.clearRect(0, 0, qrCanvasRef.current.width, qrCanvasRef.current.height);
          }
          
          if (qrCanvasRef.current) {
            await QRCode.toCanvas(qrCanvasRef.current, safeQRValue, {
              width: 200, 
              height: 200,
              margin: 2,
              color: { dark: '#1a568b', light: '#ffffff' },
              errorCorrectionLevel: 'M'
            });
            console.log('QR code generated successfully'); // Debug log
            setQrError(''); // Clear any previous errors
          }
        } catch (error) {
          console.error('QR Code generation failed:', error);
          setQrError('QR generation failed');
          // Final fallback: try with just phone number
          if (member.phone && qrCanvasRef.current) {
            try {
              await QRCode.toCanvas(qrCanvasRef.current, member.phone, {
                width: 200, 
                height: 200,
                margin: 2,
                color: { dark: '#1a568b', light: '#ffffff' },
                errorCorrectionLevel: 'M'
              });
              console.log('Fallback QR code generated successfully'); // Debug log
              setQrError(''); // Clear error if fallback works
            } catch (fallbackError) {
              console.error('Fallback QR generation also failed:', fallbackError);
              setQrError('QR generation completely failed');
            }
          }
        }
      };

      // Small delay to ensure canvas is ready
      setTimeout(generateQR, 100);
    }
  }, [member]); // Trigger when member data changes

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/member/login'); return; }
      const { data: memberData } = await supabase.from('members').select('*').eq('id', user.id).single();
      if (memberData) {
        setMember(memberData);
      }
      const { data: walletsData } = await supabase.from('wallets').select('*').eq('member_id', user.id);
      if (walletsData) {
        setWallets(walletsData);
        const shopIds = walletsData.map(w => w.shop_id);
        if (shopIds.length > 0) {
          const { data: shopsData } = await supabase.from('shops').select('id, name, status').in('id', shopIds);
          if (shopsData) setShops(new Map(shopsData.map(s => [s.id, s])));
        }
      }
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const handleSync = async () => {
    setSyncing(true);
    await loadDashboardData();
    setPendingTransactions(0);
    setSyncing(false);
  };

  const getProgress = (w: Wallet) => w.policies ? Math.min(100, Math.round((w.policies.current / w.policies.target) * 100)) : 0;

  const totalBalance = wallets.reduce((s, w) => s + (w.balance || 0), 0);
  const mainWallet = wallets[0];
  const progressPct = mainWallet ? getProgress(mainWallet) : 0;

  if (loading) {
    return (
      <div className="page-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--gray-text)' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="page-header">
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div className="logo-mark-white"><span className="logo-text">+1</span></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', lineHeight: 1 }}>+1 Rewards</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '1px' }}>Member Portal</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
              <span className={`online-dot ${isOnline ? 'online' : 'offline'}`} />
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{isOnline ? 'Online' : `Offline · ${pendingTransactions} pending`}</span>
            </div>
            <button
              onClick={() => supabase.auth.signOut().then(() => navigate('/member/login'))}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Welcome Banner */}
          <div style={{
            background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%)',
            borderRadius: '16px', padding: '1.5rem 1.75rem', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
          }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', marginBottom: '0.25rem' }}>Welcome back,</p>
              <h1 style={{ fontSize: '1.625rem', fontWeight: 800, marginBottom: '0.375rem' }}>{member?.name || 'Member'}</h1>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)' }}>📱 {member?.phone}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>Total Rewards Balance</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#37d270' }}>R{totalBalance.toFixed(2)}</p>
            </div>
          </div>

          {/* QR Code Card */}
          {member && (
            <div className="card animate-fade-up" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 className="section-title" style={{ margin: 0 }}>💳 Your Rewards QR</h2>
                <span className="badge badge-blue">Show at shops</span>
              </div>
              <div style={{
                background: 'var(--blue-light)', borderRadius: '16px', padding: '1.25rem',
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem',
                border: '2px solid #dce8f5',
              }}>
                <canvas ref={qrCanvasRef} style={{ 
                  borderRadius: '8px', 
                  display: 'block',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }} />
                {qrError && (
                  <div style={{ 
                    padding: '0.5rem', 
                    background: '#fee2e2', 
                    color: '#dc2626', 
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    textAlign: 'center'
                  }}>
                    {qrError}
                  </div>
                )}
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--blue)', margin: 0, letterSpacing: '0.05em' }}>{member.phone}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => navigate('/member/qr')} style={{ borderRadius: '10px' }}>
                  ⛶ Full Screen
                </button>
                <button className="btn btn-ghost" onClick={() => { navigator.clipboard?.writeText(member.phone); }} style={{ borderRadius: '10px' }}>
                  📋 Copy Phone
                </button>
                <button className="btn btn-ghost" onClick={async () => {
                  if (qrCanvasRef.current && member) {
                    const qrValue = encodeMemberQR(member.qr_code || member.id, member.phone);
                    await QRCode.toCanvas(qrCanvasRef.current, qrValue, {
                      width: 200, height: 200, margin: 2,
                      color: { dark: '#1a568b', light: '#ffffff' },
                      errorCorrectionLevel: 'M'
                    });
                  }
                }} style={{ borderRadius: '10px', fontSize: '0.75rem' }}>
                  🔄 Regenerate
                </button>
                <button className="btn btn-ghost" onClick={async () => {
                  if (qrCanvasRef.current) {
                    try {
                      await QRCode.toCanvas(qrCanvasRef.current, 'TEST QR CODE', {
                        width: 200, height: 200, margin: 2,
                        color: { dark: '#1a568b', light: '#ffffff' },
                        errorCorrectionLevel: 'M'
                      });
                      setQrError('Test QR generated');
                    } catch (error) {
                      setQrError('Test QR failed: ' + error);
                    }
                  }
                }} style={{ borderRadius: '10px', fontSize: '0.75rem' }}>
                  🧪 Test QR
                </button>
              </div>
            </div>
          )}

          {/* Active Policy Progress */}
          {mainWallet?.policies && (
            <div className="card animate-fade-up">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 className="section-title" style={{ margin: 0 }}>📊 Policy Progress</h2>
                <span className={`badge ${mainWallet.policies.status === 'active' ? 'badge-green' : 'badge-orange'}`}>
                  {mainWallet.policies.status === 'active' ? '✓ Active' : '⚠ Suspended'}
                </span>
              </div>
              <p style={{ color: 'var(--gray-text)', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                {mainWallet.policies.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginBottom: '0.875rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--blue)' }}>R{mainWallet.policies.current}</span>
                <span style={{ color: 'var(--gray-light)', fontSize: '0.9375rem' }}>/ R{mainWallet.policies.target}</span>
              </div>
              <div className="progress-track" style={{ marginBottom: '0.625rem' }}>
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--gray-light)' }}>
                {progressPct}% towards policy activation
                {progressPct === 100 && ' 🎉 Policy Activated!'}
              </p>
              <button
                onClick={() => navigate('/member/policy-selector')}
                className="btn btn-outline"
                style={{ marginTop: '1rem', borderRadius: '10px', fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}
              >
                View All Plans
              </button>
            </div>
          )}

          {/* Partner Shops */}
          <div className="card animate-fade-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>🏪 Partner Shops ({wallets.length})</h2>
              <button onClick={handleSync} disabled={syncing} className="btn btn-ghost" style={{ fontSize: '0.8125rem', borderRadius: '8px', padding: '0.5rem 0.875rem', gap: '0.375rem' }}>
                <span style={syncing ? { animation: 'spin 1s linear infinite', display: 'inline-block' } : {}}>🔄</span>
                {syncing ? 'Syncing...' : 'Sync'}
              </button>
            </div>

            {wallets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--gray-light)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏪</div>
                <p>No partner shops yet. Visit any +1 partner shop to start earning!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {wallets.map(wallet => {
                  const shop = shops.get(wallet.shop_id);
                  const isActive = wallet.policies?.status === 'active';
                  return (
                    <div key={wallet.id} style={{
                      border: '1.5px solid var(--gray-border)', borderRadius: '12px', padding: '1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: '#fafbff'
                    }}>
                      <div>
                        <p style={{ fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>{shop?.name || 'Unknown Shop'}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--blue)', fontWeight: 700 }}>R{wallet.balance?.toFixed(2) || '0.00'} balance</p>
                      </div>
                      <span className={`badge ${isActive ? 'badge-green' : 'badge-orange'}`}>
                        {isActive ? '✓ Active' : '⚠ Suspended'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <button onClick={() => navigate('/member/find-shops')} className="btn btn-outline btn-block" style={{ marginTop: '1rem', borderRadius: '10px' }}>
              🔍 Find Active Shops
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            {[
              { label: '📱 Scan Shop QR', path: '/member/scan-shop', primary: true },
              { label: '📋 My Policies', path: '/member/policy-selector', primary: false },
              { label: '📊 History', path: '/member/history', primary: false },
              { label: '👤 My Profile', path: '/member/profile', primary: false },
            ].map((a, i) => (
              <button
                key={i}
                onClick={() => navigate(a.path)}
                className={a.primary ? 'btn btn-primary' : 'btn btn-ghost'}
                style={{ borderRadius: '12px', padding: '1rem', fontSize: '0.875rem', height: '54px' }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ background: '#fff', borderTop: '1px solid var(--gray-border)', padding: '1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.8125rem' }}>© 2026 +1 Rewards · Shop. Earn. Cover your health.</p>
      </footer>
    </div>
  );
}
