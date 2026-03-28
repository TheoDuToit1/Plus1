import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../lib/auth';
import { User, Lock, Phone } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!fullName || fullName.trim().length < 2) {
      setError('Full name is required (minimum 2 characters)');
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setError('PIN must be exactly 6 digits');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);

    try {
      await register(fullName, mobileNumber, pin);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-100 rounded-[9px] shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/plus1-go logo.png" alt="Plus1 Go" className="h-16 object-contain" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-primary tracking-tighter mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">Join Plus1 Go and start ordering</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[9px] text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-primary font-medium outline-none"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="0812345678"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-primary font-medium outline-none"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-slate-400 font-medium">10 digits, no spaces</p>
            </div>

            {/* PIN */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                6-Digit PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-primary font-medium tracking-widest outline-none"
                  required
                />
              </div>
            </div>

            {/* Confirm PIN */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Confirm PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[9px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-primary font-medium tracking-widest outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-black py-4 rounded-[9px] hover:bg-primary/90 transition-all shadow-xl uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary font-black hover:underline"
              >
                Log In
              </button>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-slate-50 border border-slate-100 rounded-[9px] p-4 text-center">
          <p className="text-sm text-primary font-bold">
            🎉 Same account works on Plus1 Rewards and Plus1 Go!
          </p>
        </div>
      </div>
    </div>
  );
}
