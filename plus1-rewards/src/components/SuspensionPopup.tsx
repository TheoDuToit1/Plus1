

interface SuspensionPopupProps {
  shopName: string;
  invoiceAmount?: number;
  dueDate?: string;
  onClose: () => void;
  onFindShop?: () => void;
}

export function SuspensionPopup({ shopName, invoiceAmount, dueDate, onClose, onFindShop }: SuspensionPopupProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      animation: 'fadeInUp 0.3s ease both',
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '380px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        overflow: 'hidden',
      }}>
        {/* Warning header */}
        <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '2rem 1.5rem 1.5rem', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 900, color: '#fff', margin: '0 0 0.375rem' }}>Shop Temporarily Suspended</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem', margin: 0, fontWeight: 500 }}>
            {shopName}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Status message */}
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontWeight: 700, color: '#92400e', fontSize: '1rem', margin: '0 0 0.25rem' }}>
              🔒 Rewards Paused — Not Deleted
            </p>
            <p style={{ color: '#78350f', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
              Your accumulated rewards at this shop are <strong>safe</strong> and will be fully restored once the shop pays their invoice.
            </p>
          </div>

          {/* Details */}
          {(invoiceAmount || dueDate) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {invoiceAmount && (
                <div style={{ background: '#fef2f2', borderRadius: '10px', padding: '0.875rem', textAlign: 'center', border: '1px solid #fca5a5' }}>
                  <p style={{ fontSize: '0.75rem', color: '#ef4444', margin: '0 0 2px', fontWeight: 600 }}>Invoice Amount</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 900, color: '#991b1b', margin: 0 }}>R{invoiceAmount.toFixed(2)}</p>
                </div>
              )}
              {dueDate && (
                <div style={{ background: '#f3f4f6', borderRadius: '10px', padding: '0.875rem', textAlign: 'center', border: '1px solid var(--gray-border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-text)', margin: '0 0 2px', fontWeight: 600 }}>Due Date</p>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>{dueDate}</p>
                </div>
              )}
            </div>
          )}

          <p style={{ fontSize: '0.875rem', color: 'var(--gray-text)', textAlign: 'center', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            You can continue earning rewards at <strong>other active shops</strong> while this shop resolves their payment.
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {onFindShop && (
              <button onClick={onFindShop} className="btn btn-green btn-block" style={{ height: '52px', borderRadius: '12px', fontSize: '1rem' }}>
                🔍 Find Active Shops Nearby
              </button>
            )}
            <button onClick={onClose} className="btn btn-ghost btn-block" style={{ height: '48px', borderRadius: '12px', fontSize: '0.9375rem' }}>
              ✕ Close — Waiting for Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
