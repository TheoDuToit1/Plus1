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

interface Wallet {
  id: string; member_id: string; shop_id: string;
  rewards_total?: number; balance?: number;
  policies: { name: string; current: number; target: number; status: 'active' | 'suspended' } | null;
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
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(false);

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

  const totalBalance = wallets.reduce((s, w) => s + (w.rewards_total || w.balance || 0), 0);

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
    </MemberLayout>
  );
}
