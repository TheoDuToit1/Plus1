import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentMember, logout } from '../lib/auth';
import { 
  LogOut,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Search,
  Home,
  History,
  Bell,
  Wallet
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const member = getCurrentMember();
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'profile'>('home');
  const [coverBalance] = useState(218.50); // Mock data - would fetch from DB
  const [coverTarget] = useState(320.00);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!member) {
      navigate('/login');
    }
  }, [member, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!member) return null;

  const coverPercentage = (coverBalance / coverTarget) * 100;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src="/plus1-go logo.png" alt="Plus1 Go" className="h-12 object-contain" />
          <div className="flex items-center gap-4">
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-slate-50 rounded-full transition-all"
              >
                <Bell className={`w-6 h-6 ${!member.profile_completed ? 'text-amber-500 bell-shake' : 'text-slate-400'}`} />
                {!member.profile_completed && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  />
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-[9px] shadow-2xl border border-slate-200 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                      <h3 className="font-black text-primary tracking-tight">Notifications</h3>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {!member.profile_completed && (
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            navigate('/profile');
                          }}
                          className="w-full p-4 hover:bg-amber-50 transition-all text-left border-b border-slate-100"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-lg">⚠️</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-black text-sm text-amber-900 tracking-tight">Complete Your Profile</h4>
                              <p className="text-xs text-amber-800 font-medium mt-1">
                                Add your ID number and bank details to start ordering
                              </p>
                              <span className="text-xs text-amber-600 font-bold mt-2 inline-block">
                                Tap to complete →
                              </span>
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Welcome Notification */}
                      <div className="p-4 border-b border-slate-100">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">👋</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-sm text-primary tracking-tight">Welcome to Plus1-Go!</h4>
                            <p className="text-xs text-slate-600 font-medium mt-1">
                              Start ordering from your favorite restaurants
                            </p>
                            <span className="text-xs text-slate-400 font-bold mt-2 inline-block">
                              Just now
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Empty State if all notifications read */}
                      {member.profile_completed && (
                        <div className="p-8 text-center">
                          <div className="text-4xl mb-2">🔔</div>
                          <p className="text-sm text-slate-500 font-medium">You're all caught up!</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-[9px] transition-all font-bold"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-black uppercase tracking-widest text-xs">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Welcome & Delivery Address */}
            <div className="bg-white border border-slate-100 rounded-[9px] shadow-sm p-6">
              <h1 className="text-2xl font-black text-primary tracking-tighter mb-1">
                Hi, {member.full_name}!
              </h1>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <MapPin className="w-4 h-4" />
                <span>Deliver to {member.phone}</span>
              </div>
            </div>

            {/* Search Bar */}
            <button
              onClick={() => navigate('/')}
              className="w-full bg-slate-50 border border-slate-200 rounded-[9px] p-4 flex items-center gap-3 hover:bg-slate-100 transition-all"
            >
              <Search className="w-5 h-5 text-slate-400" />
              <span className="text-slate-500 font-medium">Search restaurants, groceries...</span>
            </button>

            {/* Cover Progress Card */}
            <div className="bg-gradient-to-br from-primary to-slate-800 rounded-[9px] shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black tracking-tight">Health Cover Progress</h2>
                <Wallet className="w-6 h-6" />
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-3xl font-black tracking-tighter">R{coverBalance.toFixed(2)}</span>
                  <span className="text-sm font-bold opacity-90">/ R{coverTarget.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div className="bg-white h-full rounded-full transition-all" style={{ width: `${coverPercentage}%` }} />
                </div>
              </div>
              <p className="text-xs font-bold opacity-90">{Math.round(coverPercentage)}% funded • 102 days until renewal</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/')}
                className="bg-white border border-slate-100 rounded-[9px] shadow-sm p-4 hover:shadow-md transition-all text-center"
              >
                <div className="text-2xl mb-2">🍕</div>
                <p className="font-black text-sm text-primary tracking-tight">Order Food</p>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="bg-white border border-slate-100 rounded-[9px] shadow-sm p-4 hover:shadow-md transition-all text-center"
              >
                <div className="text-2xl mb-2">📦</div>
                <p className="font-black text-sm text-primary tracking-tight">My Orders</p>
              </button>
            </div>

            {/* Recommended Partners */}
            <div>
              <h3 className="text-lg font-black text-primary mb-4 tracking-tight">Popular Near You</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    onClick={() => navigate('/')}
                    className="w-full bg-white border border-slate-100 rounded-[9px] shadow-sm p-4 hover:shadow-md transition-all text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-slate-100 rounded-[9px]" />
                      <div className="flex-1">
                        <h4 className="font-black text-primary text-sm tracking-tight">Restaurant {i}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>4.{7 + i}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>25-35 min</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-primary tracking-tighter">Your Orders</h2>
            <div className="bg-white border border-slate-100 rounded-[9px] shadow-sm p-8 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-slate-500 font-medium">No orders yet</p>
              <button
                onClick={() => setActiveTab('home')}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-[9px] font-black text-sm uppercase tracking-widest"
              >
                Start Ordering
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-primary tracking-tighter">Profile</h2>
            
            {/* Profile Completion Warning */}
            {!member.profile_completed && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-[9px] p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-black text-amber-900 tracking-tight">Profile Incomplete</h3>
                    <p className="text-sm text-amber-800 font-medium mt-1">
                      Complete your profile to start ordering. You need to add your ID number and bank details.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Status Card */}
            <div className="bg-white border border-slate-100 rounded-[9px] shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Name</p>
                  <p className="font-bold text-primary">{member.full_name}</p>
                </div>
                <span className="text-2xl">👤</span>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Mobile</p>
                <p className="font-bold text-primary">{member.phone}</p>
              </div>
            </div>

            {/* Completion Checklist */}
            <div className="bg-white border border-slate-100 rounded-[9px] shadow-sm p-6">
              <h3 className="text-lg font-black text-primary mb-4 tracking-tight">Completion Checklist</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-sm ${
                    member.id_number ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {member.id_number ? '✓' : '○'}
                  </div>
                  <span className={`font-bold ${member.id_number ? 'text-slate-700' : 'text-slate-500'}`}>
                    ID Number
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-sm ${
                    member.bank_name && member.bank_account_number ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {member.bank_name && member.bank_account_number ? '✓' : '○'}
                  </div>
                  <span className={`font-bold ${member.bank_name && member.bank_account_number ? 'text-slate-700' : 'text-slate-500'}`}>
                    Bank Details
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-primary text-white px-6 py-3 rounded-[9px] font-black text-sm uppercase tracking-widest shadow-xl hover:bg-primary/90 transition-all"
            >
              {member.profile_completed ? 'Edit Profile' : 'Complete Profile'}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'home' ? 'text-primary' : 'text-slate-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-black uppercase tracking-widest">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'orders' ? 'text-primary' : 'text-slate-400'
            }`}
          >
            <History className="w-6 h-6" />
            <span className="text-xs font-black uppercase tracking-widest">Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'profile' ? 'text-primary' : 'text-slate-400'
            }`}
          >
            <Bell className="w-6 h-6" />
            <span className="text-xs font-black uppercase tracking-widest">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
