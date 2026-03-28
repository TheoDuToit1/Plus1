import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Notification, useNotification } from '../components/Notification';

const BLUE = '#1a558b';

export function AgentAddShop() {
  const navigate = useNavigate();
  const { notification, showSuccess, showError, hideNotification } = useNotification();
  const [form, setForm] = useState({ 
    shop_name: '', 
    phone: '', 
    email: '', 
    address: '', 
    category: '',
    cashback_percent: '5',
    responsible_person: '',
    included_products: '',
    excluded_products: ''
  });
  const [loading, setLoading] = useState(false);

  const agent = (() => { 
    try { 
      return JSON.parse(sessionStorage.getItem('currentAgent') || localStorage.getItem('currentAgent') || '{}'); 
    } catch { 
      return {}; 
    } 
  })();

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!agent.agent_id && !agent.id) { 
      navigate('/agent/login'); 
      return; 
    }

    try {
      const cashback = parseFloat(form.cashback_percent);
      if (cashback < 3 || cashback > 40) {
        showError('Invalid Cashback', 'Cashback must be between 3% and 40%');
        setLoading(false);
        return;
      }

      // Create partner record
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .insert([{
          shop_name: form.shop_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          address: form.address.trim(),
          category: form.category.trim() || null,
          cashback_percent: cashback,
          responsible_person: form.responsible_person.trim(),
          included_products: form.included_products.trim() || null,
          excluded_products: form.excluded_products.trim() || null,
          status: 'pending'
        }])
        .select()
        .single();

      if (partnerError) throw partnerError;

      // Link partner to agent
      const { error: linkError } = await supabase
        .from('partner_agent_links')
        .insert([{
          partner_id: partnerData.id,
          agent_id: agent.agent_id || agent.id,
          status: 'active'
        }]);

      if (linkError) throw linkError;

      showSuccess(
        'Partner Shop Added!',
        `${form.shop_name} has been added to your network and is pending admin approval.`
      );
      
      setTimeout(() => navigate('/agent/dashboard'), 2500);
    } catch (err: any) {
      showError('Registration Failed', err?.message || 'Failed to register partner. Please try again.');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={hideNotification}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: BLUE }}>
              <span className="material-symbols-outlined text-2xl">add_business</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Add Partner Shop</h1>
              <p className="text-sm text-gray-600">Recruit a new business to your network</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/agent/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: BLUE }}>store</span>
              Shop Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  placeholder="e.g. Pick n Pay Rosebank" 
                  value={form.shop_name} 
                  onChange={e => update('shop_name', e.target.value)} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Person *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                    placeholder="Manager name" 
                    value={form.responsible_person} 
                    onChange={e => update('responsible_person', e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                    placeholder="e.g. Grocery, Pharmacy" 
                    value={form.category} 
                    onChange={e => update('category', e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                    placeholder="011 555 0000" 
                    value={form.phone} 
                    onChange={e => update('phone', e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                    placeholder="shop@email.co.za" 
                    value={form.email} 
                    onChange={e => update('email', e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Physical Address *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  placeholder="123 Main Road, Johannesburg" 
                  value={form.address} 
                  onChange={e => update('address', e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Cashback Configuration */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: BLUE }}>percent</span>
              Cashback Configuration
            </h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cashback Percentage (3% - 40%) *</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                placeholder="5" 
                min="3" 
                max="40" 
                step="0.5" 
                value={form.cashback_percent} 
                onChange={e => update('cashback_percent', e.target.value)} 
                required 
              />
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Split breakdown:</strong> Of {form.cashback_percent}% cashback:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>• 1% → Platform fee</li>
                  <li>• 1% → Your commission</li>
                  <li>• {Math.max(parseFloat(form.cashback_percent || '0') - 2, 1)}% → Member reward</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Products Configuration */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: BLUE }}>inventory_2</span>
              Products & Services
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Included Products/Services</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" 
                  placeholder="e.g. All groceries, fresh produce, household items"
                  rows={3}
                  value={form.included_products} 
                  onChange={e => update('included_products', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Excluded Products/Services</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" 
                  placeholder="e.g. Alcohol, tobacco, lottery tickets"
                  rows={3}
                  value={form.excluded_products} 
                  onChange={e => update('excluded_products', e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Commission Info */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-cyan-600 text-2xl">info</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Your Commission</h3>
                <p className="text-sm text-gray-700">
                  You earn <strong>1%</strong> of every transaction made by members at this partner. 
                  Commissions are paid monthly (minimum R500 payout threshold).
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 text-lg"
            style={{ backgroundColor: BLUE }}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Registering Partner...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">add_business</span>
                Add Partner to My Network
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
