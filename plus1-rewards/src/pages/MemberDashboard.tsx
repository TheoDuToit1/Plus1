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
import BlockedFundsNotification from '../components/member/BlockedFundsNotification';
import ProfileCompletionModal from '../components/member/ProfileCompletionModal';

interface Wallet {
  id: string; member_id: string; partner_id: string;
  rewards_total?: number; balance?: number; blocked_balance?: number;
  policies: { name: string; current: number; target: number; status: 'active' | 'suspended' } | null;
}
interface Partner { id: string; name: string; status: 'active' | 'suspended' }
interface Member { id: string; name: string; phone: string; email?: string; qr_code: string; active_policy?: string }

interface PolicyInfo {
  name: string;
  monthly_target: number;
  current_amount: number;
}

export function MemberDashboard() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [shops, setShops] = useState<Map<string, Partner>>(new Map());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(false);
  const [policyInfo, setPolicyInfo] = useState<PolicyInfo | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

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
    
    // Check if member needs to complete profile (no email or SA ID)
    // We'll check if they have an email in auth
    checkProfileCompletion();
  }, [member]);

  const checkProfileCompletion = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email?.includes('@plus1rewards.local')) {
        // Temporary email, profile not completed
        setProfileIncomplete(true);
        setShowProfileModal(true);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        // Don't redirect immediately, try to refresh session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          navigate('/member/login');
          return;
        }
      }
      
      if (!user) { 
        navigate('/member/login'); 
        return; 
      }
      
      // Check if user is actually a member (not shop/agent/provider)
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (memberError || !memberData) {
        // User is not a member, redirect to appropriate login
        console.log('User is not a member, redirecting to member login');
        await supabase.auth.signOut();
        navigate('/member/login');
        return;
      }
      
      setMember(memberData);
      
      const { data: walletsData } = await supabase.from('wallets').select('*').eq('member_id', user.id);
      if (walletsData) {
        setWallets(walletsData);
        
        // Load policy information if member has an active policy
        if (memberData?.active_policy) {
          await loadPolicyInfo(memberData.active_policy, walletsData);
        }
        
        const partnerIds = walletsData.map(w => w.partner_id);
        if (partnerIds.length > 0) {
          const { data: partnersData } = await supabase.from('partners').select('id, name, status').in('id', partnerIds);
          if (partnersData) setShops(new Map(partnersData.map(s => [s.id, s])));
        }
      }
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const loadPolicyInfo = async (policyId: string, walletsData: Wallet[]) => {
    try {
      // Get policy plan details
      const { data: policyPlan } = await supabase
        .from('policy_plans')
        .select('name, monthly_target')
        .eq('id', policyId)
        .single();

      if (policyPlan) {
        // Calculate current amount from wallets (sum of all rewards_total for this member)
        const currentAmount = walletsData.reduce((sum, wallet) => sum + (wallet.rewards_total || 0), 0);
        
        setPolicyInfo({
          name: policyPlan.name,
          monthly_target: policyPlan.monthly_target,
          current_amount: currentAmount
        });
      }
    } catch (error) {
      console.error('Error loading policy info:', error);
    }
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f8fc' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(26, 85, 139, 0.2)', borderTopColor: '#1a558b' }} />
          <p style={{ color: '#6b7280' }}>Loading your dashboard...</p>
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
        onScanQR={() => navigate('/member/scan-partner')}
        onMyPolicies={() => navigate('/member/policies')}
        onHistory={() => navigate('/member/history')}
        onMyProfile={() => {
          if (profileIncomplete) {
            setShowProfileModal(true);
          } else {
            navigate('/member/profile');
          }
        }}
        showProfileBadge={profileIncomplete}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <RewardsBalanceCard 
          balance={totalBalance}
          lastUpdated="Just now"
          policyInfo={policyInfo}
          memberId={member?.id}
          onOverflowHandled={loadDashboardData}
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
        onFindShops={() => navigate('/member/find-partners')}
      />

      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </MemberLayout>
  );
}
