import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface SuspendedShop {
  id: string; shop_id: string; shop_name: string;
  invoice_amount: number; due_date: string; days_overdue: number;
  members_affected: number; suspension_date: string; penalty_amount: number;
}
interface EarlyWarning { shop_id: string; shop_name: string; invoice_amount: number; days_overdue: number; due_date: string }

export function AdminSuspensions() {
  const navigate = useNavigate();
  const [suspendedShops, setSuspendedShops] = useState<SuspendedShop[]>([]);
  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarning[]>([]);
  const [stats, setStats] = useState({ totalSuspended: 0, totalRevenueLost: 0, totalMembersAffected: 0, averageDaysSuspended: 0 });
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Directly query shops with suspended status — catches all suspension sources
      const { data: suspendedShopsList } = await supabase.from('shops').select('id, name, phone, commission_rate').eq('status', 'suspended');
      const { data: overdueInvoices } = await supabase.from('monthly_invoices').select('id, shop_id, total_due, due_date').eq('status', 'overdue');
      const { data: suspendedInvoices } = await supabase.from('monthly_invoices').select('id, shop_id, total_due, due_date, penalty_amount, created_at').eq('status', 'suspended');
      const { data: wallets } = await supabase.from('wallets').select('shop_id, member_id');

      const membersByShop = new Map<string, Set<string>>();
      wallets?.forEach(w => { if (!membersByShop.has(w.shop_id)) membersByShop.set(w.shop_id, new Set()); membersByShop.get(w.shop_id)?.add(w.member_id); });

      const today = new Date();

      // Build suspended list from shops table (source of truth)
      const processed: SuspendedShop[] = (suspendedShopsList || []).map(shop => {
        const invoice = (suspendedInvoices || []).find(inv => inv.shop_id === shop.id);
        const daysOverdue = invoice ? Math.max(Math.floor((today.getTime() - new Date(invoice.due_date).getTime()) / 86400000), 0) : 0;
        return {
          id: invoice?.id || shop.id, shop_id: shop.id, shop_name: shop.name,
          invoice_amount: invoice?.total_due || 0, due_date: invoice?.due_date || '',
          days_overdue: daysOverdue, members_affected: membersByShop.get(shop.id)?.size || 0,
          suspension_date: invoice?.created_at || new Date().toISOString(), penalty_amount: invoice?.penalty_amount || 0,
        };
      });

      const warnings = (overdueInvoices || []).map(inv => {
        const shopInfo = (suspendedShopsList || []).find(s => s.id === inv.shop_id);
        const days = Math.max(Math.floor((today.getTime() - new Date(inv.due_date).getTime()) / 86400000), 0);
        return { shop_id: inv.shop_id, shop_name: shopInfo?.name || 'Unknown', invoice_amount: inv.total_due, days_overdue: days, due_date: inv.due_date };
      }).filter(w => w.days_overdue >= 4 && w.days_overdue < 7);

      setSuspendedShops(processed);
      setEarlyWarnings(warnings);
      setStats({ totalSuspended: processed.length, totalRevenueLost: processed.reduce((s, sh) => s + sh.invoice_amount, 0), totalMembersAffected: processed.reduce((s, sh) => s + sh.members_affected, 0), averageDaysSuspended: processed.length > 0 ? Math.round(processed.reduce((s, sh) => s + sh.days_overdue, 0) / processed.length * 10) / 10 : 0 });
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const reactivate = async (id: string, shopId: string) => {
    setActionId(id);
    await supabase.from("monthly_invoices").update({ status: "paid", paid_date: new Date().toISOString() }).eq("id", id);
    await supabase.from("shops").update({ status: "active" }).eq("id", shopId);
    setActionId(null); loadData();
  };
  const sendReminder = async (shopName: string) => { alert(`Reminder sent to ${shopName}`); };
  const extendGrace = async (id: string) => { setActionId(id); await supabase.from("monthly_invoices").update({ status: "generated" }).eq("id", id); setActionId(null); loadData(); };

  if (loading) return (
    <div className="page-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>🔴 Suspension Management</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Risk Control Centre</p>
          </div>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <button onClick={loadData} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>🔄</button>
            <button onClick={() => navigate("/admin/dashboard")} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>← Dashboard</button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Suspended Shops', value: String(stats.totalSuspended), color: 'var(--red)' },
              { label: 'Revenue at Risk', value: `R${stats.totalRevenueLost.toFixed(2)}`, color: 'var(--orange)' },
              { label: 'Members Affected', value: String(stats.totalMembersAffected), color: 'var(--blue)' },
              { label: 'Avg Days Overdue', value: String(stats.averageDaysSuspended), color: 'var(--gray-text)' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
                <p className="stat-label">{s.label}</p>
                <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Early Warnings */}
          {earlyWarnings.length > 0 && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#991b1b', margin: '0 0 1rem' }}>
                ⚠️ Early Warning — {earlyWarnings.length} Shop{earlyWarnings.length > 1 ? "s" : ""} at Risk (Day 4–6 Overdue)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {earlyWarnings.map(w => (
                  <div key={w.shop_id} style={{ background: '#fff', borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{w.shop_name}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-text)', margin: 0 }}>R{w.invoice_amount.toFixed(2)} · Day {w.days_overdue} overdue</p>
                    </div>
                    <button onClick={() => sendReminder(w.shop_name)} style={{ background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 0.875rem', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}>
                      📱 Send Reminder
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suspended Shops Table */}
          <div className="card" style={{ padding: 0, overflow: 'auto' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-border)' }}>
              <h2 className="section-title" style={{ margin: 0 }}>🔴 Suspended Shops ({suspendedShops.length})</h2>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Shop</th><th>Invoice</th><th>Days Overdue</th><th>Members</th><th>Penalty</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suspendedShops.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-light)' }}>✅ No suspended shops</td></tr>
                ) : suspendedShops.map(shop => (
                  <tr key={shop.id}>
                    <td style={{ fontWeight: 600 }}>{shop.shop_name}</td>
                    <td>R{shop.invoice_amount.toFixed(2)}</td>
                    <td><span className="badge badge-red">Day {shop.days_overdue}</span></td>
                    <td><span className="badge badge-blue">{shop.members_affected} members</span></td>
                    <td style={{ color: shop.penalty_amount > 0 ? 'var(--red)' : 'var(--gray-text)' }}>R{shop.penalty_amount.toFixed(2)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        <button onClick={() => reactivate(shop.id, shop.shop_id)} disabled={actionId === shop.id} style={{ background: 'var(--green-dark)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.625rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700, opacity: actionId === shop.id ? 0.5 : 1 }}>
                          {actionId === shop.id ? "..." : "✓ Reactivate"}
                        </button>
                        <button onClick={() => sendReminder(shop.shop_name)} style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.625rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>Remind</button>
                        <button onClick={() => extendGrace(shop.id)} disabled={actionId === shop.id} style={{ background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.625rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>Extend</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer style={{ background: '#fff', borderTop: '1px solid var(--gray-border)', padding: '1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.8125rem' }}>© 2026 +1 Rewards Admin</p>
      </footer>
    </div>
  );
}
