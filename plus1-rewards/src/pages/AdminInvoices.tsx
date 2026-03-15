import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Invoice {
  id: string; shop_id: string; shop_name: string; invoice_month: string;
  total_due: number; due_date: string;
  status: "generated" | "sent" | "overdue" | "paid" | "suspended";
  paid_date?: string; penalty_amount: number;
}
type StatusFilter = "all" | "generated" | "overdue" | "paid" | "suspended";
type MonthFilter = "current" | "previous";

const statusConfig: Record<string, { badge: string; label: string }> = {
  paid:      { badge: 'badge-green',  label: '✓ Paid' },
  overdue:   { badge: 'badge-orange', label: '⚠ Overdue' },
  suspended: { badge: 'badge-red',    label: '🔴 Suspended' },
  generated: { badge: 'badge-blue',   label: '📄 Generated' },
  sent:      { badge: 'badge-orange', label: '📤 Sent' },
};

export function AdminInvoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [monthFilter, setMonthFilter] = useState<MonthFilter>("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [nextRunDate, setNextRunDate] = useState("");

  useEffect(() => { loadInvoices(); calculateNextRun(); }, []);
  useEffect(() => { filterInvoices(); }, [invoices, statusFilter, monthFilter, searchTerm]);

  const calculateNextRun = () => {
    const today = new Date();
    const nextRun = new Date(today.getFullYear(), today.getMonth(), 28);
    if (nextRun < today) nextRun.setMonth(nextRun.getMonth() + 1);
    setNextRunDate(nextRun.toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" }));
  };

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const { data: invoicesData } = await supabase.from("monthly_invoices").select("id, shop_id, invoice_month, total_due, due_date, status, paid_date, penalty_amount");
      const { data: shopsData } = await supabase.from("shops").select("id, name");
      const shopMap = new Map(shopsData?.map(s => [s.id, s.name]) || []);
      setInvoices((invoicesData || []).map(inv => ({ ...inv, shop_name: shopMap.get(inv.shop_id) || "Unknown Shop" })));
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const filterInvoices = () => {
    let f = invoices;
    if (monthFilter === "current") { const m = new Date().toISOString().slice(0, 7); f = f.filter(inv => inv.invoice_month === m); }
    else { const d = new Date(); d.setMonth(d.getMonth() - 1); f = f.filter(inv => inv.invoice_month === d.toISOString().slice(0, 7)); }
    if (statusFilter !== "all") f = f.filter(inv => inv.status === statusFilter);
    if (searchTerm) f = f.filter(inv => inv.shop_name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredInvoices(f);
  };

  const markAsPaid = async (id: string) => { await supabase.from("monthly_invoices").update({ status: "paid", paid_date: new Date().toISOString() }).eq("id", id); loadInvoices(); };
  const markMultiplePaid = async () => { await supabase.from("monthly_invoices").update({ status: "paid", paid_date: new Date().toISOString() }).in("id", Array.from(selectedInvoices)); setSelectedInvoices(new Set()); loadInvoices(); };
  const addPenalty = async (id: string) => { const inv = invoices.find(i => i.id === id); if (!inv) return; await supabase.from("monthly_invoices").update({ penalty_amount: inv.total_due * 0.02 }).eq("id", id); loadInvoices(); };
  const suspendShop = async (inv: Invoice) => { await supabase.from("monthly_invoices").update({ status: "suspended" }).eq("id", inv.id); await supabase.from("shops").update({ status: "suspended" }).eq("id", inv.shop_id); loadInvoices(); };

  const exportCSV = () => {
    const rows = filteredInvoices.map(inv => [inv.shop_name, `R${inv.total_due.toFixed(2)}`, inv.due_date, inv.status, `R${inv.penalty_amount.toFixed(2)}`].join(","));
    const blob = new Blob([["Shop,Amount,Due Date,Status,Penalty", ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const summaryStats = {
    totalDue: filteredInvoices.reduce((s, i) => s + i.total_due, 0),
    totalPaid: filteredInvoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total_due, 0),
    totalOverdue: filteredInvoices.filter(i => i.status === "overdue").length,
    day1Payout: filteredInvoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total_due * 0.9, 0),
  };

  if (loading) return (
    <div className="page-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--gray-text)' }}>Loading invoices...</p>
    </div>
  );

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>📄 Invoice Management</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Revenue Control Centre</p>
          </div>
          <button onClick={() => navigate("/admin/dashboard")} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Automation notice */}
          <div className="alert alert-info">
            📅 Next invoice run: <strong>{nextRunDate} 00:01</strong> · {invoices.length} invoices on record
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Total Due', value: `R${summaryStats.totalDue.toFixed(2)}`, color: 'var(--blue)' },
              { label: 'Total Paid', value: `R${summaryStats.totalPaid.toFixed(2)}`, color: 'var(--green-dark)' },
              { label: 'Overdue Shops', value: String(summaryStats.totalOverdue), color: 'var(--orange)' },
              { label: 'Day1 Payout (90%)', value: `R${summaryStats.day1Payout.toFixed(2)}`, color: '#0e7490' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
                <p className="stat-label">{s.label}</p>
                <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem' }}>
              <div>
                <label className="input-label">Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusFilter)} className="input" style={{ paddingRight: '0.5rem' }}>
                  <option value="all">All Statuses</option>
                  <option value="generated">Generated</option>
                  <option value="overdue">Overdue</option>
                  <option value="paid">Paid</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div>
                <label className="input-label">Month</label>
                <select value={monthFilter} onChange={e => setMonthFilter(e.target.value as MonthFilter)} className="input" style={{ paddingRight: '0.5rem' }}>
                  <option value="current">Current Month</option>
                  <option value="previous">Previous Month</option>
                </select>
              </div>
              <div>
                <label className="input-label">Search</label>
                <input type="text" placeholder="Shop name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input" />
              </div>
            </div>
          </div>

          {/* Bulk + Actions bar */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {selectedInvoices.size > 0 && (
              <button onClick={markMultiplePaid} className="btn btn-green" style={{ borderRadius: '8px', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                ✓ Mark {selectedInvoices.size} as Paid
              </button>
            )}
            <button onClick={() => alert("Invoices are auto-generated on Day 28")} className="btn btn-primary" style={{ borderRadius: '8px', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>📄 Generate Invoices</button>
            <button onClick={exportCSV} className="btn btn-outline" style={{ borderRadius: '8px', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>⬇ Export CSV</button>
            <button onClick={loadInvoices} className="btn btn-ghost" style={{ borderRadius: '8px', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>🔄 Refresh</button>
          </div>

          {/* Table */}
          <div className="card" style={{ padding: 0, overflow: 'auto' }}>
            <table className="data-table" style={{ minWidth: '700px' }}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input type="checkbox" checked={selectedInvoices.size === filteredInvoices.length && filteredInvoices.length > 0} onChange={() => { selectedInvoices.size === filteredInvoices.length ? setSelectedInvoices(new Set()) : setSelectedInvoices(new Set(filteredInvoices.map(i => i.id))); }} style={{ cursor: 'pointer' }} />
                  </th>
                  <th>Shop</th><th>Amount Due</th><th>Due Date</th><th>Status</th><th>Penalty</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-light)' }}>No invoices found</td></tr>
                ) : filteredInvoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td><input type="checkbox" checked={selectedInvoices.has(invoice.id)} onChange={() => { const n = new Set(selectedInvoices); n.has(invoice.id) ? n.delete(invoice.id) : n.add(invoice.id); setSelectedInvoices(n); }} style={{ cursor: 'pointer' }} /></td>
                    <td style={{ fontWeight: 600 }}>{invoice.shop_name}</td>
                    <td>R{invoice.total_due.toFixed(2)}</td>
                    <td style={{ color: 'var(--gray-text)', fontSize: '0.875rem' }}>{invoice.due_date}</td>
                    <td><span className={`badge ${statusConfig[invoice.status]?.badge || 'badge-gray'}`}>{statusConfig[invoice.status]?.label || invoice.status}</span></td>
                    <td style={{ color: invoice.penalty_amount > 0 ? 'var(--red)' : 'var(--gray-text)' }}>R{invoice.penalty_amount.toFixed(2)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {invoice.status !== "paid" && <button onClick={() => markAsPaid(invoice.id)} style={{ background: 'var(--green-dark)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>Pay</button>}
                        {invoice.status === "overdue" && <>
                          <button onClick={() => addPenalty(invoice.id)} style={{ background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>Penalty</button>
                          <button onClick={() => suspendShop(invoice)} style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>Suspend</button>
                        </>}
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
