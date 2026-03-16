// plus1-rewards/src/components/dashboard/pages/ShopsPage.tsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabase } from '../../../lib/supabase';

export default function ShopsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [shops, setShops] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalShops: 0,
    verified: 0,
    transactions: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch shops
      const { data: shopsData, error: shopsError } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });

      if (shopsError) throw shopsError;

      // Fetch transactions for revenue calculation
      const { data: transactionsData, error: transError } = await supabase
        .from('transactions')
        .select('shop_id, shop_contribution');

      if (transError) throw transError;

      // Calculate stats
      const totalShops = shopsData?.length || 0;
      const verified = shopsData?.filter(s => s.status === 'active' && s.approved_at)?.length || 0;
      const transactions = transactionsData?.length || 0;
      const revenue = transactionsData?.reduce((sum, t) => sum + (parseFloat(t.shop_contribution) || 0), 0) || 0;

      setStats({
        totalShops,
        verified,
        transactions,
        revenue
      });

      setShops(shopsData || []);
    } catch (error) {
      console.error('Error fetching shops:', error);
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
    console.log('Logout triggered');
  };

  const handleFilter = () => {
    console.log('Filter triggered');
  };

  const handleExport = () => {
    console.log('Export CSV triggered');
  };

  const statsData = [
    {
      icon: 'storefront',
      title: 'Total Shops',
      value: stats.totalShops.toString(),
      change: '+0%',
      description: 'Active shops'
    },
    {
      icon: 'check_circle',
      title: 'Verified',
      value: stats.verified.toString(),
      change: '+0%',
      description: 'Verified shops'
    },
    {
      icon: 'trending_up',
      title: 'Total Transactions',
      value: stats.transactions.toString(),
      change: '+0%',
      description: 'This month'
    },
    {
      icon: 'payments',
      title: 'Revenue',
      value: `R${stats.revenue.toFixed(2)}`,
      change: '+0%',
      description: 'Total collected'
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
                placeholder="Search shops, transactions or IDs..."
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
            <h2 className="text-3xl font-black text-slate-100 tracking-tight">Shops Management</h2>
            <p className="text-slate-400 mt-1">Manage partner shops and their transactions</p>
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

          {/* Shops List Table */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-primary/10 flex items-center justify-between bg-primary/5">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">list_alt</span>
                Shops List
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
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Shop ID</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Shop Name</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Transactions</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Revenue</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {loading ? (
                    <tr>
                      <td className="px-6 py-12 text-center" colSpan={6}>
                        <p className="text-slate-400">Loading shops...</p>
                      </td>
                    </tr>
                  ) : shops.length === 0 ? (
                    <tr>
                      <td className="px-6 py-12 text-center" colSpan={6}>
                        <p className="text-slate-400">No shops yet</p>
                      </td>
                    </tr>
                  ) : (
                    shops.map((shop) => (
                      <tr key={shop.id} className="hover:bg-primary/10 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono font-bold text-primary px-2 py-1 bg-primary/10 rounded">
                            {shop.id.substring(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-200">{shop.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            shop.status === 'active' 
                              ? 'bg-primary/20 text-primary border border-primary/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            <span className={`size-1.5 rounded-full ${shop.status === 'active' ? 'bg-primary' : 'bg-red-400'}`}></span>
                            {shop.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-200">0</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-200">R0.00</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg bg-slate-800/50 hover:bg-primary/10" title="View Details">
                              <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                            <button className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg bg-slate-800/50 hover:bg-primary/10" title="Edit Shop">
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg bg-slate-800/50 hover:bg-red-400/10" title="Block Shop">
                              <span className="material-symbols-outlined text-sm">block</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-primary/5">
                    <td className="px-6 py-3 text-center" colSpan={6}>
                      <p className="text-[10px] text-slate-600 font-medium uppercase tracking-widest">
                        Showing {shops.length} of {shops.length} total records
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
