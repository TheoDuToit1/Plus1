// src/components/dashboard/pages/MembersPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabaseAdmin } from '../../../lib/supabase';

export default function MembersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    verified: 0,
    qrCodes: 0,
    totalRewards: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberDetails, setMemberDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '', // 'complete' or 'incomplete'
    hasPolicy: '', // 'yes' or 'no'
    hasQR: '' // 'yes' or 'no'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch members with all their data using admin client
      const { data: membersData, error: membersError } = await supabaseAdmin
        .from('members')
        .select(`
          *,
          wallets(balance, rewards_total)
        `)
        .order('created_at', { ascending: false });

      if (membersError) throw membersError;

      // Calculate stats
      const totalMembers = membersData?.length || 0;
      const verified = membersData?.filter(m => m.active_policy)?.length || 0;
      const qrCodes = membersData?.filter(m => m.qr_code)?.length || 0;
      const totalRewards = membersData?.reduce((sum, m) => {
        const memberRewards = m.wallets?.reduce((s: number, w: any) => s + (parseFloat(w.rewards_total) || 0), 0) || 0;
        return sum + memberRewards;
      }, 0) || 0;

      setStats({
        totalMembers,
        verified,
        qrCodes,
        totalRewards
      });

      setMembers(membersData || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Phone', 'Email', 'SA ID', 'City', 'Suburb', 'Policy', 'Balance', 'Rewards', 'QR Code', 'Joined'].join(','),
      ...members.map(m => [
        m.id,
        m.name,
        m.phone || '',
        m.email || '',
        m.sa_id || '',
        m.city || '',
        m.suburb || '',
        m.active_policy || '',
        m.wallets?.reduce((s: number, w: any) => s + (parseFloat(w.balance) || 0), 0) || 0,
        m.wallets?.reduce((s: number, w: any) => s + (parseFloat(w.rewards_total) || 0), 0) || 0,
        m.qr_code ? 'Yes' : 'No',
        new Date(m.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredMembers = members.filter(m => {
    // Advanced Search
    const searchLower = searchTerm.toLowerCase().trim();
    const searchTerms = searchLower.split(/\s+/);
    
    const matchesSearch = searchLower === '' || searchTerms.every(term => 
      m.name?.toLowerCase().includes(term) ||
      m.phone?.includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.id?.toLowerCase().includes(term) ||
      m.sa_id?.toLowerCase().includes(term) ||
      m.city?.toLowerCase().includes(term) ||
      m.suburb?.toLowerCase().includes(term)
    );

    // Filters
    const isIncomplete = !m.email || m.email.includes('@plus1rewards.local') || !m.sa_id || !m.city || !m.suburb;
    const matchesStatus = filters.status === '' || 
      (filters.status === 'complete' && !isIncomplete) || 
      (filters.status === 'incomplete' && isIncomplete);
    
    const matchesPolicy = filters.hasPolicy === '' || 
      (filters.hasPolicy === 'yes' && m.active_policy) || 
      (filters.hasPolicy === 'no' && !m.active_policy);

    const matchesQR = filters.hasQR === '' || 
      (filters.hasQR === 'yes' && m.qr_code) || 
      (filters.hasQR === 'no' && !m.qr_code);

    return matchesSearch && matchesStatus && matchesPolicy && matchesQR;
  });

  const fetchMemberDetails = async (memberId: string) => {
    setDetailsLoading(true);
    try {
      // Get complete member data
      const { data: member } = await supabaseAdmin
        .from('members')
        .select('*')
        .eq('id', memberId)
        .single();

      // Get wallets with shop info
      const { data: wallets } = await supabaseAdmin
        .from('wallets')
        .select('*, shops(name, commission_rate)')
        .eq('member_id', memberId);

      // Get policy holder info
      const { data: policyHolder } = await supabaseAdmin
        .from('policy_holders')
        .select(`
          *,
          policy_plans(name, monthly_target, family, variant, adults, children),
          policy_providers(name, company_name)
        `)
        .eq('member_id', memberId)
        .single();

      // Get recent transactions
      const { data: transactions } = await supabaseAdmin
        .from('transactions')
        .select(`
          *,
          shops(name),
          agents(name)
        `)
        .eq('member_id', memberId)
        .order('created_at', { ascending: false })
        .limit(10);

      setMemberDetails({
        member,
        wallets: wallets || [],
        policyHolder,
        transactions: transactions || []
      });
    } catch (error) {
      console.error('Error fetching member details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = (member: any) => {
    setSelectedMember(member);
    fetchMemberDetails(member.id);
  };

  const closeDetailsModal = () => {
    setSelectedMember(null);
    setMemberDetails(null);
  };

  const statsData = [
    {
      icon: 'group',
      title: 'Total Members',
      value: stats.totalMembers.toString(),
      change: '+0%',
      description: 'Active members on platform'
    },
    {
      icon: 'verified_user',
      title: 'Verified',
      value: stats.verified.toString(),
      change: '+0%',
      description: 'KYC completed accounts'
    },
    {
      icon: 'qr_code',
      title: 'QR Codes Issued',
      value: stats.qrCodes.toString(),
      change: '+0%',
      description: 'Active codes in circulation'
    },
    {
      icon: 'payments',
      title: 'Total Rewards',
      value: `R${stats.totalRewards.toFixed(2)}`,
      change: '+0%',
      description: 'Issued to members'
    }
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-[#f5f8fc]">
        {/* Topbar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a558b] focus:border-[#1a558b] outline-none transition-all placeholder:text-gray-400"
                placeholder="Search by name, phone, email, or ID..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg border border-[#1a558b] bg-white text-[#1a558b] hover:bg-[#1a558b] hover:text-white transition-all text-sm"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a558b] text-white rounded-lg hover:opacity-90 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Logout
            </button>
          </div>
        </header>

        <div className="px-6 md:px-10 pb-10">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Members Management</h2>
            <p className="text-gray-600 mt-1">Complete member details and profile information</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsData.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                description={stat.description}
              />
            ))}
          </div>

          {/* Members List Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a558b]">list_alt</span>
                All Members ({filteredMembers.length})
              </h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`text-xs flex items-center gap-1 font-medium transition-colors ${showFilters ? 'text-[#1a558b]' : 'text-gray-600 hover:text-[#1a558b]'}`}
                >
                  <span className="material-symbols-outlined text-sm">{showFilters ? 'filter_list_off' : 'filter_list'}</span>
                  {showFilters ? 'Hide Filters' : 'Filter'}
                </button>
                <button 
                  onClick={handleExport}
                  className="text-xs text-gray-600 hover:text-[#1a558b] flex items-center gap-1 font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export CSV
                </button>
              </div>
            </div>

            {/* Advanced Filter Bar */}
            {showFilters && (
              <div className="px-6 py-4 border-b border-gray-200 bg-white grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top duration-200">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Profile Status</label>
                  <select 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-900 focus:ring-1 focus:ring-[#1a558b] outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="complete">Complete Profiles</option>
                    <option value="incomplete">Incomplete Profiles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Policy Status</label>
                  <select 
                    value={filters.hasPolicy}
                    onChange={(e) => setFilters({...filters, hasPolicy: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-900 focus:ring-1 focus:ring-[#1a558b] outline-none"
                  >
                    <option value="">All Members</option>
                    <option value="yes">With Active Policy</option>
                    <option value="no">No Active Policy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">QR Code</label>
                  <select 
                    value={filters.hasQR}
                    onChange={(e) => setFilters({...filters, hasQR: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs text-gray-900 focus:ring-1 focus:ring-[#1a558b] outline-none"
                  >
                    <option value="">All Members</option>
                    <option value="yes">QR Issued</option>
                    <option value="no">No QR Code</option>
                  </select>
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button 
                    onClick={() => setFilters({ status: '', hasPolicy: '', hasQR: '' })}
                    className="text-[10px] font-bold text-[#1a558b] hover:underline uppercase tracking-widest"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
            {loading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">Loading members...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">No members found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Member</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Contact</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Location</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">SA ID</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Policy</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Balance</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Rewards</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">QR Code</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Joined</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Profile</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMembers.map((member) => {
                      const balance = member.wallets?.reduce((s: number, w: any) => s + (parseFloat(w.balance) || 0), 0) || 0;
                      const rewards = member.wallets?.reduce((s: number, w: any) => s + (parseFloat(w.rewards_total) || 0), 0) || 0;
                      const isIncomplete = !member.email || member.email.includes('@plus1rewards.local') || !member.sa_id || !member.city || !member.suburb;
                      
                      return (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                {member.profile_picture_url ? (
                                  <img src={member.profile_picture_url} alt={member.name} className="size-full object-cover" />
                                ) : (
                                  <span className="text-[#1a558b] font-bold text-lg">{member.name?.charAt(0)}</span>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{member.name}</div>
                                <div className="text-[10px] font-mono text-gray-600">{member.id.substring(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs text-gray-700">{member.phone || 'No phone'}</div>
                            <div className="text-[10px] text-gray-600">{member.email || 'No email'}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs text-gray-700">{member.city || '-'}</div>
                            <div className="text-[10px] text-gray-600">{member.suburb || '-'}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs text-gray-700">{member.sa_id || '-'}</div>
                          </td>
                          <td className="px-4 py-4">
                            {member.active_policy ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#1a558b]/20 text-[#1a558b] border border-[#1a558b]/30">
                                <span className="size-1.5 rounded-full bg-[#1a558b]"></span>
                                {member.active_policy}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-600">No policy</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-bold text-gray-900">R{balance.toFixed(2)}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-bold text-[#1a558b]">R{rewards.toFixed(2)}</span>
                          </td>
                          <td className="px-4 py-4">
                            {member.qr_code ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-green-500/20 text-green-600">
                                ✓ Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-red-500/20 text-red-700">
                                ✗ No
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs text-gray-600">{new Date(member.created_at).toLocaleDateString()}</span>
                          </td>
                          <td className="px-4 py-4">
                            {isIncomplete ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-600">
                                ⚠ Incomplete
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-green-500/20 text-green-600">
                                ✓ Complete
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleViewDetails(member)}
                              className="px-3 py-1.5 bg-[#1a558b] text-white rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-[10px] text-gray-600 font-medium uppercase tracking-widest text-center">
                Showing {filteredMembers.length} of {members.length} total members
              </p>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase">
              © 2024 +1 Rewards Platform Management • Secured Admin Access
            </p>
          </div>
        </div>

        {/* Member Details Modal */}
        {selectedMember && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
            onClick={closeDetailsModal}
          >
            <div 
              className="rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              style={{ backgroundColor: '#ffffff' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: '#ffffff' }}>
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {selectedMember.profile_picture_url ? (
                      <img src={selectedMember.profile_picture_url} alt={selectedMember.name} className="size-full object-cover" />
                    ) : (
                      <span className="text-[#1a558b] font-bold text-2xl">{selectedMember.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">{selectedMember.name}</h2>
                    <p className="text-sm text-gray-600">Member ID: {selectedMember.id}</p>
                  </div>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-600 hover:text-gray-900 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto flex-1">
                {detailsLoading ? (
                  <div className="px-6 py-12 text-center bg-gray-50">
                    <p className="text-gray-600">Loading member details...</p>
                  </div>
                ) : memberDetails ? (
                  <div className="px-6 py-6 space-y-6 bg-gray-50">
                  {/* Personal Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1a558b]">person</span>
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">Full Name</p>
                        <p className="text-sm text-gray-900 font-semibold">{memberDetails.member.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">Phone</p>
                        <p className="text-sm text-gray-900 font-semibold">{memberDetails.member.phone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">Email</p>
                        <p className="text-sm text-gray-900 font-semibold break-all">{memberDetails.member.email || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">SA ID Number</p>
                        <p className="text-sm text-gray-900 font-semibold">{memberDetails.member.sa_id || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">City</p>
                        <p className="text-sm text-gray-900 font-semibold">{memberDetails.member.city || 'Cape Town'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">Suburb</p>
                        <p className="text-sm text-gray-900 font-semibold">{memberDetails.member.suburb || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">QR Code</p>
                        <p className="text-sm text-gray-900 font-semibold font-mono">{memberDetails.member.qr_code || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wider">Joined</p>
                        <p className="text-sm text-gray-900 font-semibold">{new Date(memberDetails.member.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Policy Information */}
                  {memberDetails.policyHolder ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#1a558b]">health_and_safety</span>
                        Active Policy
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wider">Policy Number</p>
                          <p className="text-sm text-gray-900 font-semibold">{memberDetails.policyHolder.policy_number}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wider">Plan Name</p>
                          <p className="text-sm text-gray-900 font-semibold">{memberDetails.policyHolder.policy_plans?.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wider">Provider</p>
                          <p className="text-sm text-gray-900 font-semibold">{memberDetails.policyHolder.policy_providers?.company_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wider">Family Type</p>
                          <p className="text-sm text-gray-900 font-semibold">{memberDetails.policyHolder.policy_plans?.family} ({memberDetails.policyHolder.policy_plans?.variant})</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wider">Coverage</p>
                          <p className="text-sm text-gray-900 font-semibold">{memberDetails.policyHolder.policy_plans?.adults} Adults, {memberDetails.policyHolder.policy_plans?.children} Children</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wider">Status</p>
                          <p className="text-sm text-gray-900 font-semibold capitalize">{memberDetails.policyHolder.status}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wider">Monthly Target</p>
                          <p className="text-sm text-[#1a558b] font-bold">R{parseFloat(memberDetails.policyHolder.policy_plans?.monthly_target || 0).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wider">Amount Funded</p>
                          <p className="text-sm text-green-600 font-bold">R{parseFloat(memberDetails.policyHolder.amount_funded || 0).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wider">Progress</p>
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#1a558b] h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (parseFloat(memberDetails.policyHolder.amount_funded || 0) / parseFloat(memberDetails.policyHolder.policy_plans?.monthly_target || 1)) * 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {((parseFloat(memberDetails.policyHolder.amount_funded || 0) / parseFloat(memberDetails.policyHolder.policy_plans?.monthly_target || 1)) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wider">Start Date</p>
                          <p className="text-sm text-gray-900 font-semibold">{memberDetails.policyHolder.start_date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wider">Last Funded</p>
                          <p className="text-sm text-gray-900 font-semibold">{memberDetails.policyHolder.last_funded_date || '-'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                      <p className="text-yellow-600 text-sm">⚠ No active policy found for this member</p>
                    </div>
                  )}

                  {/* Wallets */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1a558b]">account_balance_wallet</span>
                      Wallets ({memberDetails.wallets.length})
                    </h3>
                    {memberDetails.wallets.length > 0 ? (
                      <div className="space-y-3">
                        {memberDetails.wallets.map((wallet: any) => (
                          <div key={wallet.id} className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-bold text-gray-900">{wallet.shops?.name || 'Unknown Shop'}</p>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${wallet.status === 'active' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-700'}`}>
                                {wallet.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                              <div>
                                <p className="text-xs text-gray-600">Balance</p>
                                <p className="text-sm text-gray-900 font-bold">R{parseFloat(wallet.balance || 0).toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Total Rewards</p>
                                <p className="text-sm text-[#1a558b] font-bold">R{parseFloat(wallet.rewards_total || 0).toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Blocked Balance</p>
                                <p className="text-sm text-yellow-600 font-bold">R{parseFloat(wallet.blocked_balance || 0).toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Commission Rate</p>
                                <p className="text-sm text-gray-900 font-bold">{wallet.commission_rate}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">No wallets found</p>
                    )}
                  </div>

                  {/* Recent Transactions */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1a558b]">receipt_long</span>
                      Recent Transactions ({memberDetails.transactions.length})
                    </h3>
                    {memberDetails.transactions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="pb-2 text-xs text-gray-600 uppercase">Date</th>
                              <th className="pb-2 text-xs text-gray-600 uppercase">Shop</th>
                              <th className="pb-2 text-xs text-gray-600 uppercase">Amount</th>
                              <th className="pb-2 text-xs text-gray-600 uppercase">Reward</th>
                              <th className="pb-2 text-xs text-gray-600 uppercase">Type</th>
                              <th className="pb-2 text-xs text-gray-600 uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {memberDetails.transactions.map((tx: any) => (
                              <tr key={tx.id} className="border-b border-gray-100">
                                <td className="py-2 text-gray-700">{new Date(tx.created_at).toLocaleDateString()}</td>
                                <td className="py-2 text-gray-700">{tx.shops?.name || '-'}</td>
                                <td className="py-2 text-gray-900 font-bold">R{parseFloat(tx.purchase_amount || 0).toFixed(2)}</td>
                                <td className="py-2 text-[#1a558b] font-bold">R{parseFloat(tx.member_reward || 0).toFixed(2)}</td>
                                <td className="py-2">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${tx.is_spend ? 'bg-red-500/20 text-red-700' : 'bg-green-500/20 text-green-600'}`}>
                                    {tx.is_spend ? 'Spend' : 'Earn'}
                                  </span>
                                </td>
                                <td className="py-2">
                                  <span className="text-xs text-gray-600 capitalize">{tx.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">No transactions found</p>
                    )}
                  </div>

                </div>
              ) : null}
              </div>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
