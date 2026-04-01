import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSession, clearSession } from '../lib/session';
import { encodeMemberQR } from '../lib/config';
import QRCode from 'qrcode';
import UpgradePromptModal from '../components/member/UpgradePromptModal';
import ProfileIncompleteModal from '../components/member/ProfileIncompleteModal';

interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  qr_code: string;
  status: string;
  sa_id?: string;
  suburb?: string;
  city?: string;
}

interface MemberCoverPlan {
  id: string;
  creation_order: number;
  target_amount: number | string;
  funded_amount: number | string;
  overflow_balance: number | string;
  status: string;
  active_from: string | null;
  active_to: string | null;
  cover_plans: {
    plan_name: string;
  };
}

interface Transaction {
  id: string;
  purchase_amount: number;
  member_amount: number;
  created_at: string;
  partners: {
    shop_name: string;
  };
}

const DashboardNew: React.FC = () => {
  const navigate = useNavigate();
  
  // Member and data state
  const [member, setMember] = useState<Member | null>(null);
  const [mainCoverPlan, setMainCoverPlan] = useState<MemberCoverPlan | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for form inputs
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showProfileIncomplete, setShowProfileIncomplete] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const generateQRCode = async (qrCode: string, phone: string) => {
    const qrValue = encodeMemberQR(qrCode, phone);
    try {
      const url = await QRCode.toDataURL(qrValue, {
        width: 400,
        margin: 2,
        color: { dark: '#1a558b', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const session = getSession();
      
      if (!session) {
        navigate('/member/login');
        return;
      }

      const sessionMemberData = session.member;
      
      if (!sessionMemberData || !sessionMemberData.id) {
        console.error('No member data in session');
        navigate('/member/login');
        return;
      }

      // Fetch member data
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('id, full_name, cell_phone, email, qr_code, status, sa_id, suburb, city, postal_code')
        .eq('id', sessionMemberData.id)
        .single();

      if (memberError || !memberData) {
        console.error('Error fetching member data:', memberError);
        navigate('/member/login');
        return;
      }

      setMember({
        id: memberData.id,
        name: memberData.full_name,
        phone: memberData.cell_phone,
        email: memberData.email,
        qr_code: memberData.qr_code,
        status: memberData.status,
        sa_id: memberData.sa_id,
        suburb: memberData.suburb,
        city: memberData.city
      });
      
      setFullName(memberData.full_name);
      setContactNumber(memberData.cell_phone);
      setEmail(memberData.email || '');

      // Generate QR code
      if (memberData.qr_code) {
        generateQRCode(memberData.qr_code, memberData.cell_phone);
      }

      // Get main cover plan
      const { data: coverPlansData } = await supabase
        .from('member_cover_plans')
        .select(`
          *,
          cover_plans (plan_name)
        `)
        .eq('member_id', memberData.id)
        .order('creation_order', { ascending: true });

      if (coverPlansData && coverPlansData.length > 0) {
        const planWithNumbers = {
          ...coverPlansData[0],
          target_amount: typeof coverPlansData[0].target_amount === 'string' 
            ? parseFloat(coverPlansData[0].target_amount) 
            : coverPlansData[0].target_amount,
          funded_amount: typeof coverPlansData[0].funded_amount === 'string' 
            ? parseFloat(coverPlansData[0].funded_amount) 
            : coverPlansData[0].funded_amount,
          overflow_balance: typeof coverPlansData[0].overflow_balance === 'string' 
            ? parseFloat(coverPlansData[0].overflow_balance) 
            : (coverPlansData[0].overflow_balance || 0)
        };
        setMainCoverPlan(planWithNumbers);
      }

      // Get recent transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select(`
          id,
          purchase_amount,
          member_amount,
          created_at,
          partners (shop_name)
        `)
        .eq('member_id', memberData.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (txData) {
        setRecentTransactions(txData as any);
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    clearSession();
    navigate('/member/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  // Calculate values
  const targetAmount = mainCoverPlan ? Number(mainCoverPlan.target_amount) : 0;
  const fundedAmount = mainCoverPlan ? Number(mainCoverPlan.funded_amount) : 0;
  const overflowBalance = mainCoverPlan ? Number(mainCoverPlan.overflow_balance) : 0;
  const totalCashbackEarned = fundedAmount + overflowBalance;
  const progressPercent = mainCoverPlan 
    ? Math.min((fundedAmount / targetAmount) * 100, 100)
    : 0;

  // Check if we should show upgrade prompt (when overflow >= plan amount on login)
  useEffect(() => {
    if (mainCoverPlan && overflowBalance >= targetAmount && mainCoverPlan.status === 'active') {
      const lastPromptOverflow = sessionStorage.getItem('last_upgrade_prompt_overflow');
      const currentOverflowKey = `${mainCoverPlan.id}_${Math.floor(overflowBalance)}`;
      
      if (lastPromptOverflow !== currentOverflowKey) {
        setShowUpgradePrompt(true);
        sessionStorage.setItem('last_upgrade_prompt_overflow', currentOverflowKey);
      }
    }
  }, [mainCoverPlan, overflowBalance, targetAmount]);

  // Check profile completeness when plan reaches 90%+
  useEffect(() => {
    if (!member || !mainCoverPlan) return;

    const checkProfileCompleteness = async () => {
      const missing: string[] = [];
      if (!member.email || member.email.includes('@plus1rewards.local')) {
        missing.push('Valid Email Address');
      }
      if (!member.sa_id) {
        missing.push('SA ID Number');
      }
      if (!member.suburb) {
        missing.push('Suburb');
      }

      const isProfileIncomplete = missing.length > 0;

      if (isProfileIncomplete && progressPercent >= 90) {
        setMissingFields(missing);
        
        const lastPromptProgress = sessionStorage.getItem('last_profile_prompt_progress');
        const currentProgressKey = `${mainCoverPlan.id}_${Math.floor(progressPercent)}`;
        
        if (lastPromptProgress !== currentProgressKey) {
          setShowProfileIncomplete(true);
          sessionStorage.setItem('last_profile_prompt_progress', currentProgressKey);

          try {
            await supabase.from('admin_notifications').insert({
              type: 'profile_incomplete',
              member_id: member.id,
              member_name: member.name,
              member_phone: member.phone,
              message: `Member ${member.name} (${member.phone}) has reached ${progressPercent.toFixed(0)}% cover plan completion but has incomplete profile. Missing: ${missing.join(', ')}`,
              priority: progressPercent >= 100 ? 'high' : 'medium',
              metadata: {
                progress_percent: progressPercent,
                missing_fields: missing,
                cover_plan_id: mainCoverPlan.id
              }
            });
          } catch (error) {
            console.error('Error creating admin notification:', error);
          }
        }
      }

      if (isProfileIncomplete && progressPercent >= 100 && mainCoverPlan.status === 'in_progress') {
        setShowProfileIncomplete(true);
        setMissingFields(missing);
      }
    };

    checkProfileCompleteness();
  }, [member, mainCoverPlan, progressPercent]);

  const handleUpgrade = async () => {
    if (!mainCoverPlan) return;

    const currentTarget = Number(mainCoverPlan.target_amount);
    const currentOverflow = Number(mainCoverPlan.overflow_balance);
    
    let nextTarget = 0;
    let upgradeCost = 0;
    
    if (currentTarget === 385) {
      nextTarget = 500;
      upgradeCost = 115;
    } else if (currentTarget === 500) {
      nextTarget = 750;
      upgradeCost = 250;
    } else {
      alert('You are already on the highest plan!');
      return;
    }

    if (currentOverflow < upgradeCost) {
      alert(`You need R${upgradeCost.toFixed(2)} to upgrade. You have R${currentOverflow.toFixed(2)}.`);
      return;
    }

    try {
      const newOverflow = currentOverflow - upgradeCost;
      
      const { error } = await supabase
        .from('member_cover_plans')
        .update({ 
          target_amount: nextTarget,
          funded_amount: nextTarget,
          overflow_balance: newOverflow,
          status: 'active',
          active_from: new Date().toISOString(),
          active_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', mainCoverPlan.id);

      if (error) throw error;

      await supabase
        .from('cover_plan_wallet_entries')
        .insert({
          member_id: member!.id,
          member_cover_plan_id: mainCoverPlan.id,
          entry_type: 'overflow_moved',
          amount: -upgradeCost,
          balance_after: newOverflow
        });

      setShowUpgradePrompt(false);
      sessionStorage.removeItem('last_upgrade_prompt_overflow');
      loadDashboardData();
      
      alert(`Successfully upgraded to R${nextTarget} plan! Remaining overflow: R${newOverflow.toFixed(2)}`);
    } catch (error) {
      console.error('Error upgrading plan:', error);
      alert('Failed to upgrade plan. Please try again.');
    }
  };

  const handleDeclineUpgrade = () => {
    setShowUpgradePrompt(false);
  };

  const handleSaveProfile = async () => {
    if (!member) return;

    try {
      const { error } = await supabase
        .from('members')
        .update({
          full_name: fullName,
          cell_phone: contactNumber,
          email: email,
          sa_id: member.sa_id,
          suburb: member.suburb,
          city: member.city
        })
        .eq('id', member.id);

      if (error) throw error;

      alert('Profile updated successfully!');
      loadDashboardData();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleDiscardChanges = () => {
    if (member) {
      setFullName(member.name);
      setContactNumber(member.phone);
      setEmail(member.email || '');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light text-gray-900">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 h-16 bg-slate-900 dark:bg-background-dark z-50 transition-all">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <img 
            src="/logo.png" 
            alt="Plus1 Rewards" 
            className="h-8 w-auto"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><text x="10" y="25" fill="white" font-family="Arial" font-size="16" font-weight="bold">Plus1</text></svg>';
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Profile Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* Profile Picture - placeholder if not available */}
              <div className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-gray-400 text-4xl">person</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                ACTIVE
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{member?.name || 'Member'}</h1>
              <p className="text-gray-600 font-medium">{member?.phone} • {member?.qr_code}</p>
              <button 
                onClick={() => {
                  const element = document.getElementById('edit-profile-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="mt-2 text-gray-900 font-bold text-sm flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-sm">edit</span> Edit Profile
              </button>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg flex items-center gap-4 shadow-sm border border-gray-200">
            <button 
              onClick={() => setShowQRModal(true)}
              className="bg-white p-1 rounded-[4px] border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
            >
              {qrDataUrl ? (
                <img
                  className="w-16 h-16"
                  src={qrDataUrl}
                  alt="QR Code"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400">qr_code</span>
                </div>
              )}
            </button>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.05em]">Membership ID</p>
              <p className="text-sm font-bold text-gray-900">{member?.qr_code || 'N/A'}</p>
              <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-[4px]">
                DIGITAL PASS
              </span>
            </div>
          </div>
        </div>


        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Balance & Metrics */}
          <div className="md:col-span-8 flex flex-col gap-6">
            {/* Primary Balance Card */}
            <div className="bg-blue-700 text-white p-8 rounded-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
              </div>
              <div>
                <p className="text-blue-200 text-xs font-bold uppercase tracking-[0.1em] mb-1">
                  Available Cashback Balance
                </p>
                <h2 className="text-6xl font-extrabold tracking-tighter">R{overflowBalance.toFixed(2)}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/20">
                <div>
                  <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.05em]">
                    Total Lifetime Earned
                  </p>
                  <p className="text-xl font-bold">R{totalCashbackEarned.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.05em]">
                    Policy Deductions
                  </p>
                  <p className="text-xl font-bold text-green-300">-R{fundedAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Manage Cashback Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="!bg-blue-600 !text-white p-4 rounded-lg text-left hover:scale-[0.98] transition-all flex flex-col justify-between min-h-[120px]">
                <span className="material-symbols-outlined text-2xl !text-white">upgrade</span>
                <span className="font-bold text-sm leading-tight !text-white">
                  Upgrade<br />Plan
                </span>
              </button>
              <button className="!bg-teal-800 !text-white p-4 rounded-lg text-left hover:scale-[0.98] transition-all flex flex-col justify-between min-h-[120px]">
                <span className="material-symbols-outlined text-2xl !text-white">person_add</span>
                <span className="font-bold text-sm leading-tight !text-white">
                  Add<br />Dependant
                </span>
              </button>
              <button className="!bg-green-700 !text-white p-4 rounded-lg text-left hover:scale-[0.98] transition-all flex flex-col justify-between min-h-[120px]">
                <span className="material-symbols-outlined text-2xl !text-white">volunteer_activism</span>
                <span className="font-bold text-sm leading-tight !text-white">
                  Sponsor<br />Someone
                </span>
              </button>
              <button className="!bg-slate-600 !text-white p-4 rounded-lg text-left hover:scale-[0.98] transition-all flex flex-col justify-between min-h-[120px]">
                <span className="material-symbols-outlined text-2xl !text-white">list_alt</span>
                <span className="font-bold text-sm leading-tight !text-white">
                  View All<br />Plans
                </span>
              </button>
            </div>


            {/* Recent Transactions */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-gray-500">
                  Recent Rewards History
                </h3>
                <button className="text-blue-600 text-xs font-bold hover:underline">View Statement</button>
              </div>
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent transactions</p>
                  </div>
                ) : (
                  recentTransactions.map((tx, index) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg transition-colors hover:bg-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-blue-600">
                            {index === 0 ? 'shopping_cart' : index === 1 ? 'medication' : 'coffee'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{tx.partners?.shop_name || 'Partner Store'}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                            {formatDate(tx.created_at)} • CASHBACK REWARD
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-sm text-green-600">+R{tx.member_amount.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-500">Cashback</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>


          {/* Side Grid Column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Active Policy Card */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em]">
                    Current Plan
                  </p>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                    {mainCoverPlan?.cover_plans?.plan_name || 'No Plan'}
                  </h3>
                </div>
                <span className="material-symbols-outlined text-blue-600">verified</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className={`text-xs font-bold ${mainCoverPlan?.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                    Policy {mainCoverPlan?.status === 'active' ? 'Active' : 'In Progress'}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {mainCoverPlan?.status === 'active' ? '100' : progressPercent.toFixed(0)}% Utilization
                  </span>
                </div>
                {/* Precision Progress Bar */}
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${mainCoverPlan?.status === 'active' ? 'bg-green-500' : 'bg-blue-500'}`} 
                    style={{ width: `${mainCoverPlan?.status === 'active' ? 100 : progressPercent}%` }}
                  ></div>
                </div>
                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Premium</p>
                    <p className="text-sm font-bold text-slate-900">R{targetAmount.toFixed(2)}/mo</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Renewal</p>
                    <p className="text-sm font-bold text-slate-900">
                      {mainCoverPlan?.active_to ? new Date(mainCoverPlan.active_to).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/find-partner')}
                className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors group border border-blue-100">
                <span className="material-symbols-outlined text-blue-600 group-hover:scale-110 transition-transform">
                  store
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-center text-gray-900">Find Partners</span>
              </button>
              <button 
                onClick={() => navigate('/member/cover-plans')}
                className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors group border border-blue-100">
                <span className="material-symbols-outlined text-blue-600 group-hover:scale-110 transition-transform">
                  health_and_safety
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-center text-gray-900">My Cover Plans</span>
              </button>
              <button 
                onClick={() => navigate('/member/transactions')}
                className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors group border border-blue-100">
                <span className="material-symbols-outlined text-blue-600 group-hover:scale-110 transition-transform">
                  history
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-center text-gray-900">View All Transactions</span>
              </button>
              <button 
                onClick={() => navigate('/member/top-up')}
                className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors group border border-blue-100">
                <span className="material-symbols-outlined text-blue-600 group-hover:scale-110 transition-transform">
                  account_balance
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-center text-gray-900">Top Up</span>
              </button>
              <button 
                onClick={() => navigate('/member/linked-people')}
                className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors group border border-blue-100">
                <span className="material-symbols-outlined text-blue-600 group-hover:scale-110 transition-transform">
                  group
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-center text-gray-900">Linked People</span>
              </button>
              <button 
                onClick={() => navigate('/member/support')}
                className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors group border border-blue-100">
                <span className="material-symbols-outlined text-blue-600 group-hover:scale-110 transition-transform">
                  support_agent
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-center text-gray-900">Support</span>
              </button>
            </div>
          </div>


          {/* Settings Form Section */}
          <div id="edit-profile-section" className="md:col-span-12 bg-blue-50 rounded-lg border border-blue-100 overflow-hidden shadow-sm">
            <div className="bg-blue-100 px-6 py-4 flex items-center gap-2 border-b border-blue-200">
              <span className="material-symbols-outlined text-blue-700">manage_accounts</span>
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-gray-700">
                Account Settings &amp; Preferences
              </h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.05em] block">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.05em] block">
                    Contact Number
                  </label>
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.05em] block">
                    Email Address
                  </label>
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.05em] block">
                    SA ID Number
                  </label>
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    type="text"
                    placeholder="Enter your SA ID number"
                    value={member?.sa_id || ''}
                    onChange={(e) => setMember(prev => prev ? {...prev, sa_id: e.target.value} : null)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.05em] block">
                    Suburb
                  </label>
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    type="text"
                    placeholder="Enter your suburb"
                    value={member?.suburb || ''}
                    onChange={(e) => setMember(prev => prev ? {...prev, suburb: e.target.value} : null)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.05em] block">
                    City
                  </label>
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    type="text"
                    placeholder="Enter your city"
                    value={member?.city || ''}
                    onChange={(e) => setMember(prev => prev ? {...prev, city: e.target.value} : null)}
                  />
                </div>
              </div>
              <div className="mt-10 flex justify-end gap-3">
                <button 
                  onClick={handleDiscardChanges}
                  className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors rounded-lg"
                >
                  Discard Changes
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="bg-blue-600 text-white px-8 py-2.5 text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-all"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-white dark:bg-background-dark shadow-[0px_-4px_20px_rgba(0,31,40,0.06)] border-t border-gray-200">
        <button className="flex flex-col items-center justify-center bg-primary-50 text-primary-600 rounded-lg px-3 py-1 transition-transform active:scale-95">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            dashboard
          </span>
          <span className="text-[10px] uppercase font-bold tracking-[0.05em]">
            Dashboard
          </span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-all">
          <span className="material-symbols-outlined">military_tech</span>
          <span className="text-[10px] uppercase font-bold tracking-[0.05em]">
            Rewards
          </span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-all">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[10px] uppercase font-bold tracking-[0.05em]">
            History
          </span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-all">
          <span className="material-symbols-outlined">medical_services</span>
          <span className="text-[10px] uppercase font-bold tracking-[0.05em]">
            Health
          </span>
        </button>
      </nav>

      {/* QR Code Modal */}
      {showQRModal && qrDataUrl && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQRModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Your Member QR Code</h3>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
              <img 
                src={qrDataUrl} 
                alt="Member QR Code" 
                className="w-full h-auto"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Show this QR code at partner stores</p>
              <p className="text-xs text-gray-500">{member?.name}</p>
              <p className="text-xs text-gray-500">{member?.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && mainCoverPlan && (
        <UpgradePromptModal
          currentPlanName={mainCoverPlan.cover_plans.plan_name}
          currentTarget={targetAmount}
          fundedAmount={fundedAmount}
          overflowAmount={overflowBalance}
          onUpgrade={handleUpgrade}
          onDecline={handleDeclineUpgrade}
        />
      )}

      {/* Profile Incomplete Modal */}
      {showProfileIncomplete && member && (
        <ProfileIncompleteModal
          memberName={member.name}
          percentComplete={progressPercent}
          missingFields={missingFields}
          onClose={() => {
            if (progressPercent < 100) {
              setShowProfileIncomplete(false);
            }
          }}
          onForceClose={() => {
            setShowProfileIncomplete(false);
          }}
        />
      )}
    </div>
  );
};

export default DashboardNew;
