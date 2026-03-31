import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSession, clearSession } from '../lib/session';
import MemberLayout from '../components/member/MemberLayout';

interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  qr_code: string;
}

interface CoverPlan {
  id: string;
  plan_name: string;
  monthly_target_amount: number;
}

interface MemberCoverPlan {
  id: string;
  member_id: string;
  cover_plan_id: string;
  creation_order: number;
  target_amount: number;
  funded_amount: number;
  status: 'in_progress' | 'active' | 'suspended';
  active_from: string | null;
  active_to: string | null;
  suspended_at: string | null;
  created_at: string;
  cover_plans: CoverPlan;
}

export default function MemberCoverPlans() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [coverPlans, setCoverPlans] = useState<MemberCoverPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const session = getSession();
      if (!session) {
        navigate('/member/login');
        return;
      }

      // Get member ID from session
      const sessionMemberData = session.member;
      
      if (!sessionMemberData || !sessionMemberData.id) {
        console.error('No member data in session');
        navigate('/member/login');
        return;
      }

      // Fetch fresh member data from database
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('id, full_name, cell_phone, email, qr_code')
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
        qr_code: memberData.qr_code
      });

      // Load cover plans using member.id
      const { data: coverPlansData } = await supabase
        .from('member_cover_plans')
        .select(`
          *,
          cover_plans (
            id,
            plan_name,
            monthly_target_amount
          )
        `)
        .eq('member_id', memberData.id)
        .order('creation_order', { ascending: true });

      if (coverPlansData) {
        setCoverPlans(coverPlansData as any);
      }
    } catch (error) {
      console.error('Error loading cover plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    clearSession();
    navigate('/member/login');
  };

  const getProgressPercent = (plan: MemberCoverPlan) => {
    return Math.min((plan.funded_amount / plan.target_amount) * 100, 100);
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
            <p className="text-gray-600">Loading cover plans...</p>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Cover Plans</h1>
          <p className="text-gray-600">View all your healthcare cover plans</p>
        </div>
        <button
          onClick={() => navigate('/member/dashboard')}
          className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-4 py-2 rounded-xl transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#1a558b] text-2xl">health_and_safety</span>
          <div>
            <p className="text-gray-900 font-bold text-xl">{coverPlans.length}</p>
            <p className="text-gray-600 text-sm">Total Cover Plans</p>
          </div>
        </div>
      </div>

      {/* Cover Plans List */}
      {coverPlans.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">health_and_safety</span>
          <h3 className="text-gray-900 font-bold text-lg mb-2">No cover plans yet</h3>
          <p className="text-gray-600 mb-6">Contact support to add a cover plan</p>
          <button
            onClick={() => navigate('/member/support')}
            className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Contact Support
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {coverPlans.map((plan) => (
            <div key={plan.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      #{plan.creation_order}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{plan.cover_plans.plan_name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">Created {new Date(plan.created_at).toLocaleDateString('en-ZA')}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  plan.status === 'active' ? 'bg-green-100 text-green-700' :
                  plan.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {plan.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>R{plan.funded_amount.toFixed(2)} funded</span>
                  <span>R{plan.target_amount.toFixed(2)} target</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-[#1a558b] h-3 rounded-full transition-all"
                    style={{ width: `${getProgressPercent(plan)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-[#1a558b]">{getProgressPercent(plan).toFixed(1)}%</span>
                </div>

                {plan.status === 'active' && plan.active_to && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Active until: <span className="font-bold text-gray-900">
                        {new Date(plan.active_to).toLocaleDateString('en-ZA')}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </MemberLayout>
  );
}
