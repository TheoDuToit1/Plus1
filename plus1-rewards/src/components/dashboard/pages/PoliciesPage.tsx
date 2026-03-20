// plus1-rewards/src/components/dashboard/pages/PoliciesPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import StatCard from '../components/StatCard';
import { supabaseAdmin } from '../../../lib/supabase';

export default function PoliciesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [policies, setPolicies] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalPolicies: 0, approved: 0, enrolled: 0, premiums: 0, overflowPolicies: 0 });
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'plans' | 'rules'>('plans');
  const [selectedFamily, setSelectedFamily] = useState<string>('day_to_day');
  const [selectedVariant, setSelectedVariant] = useState<string>('single');
  const [rules, setRules] = useState<any[]>([]);
  const [savingRules, setSavingRules] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    planType: ''
  });

  const fetchRules = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('pricing_rules')
        .select('*')
        .order('plan_family', { ascending: true });
      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await fetchRules();
      
      // 1. Fetch policy plans
      const { data: plansData, error: plansError } = await supabaseAdmin
        .from('policy_plans')
        .select('*')
        .order('name', { ascending: true });

      if (plansError) throw plansError;

      // 2. Fetch member counts per plan
      const { data: memberData, error: memberError } = await supabaseAdmin
        .from('members')
        .select('active_policy')
        .not('active_policy', 'is', null);

      if (memberError) throw memberError;

      const countsMap: Record<string, number> = {};
      memberData?.forEach(m => {
        countsMap[m.active_policy] = (countsMap[m.active_policy] || 0) + 1;
      });

      const processedData = plansData?.map(plan => ({
        ...plan,
        enrolledCount: countsMap[plan.id] || 0
      })) || [];

      const totalPolicies = processedData.length;
      const active = processedData.filter(p => p.is_active).length;
      const avgTarget = processedData.reduce((sum, p) => sum + (parseFloat(p.monthly_target) || 0), 0) / (totalPolicies || 1);
      const families = new Set(processedData.map(p => p.family)).size;

      setStats({ 
        totalPolicies, 
        approved: active, 
        enrolled: families, 
        premiums: avgTarget, 
        overflowPolicies: totalPolicies - active 
      });
      setPolicies(processedData);
    } catch (error) {
      console.error('Error fetching policy plans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  const handleSaveRules = async (updatedRules: any[]) => {
    setSavingRules(true);
    try {
      // 1. Update rules table
      const { error: ruleError } = await supabaseAdmin
        .from('pricing_rules')
        .upsert(updatedRules.map(r => ({
          plan_family: r.plan_family,
          rule_name: r.rule_name,
          rule_value: r.rule_value,
          updated_at: new Date().toISOString()
        })), { onConflict: 'plan_family,rule_name' });

      if (ruleError) throw ruleError;

      // 2. Sync all policy plans
      const { data: currentPlans, error: plansError } = await supabaseAdmin.from('policy_plans').select('*');
      if (plansError) throw plansError;

      const updatedPlans = currentPlans.map(plan => {
        const familyRules = updatedRules.filter(r => r.plan_family === plan.family);
        const baseSingle = familyRules.find(r => r.rule_name === 'base_single')?.rule_value || 0;
        const baseCouple = familyRules.find(r => r.rule_name === 'base_couple')?.rule_value || 0;
        const perChild = familyRules.find(r => r.rule_name === 'per_child')?.rule_value || 0;
        const perAdult = familyRules.find(r => r.rule_name === 'per_adult')?.rule_value || 0;

        let newTarget = 0;
        if (plan.variant === 'single') {
          newTarget = parseFloat(baseSingle) + (plan.children * parseFloat(perChild));
        } else if (plan.variant === 'couple') {
          newTarget = parseFloat(baseCouple) + (plan.children * parseFloat(perChild));
        } else if (plan.variant === 'family') {
          newTarget = (plan.adults * parseFloat(perAdult)) + (plan.children * parseFloat(perChild));
        }

        return { ...plan, monthly_target: newTarget };
      });

      // Bulk update
      for (const plan of updatedPlans) {
        await supabaseAdmin.from('policy_plans').update({ monthly_target: plan.monthly_target }).eq('id', plan.id);
      }

      await fetchData();
      alert('Rules saved and all policy plans updated successfully!');
    } catch (error) {
      console.error('Error saving rules:', error);
      alert('Failed to save rules. Check console.');
    } finally {
      setSavingRules(false);
    }
  };

  const handleRefresh = () => { fetchData(); };
  const handleLogout = () => navigate('/');
  
  const handleExport = () => {
    const csv = [
      ['ID', 'Policy Number', 'Member', 'Plan', 'Status', 'Funded', 'Premium', 'Created'].join(','),
      ...policies.map(p => [
        p.id,
        p.policy_number,
        p.members?.name || 'N/A',
        p.policy_plans?.name || 'N/A',
        p.status,
        p.amount_funded || 0,
        p.monthly_premium || 0,
        new Date(p.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `policies-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredPolicies = policies.filter(p => {
    // Advanced Search
    const searchLower = searchTerm.toLowerCase().trim();
    const searchTerms = searchLower.split(/\s+/);
    
    const matchesSearch = searchLower === '' || searchTerms.every(term => 
      p.name?.toLowerCase().includes(term) ||
      p.family?.toLowerCase().includes(term) ||
      p.variant?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.id?.toLowerCase().includes(term)
    );

    // Tab Filters (Primary logic)
    const matchesFamily = p.family === selectedFamily;
    const matchesVariant = p.variant === selectedVariant;

    // Additional Filters (Status etc.)
    const matchesStatus = filters.status === '' || p.is_active.toString() === filters.status;

    return matchesSearch && matchesFamily && matchesVariant && matchesStatus;
  });

  const statsData = [
    { icon: 'description', title: 'Total Plans', value: stats.totalPolicies.toString(), change: '+0%', description: 'Defined products' },
    { icon: 'check_circle', title: 'Active Plans', value: stats.approved.toString(), change: '+0%', description: 'Available for members' },
    { icon: 'category', title: 'Plan Families', value: stats.enrolled.toString(), change: '+0%', description: 'Distinct categories' },
    { icon: 'payments', title: 'Avg. Target', value: `R${stats.premiums.toFixed(2)}`, change: '+0%', description: 'Across all plans' }
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-[#f5f8fc]">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10 pb-6">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">search</span>
              <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a558b] focus:border-[#1a558b] outline-none transition-all placeholder:text-gray-400" 
                placeholder="Search by policy #, member name or plan..." 
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleRefresh} className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg border border-[#1a558b] bg-white text-[#1a558b] hover:bg-[#1a558b] hover:text-white transition-all text-sm">
              <span className="material-symbols-outlined text-lg">refresh</span>Refresh
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-[#1a558b] text-white rounded-lg hover:opacity-90 transition-all text-sm">
              <span className="material-symbols-outlined text-lg">logout</span>Logout
            </button>
          </div>
        </header>

        <div className="px-6 md:px-10 pb-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Policies Management</h2>
            <p className="text-gray-600 mt-1">Manage insurance policies and their configurations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsData.map((stat, index) => (<StatCard key={index} icon={stat.icon} title={stat.title} value={stat.value} change={stat.change} description={stat.description} />))}
          </div>

          <div className="flex items-center gap-1 mb-6 bg-white p-1 rounded-xl border border-gray-200 w-fit shadow-sm">
            <button 
              onClick={() => setActiveTab('plans')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'plans' ? 'bg-[#1a558b] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Plan List
            </button>
            <button 
              onClick={() => setActiveTab('rules')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'rules' ? 'bg-[#1a558b] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Pricing Rules
            </button>
          </div>

          {activeTab === 'plans' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Family Selector Tabs */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-sm w-fit">
                {[
                  { id: 'day_to_day', label: 'Day-to-Day', icon: 'medical_services' },
                  { id: 'hospital', label: 'Hospital', icon: 'hospital' },
                  { id: 'comprehensive', label: 'Comprehensive', icon: 'health_and_safety' },
                  { id: 'senior', label: 'Senior', icon: 'elderly' }
                ].map(fam => (
                  <button
                    key={fam.id}
                    onClick={() => setSelectedFamily(fam.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      selectedFamily === fam.id 
                      ? 'bg-[#1a558b] text-white shadow-md transform scale-105' 
                      : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{fam.icon}</span>
                    {fam.label}
                  </button>
                ))}
              </div>

              {/* Variant Selector Tabs */}
              <div className="flex items-center gap-6 border-b border-gray-200 px-2">
                {[
                  { id: 'single', label: 'Single Plans' },
                  { id: 'couple', label: 'Couple Plans' },
                  { id: 'family', label: 'Family Plans' }
                ].map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`pb-4 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                      selectedVariant === variant.id 
                      ? 'text-[#1a558b]' 
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {variant.label}
                    {selectedVariant === variant.id && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1a558b] rounded-t-full"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                      {selectedFamily.replace(/_/g, ' ')} / {selectedVariant}
                      <span className="text-xs font-bold px-3 py-1 bg-[#1a558b]/10 text-[#1a558b] rounded-full uppercase tracking-widest">
                        {filteredPolicies.length} Variations
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-bold ${
                        showFilters ? 'bg-[#1a558b] text-white border-[#1a558b]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#1a558b] hover:text-[#1a558b]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">filter_list</span>
                      Extra Filters
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-[#1a558b] hover:text-[#1a558b] transition-all text-xs font-bold bg-white">
                      <span className="material-symbols-outlined text-lg">download</span>
                      Export
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top duration-300">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Publishing Status</label>
                      <select 
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#1a558b] outline-none transition-all"
                      >
                        <option value="">Show All</option>
                        <option value="true">Active Only</option>
                        <option value="false">Inactive Only</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 border-b border-gray-100">Plan Description</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 border-b border-gray-100 text-center">Monthly Target</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 border-b border-gray-100 text-center">Enrolled Members</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 border-b border-gray-100">Visibility</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 border-b border-gray-100 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        <tr><td className="px-8 py-20 text-center" colSpan={5}><div className="flex flex-col items-center gap-3"><span className="material-symbols-outlined animate-spin text-4xl text-[#1a558b]">sync</span><p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading specialized plans...</p></div></td></tr>
                      ) : filteredPolicies.length === 0 ? (
                        <tr><td className="px-8 py-20 text-center" colSpan={5}><div className="flex flex-col items-center gap-3"><span className="material-symbols-outlined text-4xl text-gray-300">search_off</span><p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No matching plans found in this category</p></div></td></tr>
                      ) : (
                        filteredPolicies.map((plan) => (
                          <tr key={plan.id} className="hover:bg-gray-50/50 transition-all group">
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-[#1a558b] group-hover:underline cursor-pointer tracking-tight">{plan.name.replace(/_/g, ' ')}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-wider">{plan.adults} Adults • {plan.children} Children</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <div className="inline-block px-4 py-1.5 bg-[#f5f8fc] rounded-xl">
                                <span className="text-sm font-black text-gray-900 tracking-tight">R{parseFloat(plan.monthly_target).toFixed(2)}</span>
                                <span className="text-[9px] font-bold text-gray-400 block uppercase">per month</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <div className="flex flex-col items-center">
                                <span className={`text-sm font-black tracking-tight ${plan.enrolledCount > 0 ? 'text-[#1a558b]' : 'text-gray-300'}`}>
                                  {plan.enrolledCount}
                                </span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Users</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                plan.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-500 border border-gray-200'
                              }`}>
                                <span className={`size-1.5 rounded-full ${plan.is_active ? 'bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.5)]' : 'bg-gray-400'}`}></span>
                                {plan.is_active ? 'Public' : 'Private'}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center justify-center gap-2">
                                <button className="p-2.5 text-gray-400 hover:text-[#1a558b] hover:bg-white hover:shadow-md transition-all rounded-xl border border-transparent hover:border-gray-100" title="Configure Plan"><span className="material-symbols-outlined text-lg">settings</span></button>
                                <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-md transition-all rounded-xl border border-transparent hover:border-gray-100" title="Deactivate"><span className="material-symbols-outlined text-lg">block</span></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50/50 px-8 py-4 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Viewing filtered variation set</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{filteredPolicies.length} of {policies.length} total platform plans</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-right duration-500 p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">System Pricing Rules</h3>
                  <p className="text-sm text-gray-500 mt-1">Adjust the constants used to calculate policy premiums across the platform.</p>
                </div>
                <button 
                  onClick={() => handleSaveRules(rules)}
                  disabled={savingRules}
                  className="px-6 py-3 bg-[#1a558b] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {savingRules ? (
                    <><span className="material-symbols-outlined animate-spin">sync</span> Saving & Syncing...</>
                  ) : (
                    <><span className="material-symbols-outlined">save</span> Save & Update All Plans</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {['day_to_day', 'comprehensive', 'hospital', 'senior'].map(family => (
                  <div key={family} className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                      <span className="material-symbols-outlined text-[#1a558b]">settings_input_component</span>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{family.replace(/_/g, ' ')}</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {rules.filter(r => r.plan_family === family).map(rule => (
                        <div key={rule.id} className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{rule.rule_name.replace(/_/g, ' ')}</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs font-mono">R</span>
                            <input 
                              type="number"
                              value={rule.rule_value}
                              onChange={(e) => {
                                const newRules = rules.map(r => r.id === rule.id ? { ...r, rule_value: e.target.value } : r);
                                setRules(newRules);
                              }}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-7 pr-3 text-sm font-black text-[#1a558b] focus:ring-1 focus:ring-[#1a558b] outline-none"
                            />
                          </div>
                          <p className="text-[9px] text-gray-400">{rule.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
                <span className="material-symbols-outlined text-blue-600">info</span>
                <div>
                  <h5 className="text-sm font-bold text-blue-900">How recalculation works</h5>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                    When you save these rules, the system will automatically iterate through all your defined policy plans and update their **Monthly Target** based on these new values. For example, if you change the "Per Child" price for Day-to-Day, all Single and Couple plans in that family will be updated to reflect the new cost per child.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase">© 2024 +1 Rewards Platform Management • Secured Admin Access</p>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
