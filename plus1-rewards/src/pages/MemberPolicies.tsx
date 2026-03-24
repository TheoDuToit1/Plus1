// plus1-rewards/src/pages/MemberPolicies.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSession, clearSession } from '../lib/session';
import MemberLayout from '../components/member/MemberLayout';
import PolicyOverflowModal from '../components/member/PolicyOverflowModal';

interface PolicyHolder {
  id: string;
  policy_number: string;
  status: string;
  start_date: string;
  monthly_premium: number;
  amount_funded: number;
  policy_plans: {
    id: string;
    name: string;
    monthly_target: number;
    family: string;
    variant: string;
    adults: number;
    children: number;
  };
  policy_providers: {
    name: string;
    status: string;
  };
}

interface Member {
  id: string;
  name: string;
  phone: string;
  qr_code: string;
  active_policy: string;
}

const BLUE = '#1a558b';

export default function MemberPolicies() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [policies, setPolicies] = useState<PolicyHolder[]>([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOverflowModal, setShowOverflowModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyHolder | null>(null);

  useEffect(() => {
    loadPoliciesData();
  }, []);

  const loadPoliciesData = async () => {
    setLoading(true);
    try {
      const session = getSession();
      if (!session) {
        navigate('/member/login');
        return;
      }

      // Get member data
      const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (memberData) {
        setMember(memberData);
      }

      // Get all policies for this member (both as policy holder and active policy)
      const { data: policiesData } = await supabase
        .from('policy_holders')
        .select(`
          *,
          policy_plans (id, name, monthly_target, family, variant, adults, children),
          policy_providers (name, status)
        `)
        .eq('member_id', session.user.id)
        .order('created_at', { ascending: false });

      // Also get the member's active policy if it's not in policy_holders yet
      let allPolicies = policiesData || [];
      
      if (memberData?.active_policy && allPolicies.length === 0) {
        // If member has an active policy but no policy_holders records, 
        // create a virtual policy record for display
        const { data: activePolicyPlan } = await supabase
          .from('policy_plans')
          .select('*')
          .eq('id', memberData.active_policy)
          .single();

        if (activePolicyPlan) {
          // Get total funding from wallets for this policy
          const { data: walletsData } = await supabase
            .from('wallets')
            .select('rewards_total, balance')
            .eq('member_id', session.user.id);

          const totalFunding = walletsData?.reduce((sum, wallet) => sum + (wallet.rewards_total || wallet.balance || 0), 0) || 0;

          // Create virtual policy holder record
          const virtualPolicy = {
            id: `virtual-${memberData.active_policy}`,
            policy_number: `ACTIVE-${memberData.active_policy.slice(0, 8)}`,
            status: 'active',
            start_date: new Date().toISOString().split('T')[0],
            monthly_premium: activePolicyPlan.monthly_target,
            amount_funded: totalFunding,
            policy_plans: activePolicyPlan,
            policy_providers: {
              name: 'Default Provider',
              status: 'active'
            }
          };

          allPolicies = [virtualPolicy];
        }
      }

      if (allPolicies) {
        setPolicies(allPolicies);
      }

      // Get total rewards from all wallets
      const { data: walletsData } = await supabase
        .from('wallets')
        .select('rewards_total, balance')
        .eq('member_id', session.user.id);

      if (walletsData) {
        const total = walletsData.reduce((sum, wallet) => sum + (wallet.rewards_total || wallet.balance || 0), 0);
        setTotalRewards(total);
      }

    } catch (error) {
      console.error('Error loading policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageOverflow = (policy: PolicyHolder) => {
    setSelectedPolicy(policy);
    setShowOverflowModal(true);
  };

  const getProgressPercentage = (funded: number, target: number) => {
    return Math.min((funded / target) * 100, 100);
  };

  const getOverflowAmount = (funded: number, target: number) => {
    return Math.max(funded - target, 0);
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f8fc' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(26, 85, 139, 0.2)', borderTopColor: BLUE }} />
          <p style={{ color: '#6b7280' }}>Loading your policies...</p>
        </div>
      </div>
    );
  }

  return (
    <MemberLayout 
      member={member}
      isOnline={true}
      pendingTransactions={0}
      onSignOut={() => { clearSession(); navigate('/member/login'); }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>My Policies</h1>
          <p style={{ color: '#6b7280' }}>Manage your insurance policies and funding</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/member/policy-selector')}
            className="font-medium px-4 py-2 rounded-xl transition-colors"
            style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
          >
            + Add Policy
          </button>
          <button 
            onClick={() => navigate('/member/dashboard')}
            className="font-bold px-4 py-2 rounded-xl transition-colors text-white hover:opacity-90"
            style={{ backgroundColor: BLUE }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Total Rewards Overview */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'rgba(26, 85, 139, 0.1)', border: `1px solid rgba(26, 85, 139, 0.2)` }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-sm uppercase tracking-wider" style={{ color: BLUE }}>Total Rewards Available</p>
            <p className="text-3xl font-black mt-1" style={{ color: '#111827' }}>{formatCurrency(totalRewards)}</p>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Available for policy funding</p>
          </div>
          <div style={{ color: BLUE }}>
            <span className="material-symbols-outlined text-5xl">account_balance_wallet</span>
          </div>
        </div>
      </div>

      {/* Policy Summary */}
      {policies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl" style={{ color: BLUE }}>policy</span>
              <div>
                <p className="font-bold text-lg" style={{ color: '#111827' }}>{policies.length}</p>
                <p className="text-sm" style={{ color: '#6b7280' }}>Active Policies</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl p-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl" style={{ color: '#f59e0b' }}>trending_up</span>
              <div>
                <p className="font-bold text-lg" style={{ color: '#111827' }}>
                  {policies.filter(p => getOverflowAmount(p.amount_funded, p.policy_plans.monthly_target) > 0).length}
                </p>
                <p className="text-sm" style={{ color: '#6b7280' }}>With Overflow</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl p-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl" style={{ color: '#10b981' }}>payments</span>
              <div>
                <p className="font-bold text-lg" style={{ color: '#111827' }}>
                  {formatCurrency(policies.reduce((sum, p) => sum + p.policy_plans.monthly_target, 0))}
                </p>
                <p className="text-sm" style={{ color: '#6b7280' }}>Total Monthly Target</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Policies List */}
      {policies.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <span className="material-symbols-outlined text-6xl mb-4 block" style={{ color: '#9ca3af' }}>policy</span>
          <h3 className="font-bold text-lg mb-2" style={{ color: '#111827' }}>No Policies Yet</h3>
          <p className="mb-6" style={{ color: '#6b7280' }}>Start by selecting your first health insurance policy to begin earning rewards.</p>
          <button
            onClick={() => navigate('/member/policy-selector')}
            className="font-bold px-6 py-3 rounded-xl transition-colors text-white hover:opacity-90"
            style={{ backgroundColor: BLUE }}
          >
            Choose Your First Policy
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {policies.map((policy) => {
            const progressPercentage = getProgressPercentage(policy.amount_funded, policy.policy_plans.monthly_target);
            const overflowAmount = getOverflowAmount(policy.amount_funded, policy.policy_plans.monthly_target);
            const hasOverflow = overflowAmount > 0;
            const isActive = member?.active_policy === policy.policy_plans.id || 
                           policy.status === 'active' || 
                           policy.id.startsWith('virtual-');

            return (
              <div key={policy.id} className="rounded-2xl p-6" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
                {/* Policy Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg" style={{ color: '#111827' }}>{policy.policy_plans.name}</h3>
                      {isActive && (
                        <span className="px-2 py-1 rounded-lg text-xs font-bold uppercase" style={{ backgroundColor: 'rgba(26, 85, 139, 0.1)', color: BLUE, border: `1px solid rgba(26, 85, 139, 0.2)` }}>
                          {policy.id.startsWith('virtual-') ? 'Primary Policy' : 'Additional Policy'}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase`} style={{
                        backgroundColor: policy.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: policy.status === 'active' ? '#10b981' : '#f59e0b',
                        border: policy.status === 'active' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        {policy.status}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                      Policy #{policy.policy_number} • {policy.policy_plans.family} Plan • {policy.policy_plans.adults} adults, {policy.policy_plans.children} children
                    </p>
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                      Provider: {policy.policy_providers.name} • Started: {new Date(policy.start_date).toLocaleDateString()}
                      {policy.id.startsWith('virtual-') && <span className="ml-2" style={{ color: BLUE }}>• Funded from rewards</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl" style={{ color: '#111827' }}>{formatCurrency(policy.amount_funded)}</p>
                    <p className="text-sm" style={{ color: '#6b7280' }}>of {formatCurrency(policy.policy_plans.monthly_target)}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm" style={{ color: '#6b7280' }}>Funding Progress</span>
                    <span className="text-sm" style={{ color: '#6b7280' }}>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full rounded-full h-3" style={{ backgroundColor: '#e5e7eb' }}>
                    <div 
                      className="h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(progressPercentage, 100)}%`,
                        backgroundColor: hasOverflow ? '#fbbf24' : BLUE
                      }}
                    ></div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    {hasOverflow ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: '#f59e0b' }}>🎉 Target Exceeded!</span>
                        <span className="text-sm" style={{ color: '#d97706' }}>Overflow: {formatCurrency(overflowAmount)}</span>
                      </div>
                    ) : progressPercentage >= 100 ? (
                      <span className="font-bold" style={{ color: BLUE }}>✓ Target Reached!</span>
                    ) : (
                      <span style={{ color: '#6b7280' }}>
                        {formatCurrency(policy.policy_plans.monthly_target - policy.amount_funded)} remaining
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {hasOverflow && (
                      <button
                        onClick={() => handleManageOverflow(policy)}
                        className="font-bold px-3 py-1 rounded-lg text-sm transition-colors hover:opacity-90"
                        style={{ backgroundColor: '#f59e0b', color: '#000' }}
                      >
                        Manage Overflow
                      </button>
                    )}
                    <button className="px-3 py-1 rounded-lg text-sm transition-colors" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Policy Overflow Modal */}
      {selectedPolicy && (
        <PolicyOverflowModal
          isOpen={showOverflowModal}
          onClose={() => setShowOverflowModal(false)}
          overflowAmount={getOverflowAmount(selectedPolicy.amount_funded, selectedPolicy.policy_plans.monthly_target)}
          currentPolicyName={selectedPolicy.policy_plans.name}
          memberId={member?.id || ''}
          onOverflowHandled={() => {
            setShowOverflowModal(false);
            loadPoliciesData(); // Reload data after overflow handling
          }}
        />
      )}
    </MemberLayout>
  );
}
