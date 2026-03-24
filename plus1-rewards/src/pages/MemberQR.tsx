import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSession, clearSession } from '../lib/session';
import MemberLayout from '../components/member/MemberLayout';
import QRCode from 'qrcode';
import { encodeMemberQR } from '../lib/config';

interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  qr_code: string;
}

export function MemberQR() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    loadMemberQR();
  }, []);

  const loadMemberQR = async () => {
    setLoading(true);
    try {
      const session = getSession();
      if (!session) {
        navigate('/member/login');
        return;
      }

      const { data } = await supabase
        .from('members')
        .select('id, full_name, phone, email, qr_code')
        .eq('id', session.user.id)
        .single();

      if (data) {
        const memberData = {
          ...data,
          name: data.full_name
        };
        setMember(memberData);
        await generateQR(data.qr_code, data.phone || session.user.id);
      }
    } catch (error) {
      console.error('Error loading QR:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQR = async (qrCode: string, phone: string) => {
    const qrValue = encodeMemberQR(qrCode, phone);
    try {
      const url = await QRCode.toDataURL(qrValue, {
        width: 400,
        margin: 2,
        color: { dark: '#1a558b', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(url);
    } catch {
      try {
        const url = await QRCode.toDataURL(phone, {
          width: 400,
          margin: 2,
          color: { dark: '#1a558b', light: '#ffffff' },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(url);
      } catch (error) {
        console.error('Error generating QR:', error);
      }
    }
  };

  const handleSignOut = () => {
    clearSession();
    navigate('/member/login');
  };

  const copyPhone = () => {
    if (!member?.phone) return;
    navigator.clipboard.writeText(member.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `plus1-qr-${member?.phone}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-white text-2xl">close</span>
        </button>
        <div className="text-center">
          <img
            src={qrDataUrl}
            alt="QR Code"
            className="w-[80vmin] h-[80vmin] mx-auto"
            style={{ imageRendering: 'pixelated' }}
          />
          <p className="text-white text-2xl font-bold mt-6">{member?.name}</p>
          <p className="text-white/70 text-xl mt-2">{member?.phone}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <MemberLayout
        member={member}
        isOnline={navigator.onLine}
        pendingTransactions={0}
        onSignOut={handleSignOut}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading QR code...</p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout
      member={member}
      isOnline={navigator.onLine}
      pendingTransactions={0}
      onSignOut={handleSignOut}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My QR Code</h1>
          <p className="text-gray-600">Show this at partner stores to earn cashback</p>
        </div>
        <button
          onClick={() => navigate('/member/dashboard')}
          className="bg-[#1a558b] hover:bg-[#1a558b]/90 text-white font-bold px-4 py-2 rounded-xl transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Member Info Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#1a558b] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {member?.name?.charAt(0) || 'M'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{member?.name || 'Member'}</h2>
            <p className="text-gray-600">{member?.phone}</p>
          </div>
        </div>
      </div>

      {/* QR Code Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6 shadow-sm">
        {!qrDataUrl ? (
          <div className="flex items-center justify-center" style={{ height: '320px' }}>
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Generating QR code...</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-gray-50 rounded-xl p-6 mb-4 inline-block">
              <img
                src={qrDataUrl}
                alt="Member QR Code"
                className="w-full max-w-[280px] mx-auto"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 inline-block min-w-[280px]">
              <p className="text-xs font-bold text-gray-600 mb-1">MEMBER ID</p>
              <p className="text-2xl font-bold text-green-600 tracking-wider">
                {member?.phone}
              </p>
            </div>

            <p className="text-xs text-gray-500">
              Valid for 30 days • Scan at any Plus1 partner store
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={copyPhone}
          className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
            copied ? 'border-green-500 bg-green-50' : ''
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <span className={`material-symbols-outlined text-2xl ${
              copied ? 'text-green-600' : 'text-[#1a558b]'
            }`}>
              {copied ? 'check_circle' : 'content_copy'}
            </span>
            <span className="text-sm font-bold text-gray-900">
              {copied ? 'Copied!' : 'Copy Number'}
            </span>
          </div>
        </button>

        <button
          onClick={downloadQR}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl">download</span>
            <span className="text-sm font-bold text-gray-900">Download</span>
          </div>
        </button>

        <button
          onClick={toggleFullscreen}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl">fullscreen</span>
            <span className="text-sm font-bold text-gray-900">Fullscreen</span>
          </div>
        </button>

        <button
          onClick={loadMemberQR}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[#1a558b] text-2xl">refresh</span>
            <span className="text-sm font-bold text-gray-900">Refresh</span>
          </div>
        </button>
      </div>

      {/* Tips Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1a558b]">lightbulb</span>
          Tips for Using Your QR Code
        </h3>
        <ul className="space-y-3">
          {[
            'Show this QR code to the cashier at checkout',
            'Make sure your screen brightness is high',
            'You can also provide your mobile number',
            'QR code refreshes automatically for security'
          ].map((tip, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-[#1a558b] font-bold">•</span>
              <span className="text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </MemberLayout>
  );
}
