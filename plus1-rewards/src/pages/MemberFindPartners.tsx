import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import MemberLayout from '../components/member/MemberLayout';

interface Partner {
  id: string;
  name: string;
  commission_rate: number;
  status: 'active' | 'suspended';
  phone?: string;
}

interface Member {
  id: string;
  name: string;
  phone: string;
  qr_code: string;
}

export function MemberFindPartners() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [shops, setShops] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [connectedPartnerIds, setconnectedPartnerIds] = useState<Set<string>>(new Set());
  const [requestingShopId, setRequestingShopId] = useState<string | null>(null);

  useEffect(() => { 
    loadMemberAndShops(); 
  }, []);

  const loadMemberAndShops = async () => {
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

      // Load member data
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('id, name, phone, qr_code')
        .eq('id', user.id)
        .single();
      
      if (memberError || !memberData) {
        console.log('User is not a member, redirecting to member login');
        await supabase.auth.signOut();
        navigate('/member/login');
        return;
      }
        
      if (memberData) {
        setMember(memberData);
      }

      // Get all active shops
      const { data: partnersData } = await supabase
        .from('partners')
        .select('id, name, commission_rate, status, phone')
        .eq('status', 'active')
        .order('name');

      if (partnersData) setShops(partnersData);

      // Get member's already-connected shop IDs
      const { data: wallets } = await supabase
        .from('wallets')
        .select('partner_id')
        .eq('member_id', user.id);
      if (wallets) setconnectedPartnerIds(new Set(wallets.map(w => w.partner_id)));

    } catch (error) {
      console.error('Error loading data:', error);
    } finally { 
      setLoading(false); 
    }
  };

  const filtered = shops.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const memberEarns = (rate: number) => Math.max(rate - 2, 1);

  const handleConnectToShop = async (partnerId: string, partnerName: string) => {
    if (!member) return;
    
    try {
      setRequestingShopId(partnerId);

      // Get the partner's commission rate
      const { data: partnerData } = await supabase
        .from('partners')
        .select('commission_rate')
        .eq('id', partnerId)
        .single();

      const commissionRate = partnerData?.commission_rate || 5;
      
      // Member earns partner commission minus 2% (platform fee)
      const memberCommissionRate = Math.max(commissionRate - 2, 1);

      // Create wallet directly - no approval needed
      const { error } = await supabase
        .from('wallets')
        .insert({
          member_id: member.id,
          partner_id: partnerId,
          balance: 0,
          commission_rate: memberCommissionRate,
          status: 'active'
        });

      if (error) {
        if (error.code === '23505') {
          alert('You are already connected to this partner');
        } else {
          throw error;
        }
      } else {
        alert(`Successfully connected to ${partnerName}! You can now start earning rewards.`);
        setconnectedPartnerIds(prev => new Set([...prev, partnerId]));
      }
    } catch (err: any) {
      alert('Failed to Connect to Partner: ' + err.message);
    } finally {
      setRequestingShopId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f5f8fc] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading partners...</p>
        </div>
      </div>
    );
  }

  return (
    <MemberLayout 
      member={member}
      isOnline={navigator.onLine}
      pendingTransactions={0}
      onSignOut={() => supabase.auth.signOut().then(() => navigate('/member/login'))}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Partner Shops</h1>
          <p className="text-gray-600">{shops.length} active shops in your area</p>
        </div>
        <button 
          onClick={() => navigate('/member/dashboard')}
          className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-4 py-2 rounded-xl transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
          <input
            type="text" 
            placeholder="Search partners by name..."
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="member-input-override w-full bg-[#f5f8fc] border-2 border-[#1a558b] rounded-lg pl-12 pr-12 py-4 text-gray-900 placeholder:text-gray-400 text-lg focus:outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
        {search && (
          <p className="text-gray-600 text-sm mt-3">
            {filtered.length} Partner{filtered.length !== 1 ? 's' : ''} found for "{search}"
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#1a558b]/10 to-[#1a558b]/5 border border-[#1a558b]/20 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">Ready to Shop?</h3>
            <p className="text-gray-700">Show your QR code or scan a shop's code to connect instantly</p>
          </div>
          <button 
            onClick={() => navigate('/member/scan-partner')}
            className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">qr_code_scanner</span>
            Scan Partner QR
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#1a558b]/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#1a558b] text-xl">store</span>
            </div>
            <div>
              <p className="text-gray-900 font-bold text-2xl">{shops.length}</p>
              <p className="text-gray-600 text-sm">Active Shops</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-green-500 text-xl">link</span>
            </div>
            <div>
              <p className="text-gray-900 font-bold text-2xl">{connectedPartnerIds.size}</p>
              <p className="text-gray-600 text-sm">Connected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shop List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {search ? `Search Results (${filtered.length})` : 'All Partner Businesses'}
            </h2>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading partners...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-gray-400 text-2xl">store</span>
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">
              {search ? 'No partners match your search' : 'No active partners yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {search ? 'Try a different search term or browse all partners' : 'Check back later for new partner businesses'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Show All Shops
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filtered.map((partner) => {
              const isConnected = connectedPartnerIds.has(partner.id);
              const isRequesting = requestingShopId === partner.id;
              const earns = memberEarns(partner.commission_rate);
              
              return (
                <div key={partner.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Shop Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1a558b]/20 to-[#1a558b]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[#1a558b] text-2xl">storefront</span>
                    </div>

                    {/* Shop Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900 font-bold text-lg">{partner.name}</h3>
                        {isConnected && (
                          <span className="bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            ✓ Connected
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[#1a558b] text-sm">trending_up</span>
                          <span className="text-gray-700">You earn <span className="text-[#1a558b] font-bold">{earns}%</span> rewards</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-blue-500 text-sm">percent</span>
                          <span className="text-gray-600">{partner.commission_rate}% commission rate</span>
                        </div>
                      </div>
                      {partner.phone && (
                        <p className="text-gray-500 text-sm mt-1">📞 {partner.phone}</p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {isConnected ? (
                        <div className="text-center">
                          <div className="bg-green-50 text-green-600 px-4 py-2 rounded-xl font-bold text-sm mb-1">
                            ✓ Connected
                          </div>
                          <p className="text-gray-500 text-xs">Ready to earn</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleConnectToShop(partner.id, partner.name)}
                          disabled={isRequesting}
                          className="bg-[#1a558b]/10 hover:bg-[#1a558b]/20 text-[#1a558b] font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {isRequesting ? (
                            <>
                              <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                              Connecting...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm">add_circle</span>
                              Connect to Partner
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MemberLayout>
  );
}
