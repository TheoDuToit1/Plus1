import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Member { id: string; name: string; phone: string; email?: string; active_policy?: string }
interface Wallet { id: string; policies: any; rewards_total: number }

export function MemberProfile() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/member/login'); return; }
      const { data } = await supabase.from('members').select('*').eq('id', user.id).single();
      if (data) { setMember(data); setEditName(data.name); }
      const { data: walletsData } = await supabase.from('wallets').select('id, policies, rewards_total').eq('member_id', user.id);
      if (walletsData) setWallets(walletsData);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const saveName = async () => {
    if (!member || !editName.trim()) return;
    setSaving(true);
    await supabase.from('members').update({ name: editName.trim() }).eq('id', member.id);
    setMember(prev => prev ? { ...prev, name: editName.trim() } : prev);
    setSaving(false); setEditing(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalRewards = wallets.reduce((s, w) => s + (w.rewards_total || 0), 0);
  const activePolicies = wallets.filter(w => {
    const policies = w.policies || {};
    return Object.values(policies).some((p: any) => (p.current || 0) >= (p.target || 1));
  }).length;

  if (loading) return (
    <div className="page-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>👤 My Profile</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Account settings & details</p>
          </div>
          <button onClick={() => navigate('/member/dashboard')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {saved && <div className="alert alert-success">✓ Profile updated successfully</div>}

          {/* Avatar + name */}
          <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--blue-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.875rem', color: '#fff', fontWeight: 800 }}>
              {member?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            {editing ? (
              <div style={{ display: 'flex', gap: '0.625rem', maxWidth: '300px', margin: '0 auto' }}>
                <input type="text" className="input" value={editName} onChange={e => setEditName(e.target.value)} style={{ textAlign: 'center' }} />
                <button onClick={saveName} disabled={saving} style={{ background: 'var(--green-dark)', color: '#fff', border: 'none', borderRadius: '10px', padding: '0 1rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                  {saving ? '⏳' : '✓'}
                </button>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', margin: '0 0 0.375rem' }}>{member?.name}</h2>
                <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
                  ✏️ Edit name
                </button>
              </div>
            )}
          </div>

          {/* Account info */}
          <div className="card">
            <h2 className="section-title">Account Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { label: 'Mobile Number', value: member?.phone || '—', icon: '📱' },
                { label: 'Email', value: member?.email || '—', icon: '📧' },
                { label: 'Member ID', value: member?.id?.slice(0, 16) + '…' || '—', icon: '🔑' },
                { label: 'Active Policy', value: member?.active_policy || 'None selected', icon: '🏥' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', background: '#fafbff', borderRadius: '10px', border: '1px solid var(--gray-border)' }}>
                  <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: '0 0 2px' }}>{item.label}</p>
                    <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: '0.9375rem' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <p className="stat-label">Total Rewards</p>
              <p className="stat-value" style={{ color: 'var(--green-dark)', fontSize: '1.25rem' }}>R{totalRewards.toFixed(2)}</p>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <p className="stat-label">Partner Shops</p>
              <p className="stat-value" style={{ color: 'var(--blue)', fontSize: '1.25rem' }}>{wallets.length}</p>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <p className="stat-label">Active Policies</p>
              <p className="stat-value" style={{ color: 'var(--orange)', fontSize: '1.25rem' }}>{activePolicies}</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="card">
            <h2 className="section-title">Account Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { label: '📊 View My History', path: '/member/history' },
                { label: '🏥 Change My Policy Plan', path: '/member/policy-selector' },
                { label: '🔒 Privacy Policy (POPIA)', path: '/legal/popia' },
                { label: '📄 Member Terms', path: '/legal/member-terms' },
              ].map((item, i) => (
                <button key={i} onClick={() => navigate(item.path)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: '#fafbff', border: '1px solid var(--gray-border)', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9375rem', color: '#111827', textAlign: 'left' }}>
                  {item.label} <span style={{ color: 'var(--gray-light)' }}>→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sign out */}
          <button onClick={async () => { await supabase.auth.signOut(); navigate('/member/login'); }} className="btn btn-danger btn-block" style={{ borderRadius: '12px', height: '52px' }}>
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
