import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import QRCode from 'qrcode';

export function MemberQR() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [memberData, setMemberData] = useState<{ name: string; phone: string; qr_code: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadMemberQR(); }, []);

  const loadMemberQR = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/member/login'); return; }
      const { data } = await supabase.from('members').select('name, phone, qr_code').eq('id', user.id).single();
      if (data) {
        setMemberData(data);
        setTimeout(() => renderQR(data.qr_code || data.phone || user.id), 100);
      }
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const renderQR = async (value: string) => {
    if (!canvasRef.current) return;
    await QRCode.toCanvas(canvasRef.current, value, {
      width: Math.min(window.innerWidth * 0.75, 280),
      margin: 2,
      color: { dark: '#1a568b', light: '#ffffff' },
    });
  };

  const copyPhone = () => {
    if (!memberData?.phone) return;
    navigator.clipboard.writeText(memberData.phone);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const refreshQR = async () => {
    if (!memberData) return;
    const newQR = `PLUS1-${memberData.phone}-${Date.now()}`;
    await supabase.from('members').update({ qr_code: newQR }).eq('phone', memberData.phone);
    renderQR(newQR);
  };

  return (
    <div className="page-wrapper" style={{ background: 'var(--blue)' }}>
      {/* Header */}
      <header style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="logo-mark-white"><span className="logo-text">+1</span></div>
        </div>
        <button onClick={() => navigate('/member/dashboard')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
          ✕ Close
        </button>
      </header>

      {/* Main QR Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', gap: '1.5rem' }}>
        {/* Name */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 0.25rem' }}>{memberData?.name || 'Member'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem' }}>Show this QR code at partner shops</p>
        </div>

        {/* QR Card */}
        <div style={{
          background: '#fff', borderRadius: '24px', padding: '1.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
          animation: 'fadeInUp 0.4s ease both',
        }}>
          {loading ? (
            <div style={{ width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <canvas ref={canvasRef} style={{ borderRadius: '12px' }} />
          )}

          {/* Phone number */}
          <div style={{ textAlign: 'center', padding: '0.625rem 1.25rem', background: 'var(--blue-light)', borderRadius: '10px', width: '100%' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-text)', margin: '0 0 2px' }}>Mobile Number</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--blue)', margin: 0, letterSpacing: '0.05em' }}>
              {memberData?.phone || '—'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '300px' }}>
          <button onClick={copyPhone} style={{
            flex: 1, padding: '0.875rem', borderRadius: '12px',
            background: copied ? 'var(--green-dark)' : 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)', color: '#fff',
            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {copied ? '✓ Copied!' : '📋 Copy Phone'}
          </button>
          <button onClick={refreshQR} style={{
            flex: 1, padding: '0.875rem', borderRadius: '12px',
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
          }}>
            🔄 Refresh QR
          </button>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textAlign: 'center' }}>
          QR codes expire every 30 days for security
        </p>
      </main>
    </div>
  );
}
