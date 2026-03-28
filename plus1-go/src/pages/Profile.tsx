import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentMember } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const member = getCurrentMember();

  const [formData, setFormData] = useState({
    full_name: member?.full_name || '',
    phone: member?.phone || '',
    email: member?.email || '',
    id_number: member?.id_number || '',
    bank_name: member?.bank_name || '',
    bank_account_number: member?.bank_account_number || '',
    bank_account_holder: member?.bank_account_holder || '',
    bank_branch_code: member?.bank_branch_code || ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!member) {
      navigate('/login');
    }
  }, [member, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Validate required fields are not empty
      if (!formData.id_number?.trim()) {
        setError('ID Number is required');
        setLoading(false);
        return;
      }
      if (!formData.bank_name?.trim()) {
        setError('Bank Name is required');
        setLoading(false);
        return;
      }
      if (!formData.bank_account_number?.trim()) {
        setError('Bank Account Number is required');
        setLoading(false);
        return;
      }

      // Check if required fields are filled (all non-empty)
      const isProfileComplete = !!(
        formData.id_number?.trim() && 
        formData.bank_name?.trim() && 
        formData.bank_account_number?.trim()
      );

      const { error: updateError } = await supabase
        .from('members')
        .update({
          email: formData.email?.trim() || null,
          id_number: formData.id_number?.trim() || null,
          bank_name: formData.bank_name?.trim() || null,
          bank_account_number: formData.bank_account_number?.trim() || null,
          bank_account_holder: formData.bank_account_holder?.trim() || null,
          bank_branch_code: formData.bank_branch_code?.trim() || null,
          profile_completed: isProfileComplete
        })
        .eq('id', member?.id);

      if (updateError) throw updateError;

      // Update local storage
      const updatedMember = { 
        ...member, 
        email: formData.email?.trim() || null,
        id_number: formData.id_number?.trim() || null,
        bank_name: formData.bank_name?.trim() || null,
        bank_account_number: formData.bank_account_number?.trim() || null,
        bank_account_holder: formData.bank_account_holder?.trim() || null,
        bank_branch_code: formData.bank_branch_code?.trim() || null,
        profile_completed: isProfileComplete 
      };
      localStorage.setItem('plus1go.member', JSON.stringify(updatedMember));

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!member) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-50 rounded-[9px] transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-black text-primary tracking-tighter">My Profile</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-[9px] p-6 flex items-center gap-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-black text-green-900 tracking-tight">Profile Updated!</h3>
              <p className="text-green-800 font-medium">Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[9px] text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-slate-100 rounded-[9px] shadow-sm p-6">
            <h2 className="text-xl font-black text-primary mb-6 tracking-tight">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  disabled
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] text-slate-400 cursor-not-allowed font-medium"
                />
                <p className="mt-1 text-xs text-slate-400 font-medium">Cannot be changed</p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  disabled
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] text-slate-400 cursor-not-allowed font-medium"
                />
                <p className="mt-1 text-xs text-slate-400 font-medium">Cannot be changed</p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* Identity Information */}
          <div className="bg-white border border-slate-100 rounded-[9px] shadow-sm p-6">
            <h2 className="text-xl font-black text-primary mb-2 tracking-tight">Identity Information</h2>
            <p className="text-sm text-amber-600 font-black mb-6 uppercase tracking-widest">
              ⚠️ Required to place orders
            </p>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                ID Number
              </label>
              <input
                type="text"
                value={formData.id_number}
                onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                placeholder="8001015009087"
                maxLength={13}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium outline-none"
              />
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white border border-slate-100 rounded-[9px] shadow-sm p-6">
            <h2 className="text-xl font-black text-primary mb-2 tracking-tight">Bank Details</h2>
            <p className="text-sm text-amber-600 font-black mb-6 uppercase tracking-widest">
              ⚠️ Required for refunds and order processing
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Bank Name
                </label>
                <select
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium outline-none"
                >
                  <option value="">Select Bank</option>
                  <option value="FNB">FNB</option>
                  <option value="Standard Bank">Standard Bank</option>
                  <option value="Nedbank">Nedbank</option>
                  <option value="Absa">Absa</option>
                  <option value="Capitec">Capitec</option>
                  <option value="African Bank">African Bank</option>
                  <option value="TymeBank">TymeBank</option>
                  <option value="Discovery Bank">Discovery Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.bank_account_number}
                  onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value.replace(/\D/g, '') })}
                  placeholder="1234567890"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={formData.bank_account_holder}
                  onChange={(e) => setFormData({ ...formData, bank_account_holder: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Branch Code
                </label>
                <input
                  type="text"
                  value={formData.bank_branch_code}
                  onChange={(e) => setFormData({ ...formData, bank_branch_code: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  placeholder="250655"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.id_number?.trim() || !formData.bank_name?.trim() || !formData.bank_account_number?.trim()}
            className="w-full bg-primary text-white font-black py-4 rounded-[9px] hover:bg-primary/90 transition-all shadow-xl uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
