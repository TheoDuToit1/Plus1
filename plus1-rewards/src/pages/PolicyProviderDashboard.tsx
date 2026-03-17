import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProviderDashboard from '../components/provider/ProviderDashboard';

interface PolicyBatch {
  member_id: string; member_name: string; member_phone: string;
  plan_name: string; monthly_target: number; amount_funded: number; status: 'activated' | 'in_progress';
}

interface Provider {
  id: string;
  name: string;
}

export function PolicyProviderDashboard() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<PolicyBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [showNewDashboard, setShowNewDashboard] = useState(true);
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => { 
    const providerData = localStorage.getItem('currentProvider');
    if (!providerData) { navigate('/provider/login'); return; }
    const parsed = JSON.parse(providerData);
    setProvider(parsed);
    loadData(); 
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: wallets } = await supabase.from('wallets').select('member_id, policies');
      const { data: members } = await supabase.from('members').select('id, name, phone');
      const memberMap = new Map(members?.map(m => [m.id, m]) || []);
      const batchData: PolicyBatch[] = [];
      (wallets || []).forEach(wallet => {
        const member = memberMap.get(wallet.member_id);
        if (!member) return;
        const policies = wallet.policies || {};
        Object.entries(policies).forEach(([key, pol]: [string, any]) => {
          if (!pol.target) return;
          batchData.push({
            member_id: wallet.member_id, member_name: member.name, member_phone: member.phone,
            plan_name: pol.name || key, monthly_target: pol.target || 0, amount_funded: pol.current || 0,
            status: (pol.current || 0) >= (pol.target || 1) ? 'activated' : 'in_progress',
          });
        });
      });
      setBatches(batchData);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  // Show the new dashboard by default
  if (showNewDashboard) {
    return <ProviderDashboard />;
  }

  return null;
}
