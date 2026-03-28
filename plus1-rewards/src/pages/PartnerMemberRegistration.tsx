// plus1-rewards/src/pages/PartnerMemberRegistration.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Notification, useNotification } from '../components/Notification';

const BLUE = '#1a558b';

interface Partner {
  id: string;
  shop_name: string;
  cashback_percent: number;
}

export default function PartnerMemberRegistration() {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const { notification, showSuccess, hideNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pin: '',
    terms: false
  });

  useEffect(() => {
    loadPartner();
  }, []);

  const loadPartner = async () => {
    try {
      const partnerSessionData = localStorage.getItem('partnerSession') || sessionStorage.getItem('partnerSession');
      
      if (!partnerSessionData) {
        navigate('/partner/login');
        return;
      }

      const session = JSON.parse(partnerSessionData);
      const partnerId = session.partner?.id;

      if (!partnerId) {
        navigate('/partner/login');
        return;
      }

      const { data, error } = await supabase
        .from('partners')
        .select('id, shop_name, cashback_percent')
        .eq('id', partnerId)
        .single();

      if (error) throw error;
      setPartner(data);
    } catch (error) {
      console.error('Error loading partner:', error);
      navigate('/partner/login');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.terms) { 
      setError('Please agree to the Terms of Service and Privacy Policy'); 
      return; 
    }
    if (formData.pin.length !== 6) { 
      setError('PIN must be exactly 6 digits'); 
      return; 
    }
    if (!/^\d{6}$/.test(formData.pin)) { 
      setError('PIN must contain only numbers'); 
      return; 
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) { 
      setError('Phone number must be exactly 10 digits'); 
      return; 
    }

    setLoading(true);

    try {
      const { data: existingUser } = await supabase
        .from('users').select('id').eq('mobile_number', phoneDigits).maybeSingle();

      if (existingUser) { 
        setError('This phone number is already registered'); 
        setLoading(false); 
        return; 
      }

      const { data: existingMember } = await supabase
        .from('members').select('id').eq('phone', phoneDigits).maybeSingle();

      if (existingMember) { 
        setError('This phone number is already registered'); 
        setLoading(false); 
        return; 
      }

      const { data: defaultPlan, error: planError } = await supabase
        .from('cover_plans')
        .select('id, plan_name, monthly_target_amount')
        .eq('status', 'active')
        .eq('monthly_target_amount', 385)
        .limit(1)
        .single();

      if (planError || !defaultPlan) {
        setError('System error: Default cover plan not found. Please contact support.');
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          role: 'member',
          full_name: formData.name,
          mobile_number: phoneDigits,
          pin_code: formData.pin,
          status: 'active'
        })
        .select()
        .single();

      if (userError) throw userError;

      const qrCode = `PLUS1-${phoneDigits}-${Date.now()}`;

      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .insert({
          user_id: userData.id,
          full_name: formData.name,
          phone: phoneDigits,
          qr_code: qrCode,
          status: 'active'
        })
        .select()
        .single();

      if (memberError) throw memberError;

      const { error: coverPlanError } = await supabase
        .from('member_cover_plans')
        .insert({
          member_id: memberData.id,
          cover_plan_id: defaultPlan.id,
          creation_order: 1,
          target_amount: defaultPlan.monthly_target_amount,
          funded_amount: 0,
          status: 'in_progress'
        });

      if (coverPlanError) throw coverPlanError;

      showSuccess(
        'Member Account Created!',
        `${formData.name} has been registered successfully. They can now earn cashback at your store.`
      );
      
      setTimeout(() => {
        setFormData({ name: '', phone: '', pin: '', terms: false });
        setError('');
      }, 3000);
    } catch (err: any) {
      if (err.message?.includes('already registered') || err.message?.includes('duplicate')) {
        setError('This phone number is already registered');
      } else {
        setError('Registration failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={hideNotification}
        />
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="material-symbols-outlined text-white text-3xl">person_add</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register New Member</h1>
          <p className="text-gray-600">
            Registering at: <span className="font-semibold" style={{ color: BLUE }}>{partner.shop_name}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Cashback Rate: {partner.cashback_percent}%
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3">
              {['R0 Fee', 'Instant Cashback', 'Day1 Health'].map((b) => (
                <div 
                  key={b} 
                  className="flex flex-col items-center gap-1 py-3 rounded-xl text-center" 
                  style={{ backgroundColor: 'rgba(26,85,139,0.06)' }}
                >
                  <span className="text-xs font-bold" style={{ color: BLUE }}>{b}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-red-600">error</span>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    person
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Sarah Dlamini"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cell Phone Number (10 digits)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    phone
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="082 555 1234"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* PIN */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  6-Digit PIN
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    pin
                  </span>
                  <input
                    type={showPin ? 'text' : 'password'}
                    name="pin"
                    value={formData.pin}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit PIN"
                    maxLength={6}
                    pattern="\d{6}"
                    className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPin(!showPin)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPin ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Member will use this PIN with their phone number to log in
                </p>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <span>
                  I confirm the member agrees to the{' '}
                  <a 
                    href="/terms-of-service" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline" 
                    style={{ color: BLUE }}
                  >
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a 
                    href="/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline" 
                    style={{ color: BLUE }}
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Member Account
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Dashboard */}
            <button
              onClick={() => navigate('/partner/dashboard')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600">info</span>
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Registration Benefits:</p>
              <ul className="space-y-1 text-blue-800">
                <li>• Member gets instant {partner.cashback_percent}% cashback on purchases</li>
                <li>• Automatic health cover plan funding</li>
                <li>• No registration fees or hidden costs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
