import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import QRCode from 'qrcode';
import { encodePartnerQR } from '../lib/config';

interface Member { id: string; name: string; phone: string; qr_code: string }
interface Wallet { id: string; member_id: string; balance: number; policies: { name: string; current: number; target: number; status: 'active' | 'suspended' } }
interface Transaction { id: string; member_id: string; purchase_amount: number; member_reward: number; created_at: string; member_name?: string }
interface Partner { id: string; name: string; commission_rate: number; status: 'active' | 'suspended' }

export function PartnerDashboard() {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [activeTab, setActiveTab] = useState<'scan' | 'phone'>('scan');
  const [partnerQrDataUrl, setpartnerQrDataUrl] = useState<string>('');

  useEffect(() => { 
    loadPartnerData(); 
    // Check if we have a selected member from the scanner
    const selectedMemberData = sessionStorage.getItem('selectedMember');
    if (selectedMemberData) {
      const { member: selectedMember, wallet: selectedWallet } = JSON.parse(selectedMemberData);
      setMember(selectedMember);
      setWallet(selectedWallet);
      sessionStorage.removeItem('selectedMember');
    }
  }, []);

  // Generate Partner QR as data URL — no canvas ref needed
  useEffect(() => {
    if (!partner) return;
    QRCode.toDataURL(encodePartnerQR(partner.id), {
      width: 180, margin: 1,
      color: { dark: '#1a568b', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then(url => setpartnerQrDataUrl(url))
      .catch(() =>
        QRCode.toDataURL(`PARTNER:${partner.id}`, { width: 180, margin: 1, color: { dark: '#1a568b', light: '#ffffff' } })
          .then(url => setpartnerQrDataUrl(url))
          .catch(() => {})
      );
  }, [partner]);

  const loadPartnerData = async () => {
    setLoading(true);
    try {
      const partnerData = localStorage.getItem('currentPartner');
      if (!partnerData) { navigate('/partner/login'); return; }
      const parsedPartner = JSON.parse(partnerData);
      const { data: partnerDetails } = await supabase.from('partners').select('*').eq('id', parsedPartner.id).single();
      if (partnerDetails) {
        setPartner(partnerDetails);
      }
      const { data: transactions } = await supabase.from('transactions').select('*').eq('partner_id', parsedPartner.id).order('created_at', { ascending: false }).limit(5);
      if (transactions) {
        const memberIds = [...new Set(transactions.map(t => t.member_id))];
        if (memberIds.length > 0) {
          const { data: members } = await supabase.from('members').select('id, name').in('id', memberIds);
          const memberMap = new Map(members?.map(m => [m.id, m.name]) || []);
          setRecentTransactions(transactions.map(t => ({ ...t, member_name: memberMap.get(t.member_id) || 'Unknown' })));
          const today = new Date().toDateString();
          setTodayTotal(transactions.filter(t => new Date(t.created_at).toDateString() === today).reduce((s, t) => s + t.member_reward, 0));
        }
      }
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const handlePhoneSearch = async () => {
    if (!phoneSearch) return;
    setError('');
    const { data: memberData } = await supabase.from('members').select('*').eq('phone', phoneSearch).single();
    if (!memberData) { setError('Member not found'); return; }
    
    // Check if member has an active policy
    if (!memberData.active_policy) {
      setError('Member must select a policy plan before receiving rewards. Ask them to choose a policy in their +1 Rewards app first.');
      return;
    }
    
    setMember(memberData);
    const { data: walletData } = await supabase.from('wallets').select('*').eq('member_id', memberData.id).eq('partner_id', partner?.id).single();
    if (walletData) setWallet(walletData);
    else setError('Member not connected to this partner');
  };

  const calcRewards = (amount: number) => partner ? (amount * partner.commission_rate) / 100 : 0;

  const handleIssueRewards = async () => {
    if (!member || !wallet || !purchaseAmount || !partner) { setError('Please fill in all required fields'); return; }
    setIssuing(true); setError(''); setSuccess('');
    try {
      const amount = parseFloat(purchaseAmount);
      const rewards = calcRewards(amount);
      await supabase.from('transactions').insert([{ partner_id: partner.id, member_id: member.id, purchase_amount: amount, member_reward: rewards, agent_commission: amount * 0.01, platform_fee: amount * 0.01, partner_contribution: rewards, status: 'pending_sync' }]);
      await supabase.from('wallets').update({ balance: (wallet.balance || 0) + rewards, policies: { ...wallet.policies, current: (wallet.policies?.current || 0) + rewards } }).eq('id', wallet.id);
      setSuccess(`✓ R${rewards.toFixed(2)} rewards issued to ${member.name}`);
      setPurchaseAmount(''); setMember(null); setWallet(null);
      setTimeout(() => { setSuccess(''); loadPartnerData(); }, 2000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to issue rewards'); }
    finally { setIssuing(false); }
  };

  if (loading) return (
    <div className="page-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--gray-text)' }}>Loading Partner Dashboard...</p>
    </div>
  );

  const isSuspended = partner?.status === 'suspended';
  const amount = parseFloat(purchaseAmount) || 0;

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>{partner?.name || 'Partner Dashboard'}</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Commission: {partner?.commission_rate}%</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`badge ${isSuspended ? 'badge-orange' : 'badge-green'}`} style={{ fontSize: '0.8125rem' }}>
              {isSuspended ? '⚠ Suspended' : '✓ Active'}
            </span>
            <button onClick={() => { localStorage.removeItem('currentPartner'); navigate('/'); }} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {isSuspended && (
        <div style={{ background: '#fef3c7', borderBottom: '1px solid #f59e0b', padding: '0.875rem 1.5rem' }}>
          <p style={{ textAlign: 'center', color: '#92400e', fontWeight: 600, margin: 0, fontSize: '0.9375rem' }}>
            ⚠️ Partner suspended — rewards are paused. <button onClick={() => navigate('/partner/invoice')} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Pay your invoice</button> to reactivate.
          </p>
        </div>
      )}

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="stat-card">
              <p className="stat-label">Today's Rewards</p>
              <p className="stat-value" style={{ color: 'var(--blue)' }}>R{todayTotal.toFixed(2)}</p>
              <p className="stat-sub">Issued today</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Pending Sync</p>
              <p className="stat-value" style={{ color: 'var(--orange)' }}>0</p>
              <p className="stat-sub">Transactions</p>
            </div>
          </div>

          {/* Partner QR Code (for members to scan) */}
          <div className="card">
            <h2 className="section-title">🏪 My Business QR Code</h2>
            <p style={{ color: 'var(--gray-text)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Show this QR code to members to connect them to Your Business. Members scan this with their +1 Rewards app.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--blue-light)', borderRadius: '16px', padding: '1.25rem', border: '2px solid #dce8f5' }}>
                {partnerQrDataUrl ? (
                  <img
                    src={partnerQrDataUrl}
                    alt="Partner QR Code"
                    style={{ width: '180px', height: '180px', borderRadius: '8px', display: 'block', border: '1px solid #dce8f5' }}
                  />
                ) : (
                  <div style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', animation: 'spin 1s linear infinite' }} />
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{partner?.name}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-light)', margin: '0 0 0.875rem' }}>Commission: {partner?.commission_rate}% · Members earn {partner ? partner.commission_rate - 2 : 0}%</p>
                {/* Shop ID — for members to enter manually if camera scan fails */}
                <div style={{ background: '#f3f4f6', borderRadius: '10px', padding: '0.625rem 0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', border: '1px solid var(--gray-border)' }}>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--gray-light)', margin: '0 0 1px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Partner ID (for manual entry)</p>
                    <p style={{ fontSize: '0.75rem', color: '#374151', margin: 0, fontFamily: 'monospace', wordBreak: 'break-all' }}>{partner?.id}</p>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(partner?.id || ''); }}
                    style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: '7px', padding: '0.375rem 0.625rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                    title="Copy Partner ID"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Rewards */}
          <div className="card">
            <h2 className="section-title">💳 Issue Member Rewards</h2>

            {/* Tabs */}
            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '10px', padding: '4px', marginBottom: '1.25rem' }}>
              {[{ id: 'scan', label: '📱 Scan QR' }, { id: 'phone', label: '📞 Phone Search' }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as 'scan' | 'phone')} style={{
                  flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                  background: activeTab === tab.id ? '#fff' : 'transparent',
                  color: activeTab === tab.id ? 'var(--blue)' : 'var(--gray-text)',
                  boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}>{tab.label}</button>
              ))}
            </div>

            {/* Scan Tab */}
            {activeTab === 'scan' && !member && (
              <button onClick={() => navigate('/partner/scan-member')} className="btn btn-primary btn-block" style={{ borderRadius: '12px', height: '52px' }}>
                📷 Start QR Scanner
              </button>
            )}

            {/* Phone Tab */}
            {activeTab === 'phone' && !member && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="tel" placeholder="082 555 1234" value={phoneSearch} onChange={e => setPhoneSearch(e.target.value)}
                  className="input" style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && handlePhoneSearch()} />
                <button onClick={handlePhoneSearch} className="btn btn-primary" style={{ borderRadius: '10px', padding: '0 1.25rem', flexShrink: 0 }}>
                  Search
                </button>
              </div>
            )}

            {/* Member Found */}
            {member && wallet && (
              <div style={{ background: 'var(--blue-light)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', border: '1px solid #dce8f5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.875rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>{member.name}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-text)', margin: 0 }}>{member.phone}</p>
                  </div>
                  <button onClick={() => { setMember(null); setWallet(null); setPhoneSearch(''); }} className="btn btn-ghost" style={{ fontSize: '0.75rem', borderRadius: '8px', padding: '0.25rem 0.75rem' }}>
                    Clear
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: '0 0 2px' }}>Policy</p>
                    <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: '0.875rem' }}>{wallet.policies?.name}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: '0 0 2px' }}>Progress</p>
                    <p style={{ fontWeight: 700, color: 'var(--blue)', margin: 0 }}>R{wallet.policies?.current || 0} / R{wallet.policies?.target || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Purchase Amount */}
            <div style={{ marginTop: member ? 0 : '1rem' }}>
              <label className="input-label">Purchase Amount (R) *</label>
              <input type="number" placeholder="1000" value={purchaseAmount} onChange={e => setPurchaseAmount(e.target.value)}
                disabled={!member} className="input" style={{ opacity: member ? 1 : 0.5, fontSize: '1.125rem' }} />
            </div>

            {/* Rewards Breakdown */}
            {amount > 0 && member && (
              <div style={{ background: 'var(--green-light)', borderRadius: '12px', padding: '1rem', marginTop: '1rem', border: '1px solid #a7f3d0' }}>
                <p style={{ fontSize: '0.8125rem', color: '#166534', fontWeight: 600, marginBottom: '0.5rem' }}>Rewards Breakdown</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <div style={{ textAlign: 'center', background: '#fff', borderRadius: '8px', padding: '0.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 800, color: '#166534', margin: '0 0 2px' }}>R{calcRewards(amount).toFixed(2)}</p>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--gray-text)', margin: 0 }}>Member reward</p>
                  </div>
                  <div style={{ textAlign: 'center', background: '#fff', borderRadius: '8px', padding: '0.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--blue)', margin: '0 0 2px' }}>R{(amount * 0.01).toFixed(2)}</p>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--gray-text)', margin: 0 }}>Agent 1%</p>
                  </div>
                  <div style={{ textAlign: 'center', background: '#fff', borderRadius: '8px', padding: '0.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--blue)', margin: '0 0 2px' }}>R{(amount * 0.01).toFixed(2)}</p>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--gray-text)', margin: 0 }}>Platform 1%</p>
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleIssueRewards} disabled={!member || !purchaseAmount || issuing} className="btn btn-green btn-block" style={{ marginTop: '1rem', borderRadius: '12px', height: '52px', fontSize: '1rem' }}>
              {issuing ? '⏳ Processing...' : '✓ Issue Rewards'}
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <button onClick={() => navigate('/partner/invoice')} className="btn btn-primary" style={{ borderRadius: '12px', height: '52px', fontSize: '0.875rem' }}>📄 Monthly Invoice</button>
            <button onClick={() => navigate('/partner/history')} className="btn btn-outline" style={{ borderRadius: '12px', height: '52px', fontSize: '0.875rem' }}>📊 Transaction History</button>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <h2 className="section-title">Recent Transactions</h2>
            {recentTransactions.length === 0 ? (
              <p style={{ color: 'var(--gray-light)', textAlign: 'center', padding: '2rem 0' }}>No transactions yet today</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {recentTransactions.map(tx => (
                  <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', background: '#fafbff', border: '1px solid var(--gray-border)', borderRadius: '10px' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: '#111827', margin: '0 0 2px', fontSize: '0.9375rem' }}>{tx.member_name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: 0 }}>{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 700, color: 'var(--green-dark)', margin: '0 0 2px' }}>+R{tx.member_reward.toFixed(2)}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: 0 }}>Purchase: R{tx.purchase_amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={{ background: '#fff', borderTop: '1px solid var(--gray-border)', padding: '1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.8125rem' }}>© 2026 +1 Rewards · Partner Portal</p>
      </footer>
    </div>
  );
}
