import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import QRCode from 'qrcode';
import { encodeMemberQR } from '../lib/config';
import MemberLayout from '../components/member/MemberLayout';
import WelcomeSection from '../components/member/components/WelcomeSection';
import QuickActionsGrid from '../components/member/components/QuickActionsGrid';
import RewardsBalanceCard from '../components/member/components/RewardsBalanceCard';
import QRCodeCard from '../components/member/components/QRCodeCard';
import PartnerShopsSection from '../components/member/components/PartnerShopsSection';
import PolicySelectionModal from '../components/member/PolicySelectionModal';
import BlockedFundsNotification from '../components/member/BlockedFundsNotification';

interface Wallet {
  id: string; member_id: string; shop_id: string;
  rewards_total?: number; balance?: number; blocked_balance?: number;
  policies: { name: string; current: number; target: number; status: 'active' | 'suspended' } | null;
}
interface Shop { id: string; name: string; status: 'active' | 'suspended' }
interface Member { id: string; name: string; phone: string; email?: string; qr_code: string; active_policy?: string }

export function MemberDashboard() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [shops, setShops] = useState<Map<string, Shop>>(new Map());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    loadDashboardData();
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  useEffect(() => {
    if (!member) return;
    generateQRDataUrl(member);
    
    // Check if member needs to select a policy
    if (!member.active_policy) {
      setShowPolicyModal(true);
    }
  }, [member]);

  const generateQRDataUrl = async (m: Member) => {
    setQrLoading(true);
    try {
      const qrValue = encodeMemberQR(m.qr_code, m.phone || m.id);
      const url = await QRCode.toDataURL(qrValue, {
        width: 210,
        margin: 2,
        color: { dark: '#102216', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(url);
    } catch {
      try {
        const url = await QRCode.toDataURL(m.phone || m.id, {
          width: 210, margin: 2,
          color: { dark: '#102216', light: '#ffffff' },
          errorCorrectionLevel: 'M',
        });
        setQrDataUrl(url);
      } catch { /* silent */ }
    } finally { setQrLoading(false); }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/member/login'); return; }
      const { data: memberData } = await supabase.from('members').select('*').eq('id', user.id).single();
      if (memberData) setMember(memberData);
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

  const handlePolicySelected = async (policyId: string) => {
    // Reload member data to get updated policy
    await loadDashboardData();
    
    // Move blocked funds to available balance
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get wallets with blocked balance
      const { data: walletsWithBlocked } = await supabase
        .from('wallets')
        .select('*')
        .eq('member_id', user.id)
        .gt('blocked_balance', 0);

      if (walletsWithBlocked && walletsWithBlocked.length > 0) {
        // Move blocked balance to available balance for each wallet
        for (const wallet of walletsWithBlocked) {
          const newBalance = (wallet.balance || 0) + (wallet.blocked_balance || 0);
          await supabase
            .from('wallets')
            .update({ 
              balance: newBalance,
              blocked_balance: 0 
            })
            .eq('id', wallet.id);
        }
        
        // Reload data to show updated balances
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error moving blocked funds:', error);
    }
  };

  const totalBalance = wallets.reduce((s, w) => s + (w.rewards_total || w.balance || 0), 0);
  const totalBlockedBalance = wallets.reduce((s, w) => s + (w.blocked_balance || 0), 0);

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <MemberLayout 
      member={member}
      isOnline={isOnline}
      pendingTransactions={pendingTransactions}
      onSignOut={() => supabase.auth.signOut().then(() => navigate('/member/login'))}
    >
      <WelcomeSection 
        name={member?.name || 'Member'}
        phone={member?.phone || ''}
        avatarUrl={`https://ui-avatars.com/api/?name=${encodeURIComponent(member?.name || 'Member')}&background=11d452&color=102216&size=256&bold=true`}
      />

      {/* Show blocked funds notification if no policy selected */}
      {!member?.active_policy && totalBlockedBalance > 0 && (
        <BlockedFundsNotification 
          blockedAmount={totalBlockedBalance}
          onSelectPolicy={() => setShowPolicyModal(true)}
        />
      )}

      <QuickActionsGrid 
        onScanQR={() => navigate('/member/scan-shop')}
        onMyPolicies={() => navigate('/member/policy-selector')}
        onHistory={() => navigate('/member/history')}
        onMyProfile={() => navigate('/member/profile')}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <RewardsBalanceCard 
          balance={totalBalance}
          lastUpdated="Just now"
        />
        <QRCodeCard 
          phone={member?.phone || ''}
          qrCodeUrl={qrDataUrl}
          qrLoading={qrLoading}
          onRefresh={() => member && generateQRDataUrl(member)}
          onFullScreen={() => navigate('/member/qr')}
        />
      </div>

      <PartnerShopsSection 
        shopCount={wallets.length}
        wallets={wallets}
        shops={shops}
        syncing={syncing}
        onSync={handleSync}
        onFindShops={() => navigate('/member/find-shops')}
      />

      {/* Policy Selection Modal */}
      <PolicySelectionModal
        isOpen={showPolicyModal}
        onClose={() => {
          // Only allow closing if member has a policy or no blocked funds
          if (member?.active_policy || totalBlockedBalance === 0) {
            setShowPolicyModal(false);
          }
        }}
        onPolicySelected={handlePolicySelected}
        memberId={member?.id || ''}
      />
    </MemberLayout>
  );
}
