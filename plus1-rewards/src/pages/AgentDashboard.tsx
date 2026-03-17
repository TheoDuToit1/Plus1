import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AgentLayout from "../components/agent/AgentLayout";

interface ShopWithEarnings {
  id: string; name: string; commission_rate: number;
  status: "active" | "suspended"; monthly_earnings: number;
}
interface Agent { id: string; name: string; phone: string; total_commission: number }

export function AgentDashboard() {
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [shops, setShops] = useState<ShopWithEarnings[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [activeShops, setActiveShops] = useState(0);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const agentData = localStorage.getItem("currentAgent");
      if (!agentData) { navigate("/agent/login"); return; }
      const parsedAgent = JSON.parse(agentData);
      const { data: agentDetails } = await supabase.from("agents").select("*").eq("id", parsedAgent.id).single();
      if (agentDetails) setAgent(agentDetails);
      const { data: shopsData } = await supabase.from("shops").select("*").eq("agent_id", parsedAgent.id);
      if (shopsData) {
        const shopsWithEarnings = await Promise.all(shopsData.map(async shop => {
          const { data: invoices } = await supabase.from("monthly_invoices").select("agent_commission_total").eq("shop_id", shop.id).order("invoice_month", { ascending: false }).limit(1);
          return { ...shop, monthly_earnings: invoices?.[0]?.agent_commission_total || 0 };
        }));
        setShops(shopsWithEarnings);
        setMonthlyTotal(shopsWithEarnings.reduce((s, sh) => s + sh.monthly_earnings, 0));
        setActiveShops(shopsWithEarnings.filter(sh => sh.status === "active").length);
      }
    } catch { /* silent */ } finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AgentLayout 
      agent={agent}
      onSignOut={() => { localStorage.removeItem("currentAgent"); navigate("/agent/login"); }}
    >
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-cyan-100 text-sm mb-1">Agent Commission</p>
            <p className="text-4xl md:text-5xl font-black text-cyan-300">R{agent?.total_commission?.toFixed(2) || '0.00'}</p>
            <p className="text-cyan-100 text-sm mt-1">Total earned to date</p>
          </div>
          <div className="text-right">
            <p className="text-cyan-100 text-sm mb-1">This Month</p>
            <p className="text-3xl md:text-4xl font-black text-emerald-300">R{monthlyTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#193322] border border-[#1a3324] rounded-xl p-6 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Shops</p>
          <p className="text-blue-400 text-4xl font-black mb-1">{shops.length}</p>
          <p className="text-slate-500 text-sm">Recruited</p>
        </div>
        <div className="bg-[#193322] border border-[#1a3324] rounded-xl p-6 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Shops</p>
          <p className="text-emerald-400 text-4xl font-black mb-1">{activeShops}</p>
          <p className="text-slate-500 text-sm">Earning now</p>
        </div>
        <div className="bg-[#193322] border border-[#1a3324] rounded-xl p-6 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Suspended</p>
          <p className="text-orange-400 text-4xl font-black mb-1">{shops.length - activeShops}</p>
          <p className="text-slate-500 text-sm">Need attention</p>
        </div>
      </div>

      <div className="bg-[#193322] border border-[#1a3324] rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h2 className="text-white text-xl font-bold">🏪 Recruited Shops</h2>
          <button onClick={() => navigate("/agent/add-shop")} className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-cyan-600 text-sm">
            + Add Shop
          </button>
        </div>

        {shops.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🏪</div>
            <p className="text-slate-400 mb-2">No shops recruited yet.</p>
            <p className="text-slate-500 text-sm">Start recruiting shops to earn commissions!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shops.map(shop => (
              <div key={shop.id} className="flex flex-col md:flex-row justify-between md:items-center p-4 bg-slate-700 rounded-lg border border-slate-600 gap-4">
                <div>
                  <p className="font-bold text-white">{shop.name}</p>
                  <p className="text-sm text-slate-400">Commission rate: {shop.commission_rate}%</p>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <p className="font-black text-cyan-400">R{shop.monthly_earnings.toFixed(2)}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${shop.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {shop.status === 'active' ? '✓ Active' : '⚠ Suspended'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AgentLayout>
  );
}
