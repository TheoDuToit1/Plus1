// src/components/partner/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { usePartnerDashboard } from '../../../hooks/usePartnerDashboard';
import WelcomeSection from '../components/WelcomeSection';
import TopStatsGrid from '../components/TopStatsGrid';
import RewardsIssuanceTool from '../components/RewardsIssuanceTool';
import RecentTransactions from '../components/RecentTransactions';
import PartnerQRCode from '../components/PartnerQRCode';
import GrowthPromo from '../components/GrowthPromo';

export default function Dashboard() {
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [activeTab, setActiveTab] = useState('scan');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [memberDetails, setMemberDetails] = useState<any>(null);
  const [issuingRewards, setIssuingRewards] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { shop, transactions, stats, loading, error, issueRewards, searchMember } = usePartnerDashboard(partnerId);

  // Get current shop from auth
  useEffect(() => {
    const getcurrentPartner = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          // Try to refresh the session
          const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
          if (!refreshedSession) {
            setAuthLoading(false);
            return;
          }
        }
        
        if (session?.user?.id) {
          // Find shop by matching auth user ID to shop ID
          const { data: partnerData, error: partnerError } = await supabase
            .from('partners')
            .select('id, name, status')
            .eq('id', session.user.id)
            .single();
          
          if (partnerData) {
            setPartnerId(partnerData.id);
          } else {
            console.log('No partner found for user ID:', session.user.id);
            // Try to find by email as fallback
            const { data: partnerByEmail } = await supabase
              .from('partners')
              .select('id, name, status')
              .eq('email', session.user.email)
              .single();
              
            if (partnerByEmail) {
              setPartnerId(partnerByEmail.id);
            } else {
              console.log('No partner found for this user');
            }
          }
        }
      } catch (err) {
        console.error('Error getting current shop:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    getcurrentPartner();
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
      
      // Check if member has a wallet with this partner
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('member_id', member.id)
        .eq('partner_id', partnerId)
        .single();

      if (walletError || !wallet) {
        alert(`${member.name} (${member.phone}) is not connected to Your Business yet. They need to scan Your Business QR code first to join your rewards program.`);
        return;
      }
      
      setSelectedMemberId(member.id);
      setMemberDetails({
        id: member.id,
        name: member.name,
        phone: member.phone,
        balance: wallet?.balance || 0
      });
    } catch (err: any) {
      // Show the detailed error message from searchMember
      alert(err.message || 'Member not found');
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

      // Check if member has a wallet with this partner
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('member_id', member.id)
        .eq('partner_id', partnerId)
        .single();

      if (walletError || !wallet) {
        alert(`${member.name} (${member.phone}) is not connected to Your Business yet. They need to scan Your Business QR code first to join your rewards program.`);
        return;
      }

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
          <div className="w-12 h-12 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!partnerId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-900 mb-4">No partner found for your account</p>
          <p className="text-gray-600 text-sm">Please contact support or register a shop</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-700">
          {successMessage}
        </div>
      )}
      <WelcomeSection shopName={shop?.name} partnerId={shop?.id} />
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
          <PartnerQRCode partnerId={shop?.id} />
          <GrowthPromo />
        </div>
      </div>
    </>
  );
}
