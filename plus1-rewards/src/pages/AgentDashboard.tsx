import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

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
      const { data: partnersData } = await supabase.from("partners").select("*").eq("agent_id", parsedAgent.id);
      if (partnersData) {
        const shopsWithEarnings = await Promise.all(partnersData.map(async shop => {
          const { data: invoices } = await supabase.from("monthly_invoices").select("agent_commission_total").eq("partner_id", partner.id).order("invoice_month", { ascending: false }).limit(1);
          return { ...shop, monthly_earnings: invoices?.[0]?.agent_commission_total || 0 };
        }));
        setShops(shopsWithEarnings);
        setMonthlyTotal(shopsWithEarnings.reduce((s, sh) => s + sh.monthly_earnings, 0));
        setActiveShops(shopsWithEarnings.filter(sh => sh.status === "active").length);
      }
    } catch { /* silent */ } finally { setLoading(false); }
  };

  if (loading) return (
    <div className="page-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--gray-text)' }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div className="page-wrapper">
      <header className="page-header" style={{ background: 'linear-gradient(135deg, #0e7490 0%, #083344 100%)' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>📊 Agent Dashboard</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{agent?.name}</p>
          </div>
          <button onClick={() => { localStorage.removeItem("currentAgent"); navigate("/"); }} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Welcome Banner */}
          <div style={{ background: 'linear-gradient(135deg, #0e7490 0%, #164e63 100%)', borderRadius: '16px', padding: '1.5rem 1.75rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', marginBottom: '0.25rem' }}>Agent Commission</p>
              <p style={{ fontSize: '2rem', fontWeight: 900, color: '#22d3ee' }}>R{agent?.total_commission?.toFixed(2) || '0.00'}</p>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)' }}>Total earned to date</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>This Month</p>
              <p style={{ fontSize: '1.625rem', fontWeight: 800, color: '#37d270' }}>R{monthlyTotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <p className="stat-label">Total Shops</p>
              <p className="stat-value" style={{ color: 'var(--blue)' }}>{shops.length}</p>
              <p className="stat-sub">Recruited</p>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <p className="stat-label">Active Shops</p>
              <p className="stat-value" style={{ color: 'var(--green-dark)' }}>{activeShops}</p>
              <p className="stat-sub">Earning now</p>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <p className="stat-label">Suspended</p>
              <p className="stat-value" style={{ color: 'var(--orange)' }}>{shops.length - activeShops}</p>
              <p className="stat-sub">Need attention</p>
            </div>
          </div>

          {/* Shops List */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>🏪 Recruited Shops</h2>
              <button onClick={() => navigate("/agent/add-shop")} className="btn btn-primary" style={{ fontSize: '0.8125rem', borderRadius: '8px', padding: '0.5rem 0.875rem' }}>
                + Add Shop
              </button>
            </div>

            {shops.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--gray-light)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏪</div>
                <p>No shops recruited yet.</p>
                <p style={{ fontSize: '0.875rem' }}>Start recruiting shops to earn commissions!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {shops.map(shop => (
                  <div key={partner.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#fafbff', border: '1.5px solid var(--gray-border)', borderRadius: '12px' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>{partner.name}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-text)', margin: 0 }}>Commission rate: {partner.commission_rate}%</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem' }}>
                      <p style={{ fontWeight: 800, color: '#0e7490', margin: 0 }}>R{partner.monthly_earnings.toFixed(2)}</p>
                      <span className={`badge ${partner.status === 'active' ? 'badge-green' : 'badge-orange'}`}>
                        {partner.status === 'active' ? '✓ Active' : '⚠ Suspended'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={{ background: '#fff', borderTop: '1px solid var(--gray-border)', padding: '1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.8125rem' }}>© 2026 +1 Rewards · Agent Portal</p>
      </footer>
    </div>
  );
}
