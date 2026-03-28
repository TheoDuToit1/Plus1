// src/components/partner/pages/ShopProfile.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface Partner {
  id: string;
  shop_name: string;
  name: string;
  location: string;
  category: string;
  responsible_person: string;
  phone: string;
  email: string;
  cashback_percent: number;
  status: string;
}

export default function ShopProfile() {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartnerProfile();
  }, []);

  const loadPartnerProfile = async () => {
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
        .select('*')
        .eq('id', partnerId)
        .single();

      if (error) throw error;
      setPartner(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-900 mb-4">Profile not found</p>
          <button
            onClick={() => navigate('/partner/dashboard')}
            className="bg-[#1a558b] text-white px-6 py-2 rounded-xl font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Shop Profile</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your business details</p>
        </div>
        <button
          onClick={() => navigate('/partner/dashboard')}
          className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back
        </button>
      </div>

      {/* Status Banner */}
      <div className={`rounded-2xl p-6 ${
        partner.status === 'active' ? 'bg-gradient-to-br from-green-500 to-green-600' :
        partner.status === 'pending' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
        'bg-gradient-to-br from-red-500 to-red-600'
      } text-white shadow-lg`}>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl">storefront</span>
          <div>
            <p className="text-sm opacity-90">Business Status</p>
            <p className="text-2xl font-black capitalize">{partner.status}</p>
          </div>
        </div>
      </div>

      {/* Business Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1a558b]">business</span>
          Business Details
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Business Name</label>
              <p className="text-gray-900 font-semibold mt-1">{partner.shop_name || partner.name}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
              <p className="text-gray-900 font-semibold mt-1">{partner.category || 'Not specified'}</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
            <p className="text-gray-900 font-semibold mt-1">{partner.location || 'Not specified'}</p>
          </div>
        </div>
      </div>

      {/* Cashback Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1a558b]">percent</span>
          Cashback Settings
        </h2>
        <div className="bg-gradient-to-br from-[#1a558b] to-[#2563eb] rounded-xl p-6 text-white mb-4">
          <p className="text-sm text-blue-100 mb-1">Current Cashback Rate</p>
          <p className="text-5xl font-black">{partner.cashback_percent}%</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
          <p className="text-xs font-bold text-gray-700 mb-2">Split Breakdown:</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">System Fee</span>
              <span className="font-bold text-[#1a558b]">1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Agent Commission</span>
              <span className="font-bold text-[#1a558b]">1%</span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-blue-200">
              <span className="text-gray-700 font-semibold">Member Reward</span>
              <span className="font-black text-[#1a558b]">{partner.cashback_percent - 2}%</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 italic">
          Note: Cashback rate changes require admin approval
        </p>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1a558b]">contact_phone</span>
          Contact Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Responsible Person</label>
            <p className="text-gray-900 font-semibold mt-1">{partner.responsible_person}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
              <p className="text-gray-900 font-semibold mt-1">{partner.phone}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
              <p className="text-gray-900 font-semibold mt-1">{partner.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1a558b]">settings</span>
          Actions
        </h2>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/partner/support')}
            className="w-full bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">edit</span>
            Request Detail Change
          </button>
          <button
            onClick={() => navigate('/partner/support')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">support_agent</span>
            Contact Admin
          </button>
        </div>
      </div>
    </div>
  );
}
