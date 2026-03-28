// plus1-rewards/src/components/member/PolicyOverflowModal.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface PolicyPlan {
  id: string;
  name: string;
  monthly_target: number;
  family: string;
  variant: string;
  adults: number;
  children: number;
}

interface PolicyProvider {
  id: string;
  name: string;
  status: string;
}

interface PolicyOverflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  overflowAmount: number;
  currentPolicyName: string;
  memberId: string;
  onOverflowHandled: () => void;
}

export default function PolicyOverflowModal({ 
  isOpen, 
  onClose, 
  overflowAmount, 
  currentPolicyName, 
  memberId,
  onOverflowHandled 
}: PolicyOverflowModalProps) {
  const [selectedOption, setSelectedOption] = useState<'new-policy' | 'add-beneficiary' | 'keep-overflow'>('keep-overflow');
  const [availablePolicies, setAvailablePolicies] = useState<PolicyPlan[]>([]);
  const [availableProviders, setAvailableProviders] = useState<PolicyProvider[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryRelation, setBeneficiaryRelation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailablePolicies();
      loadAvailableProviders();
    }
  }, [isOpen]);

  const loadAvailablePolicies = async () => {
    try {
      const { data: policies } = await supabase
        .from('policy_plans')
        .select('*')
        .eq('is_active', true)
        .order('monthly_target');
      
      if (policies) {
        setAvailablePolicies(policies);
      }
    } catch (error) {
      console.error('Error loading policies:', error);
    }
  };

  const loadAvailableProviders = async () => {
    try {
      // Try to get active providers first
      let { data: providers } = await supabase
        .from('policy_providers')
        .select('id, name, status')
        .eq('status', 'active')
        .order('name');
      
      // If no active providers, get any provider (including pending)
      if (!providers || providers.length === 0) {
        const { data: allProviders } = await supabase
          .from('policy_providers')
          .select('id, name, status')
          .order('name')
          .limit(1);
        
        providers = allProviders || [];
      }
      
      if (providers && providers.length > 0) {
        setAvailableProviders(providers);
        setSelectedProviderId(providers[0].id); // Auto-select first provider
      }
    } catch (error) {
      console.error('Error loading providers:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (selectedOption === 'new-policy' && selectedPolicyId && selectedProviderId) {
        // Create a new policy holder record for additional policy
        const selectedPolicy = availablePolicies.find(p => p.id === selectedPolicyId);
        if (selectedPolicy) {
          const { error } = await supabase
            .from('policy_holders')
            .insert({
              member_id: memberId,
              policy_plan_id: selectedPolicyId,
              policy_provider_id: selectedProviderId,
              policy_number: `POL-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
              status: 'active',
              start_date: new Date().toISOString().split('T')[0],
              monthly_premium: selectedPolicy.monthly_target,
              amount_funded: Math.min(overflowAmount, selectedPolicy.monthly_target)
            });

          if (error) throw error;
          
          const providerName = availableProviders.find(p => p.id === selectedProviderId)?.name || 'Provider';
          alert(`Successfully created additional policy: ${selectedPolicy.name} with ${providerName}`);
        }
      } else if (selectedOption === 'add-beneficiary') {
        // Add beneficiary to existing policy
        if (beneficiaryName && beneficiaryRelation) {
          // For now, just show a message - you'd need to implement the beneficiary update logic
          alert(`Beneficiary ${beneficiaryName} (${beneficiaryRelation}) would be added to your existing policy. This feature will be implemented soon.`);
        }
      } else {
        // Keep overflow - no action needed
        alert('Overflow funds will remain in your rewards balance for future use.');
      }

      onOverflowHandled();
      onClose();
    } catch (error: any) {
      console.error('Overflow processing error:', error);
      alert('Error processing overflow: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Policy Target Exceeded!</h2>
              <p className="text-slate-400 text-sm">You have R{overflowAmount.toFixed(2)} in overflow funds</p>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Current Policy Info */}
          <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
            <p className="text-white font-medium mb-1">Current Policy: {currentPolicyName}</p>
            <p className="text-primary text-sm">✓ Target reached with R{overflowAmount.toFixed(2)} overflow</p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            <h3 className="text-white font-medium">What would you like to do with the overflow?</h3>
            
            {/* Option 1: Keep Overflow */}
            <label className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors">
              <input
                type="radio"
                name="overflow-option"
                value="keep-overflow"
                checked={selectedOption === 'keep-overflow'}
                onChange={(e) => setSelectedOption(e.target.value as any)}
                className="mt-1"
              />
              <div>
                <p className="text-white font-medium">Keep as Rewards Balance</p>
                <p className="text-slate-400 text-sm">Keep the overflow in your rewards balance for future purchases</p>
              </div>
            </label>

            {/* Option 2: Start New Policy */}
            <label className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors">
              <input
                type="radio"
                name="overflow-option"
                value="new-policy"
                checked={selectedOption === 'new-policy'}
                onChange={(e) => setSelectedOption(e.target.value as any)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="text-white font-medium">Start Additional Policy</p>
                <p className="text-slate-400 text-sm mb-3">Use overflow to fund a second policy plan</p>
                
                {selectedOption === 'new-policy' && (
                  <div className="space-y-3">
                    <select
                      value={selectedPolicyId}
                      onChange={(e) => setSelectedPolicyId(e.target.value)}
                      className="w-full bg-slate-600 text-white rounded-lg p-2 text-sm"
                    >
                      <option value="">Select a policy plan...</option>
                      {availablePolicies.map((policy) => (
                        <option key={policy.id} value={policy.id}>
                          {policy.name} - R{policy.monthly_target}/month ({policy.adults} adults, {policy.children} children)
                        </option>
                      ))}
                    </select>
                    
                    {availableProviders.length > 0 && (
                      <select
                        value={selectedProviderId}
                        onChange={(e) => setSelectedProviderId(e.target.value)}
                        className="w-full bg-slate-600 text-white rounded-lg p-2 text-sm"
                      >
                        <option value="">Select policy provider...</option>
                        {availableProviders.map((provider) => (
                          <option key={provider.id} value={provider.id}>
                            {provider.name} {provider.status !== 'active' && `(${provider.status})`}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {availableProviders.length === 0 && (
                      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-2">
                        <p className="text-yellow-400 text-xs">No policy providers available. Contact support to set up providers.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </label>

            {/* Option 3: Add Beneficiary */}
            <label className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors">
              <input
                type="radio"
                name="overflow-option"
                value="add-beneficiary"
                checked={selectedOption === 'add-beneficiary'}
                onChange={(e) => setSelectedOption(e.target.value as any)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="text-white font-medium">Add Beneficiary</p>
                <p className="text-slate-400 text-sm mb-3">Add someone to your existing policy</p>
                
                {selectedOption === 'add-beneficiary' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Beneficiary name"
                      value={beneficiaryName}
                      onChange={(e) => setBeneficiaryName(e.target.value)}
                      className="w-full bg-slate-600 text-white rounded-lg p-2 text-sm"
                    />
                    <select
                      value={beneficiaryRelation}
                      onChange={(e) => setBeneficiaryRelation(e.target.value)}
                      className="w-full bg-slate-600 text-white rounded-lg p-2 text-sm"
                    >
                      <option value="">Select relationship...</option>
                      <option value="spouse">Spouse</option>
                      <option value="child">Child</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || 
                (selectedOption === 'new-policy' && (!selectedPolicyId || !selectedProviderId)) || 
                (selectedOption === 'add-beneficiary' && (!beneficiaryName || !beneficiaryRelation))
              }
              className="flex-1 py-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}