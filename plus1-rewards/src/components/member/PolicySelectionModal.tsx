// plus1-rewards/src/components/member/PolicySelectionModal.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface PolicyPlan {
  id: string;
  name: string;
  family: string;
  variant: string;
  adults: number;
  children: number;
  monthly_target: number;
  description: string;
}

interface PolicySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPolicySelected: (policyId: string) => void;
  memberId: string;
}

export default function PolicySelectionModal({ isOpen, onClose, onPolicySelected, memberId }: PolicySelectionModalProps) {
  const [policies, setPolicies] = useState<PolicyPlan[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      fetchPolicies();
    }
  }, [isOpen]);

  // Auto-select the R385 plan when policies are loaded
  useEffect(() => {
    if (policies.length > 0 && !selectedPolicy) {
      const r385Plan = policies.find(p => p.monthly_target === 385);
      if (r385Plan) {
        setSelectedPolicy(r385Plan.id);
      }
    }
  }, [policies, selectedPolicy]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('policy_plans')
        .select('*')
        .eq('is_active', true)
        .order('family', { ascending: true })
        .order('variant', { ascending: true })
        .order('children', { ascending: true });

      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPolicy) {
      alert('Please select a policy plan');
      return;
    }

    if (!memberId) {
      alert('Member ID not found. Please refresh the page and try again.');
      return;
    }

    try {
      setSubmitting(true);
      
      console.log('Updating member policy:', { memberId, selectedPolicy });
      
      // Update member's active_policy
      const { data, error } = await supabase
        .from('members')
        .update({ active_policy: selectedPolicy })
        .eq('id', memberId)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Policy update error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No member found with the provided ID');
      }

      onPolicySelected(selectedPolicy);
      onClose();
    } catch (error) {
      console.error('Error selecting policy:', error);
      alert(`Failed to select policy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPolicies = policies.filter(policy => {
    if (filter === 'all') return true;
    return policy.family === filter;
  });

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  const getFamilyColor = (family: string) => {
    switch (family) {
      case 'comprehensive': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'hospital': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'day_to_day': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'senior': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-dark rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Select Your Policy Plan</h2>
              <p className="text-slate-400 mt-1">Choose a policy to start receiving rewards</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
              disabled={submitting}
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Policy Family Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all' 
                  ? 'bg-primary text-background-dark' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              All Plans
            </button>
            <button
              onClick={() => setFilter('comprehensive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'comprehensive' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Comprehensive
            </button>
            <button
              onClick={() => setFilter('hospital')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'hospital' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Hospital
            </button>
            <button
              onClick={() => setFilter('day_to_day')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'day_to_day' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Day-to-Day
            </button>
            <button
              onClick={() => setFilter('senior')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'senior' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Senior
            </button>
          </div>

          {/* Policy Grid */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl animate-pulse">
                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-6 bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPolicies.map((policy) => {
                  const isR385 = policy.monthly_target === 385;
                  const isSelected = selectedPolicy === policy.id;
                  
                  return (
                    <div
                      key={policy.id}
                      onClick={() => isR385 && setSelectedPolicy(policy.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        !isR385 
                          ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'border-primary bg-primary/10 cursor-pointer'
                          : 'border-white/10 bg-white/5 hover:border-white/20 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getFamilyColor(policy.family)}`}>
                          {policy.family.replace('_', ' ')}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{formatCurrency(policy.monthly_target)}</p>
                          <p className="text-xs text-slate-400">monthly target</p>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-white mb-1">{policy.description}</h3>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>{policy.adults} Adult{policy.adults > 1 ? 's' : ''}</span>
                        {policy.children > 0 && (
                          <span>{policy.children} Child{policy.children > 1 ? 'ren' : ''}</span>
                        )}
                      </div>

                      {isSelected && (
                        <div className="mt-3 flex items-center gap-2 text-primary">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-white/10">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedPolicy || submitting}
              className="px-6 py-3 rounded-xl bg-primary text-background-dark font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <span className="material-symbols-outlined animate-spin">refresh</span>}
              {submitting ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}