// plus1-rewards/src/components/dashboard/Dashboard.tsx
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import Topbar from './Topbar';
import StatsCards, { StatsCardsRef } from './StatsCards';
import FinancialOverview from './FinancialOverview';
import PlatformStatus from './PlatformStatus';
import QuickActions from './QuickActions';
import Footer from './Footer';
import { supabaseAdmin } from '../../lib/supabase';

export default function Dashboard() {
  const statsCardsRef = useRef<StatsCardsRef>(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ message: string; action: () => void } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [membersNeedingVerification, setMembersNeedingVerification] = useState<Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    percentComplete: string;
    amountFunded: number;
    target: number;
  }>>([]);

  const handleRefresh = () => {
    if (statsCardsRef.current) {
      statsCardsRef.current.refresh();
    }
    checkMembersNeedingProfileCompletion();
  };

  const checkMembersNeedingProfileCompletion = async () => {
    try {
      console.log('🔍 Checking for members at 90%+ needing profile completion...');
      
      // Get all members
      const { data: members } = await supabaseAdmin
        .from('members')
        .select('*');
      
      if (!members) return;
      
      console.log(`📋 Found ${members.length} members`);
      
      const membersNeedingAttention: Array<{
        id: string;
        name: string;
        phone: string;
        email: string;
        percentComplete: string;
        amountFunded: number;
        target: number;
      }> = [];
      
      for (const member of members) {
        // Check if profile is incomplete
        const hasIncompleteProfile = 
          !member.email || 
          member.email.includes('@plus1rewards.local') || 
          !member.sa_id;
        
        if (!hasIncompleteProfile || !member.active_policy) continue;
        
        // Get member's total cashback (using rewards as cashback)
        const { data: wallets, error: walletError } = await supabaseAdmin
          .from('wallets')
          .select('rewards_total')
          .eq('member_id', member.id);
        
        console.log(`Member ${member.name} (${member.id}): wallets query returned`, wallets, 'error:', walletError);
        
        const totalCashback = (wallets || []).reduce((sum, w) => sum + (w.rewards_total || 0), 0);
        const targetAmount = 385; // Default cover plan target from docs
        const percentComplete = (totalCashback / targetAmount) * 100;
        
        console.log(`Member ${member.name}: ${percentComplete.toFixed(1)}% complete (R${totalCashback}/R${targetAmount}), incomplete=${hasIncompleteProfile}`);
        
        if (percentComplete >= 90) {
          membersNeedingAttention.push({
            id: member.id,
            name: member.name,
            phone: member.phone,
            email: member.email,
            percentComplete: percentComplete.toFixed(1),
            amountFunded: totalCashback,
            target: targetAmount
          });
          console.log(`⚠️ ALERT: Member ${member.name} at ${percentComplete.toFixed(1)}% needs verification!`);
        }
      }
      
      if (membersNeedingAttention.length > 0) {
        setMembersNeedingVerification(membersNeedingAttention);
        setAlert({
          message: `${membersNeedingAttention.length} member(s) at 90%+ cover plan completion need profile verification`,
          action: () => setShowModal(true)
        });
      } else {
        setAlert(null);
        setMembersNeedingVerification([]);
      }
    } catch (error) {
      console.error('Error checking members:', error);
    }
  };

  useEffect(() => {
    checkMembersNeedingProfileCompletion();
  }, []);

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-[#f5f8fc] p-6 md:p-10">
        <Topbar onRefresh={handleRefresh} />
        
        {/* Alert Notification */}
        {alert && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-yellow-600">warning</span>
              <span className="text-yellow-800 font-medium">{alert.message}</span>
            </div>
            <button
              onClick={alert.action}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
            >
              View Details
            </button>
          </div>
        )}
        
        <StatsCards ref={statsCardsRef} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FinancialOverview />
            <PlatformStatus />
          </div>
          
          <QuickActions />
        </div>
        
        <Footer />
      </main>

      {/* Members Needing Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <span className="material-symbols-outlined text-4xl">verified_user</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-1">Profile Verification Required</h2>
                    <p className="text-yellow-50 text-sm font-medium">
                      {membersNeedingVerification.length} {membersNeedingVerification.length === 1 ? 'member has' : 'members have'} reached 90%+ cover plan completion with incomplete profiles
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all hover:rotate-90 duration-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)] bg-gray-50">
              <div className="space-y-4">
                {membersNeedingVerification.map((member, index) => (
                  <div 
                    key={member.id} 
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Member Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-[#1a558b] to-[#2d7ab8] text-white rounded-full w-12 h-12 flex items-center justify-center font-black text-lg">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-gray-900">{member.name}</h3>
                          <p className="text-xs text-gray-500 font-mono">ID: {member.id.slice(0, 12)}...</p>
                        </div>
                      </div>
                      <div className="text-right bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl px-4 py-2 border border-yellow-200">
                        <div className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                          {member.percentComplete}%
                        </div>
                        <div className="text-xs text-gray-600 font-bold uppercase tracking-wide">Complete</div>
                      </div>
                    </div>
                    
                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-[#1a558b] text-lg">phone</span>
                          <p className="text-xs text-gray-600 uppercase font-bold tracking-wide">Phone</p>
                        </div>
                        <p className="text-lg font-black text-gray-900">{member.phone}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-purple-600 text-lg">mail</span>
                          <p className="text-xs text-gray-600 uppercase font-bold tracking-wide">Email</p>
                        </div>
                        {member.email?.includes('@plus1rewards.local') ? (
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                            <span className="text-sm font-bold text-red-600">Temporary Email</span>
                          </div>
                        ) : (
                          <p className="text-sm font-bold text-gray-900 truncate">{member.email || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Policy Progress */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-5 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-green-600">trending_up</span>
                          <span className="text-xs text-gray-600 uppercase font-bold tracking-wide">Cover Plan Funding Progress</span>
                        </div>
                        <span className="text-sm font-black text-green-600">
                          R{member.amountFunded.toFixed(2)} / R{member.target.toFixed(2)}
                        </span>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 shadow-lg"
                          style={{ width: `${Math.min(parseFloat(member.percentComplete), 100)}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center font-medium">
                        R{(member.target - member.amountFunded).toFixed(2)} remaining to reach 100%
                      </p>
                    </div>
                    
                    {/* Action Required Box */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="bg-[#1a558b] rounded-lg p-2">
                          <span className="material-symbols-outlined text-white text-xl">priority_high</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-blue-900 mb-1 uppercase tracking-wide">Urgent Action Required</p>
                          <p className="text-sm text-blue-800 leading-relaxed">
                            Contact this member immediately to verify their profile information including SA ID, valid email address, and residential address before cover plan goes live.
                          </p>
                        </div>
                      </div>
                      <a 
                        href={`tel:${member.phone}`}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1a558b] to-[#2d7ab8] hover:from-[#1a558b]/90 hover:to-[#2d7ab8]/90 text-white rounded-xl py-3.5 px-6 font-black text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-2xl">call</span>
                        <span>Call {member.phone} Now</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-200 p-5 bg-white flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium">
                <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
                Verify all members before they reach 100% completion
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    navigate('/admin/members');
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">group</span>
                  View All Members
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
