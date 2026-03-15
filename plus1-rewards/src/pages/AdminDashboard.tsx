import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface DashboardStats {
  totalShops: number; activeShops: number; suspendedShops: number;
  revenueThisMonth: number; policiesActivated: number; overdueShops: number; upcomingPayouts: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({ totalShops: 0, activeShops: 0, suspendedShops: 0, revenueThisMonth: 0, policiesActivated: 0, overdueShops: 0, upcomingPayouts: 0 });
  const [alerts, setAlerts] = useState<Array<{ id: string; type: 'warning' | 'info'; message: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: shops } = await supabase.from("shops").select("id, status");
      const totalShops = shops?.length || 0;
      const activeShops = shops?.filter(s => s.status === "active").length || 0;
      const suspendedShops = shops?.filter(s => s.status === "suspended").length || 0;
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: invoices } = await supabase.from("monthly_invoices").select("total_due, status").eq("invoice_month", currentMonth);
      const revenueThisMonth = invoices?.reduce((s, inv) => s + (inv.total_due || 0), 0) || 0;
      const { data: overdueInvoices } = await supabase.from("monthly_invoices").select("id").eq("status", "overdue");
      const overdueShops = overdueInvoices?.length || 0;
      const { data: transactions } = await supabase.from("transactions").select("id").eq("status", "synced");
      const policiesActivated = transactions?.length || 0;
      const { data: agents } = await supabase.from("agents").select("total_commission").gt("total_commission", 0);
      const upcomingPayouts = agents?.reduce((s, a) => s + (a.total_commission || 0), 0) || 0;
      setStats({ totalShops, activeShops, suspendedShops, revenueThisMonth, policiesActivated, overdueShops, upcomingPayouts });
      const newAlerts = [];
      if (overdueShops > 0) newAlerts.push({ id: "overdue", type: "warning" as const, message: `${overdueShops} shop${overdueShops > 1 ? 's' : ''} overdue — auto-suspend pending` });
      if (suspendedShops > 0) newAlerts.push({ id: "suspended", type: "warning" as const, message: `${suspendedShops} shop${suspendedShops > 1 ? 's' : ''} currently suspended` });
      if (upcomingPayouts > 0) newAlerts.push({ id: "payout", type: "info" as const, message: `R${upcomingPayouts.toFixed(2)} agent commission payout due on the 5th` });
      setAlerts(newAlerts);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const kpis = [
    { label: 'Active Shops', value: `${stats.activeShops}/${stats.totalShops}`, sub: `${stats.totalShops > 0 ? Math.round((stats.activeShops / stats.totalShops) * 100) : 0}% operational`, color: 'var(--green-dark)' },
    { label: 'Revenue This Month', value: `R${stats.revenueThisMonth.toFixed(2)}`, sub: 'From invoices', color: 'var(--blue)' },
    { label: 'Suspended Shops', value: String(stats.suspendedShops), sub: 'Need attention', color: 'var(--red)' },
    { label: 'Overdue Invoices', value: String(stats.overdueShops), sub: 'Action required', color: 'var(--orange)' },
    { label: 'Policies Activated', value: String(stats.policiesActivated), sub: 'Synced transactions', color: 'var(--blue)' },
    { label: 'Agent Payouts', value: `R${stats.upcomingPayouts.toFixed(2)}`, sub: 'Commissions due', color: '#0e7490' },
    { label: 'Total Shops', value: String(stats.totalShops), sub: 'Network size', color: 'var(--blue)' },
    { label: 'Collection Rate', value: `${stats.totalShops > 0 ? Math.round(((stats.totalShops - stats.overdueShops) / stats.totalShops) * 100) : 0}%`, sub: 'On-time payments', color: 'var(--green-dark)' },
  ];

  if (loading) return (
    <div className="page-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--gray-text)' }}>Loading admin dashboard...</p>
    </div>
  );

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div className="logo-mark-white"><span className="logo-text">+1</span></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>Admin Dashboard</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Platform Overview</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <button onClick={loadDashboardData} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
              🔄 Refresh
            </button>
            <button onClick={() => { localStorage.removeItem("currentAdmin"); navigate("/"); }} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Alerts */}
          {alerts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {alerts.map(alert => (
                <div key={alert.id} className={`alert ${alert.type === 'warning' ? 'alert-warning' : 'alert-info'}`}>
                  {alert.type === 'warning' ? '⚠️' : '💡'} {alert.message}
                </div>
              ))}
            </div>
          )}

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {kpis.map((kpi, i) => (
              <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${kpi.color}` }}>
                <p className="stat-label">{kpi.label}</p>
                <p className="stat-value" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="stat-sub">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="section-title">⚡ Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem' }}>
              {[
                { label: '📄 Generate Invoices', path: '/admin/invoices', color: 'var(--blue)' },
                { label: '🔴 Manage Suspensions', path: '/admin/suspensions', color: 'var(--red)' },
                { label: '👥 Agent Payouts', path: '/admin/agents', color: '#0e7490' },
                { label: '📊 Export Day1 Batch', path: null, color: 'var(--green-dark)' },
              ].map((action, i) => (
                <button key={i} onClick={() => action.path ? navigate(action.path) : alert('Export feature coming soon')}
                  style={{ background: action.color, color: '#fff', border: 'none', borderRadius: '12px', padding: '1rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', transition: 'opacity 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer style={{ background: '#fff', borderTop: '1px solid var(--gray-border)', padding: '1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.8125rem' }}>© 2026 +1 Rewards Admin Panel</p>
      </footer>
    </div>
  );
}
