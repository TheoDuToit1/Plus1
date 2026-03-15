import { useNavigate } from 'react-router-dom';

export function LegalPopia() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>🔒 Privacy Policy</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>POPIA Compliant · March 2026</p>
          </div>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Back
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="alert alert-info">
            This Privacy Policy is compliant with the Protection of Personal Information Act (POPIA) No. 4 of 2013.
          </div>

          <div className="card">
            <h2 className="section-title">Information Officer</h2>
            <div style={{ background: 'var(--blue-light)', borderRadius: '12px', padding: '1.25rem', border: '1px solid #dce8f5' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                {[
                  { label: 'Company', value: '+1 Rewards (Pty) Ltd' },
                  { label: 'Registration', value: '2024/123456/07' },
                  { label: 'Email', value: 'privacy@plus1rewards.co.za' },
                  { label: 'Phone', value: '010 000 0000' },
                ].map((item, i) => (
                  <div key={i}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: '0 0 2px' }}>{item.label}</p>
                    <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '0.875rem' }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {[
            {
              title: '1. What Information We Collect',
              content: [
                '**Personal details**: Your full name, South African mobile number, and date of birth for identity verification.',
                '**Transaction data**: Purchase amounts, rewards earned, and policy funding records linked to your account.',
                '**Device information**: Device fingerprint for passwordless authentication (no passwords stored).',
                '**Usage data**: App interaction logs for fraud prevention and service improvement.',
              ],
            },
            {
              title: '2. How We Use Your Information',
              content: [
                'To create and manage your +1 Rewards member account and QR code.',
                'To calculate and allocate rewards from partner shop purchases to your Day1 Health policy.',
                'To generate monthly invoices for partner shops based on transaction data.',
                'To pay agent commissions and platform fees as per our revenue model.',
                'To send service notifications (suspension warnings, policy activations, payment reminders).',
              ],
            },
            {
              title: '3. Information Sharing',
              content: [
                '**Day1 Health (Policy Provider)**: Policy funding data is shared monthly (Day 10) to activate your health benefits.',
                '**Sales Agents**: Your shop visit counts may be shared with your recruiting agent (no personal details).',
                '**Legal Requirements**: We may disclose data if required by South African law or regulatory authorities.',
                'We do NOT sell, rent, or trade your personal information to third parties.',
              ],
            },
            {
              title: '4. Data Security',
              content: [
                'All data is encrypted in transit (TLS 1.3) and at rest using AES-256 encryption.',
                'Supabase PostgreSQL with Row Level Security (RLS) ensures you only access your own data.',
                'Passwordless authentication means we never store your password.',
                'Annual penetration testing is conducted by an independent security firm.',
                'Financial records are retained for 7 years as required by South African law.',
              ],
            },
            {
              title: '5. Your Rights Under POPIA',
              content: [
                '**Access**: Request a copy of all personal information we hold about you.',
                '**Correction**: Request correction of inaccurate or outdated information.',
                '**Deletion**: Request deletion of your account and data (subject to legal retention requirements).',
                '**Portability**: Export your full transaction history in CSV format at any time.',
                '**Objection**: Object to processing of your data for marketing purposes.',
                'Submit requests to: privacy@plus1rewards.co.za or call 010 000 0000.',
              ],
            },
            {
              title: '6. Cookies & Offline Storage',
              content: [
                'We use IndexedDB (device storage) to enable offline functionality — no cookies required.',
                'Transaction data is temporarily stored on your device and synced when connectivity is restored.',
                'You can clear this data at any time through your browser/app settings.',
              ],
            },
          ].map((section, i) => (
            <div key={i} className="card">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--blue)', marginBottom: '1rem' }}>{section.title}</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {section.content.map((item, j) => (
                  <li key={j} style={{ display: 'flex', gap: '0.625rem', fontSize: '0.9rem', color: 'var(--gray-text)', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--green-dark)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* I Understand button */}
          <div style={{ padding: '0.5rem 0 1.5rem' }}>
            <button onClick={() => navigate(-1)} className="btn btn-primary btn-block" style={{ height: '56px', fontSize: '1rem', borderRadius: '14px' }}>
              ✓ I Understand & Accept
            </button>
            <p style={{ textAlign: 'center', color: 'var(--gray-light)', fontSize: '0.75rem', marginTop: '0.875rem' }}>
              Last updated: March 15, 2026 · +1 Rewards v7.3
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
