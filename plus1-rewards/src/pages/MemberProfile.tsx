import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSession, clearSession } from '../lib/session';
import MemberLayout from '../components/member/MemberLayout';

const CAPE_TOWN_SUBURBS = [
  'Adderley', 'Athlone', 'Bellville', 'Benoni', 'Bloubergstrand', 'Bonteheuwel',
  'Brackenfell', 'Camps Bay', 'Claremont', 'Constantia', 'Darling', 'De Kelders',
  'Delft', 'Diep River', 'Durbanville', 'Eerste River', 'Epping', 'Faure',
  'Fisantekraal', 'Flamingo Vlei', 'Foreshore', 'Fresnaye', 'Gatesville', 'Goodwood',
  'Gordon\'s Bay', 'Grassy Park', 'Greenpoint', 'Guguletu', 'Hanover Park', 'Harfield Village',
  'Heathfield', 'Heideveld', 'Hermanus', 'Hout Bay', 'Ilanga', 'Imizamo Yethu',
  'Jabulani', 'Jamestown', 'Kalk Bay', 'Kanonkop', 'Kenilworth', 'Kensington',
  'Khayelitsha', 'Killarney', 'Kommetjie', 'Kraaifontein', 'Kuils River', 'Lakeside',
  'Langa', 'Lansdowne', 'Lavender Hill', 'Lentegeur', 'Libanon', 'Linksfield',
  'Llandudno', 'Lotus River', 'Macassar', 'Maitland', 'Mannenberg', 'Marshalltown',
  'Melkbosstrand', 'Mfuleni', 'Milnerton', 'Mitchells Plain', 'Montagu', 'Morningstar',
  'Mouille Point', 'Muizenberg', 'Myrtle', 'Netreg', 'Newlands', 'Newmarket',
  'Nolungile', 'Nomzamo', 'Norwood', 'Nyanga', 'Observatory', 'Orchards',
  'Ottery', 'Oude Kraal', 'Oudekraal', 'Overberg', 'Paarden Eiland', 'Paarl',
  'Palmyra', 'Parow', 'Paternoster', 'Patterdale', 'Pelican Park', 'Penlyn',
  'Pennywise', 'Philippi', 'Pinelands', 'Plumstead', 'Potsdam', 'Primrose Park',
  'Protea Park', 'Protea Valley', 'Ravensmead', 'Ravenswood', 'Retreat', 'Rondebosch',
  'Rondebosch East', 'Rondevlei', 'Rosendal', 'Rosmead', 'Rosebank', 'Rosebery',
  'Rosedale', 'Roseglen', 'Roseland', 'Roselle', 'Rosepark', 'Rosewood',
  'Roubaix', 'Roux', 'Rowland', 'Roxbury', 'Royalton', 'Ruyterwacht',
  'Rylands', 'Sable Square', 'Saldanha', 'Salt River', 'Samora Machel', 'Sandown',
  'Sandton', 'Sanlamhof', 'Sarepta', 'Scarborough', 'Schaapkraal', 'Sea Point',
  'Seawinds', 'Sebenza', 'Seapoint', 'Seawinds', 'Seawinds', 'Seawinds',
  'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds',
  'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds',
  'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds',
  'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds',
  'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds',
  'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds', 'Seawinds',
];

interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  sa_id?: string;
  city?: string;
  suburb?: string;
  profile_picture_url?: string;
  qr_code: string;
  active_policy?: string;
}

export function MemberProfile() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    sa_id: '',
    city: '',
    suburb: '',
    profile_picture_url: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const session = getSession();
      
      if (!session) {
        navigate('/member/login');
        return;
      }
      
      const { data, error: memberError } = await supabase.from('members').select('*').eq('id', session.user.id).single();
      
      if (memberError || !data) {
        console.log('Member not found, redirecting to login');
        clearSession();
        navigate('/member/login');
        return;
      }
      
      if (data) {
        setMember(data);
        // Set Cape Town as default city if not set
        const defaultCity = data.city || 'Cape Town';
        setFormData({
          email: data.email || '',
          sa_id: data.sa_id || '',
          city: defaultCity,
          suburb: data.suburb || '',
          profile_picture_url: data.profile_picture_url || ''
        });
        
        // Auto-update city to Cape Town if not set
        if (!data.city) {
          await supabase
            .from('members')
            .update({ city: 'Cape Town' })
            .eq('id', session.user.id);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!member) return;
    setSaving(true);
    setError(null);
    try {
      // Check for duplicate email if email is being updated
      if (formData.email && formData.email !== member.email) {
        const { data: existingEmail } = await supabase
          .from('members')
          .select('id')
          .eq('email', formData.email)
          .neq('id', member.id)
          .maybeSingle();

        if (existingEmail) {
          setError('This email is already registered by another member. Please use a different email address.');
          setSaving(false);
          return;
        }
      }

      // Check for duplicate SA ID if SA ID is being updated
      if (formData.sa_id && formData.sa_id !== member.sa_id) {
        const { data: existingSaId } = await supabase
          .from('members')
          .select('id')
          .eq('sa_id', formData.sa_id)
          .neq('id', member.id)
          .maybeSingle();

        if (existingSaId) {
          setError('This SA ID number is already registered by another member. Please verify your ID number.');
          setSaving(false);
          return;
        }
      }

      const { error: updateError } = await supabase
        .from('members')
        .update({
          email: formData.email,
          sa_id: formData.sa_id,
          city: formData.city,
          suburb: formData.suburb,
          profile_picture_url: formData.profile_picture_url
        })
        .eq('id', member.id);

      if (updateError) throw updateError;

      setMember(prev => prev ? { ...prev, ...formData } : prev);
      setSaved(true);
      setEditingField(null);
      setTimeout(() => {
        setSaved(false);
        // If coming from dashboard with incomplete profile, redirect back
        const fromDashboard = sessionStorage.getItem('profile_redirect_from_dashboard');
        if (fromDashboard === 'true') {
          sessionStorage.removeItem('profile_redirect_from_dashboard');
          sessionStorage.removeItem('last_profile_prompt_progress');
          navigate('/member/dashboard');
        }
      }, 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !member) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${member.id}/${Date.now()}.${fileExt}`;
    
    setUploading(true);
    setError(null);
    try {
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('members')
        .update({ profile_picture_url: publicUrl })
        .eq('id', member.id);

      if (updateError) throw updateError;

      setMember(prev => prev ? { ...prev, profile_picture_url: publicUrl } : prev);
      setFormData(prev => ({ ...prev, profile_picture_url: publicUrl }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload profile picture. Please try again or use a different image.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSave = async () => {
    if (!member) return;
    setSaving(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('members')
        .update({ profile_picture_url: formData.profile_picture_url })
        .eq('id', member.id);

      if (updateError) throw updateError;

      setMember(prev => prev ? { ...prev, profile_picture_url: formData.profile_picture_url } : prev);
      setSaved(true);
      setEditingField(null);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving profile picture URL:', error);
      setError('Failed to save profile picture URL. Please check the URL and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f5f8fc] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <MemberLayout
      member={member}
      isOnline={navigator.onLine}
      pendingTransactions={0}
      onSignOut={() => { clearSession(); navigate('/member/login'); }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Account settings & details</p>
        </div>
        <button
          onClick={() => navigate('/member/dashboard')}
          className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-4 py-2 rounded-xl transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
          <p className="text-green-700 font-medium">Profile updated successfully</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="material-symbols-outlined text-red-500 text-xl">error</span>
          <div className="flex-1">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center mb-6 shadow-sm">
        <div className="relative inline-block mb-4">
          {member?.profile_picture_url ? (
            <img
              src={member.profile_picture_url}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-[#1a558b]/30"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-[#1a558b] to-[#1a558b]/70 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-lg">
              {member?.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#1a558b] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1a558b]/90 transition-colors shadow-lg">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <span className="material-symbols-outlined text-white text-sm">
              {uploading ? 'hourglass_empty' : 'photo_camera'}
            </span>
          </label>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{member?.name}</h2>
        <p className="text-gray-600">{member?.phone}</p>
        {editingField === 'profile_picture_url' && (
          <div className="mt-4 max-w-md mx-auto">
            <p className="text-gray-600 text-sm mb-2">Or enter image URL:</p>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={formData.profile_picture_url}
                onChange={e => setFormData(prev => ({ ...prev, profile_picture_url: e.target.value }))}
                className="flex-1 bg-[#f5f8fc] border-2 border-[#1a558b] rounded-lg px-3 py-2 text-gray-900 text-sm"
                placeholder="https://example.com/image.jpg"
              />
              <button
                onClick={handleUrlSave}
                disabled={saving}
                className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-3 py-2 rounded-lg text-xs disabled:opacity-50"
              >
                {saving ? '...' : '✓'}
              </button>
              <button
                onClick={() => setEditingField(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-lg text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        {!editingField && (
          <button
            onClick={() => setEditingField('profile_picture_url')}
            className="mt-2 text-[#1a558b] hover:text-[#1a558b]/80 text-sm font-medium"
          >
            Add image URL
          </button>
        )}
      </div>

      {/* Account Details */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Account Details</h3>
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-[#1a558b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#1a558b] text-lg">email</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Email Address</p>
              {editingField === 'email' ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="flex-1 bg-[#f5f8fc] border-2 border-[#1a558b] rounded-lg px-3 py-2 text-gray-900 text-sm"
                    placeholder="your@email.com"
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-3 py-2 rounded-lg text-xs disabled:opacity-50"
                  >
                    {saving ? '...' : '✓'}
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-lg text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 font-medium">{member?.email || 'Not set'}</p>
                  <button
                    onClick={() => setEditingField('email')}
                    className="text-[#1a558b] hover:text-[#1a558b]/80 text-sm font-medium"
                  >
                    ✏️ Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SA ID */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-[#1a558b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#1a558b] text-lg">badge</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm">SA ID Number</p>
              {editingField === 'sa_id' ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={formData.sa_id}
                    onChange={e => setFormData(prev => ({ ...prev, sa_id: e.target.value }))}
                    className="flex-1 bg-[#f5f8fc] border-2 border-[#1a558b] rounded-lg px-3 py-2 text-gray-900 text-sm"
                    placeholder="YYMMDDGGGGGGG"
                    maxLength={13}
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-3 py-2 rounded-lg text-xs disabled:opacity-50"
                  >
                    {saving ? '...' : '✓'}
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-lg text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 font-medium">{member?.sa_id || 'Not set'}</p>
                  <button
                    onClick={() => setEditingField('sa_id')}
                    className="text-[#1a558b] hover:text-[#1a558b]/80 text-sm font-medium"
                  >
                    ✏️ Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* City and Suburb - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* City (Read-only - Cape Town) */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-[#1a558b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#1a558b] text-lg">location_city</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-sm">City</p>
                <p className="text-gray-900 font-medium">Cape Town</p>
                <p className="text-gray-500 text-xs mt-1">Default location</p>
              </div>
            </div>

            {/* Suburb */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-[#1a558b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#1a558b] text-lg">home</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-sm">Suburb</p>
                {editingField === 'suburb' ? (
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      value={formData.suburb}
                      onChange={e => setFormData(prev => ({ ...prev, suburb: e.target.value }))}
                      className="flex-1 bg-[#f5f8fc] border-2 border-[#1a558b] rounded-lg px-3 py-2 text-gray-900 text-sm min-w-0"
                    >
                      <option value="">Select suburb...</option>
                      {CAPE_TOWN_SUBURBS.map(suburb => (
                        <option key={suburb} value={suburb}>{suburb}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-3 py-2 rounded-lg text-xs disabled:opacity-50 flex-shrink-0"
                    >
                      {saving ? '...' : '✓'}
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-lg text-xs flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 font-medium truncate">{member?.suburb || 'Not set'}</p>
                    <button
                      onClick={() => setEditingField('suburb')}
                      className="text-[#1a558b] hover:text-[#1a558b]/80 text-sm font-medium flex-shrink-0 ml-2"
                    >
                      ✏️ Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phone (Read-only) */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-[#1a558b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#1a558b] text-lg">phone</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Mobile Number</p>
              <p className="text-gray-900 font-medium">{member?.phone || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={() => { clearSession(); navigate('/member/login'); }}
        className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold py-4 rounded-xl transition-colors"
      >
        <span className="material-symbols-outlined mr-2">logout</span>
        Sign Out
      </button>
    </MemberLayout>
  );
}
