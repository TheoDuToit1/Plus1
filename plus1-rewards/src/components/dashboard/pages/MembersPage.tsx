// src/components/dashboard/pages/MembersPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import MembersTable from '../components/MembersTable';
import { supabase } from '../../../lib/supabase';

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

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch members with their wallet balances
      const { data: membersData, error: membersError } = await supabase
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

      // Format members data for table
      const formattedMembers = membersData?.map(member => ({
        id: member.id.substring(0, 8).toUpperCase(),
        name: member.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=11d452&color=000`,
        status: member.active_policy ? 'Active' : 'Inactive',
        balance: `R${(member.wallets?.reduce((s: number, w: any) => s + (parseFloat(w.balance) || 0), 0) || 0).toFixed(2)}`,
        joinedDate: new Date(member.created_at).toLocaleDateString()
      })) || [];

      setMembers(formattedMembers);
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

  const handleFilter = () => {
    console.log('Filter triggered');
  };

  const handleExport = () => {
    console.log('Export CSV triggered');
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
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        {/* Topbar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-primary/5 border border-primary/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-600"
                placeholder="Search members, transactions or IDs..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg border transition-all text-sm"
              style={{backgroundColor: '#10351c', color: '#109b43', borderColor: '#109b43', borderWidth: '0.2px'}}
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh All Data
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-lg hover:opacity-90 transition-all text-sm"
              style={{color: '#000000'}}
            >
              <span className="material-symbols-outlined text-lg" style={{color: '#000000'}}>logout</span>
              Logout
            </button>

            <div className="size-11 rounded-full border-2 border-primary p-0.5 ml-2">
              <div className="w-full h-full rounded-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZTVGWF5d9bUsTI1U_LA3u4Y-VW_tV7rVaCbr2bBcopKZ6aUEHak7Ad9ln4DGdmBcA4N_9IKOEwo_ZTgYugg0o3iWvRKoqrWDyBrw7mtjHatTwJ33VZI6nS8OIhyQl1DNFVnLMy5g9mboPCvWqWHPBke7YtYx4A7Ny8R8SF3z24w7nM33LYsSZVYbQQMyEhfI9bUKhfbdf6UBFROSXG5deW8I1Twmv3QDRJbOGQADi06UdXRXlEIqzBN95vQGSGpy4mn-lBnbfZr0r')"}}></div>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-10 pb-10">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-100 tracking-tight">Members Management</h2>
            <p className="text-slate-400 mt-1">Manage all platform members and their rewards</p>
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
          <div className="bg-primary/5 border border-primary/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-primary/10 flex items-center justify-between bg-primary/5">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">list_alt</span>
                Members List
              </h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleFilter}
                  className="text-xs text-slate-400 hover:text-primary flex items-center gap-1 font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  Filter
                </button>
                <button 
                  onClick={handleExport}
                  className="text-xs text-slate-400 hover:text-primary flex items-center gap-1 font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export CSV
                </button>
              </div>
            </div>
            {loading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-slate-400">Loading members...</p>
              </div>
            ) : (
              <MembersTable members={members} />
            )}
          </div>

          {/* Footer Copyright */}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-slate-600 font-bold tracking-[0.2em] uppercase">
              © 2024 +1 Rewards Platform Management • Secured Admin Access
            </p>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
