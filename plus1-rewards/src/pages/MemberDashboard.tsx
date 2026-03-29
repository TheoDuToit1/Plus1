import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSession, clearSession } from '../lib/session';
import MemberLayout from '../components/member/MemberLayout';
import UpgradePromptModal from '../components/member/UpgradePromptModal';
import ProfileIncompleteModal from '../components/member/ProfileIncompleteModal';

interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  qr_code: string;
  status: string;
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

export function MemberDashboard() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [mainCoverPlan, setMainCoverPlan] = useState<MemberCoverPlan | null>(null);
  const [totalCoverPlans, setTotalCoverPlans] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showProfileIncomplete, setShowProfileIncomplete] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const loadDashboardData = async () => {
    try {
      const session = getSession();
      
      if (!session) {
        navigate('/member/login');
        return;
      }

      // Get member data
      const { data: memberData } = await supabase
        .from('members')
        .select('id, full_name, phone, email, qr_code, status')
        .eq('user_id', session.user.id)
        .single();

      if (memberData) {
        setMember({
          ...memberData,
          name: memberData.full_name
        });

        // Get main cover plan (first by creation order) using member.id
        const { data: coverPlansData, error: coverPlansError } = await supabase
          .from('member_cover_plans')
          .select(`
            *,
            cover_plans (plan_name)
          `)
          .eq('member_id', memberData.id)
          .order('creation_order', { ascending: true });

        console.log('Cover Plans Query Result:', { coverPlansData, coverPlansError, memberId: memberData.id });

        if (coverPlansData && coverPlansData.length > 0) {
          console.log('Setting main cover plan:', coverPlansData[0]);
          // Convert string amounts to numbers
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
          setTotalCoverPlans(coverPlansData.length);
        } else {
          console.log('No cover plans found for member');
        }

        // Get recent transactions using member.id
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
          .limit(5);

        if (txData) {
          setRecentTransactions(txData as any);
        }
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const targetAmount = mainCoverPlan ? Number(mainCoverPlan.target_amount) : 0;
  const fundedAmount = mainCoverPlan ? Number(mainCoverPlan.funded_amount) : 0;
  const overflowBalance = mainCoverPlan ? Number(mainCoverPlan.overflow_balance) : 0;

  const progressPercent = mainCoverPlan 
    ? Math.min((fundedAmount / targetAmount) * 100, 100)
    : 0;

  const amountStillNeeded = mainCoverPlan 
    ? Math.max(targetAmount - fundedAmount, 0)
    : 0;

  // Total cashback earned = funded amount + overflow balance
  const totalCashbackEarned = fundedAmount + overflowBalance;

  // Check if we should show upgrade prompt (when overflow >= plan amount on login)
  // This happens AFTER the transaction has been processed and member logs in
  useEffect(() => {
    if (mainCoverPlan && overflowBalance >= targetAmount && mainCoverPlan.status === 'active') {
      // Check if user has seen the prompt for this overflow level
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
      // Check if profile is incomplete
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
        
        // Check if we've already shown the prompt for this progress level
        const lastPromptProgress = sessionStorage.getItem('last_profile_prompt_progress');
        const currentProgressKey = `${mainCoverPlan.id}_${Math.floor(progressPercent)}`;
        
        if (lastPromptProgress !== currentProgressKey) {
          setShowProfileIncomplete(true);
          sessionStorage.setItem('last_profile_prompt_progress', currentProgressKey);

          // Notify admin if at 90%+ with incomplete profile
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

      // If at 100% and profile incomplete, prevent activation
      if (isProfileIncomplete && progressPercent >= 100 && mainCoverPlan.status === 'in_progress') {
        // Keep showing the modal until profile is complete
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
    
    // Determine next plan tier and cost
    let nextTarget = 0;
    let upgradeCost = 0;
    
    if (currentTarget === 385) {
      nextTarget = 500;
      upgradeCost = 115; // 500 - 385
    } else if (currentTarget === 500) {
      nextTarget = 750;
      upgradeCost = 250; // 750 - 500
    } else {
      alert('You are already on the highest plan!');
      return;
    }

    // Check if enough overflow to upgrade
    if (currentOverflow < upgradeCost) {
      alert(`You need R${upgradeCost.toFixed(2)} to upgrade. You have R${currentOverflow.toFixed(2)}.`);
      return;
    }

    try {
      const newOverflow = currentOverflow - upgradeCost;
      
      // Update the cover plan: increase target, deduct from overflow, extend active period
      const { error } = await supabase
        .from('member_cover_plans')
        .update({ 
          target_amount: nextTarget,
          funded_amount: nextTarget, // Plan is now funded at new level
          overflow_balance: newOverflow,
          status: 'active',
          active_from: new Date().toISOString(),
          active_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', mainCoverPlan.id);

      if (error) throw error;

      // Record the upgrade in wallet entries
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
      loadDashboardData(); // Reload to show updated plan
      
      alert(`Successfully upgraded to R${nextTarget} plan! Remaining overflow: R${newOverflow.toFixed(2)}`);
    } catch (error) {
      console.error('Error upgrading plan:', error);
      alert('Failed to upgrade plan. Please try again.');
    }
  };

  const handleDeclineUpgrade = () => {
    setShowUpgradePrompt(false);
    // Don't remove the session key so it doesn't show again this session
  };

  const handleAddDependant = () => {
    navigate('/member/add-dependant');
  };

  const handleSponsorSomeone = () => {
    navigate('/member/sponsor');
  };

  const handleSignOut = () => {
    clearSession();
    navigate('/member/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <MemberLayout
        member={member}
        isOnline={navigator.onLine}
        pendingTransactions={0}
        onSignOut={handleSignOut}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout
      member={member}
      isOnline={navigator.onLine}
      pendingTransactions={0}
      onSignOut={handleSignOut}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Dashboard</h1>
          <p className="text-gray-600">Welcome back, {member?.name || 'Member'}</p>
        </div>
        <button
          onClick={() => navigate('/member/dashboard#edit-profile')}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-[#1a558b] text-[#1a558b] font-bold px-4 py-2 rounded-xl transition-colors"
        >
          <span className="material-symbols-outlined">edit</span>
          <span className="hidden sm:inline">Edit Profile</span>
        </button>
      </div>

      {/* Status Banner */}
      <div className={`border rounded-xl p-6 mb-6 shadow-sm ${
        member?.status === 'active' ? 'bg-green-50 border-green-200' :
        member?.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
        'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className={`material-symbols-outlined text-2xl ${
            member?.status === 'active' ? 'text-green-600' :
            member?.status === 'pending' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {member?.status === 'active' ? 'check_circle' : member?.status === 'pending' ? 'schedule' : 'warning'}
          </span>
          <div>
            <p className="font-bold text-gray-900">Account Status: {member?.status?.toUpperCase()}</p>
            <p className="text-sm text-gray-600">{member?.phone}</p>
          </div>
        </div>
      </div>

      {/* Default Cover Plan Card - Main Focus */}
      {!mainCoverPlan && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-yellow-600 text-2xl">warning</span>
            <div>
              <p className="font-bold text-yellow-900">No Cover Plan Found</p>
              <p className="text-sm text-yellow-700">Please contact support to set up your default cover plan.</p>
            </div>
          </div>
        </div>
      )}

      {mainCoverPlan && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Default Cover Plan</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              mainCoverPlan.status === 'active' ? 'bg-green-100 text-green-700' :
              mainCoverPlan.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
              'bg-red-100 text-red-700'
            }`}>
              {mainCoverPlan.status === 'active' ? '🟢 ACTIVE' : 
               mainCoverPlan.status === 'in_progress' ? '🟡 IN PROGRESS' : 
               '🔴 SUSPENDED'}
            </span>
          </div>

          <div className="space-y-4">
            {/* Plan Name */}
            <div>
              <p className="font-bold text-gray-900 text-lg mb-1">{mainCoverPlan.cover_plans.plan_name}</p>
              <p className="text-sm text-gray-600">Target: R{targetAmount.toFixed(2)}</p>
            </div>
            
            {/* Progress Section - Show for in_progress status */}
            {mainCoverPlan.status === 'in_progress' && (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Cashback Progress</p>
                  <div className="flex justify-between text-sm text-gray-900 font-bold mb-2">
                    <span>R{fundedAmount.toFixed(2)} funded</span>
                    <span>R{targetAmount.toFixed(2)} target</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="h-4 rounded-full transition-all bg-blue-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {progressPercent.toFixed(0)}% complete • R{amountStillNeeded.toFixed(2)} still needed
                  </p>
                </div>

                {/* Cashback Balance Breakdown - Show even during in_progress */}
                {totalCashbackEarned > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <p className="text-blue-900 font-bold text-sm mb-3">Cashback Balance Breakdown</p>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Total Cashback Earned:</span>
                      <span className="text-blue-900 font-bold">R{totalCashbackEarned.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Allocated to Cover Plan:</span>
                      <span className="text-blue-900 font-bold">- R{fundedAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-blue-300 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-blue-900 font-bold">Overflow Balance:</span>
                        <span className={`font-bold text-lg ${overflowBalance > 0 ? 'text-purple-600' : 'text-blue-900'}`}>
                          R{overflowBalance.toFixed(2)}
                        </span>
                      </div>
                      {overflowBalance > 0 && (
                        <p className="text-xs text-blue-700 mt-1">
                          Extra cashback available once your plan is active
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Active Status - Show funded amount and overflow */}
            {mainCoverPlan.status === 'active' && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-green-800 text-sm font-bold">✓ Policy Active</p>
                      <p className="text-green-700 text-xs">
                        Coverage until {mainCoverPlan.active_to ? new Date(mainCoverPlan.active_to).toLocaleDateString('en-ZA') : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-900 font-bold text-lg">R{targetAmount.toFixed(2)}</p>
                      <p className="text-green-700 text-xs">Policy Amount</p>
                    </div>
                  </div>
                </div>

                {/* Cashback Balance Breakdown */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-blue-900 font-bold text-sm mb-3">Cashback Balance Breakdown</p>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Total Cashback Earned:</span>
                    <span className="text-blue-900 font-bold">R{totalCashbackEarned.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Policy Deduction:</span>
                    <span className="text-blue-900 font-bold">- R{targetAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-blue-300 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-blue-900 font-bold">Available Balance:</span>
                      <span className={`font-bold text-lg ${overflowBalance > 0 ? 'text-purple-600' : 'text-blue-900'}`}>
                        R{overflowBalance.toFixed(2)}
                      </span>
                    </div>
                    {overflowBalance > 0 && (
                      <p className="text-xs text-blue-700 mt-1">
                        This overflow can be used to upgrade, add dependants, or sponsor someone
                      </p>
                    )}
                    {overflowBalance === 0 && (
                      <p className="text-xs text-blue-700 mt-1">
                        Keep shopping to build overflow for upgrades or dependants
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* In Progress Status */}
            {mainCoverPlan.status === 'in_progress' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm font-bold">
                  ⏳ Keep shopping to build up your cashback! R{amountStillNeeded.toFixed(2)} more needed.
                </p>
              </div>
            )}

            {/* Suspended Status */}
            {mainCoverPlan.status === 'suspended' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm font-bold">
                  ⚠ Not enough cashback yet. Shop more or top up to reactivate your cover.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overflow Management Buttons */}
      {mainCoverPlan && mainCoverPlan.status === 'active' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Manage Your Cashback</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upgrade Plan Button */}
            <button
              onClick={handleUpgrade}
              disabled={Number(mainCoverPlan.target_amount) >= 750}
              className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-6 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 flex flex-col items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-4xl">upgrade</span>
              <span>Upgrade Plan</span>
              <span className="text-xs opacity-90">
                {Number(mainCoverPlan.target_amount) >= 750 ? 'Max plan reached' : 'Increase coverage'}
              </span>
            </button>

            {/* Add Dependant Button */}
            <button
              onClick={handleAddDependant}
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 rounded-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-4xl">group_add</span>
              <span>Add Dependant</span>
              <span className="text-xs opacity-90">Cover family members</span>
            </button>

            {/* Sponsor Someone Button */}
            <button
              onClick={handleSponsorSomeone}
              className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 rounded-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-4xl">card_giftcard</span>
              <span>Sponsor Someone</span>
              <span className="text-xs opacity-90">Help someone get covered</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl">health_and_safety</span>
            <div>
              <p className="text-gray-900 font-bold text-xl">{totalCoverPlans}</p>
              <p className="text-gray-600 text-sm">Total Cover Plans</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl">account_balance_wallet</span>
            <div>
              <p className="text-gray-900 font-bold text-xl">
                R{overflowBalance.toFixed(2)}
              </p>
              <p className="text-gray-600 text-sm">Available Balance</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl">receipt</span>
            <div>
              <p className="text-gray-900 font-bold text-xl">{recentTransactions.length}</p>
              <p className="text-gray-600 text-sm">Recent Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">receipt_long</span>
            <h3 className="text-gray-900 font-bold text-lg mb-2">No transactions yet</h3>
            <p className="text-gray-600">Start shopping at partner stores to earn cashback!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1a558b]/10 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#1a558b] text-xl">store</span>
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold">
                        {tx.partners?.shop_name || 'Partner Store'}
                      </h3>
                      <p className="text-gray-600 text-sm">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-900 font-bold text-lg">R{tx.purchase_amount.toFixed(2)}</p>
                    <p className="text-green-600 text-sm">+R{tx.member_amount.toFixed(2)} cashback</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/go/'}
            className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">store</span>
            Find Partners
          </button>

          <button
            onClick={() => navigate('/member/dashboard')}
            className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">home</span>
            Rewards Main
          </button>

          <button
            onClick={() => navigate('/member/qr')}
            className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">qr_code</span>
            Show QR Code
          </button>

          <button
            onClick={() => navigate('/member/cover-plans')}
            className="bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-900 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">health_and_safety</span>
            My Cover Plans
          </button>

          <button
            onClick={() => navigate('/member/transactions')}
            className="bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-900 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">history</span>
            View All Transactions
          </button>

          <button
            onClick={() => navigate('/member/top-up')}
            className="bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-900 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">account_balance</span>
            Top Up
          </button>

          <button
            onClick={() => navigate('/member/linked-people')}
            className="bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-900 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">group</span>
            Linked People
          </button>

          <button
            onClick={() => navigate('/member/support')}
            className="bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-900 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">support_agent</span>
            Support
          </button>
        </div>
      </div>

      {/* Profile Editing Section */}
      <div id="edit-profile" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <p className="text-sm text-gray-600 mt-1">Update your personal information</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={member?.name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Contact support to change your name</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={member?.phone || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Contact support to change your phone</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={member?.email || ''}
                placeholder="Add your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a558b] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <input
                type="text"
                value={member?.status?.toUpperCase() || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => alert('Profile update functionality coming soon!')}
              className="px-6 py-2 bg-[#1a558b] text-white font-bold rounded-lg hover:bg-[#1a558b]/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

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
            // Only allow closing if not at 100%
            if (progressPercent < 100) {
              setShowProfileIncomplete(false);
            }
          }}
        />
      )}
    </MemberLayout>
  );
}
