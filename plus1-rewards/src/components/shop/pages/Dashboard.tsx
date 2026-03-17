// src/components/shop/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useShopDashboard } from '../../../hooks/useShopDashboard';
import WelcomeSection from '../components/WelcomeSection';
import TopStatsGrid from '../components/TopStatsGrid';
import RewardsIssuanceTool from '../components/RewardsIssuanceTool';
import RecentTransactions from '../components/RecentTransactions';
import ShopQRCode from '../components/ShopQRCode';
import GrowthPromo from '../components/GrowthPromo';

export default function Dashboard() {
  const [shopId, setShopId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [activeTab, setActiveTab] = useState('scan');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [memberDetails, setMemberDetails] = useState<any>(null);
  const [issuingRewards, setIssuingRewards] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { shop, transactions, stats, loading, error, issueRewards, searchMember } = useShopDashboard(shopId);

  // Get current shop from auth
  useEffect(() => {
    const getCurrentShop = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          // Try to find shop by user ID or email
          const { data: shopData, error: shopError } = await supabase
            .from('shops')
            .select('id')
            .limit(1);
          
          if (shopData && shopData.length > 0) {
            setShopId(shopData[0].id);
          } else {
            console.log('No shops found in database');
          }
        }
      } catch (err) {
        console.error('Error getting current shop:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    getCurrentShop();
  }, []);

  const handleIssueRewards = async () => {
    if (!purchaseAmount || !selectedMemberId) {
      alert('Please select a member and enter an amount');
      return;
    }

    setIssuingRewards(true);
    try {
      await issueRewards(selectedMemberId, parseFloat(purchaseAmount));
      setSuccessMessage(`Rewards issued successfully! R${purchaseAmount} purchase recorded.`);
      setPurchaseAmount('');
      setSelectedMemberId(null);
      setMemberDetails(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to issue rewards: ' + (err as any).message);
    } finally {
      setIssuingRewards(false);
    }
  };

  const handleSearchMember = async (phone: string) => {
    try {
      const member = await searchMember(phone);
      
      // Fetch member's wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('member_id', member.id)
        .eq('shop_id', shopId)
        .single();
      
      setSelectedMemberId(member.id);
      setMemberDetails({
        id: member.id,
        name: member.name,
        phone: member.phone,
        balance: wallet?.balance || 0
      });
    } catch (err) {
      alert('Member not found');
    }
  };

  const handleQRScanned = async (qrData: string) => {
    try {
      // Parse the QR data to extract member identifier
      const { parseMemberQR } = await import('../../../lib/config');
      const memberIdentifier = parseMemberQR(qrData);
      
      if (!memberIdentifier) {
        alert('Invalid QR code format');
        return;
      }

      // Try to find member by qr_code first, then by phone, then by ID
      let member = null;
      
      // Try qr_code field
      const { data: memberByQR } = await supabase
        .from('members')
        .select('*')
        .eq('qr_code', memberIdentifier)
        .single();
      
      if (memberByQR) {
        member = memberByQR;
      } else {
        // Try phone number
        const { data: memberByPhone } = await supabase
          .from('members')
          .select('*')
          .eq('phone', memberIdentifier)
          .single();
        
        if (memberByPhone) {
          member = memberByPhone;
        } else {
          // Try ID
          const { data: memberById } = await supabase
            .from('members')
            .select('*')
            .eq('id', memberIdentifier)
            .single();
          
          if (memberById) {
            member = memberById;
          }
        }
      }

      if (!member) {
        alert('Member not found. Please ask them to register first.');
        return;
      }

      // Fetch member's wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('member_id', member.id)
        .eq('shop_id', shopId)
        .single();

      setSelectedMemberId(member.id);
      setMemberDetails({
        id: member.id,
        name: member.name,
        phone: member.phone,
        balance: wallet?.balance || 0
      });
    } catch (err) {
      console.error('QR scan error:', err);
      alert('Error processing QR code. Please try manual phone search.');
    }
  };

  const handleClearMember = () => {
    setSelectedMemberId(null);
    setMemberDetails(null);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!shopId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-white mb-4">No shop found for your account</p>
          <p className="text-slate-400 text-sm">Please contact support or register a shop</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-primary/20 border border-primary/50 rounded-lg p-4 mb-6 text-primary">
          {successMessage}
        </div>
      )}
      <WelcomeSection shopName={shop?.name} shopId={shop?.id} />
      <TopStatsGrid stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <RewardsIssuanceTool
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            purchaseAmount={purchaseAmount}
            setPurchaseAmount={setPurchaseAmount}
            selectedMemberId={selectedMemberId}
            memberDetails={memberDetails}
            commissionRate={shop?.commission_rate || 0}
            onIssueRewards={handleIssueRewards}
            onSearchMember={handleSearchMember}
            onQRScanned={handleQRScanned}
            onClearMember={handleClearMember}
            isLoading={issuingRewards}
          />
          <RecentTransactions transactions={transactions} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ShopQRCode shopId={shop?.id} />
          <GrowthPromo />
        </div>
      </div>
    </>
  );
}
