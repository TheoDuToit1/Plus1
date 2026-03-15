import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Invoice {
  id: string; shop_id: string; invoice_month: string;
  total_rewards_issued: number; customer_rewards: number;
  agent_commission_total: number; platform_fee_total: number;
  total_due: number; penalty_amount: number;
  status: "generated" | "sent" | "overdue" | "paid" | "suspended";
  due_date: string; eft_reference: string; created_at: string;
}
interface Shop { id: string; name: string; bank_name: string; bank_account: string; account_holder: string; status: "active" | "suspended" }

const statusConfig: Record<string, { badge: string; label: string }> = {
  paid:      { badge: 'badge-green',  label: 'Paid' },
  overdue:   { badge: 'badge-red',    label: 'Overdue' },
  suspended: { badge: 'badge-red',    label: 'Suspended' },
  sent:      { badge: 'badge-orange', label: 'Pending' },
  generated: { badge: 'badge-blue',   label: 'Generated' },
};

export function ShopInvoice() {
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [previousInvoices, setPreviousInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadInvoiceData(); }, []);

  const loadInvoiceData = async () => {
    setLoading(true);
    try {
      const shopData = localStorage.getItem("currentShop");
      if (!shopData) { navigate("/shop/login"); return; }
      const parsedShop = JSON.parse(shopData);
      const { data: shopDetails } = await supabase.from("shops").select("*").eq("id", parsedShop.id).single();
      if (shopDetails) setShop(shopDetails);
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: invoices } = await supabase.from("monthly_invoices").select("*").eq("shop_id", parsedShop.id).order("invoice_month", { ascending: false }).limit(4);
      if (invoices?.length) {
        const current = invoices.find(inv => inv.invoice_month === currentMonth);
        if (current) setCurrentInvoice(current);
        setPreviousInvoices(invoices.slice(0, 3));
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load invoice"); }
    finally { setLoading(false); }
  };

  const copyPaymentInfo = () => {
    if (!shop || !currentInvoice) return;
    navigator.clipboard.writeText(`Bank: ${shop.bank_name}\nAccount: ${shop.bank_account}\nHolder: ${shop.account_holder}\nRef: ${currentInvoice.eft_reference}\nAmount: R${currentInvoice.total_due.toFixed(2)}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="page-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--gray-text)' }}>Loading invoice...</p>
    </div>
  );

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>📄 Monthly Invoice</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{shop?.name}</p>
          </div>
          <button onClick={() => navigate("/shop/dashboard")} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && <div className="alert alert-error">{error}</div>}

          {currentInvoice ? (
            <>
              {/* Current Invoice */}
              <div className="card">
                {/* Invoice header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px dashed var(--gray-border)' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 0.25rem' }}>Invoice {currentInvoice.invoice_month}</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-text)', margin: 0 }}>Due: {new Date(currentInvoice.due_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge ${statusConfig[currentInvoice.status]?.badge || 'badge-gray'}`} style={{ fontSize: '0.9rem', padding: '0.375rem 0.875rem' }}>
                    {statusConfig[currentInvoice.status]?.label || currentInvoice.status}
                  </span>
                </div>

                {/* Total Due */}
                <div style={{ background: currentInvoice.status === 'paid' ? 'var(--green-light)' : 'var(--blue-light)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: `1px solid ${currentInvoice.status === 'paid' ? '#a7f3d0' : '#dce8f5'}`, textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-text)', margin: '0 0 0.25rem' }}>Total Amount Due</p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 900, color: currentInvoice.status === 'paid' ? '#166534' : 'var(--blue)', margin: 0 }}>
                    R{currentInvoice.total_due.toFixed(2)}
                  </p>
                  {currentInvoice.penalty_amount > 0 && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--red)', margin: '0.5rem 0 0', fontWeight: 600 }}>
                      Includes R{currentInvoice.penalty_amount.toFixed(2)} penalty
                    </p>
                  )}
                </div>

                {/* Breakdown */}
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem' }}>Commission Breakdown</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Customer Rewards', sub: '98%', value: currentInvoice.customer_rewards },
                    { label: 'Agent Commission', sub: '1%', value: currentInvoice.agent_commission_total },
                    { label: 'Platform Fee', sub: '1%', value: currentInvoice.platform_fee_total },
                  ].map((item, i) => (
                    <div key={i} style={{ background: 'var(--bg)', borderRadius: '10px', padding: '1rem', textAlign: 'center', border: '1px solid var(--gray-border)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: '0 0 2px' }}>{item.sub}</p>
                      <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--blue)', margin: '0 0 2px' }}>R{item.value.toFixed(2)}</p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--gray-text)', margin: 0 }}>{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* EFT Details */}
                <div style={{ background: 'var(--blue-light)', borderRadius: '12px', padding: '1.25rem', border: '1px solid #dce8f5' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--blue)', marginBottom: '1rem', margin: '0 0 1rem' }}>EFT Payment Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1rem' }}>
                    {[
                      { label: 'Bank', value: shop?.bank_name },
                      { label: 'Account Holder', value: shop?.account_holder },
                      { label: 'Account Number', value: shop?.bank_account },
                      { label: 'Reference', value: currentInvoice.eft_reference },
                    ].map((item, i) => (
                      <div key={i}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: '0 0 2px' }}>{item.label}</p>
                        <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '0.9rem' }}>{item.value || '—'}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={copyPaymentInfo} className="btn btn-primary btn-block" style={{ borderRadius: '10px' }}>
                    {copied ? '✓ Copied!' : '📋 Copy Payment Info'}
                  </button>
                </div>

                {currentInvoice.status !== 'paid' && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fcd34d' }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0, fontWeight: 600 }}>
                      ⏱ Payment must be received by {new Date(currentInvoice.due_date).toLocaleDateString()} to avoid suspension.
                    </p>
                  </div>
                )}
              </div>

              {/* Previous Invoices */}
              {previousInvoices.length > 0 && (
                <div className="card">
                  <h2 className="section-title">Invoice History</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {previousInvoices.map(inv => (
                      <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', background: '#fafbff', border: '1px solid var(--gray-border)', borderRadius: '10px' }}>
                        <div>
                          <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{inv.invoice_month}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: 0 }}>Due {new Date(inv.due_date).toLocaleDateString()}</p>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                          <p style={{ fontWeight: 800, color: '#111827', margin: 0 }}>R{inv.total_due.toFixed(2)}</p>
                          <span className={`badge ${statusConfig[inv.status]?.badge || 'badge-gray'}`}>{statusConfig[inv.status]?.label || inv.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
              <h2 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>No invoice yet</h2>
              <p style={{ color: 'var(--gray-text)', marginBottom: '1.5rem' }}>Invoices are generated on the 28th of each month.</p>
              <button onClick={() => navigate("/shop/dashboard")} className="btn btn-primary" style={{ borderRadius: '10px' }}>← Back to Dashboard</button>
            </div>
          )}
        </div>
      </main>

      <footer style={{ background: '#fff', borderTop: '1px solid var(--gray-border)', padding: '1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.8125rem' }}>© 2026 +1 Rewards · Shop Partner Portal</p>
      </footer>
    </div>
  );
}
