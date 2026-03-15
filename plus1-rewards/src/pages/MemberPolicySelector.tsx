import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface PolicyPlan {
  id: string; name: string; family: string; variant: string;
  adults: number; children: number; monthly_target: number; is_active: boolean;
}
interface Member { id: string; name: string; active_policy: string | null }

const FALLBACK_PLANS = [
  { id: 'p1', name: 'Day-to-Day Single', family: 'Single', variant: 'Day-to-Day', adults: 1, children: 0, monthly_target: 385, is_active: true },
  { id: 'p2', name: 'Hospital Single', family: 'Single', variant: 'Hospital', adults: 1, children: 0, monthly_target: 390, is_active: true },
  { id: 'p3', name: 'Comprehensive Single', family: 'Single', variant: 'Comprehensive', adults: 1, children: 0, monthly_target: 665, is_active: true },
  { id: 'p4', name: 'Day-to-Day Family', family: 'Family', variant: 'Day-to-Day', adults: 2, children: 2, monthly_target: 720, is_active: true },
];

export function MemberPolicySelector() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [plans, setPlans] = useState<PolicyPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PolicyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/member/login"); return; }
      const { data: memberDetails } = await supabase.from("members").select("id, name, active_policy").eq("id", user.id).single();
      if (memberDetails) setMember(memberDetails);
      const { data: plansData } = await supabase.from("policy_plans").select("*").eq("is_active", true).order("family");
      const usePlans = (plansData && plansData.length > 0) ? plansData : FALLBACK_PLANS;
      setPlans(usePlans);
      setSelectedPlan(usePlans[0]);
    } catch { setPlans(FALLBACK_PLANS); setSelectedPlan(FALLBACK_PLANS[0]); }
    finally { setLoading(false); }
  };

  const handleSetActivePolicy = async () => {
    if (!member || !selectedPlan) return;
    setSaving(true); setError(""); setSuccess("");
    try {
      await supabase.from("members").update({ active_policy: selectedPlan.id }).eq("id", member.id);
      await supabase.from("wallets").update({ policies: { name: selectedPlan.name, current: 0, target: selectedPlan.monthly_target, status: "active" } }).eq("member_id", member.id);
      setSuccess(`✓ Policy set to ${selectedPlan.name}`);
      setTimeout(() => navigate("/member/dashboard"), 1500);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to set policy"); }
    finally { setSaving(false); }
  };

  const familyGroups = plans.reduce((acc, p) => { (acc[p.family] = acc[p.family] || []).push(p); return acc; }, {} as Record<string, PolicyPlan[]>);

  if (loading) return (
    <div className="page-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--blue-light)', borderTopColor: 'var(--blue)', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--gray-text)' }}>Loading plans...</p>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Choose Your Health Plan</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Day1 Health — powered by your rewards</p>
          </div>
          <button onClick={() => navigate("/member/dashboard")} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Info banner */}
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--blue-light), #f0fdf8)', border: '1px solid #dce8f5' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem' }}>🏥</div>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--blue)', margin: '0 0 0.25rem' }}>Day1 Health Plans</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-text)', margin: 0 }}>Your rewards from partner shops automatically fund the plan you choose below. Once your monthly target is reached, your policy activates.</p>
              </div>
            </div>
          </div>

          {/* Plan groups */}
          {Object.entries(familyGroups).map(([family, familyPlans]) => (
            <div key={family} className="card">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                {family} Plans
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {familyPlans.map(plan => {
                  const isSelected = selectedPlan?.id === plan.id;
                  const isActive = member?.active_policy === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      style={{
                        padding: '1rem 1.25rem',
                        border: isSelected ? '2px solid var(--blue)' : '1.5px solid var(--gray-border)',
                        backgroundColor: isSelected ? 'var(--blue-light)' : '#fff',
                        borderRadius: '12px', cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <p style={{ fontWeight: 700, color: '#111827', margin: 0 }}>{plan.name}</p>
                          {isActive && <span className="badge badge-green">Your Plan</span>}
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--gray-text)', margin: 0 }}>
                          {plan.adults} adult{plan.adults > 1 ? 's' : ''}{plan.children > 0 ? ` · ${plan.children} children` : ''}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: isSelected ? 'var(--blue)' : '#374151', margin: 0 }}>
                          R{plan.monthly_target}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', margin: '2px 0 0' }}>/ month target</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          {selectedPlan && (
            <div className="card" style={{ background: 'var(--green-light)', border: '1px solid #a7f3d0' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--gray-text)', margin: '0 0 0.375rem', fontWeight: 600 }}>Selected Plan</h3>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534', margin: '0 0 0.375rem' }}>{selectedPlan.name}</p>
              <p style={{ fontSize: '0.875rem', color: '#166534', margin: '0 0 1.25rem' }}>Monthly reward target: <strong>R{selectedPlan.monthly_target}</strong></p>
              <button onClick={handleSetActivePolicy} disabled={saving} className="btn btn-green btn-block" style={{ borderRadius: '12px', height: '52px', fontSize: '1rem' }}>
                {saving ? '⏳ Saving...' : `✓ Activate ${selectedPlan.name}`}
              </button>
            </div>
          )}
        </div>
      </main>

      <footer style={{ background: '#fff', borderTop: '1px solid var(--gray-border)', padding: '1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.8125rem' }}>© 2026 +1 Rewards · Day1 Health Partner</p>
      </footer>
    </div>
  );
}
