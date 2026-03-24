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

export default function MemberSupport() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const session = getSession();
      if (!session) {
        navigate('/member/login');
        return;
      }

      const { data: memberData } = await supabase
        .from('members')
        .select('id, full_name, phone, email, qr_code')
        .eq('id', session.user.id)
        .single();

      if (memberData) {
        setMember({
          ...memberData,
          name: memberData.full_name
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    clearSession();
    navigate('/member/login');
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
            <p className="text-gray-600">Loading...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Support & Admin Chat</h1>
          <p className="text-gray-600">Get help with your account and cover plans</p>
        </div>
        <button
          onClick={() => navigate('/member/dashboard')}
          className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-4 py-2 rounded-xl transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Contact Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6 shadow-sm text-center">
        <div className="w-16 h-16 bg-[#1a558b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[#1a558b] text-3xl">support_agent</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Admin Support</h2>
        <p className="text-gray-600 mb-6">
          Our admin team is here to help you with any questions or issues.
        </p>
        
        <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1a558b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#1a558b]">email</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-bold text-gray-900">support@plus1rewards.co.za</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1a558b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#1a558b]">phone</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-bold text-gray-900">0800 PLUS1 (75871)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1a558b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#1a558b]">schedule</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hours</p>
              <p className="font-bold text-gray-900">Mon-Fri: 8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Common Support Topics */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Common Support Topics</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-green-600">account_balance</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Top-Up Support</h4>
            <p className="text-sm text-gray-600">Help with EFT payments and proof of payment</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-blue-600">health_and_safety</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Cover Plan Questions</h4>
            <p className="text-sm text-gray-600">Status updates, plan changes, and upgrades</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-purple-600">receipt_long</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Transaction Problems</h4>
            <p className="text-sm text-gray-600">Missing cashback or incorrect transactions</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-orange-600">group_add</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Linked Person Requests</h4>
            <p className="text-sm text-gray-600">Add dependants and family members</p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-blue-600 flex-shrink-0">info</span>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Note</h3>
            <p className="text-sm text-gray-700">
              In a production environment, this page would include a live chat widget or messaging system 
              for instant communication with admin support. For now, please use the contact information above.
            </p>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
