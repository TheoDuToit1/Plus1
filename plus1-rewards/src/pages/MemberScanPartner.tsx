import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import jsQR from 'jsqr';
import { parsePartnerQR } from '../lib/config';
import MemberLayout from '../components/member/MemberLayout';

interface Member {
  id: string;
  name: string;
  phone: string;
}

const BLUE = '#1a558b';

export function MemberScanPartner() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [scannedPartnerId, setscannedPartnerId] = useState('');
  const [partnerName, setShopName] = useState('');
  const [permissionAsked, setPermissionAsked] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualPartnerId, setManualPartnerId] = useState('');

  useEffect(() => {
    loadMemberData();
    return () => { 
      stopCamera(); 
      cancelAnimationFrame(rafRef.current); 
    };
  }, []);

  const loadMemberData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { 
        navigate('/member/login'); 
        return; 
      }
      
      const { data: memberData } = await supabase
        .from('members')
        .select('id, name, phone')
        .eq('id', user.id)
        .single();
        
      if (memberData) {
        setMember(memberData);
      } else {
        navigate('/member/login');
        return;
      }
    } catch (error) {
      console.error('Error loading member data:', error);
      navigate('/member/login');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    setPermissionAsked(true);
    setError('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera not available. Please use the manual partner ID entry option below.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setScanning(true);
          requestAnimationFrame(tick);
        };
      }
    } catch (err: any) {
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access and try again, or use manual entry.');
      } else if (err?.name === 'NotFoundError') {
        setError('No camera found. Please use the manual partner ID entry option.');
      } else {
        setError('Unable to start camera. Please use manual entry instead.');
      }
    }
  };

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  };

  const tick = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) { 
      rafRef.current = requestAnimationFrame(tick); 
      return; 
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, { 
      inversionAttempts: 'dontInvert' 
    });
    if (code?.data) {
      stopCamera();
      setScanning(false);
      handleQRDecoded(code.data);
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const handleQRDecoded = async (data: string) => {
    const partnerId = parsePartnerQR(data);
    if (!partnerId) {
      setError('QR code not recognized. Please try entering the partner ID manually.');
      return;
    }
    
    try {
      const { data: partnerData } = await supabase
        .from('partners')
        .select('id, name')
        .eq('id', partnerId)
        .single();
        
      if (partnerData) {
        setscannedPartnerId(partnerData.id);
        setShopName(partnerData.name);
      } else {
        setError('Partner not found. Please try entering the partner ID manually.');
      }
    } catch (error) {
      setError('Error looking up partner. Please try again.');
    }
  };

  const handleManualInput = async () => {
    setShowManualModal(true);
  };

  const handleManualSubmit = async () => {
    if (!manualPartnerId.trim()) {
      setError('Please enter a Partner ID');
      return;
    }

    stopCamera(); 
    setScanning(false);
    setShowManualModal(false);
    
    try {
      const { data } = await supabase
        .from('partners')
        .select('id, name')
        .eq('id', manualPartnerId.trim())
        .single();
        
      if (data) { 
        setscannedPartnerId(data.id); 
        setShopName(data.name); 
        setManualPartnerId('');
      } else {
        setError('Partner ID not found. Please check the ID and try again.');
      }
    } catch (error) {
      setError('Error looking up partner. Please check the ID and try again.');
    }
  };

  const handleConnect = async () => {
    if (!scannedPartnerId || !member) return;
    setConnecting(true);
    setError('');
    
    try {
      // Check if already connected
      const { data: existingWallet } = await supabase
        .from('wallets')
        .select('id')
        .eq('member_id', member.id)
        .eq('partner_id', scannedPartnerId)
        .single();

      if (existingWallet) {
        alert('You are already connected to this partner!');
        setConnecting(false);
        navigate('/member/dashboard');
        return;
      }

      // Create wallet directly - no approval needed
      const { error: walletError } = await supabase
        .from('wallets')
        .insert([{
          member_id: member.id,
          partner_id: scannedPartnerId,
          balance: 0,
          status: 'active'
        }]);

      if (walletError) {
        console.error('Wallet creation error:', walletError);
        setError('Failed to connect to partner. Please try again.');
        setConnecting(false);
        return;
      }

      // Success
      setError('');
      setConnecting(false);
      alert(`Successfully connected to ${partnerName}! You can now start earning rewards.`);
      navigate('/member/dashboard');

    } catch (err: any) {
      console.error('Connection error:', err);
      setError('Connection failed. Please try again.');
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f8fc' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(26, 85, 139, 0.2)', borderTopColor: BLUE }} />
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <MemberLayout 
      member={member}
      isOnline={navigator.onLine}
      pendingTransactions={0}
      onSignOut={() => supabase.auth.signOut().then(() => navigate('/member/login'))}
    >
      {/* Manual Partner ID Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="rounded-2xl p-6 max-w-md w-full shadow-xl" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: '#111827' }}>Enter Partner ID</h3>
              <button 
                onClick={() => {
                  setShowManualModal(false);
                  setManualPartnerId('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <p className="mb-4" style={{ color: '#6b7280' }}>
              Enter the unique Partner ID provided by the business
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                Partner ID
              </label>
              <input
                type="text"
                value={manualPartnerId}
                onChange={(e) => setManualPartnerId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
                placeholder="e.g., abc123-def456-ghi789"
                className="member-input-override w-full px-4 py-3 rounded-lg border-2 text-gray-900 placeholder:text-gray-400 focus:outline-none"
                style={{ backgroundColor: '#f5f8fc', borderColor: BLUE }}
                autoFocus
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowManualModal(false);
                  setManualPartnerId('');
                }}
                className="flex-1 font-medium py-3 px-4 rounded-xl transition-colors"
                style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
              >
                Cancel
              </button>
              <button
                onClick={handleManualSubmit}
                className="flex-1 font-bold py-3 px-4 rounded-xl transition-colors text-white hover:opacity-90"
                style={{ backgroundColor: BLUE }}
              >
                Find Partner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>Connect to Partner</h1>
          <p style={{ color: '#6b7280' }}>Scan a partner's QR code or enter their ID to connect</p>
        </div>
        <button 
          onClick={() => navigate('/member/dashboard')}
          className="font-bold px-4 py-2 rounded-xl transition-colors text-white hover:opacity-90"
          style={{ backgroundColor: BLUE }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#dc2626' }}>
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {!scannedPartnerId ? (
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            {!permissionAsked ? (
              /* Camera Permission Prompt */
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(26, 85, 139, 0.1)' }}>
                  <span className="text-4xl">📷</span>
                </div>
                <h2 className="text-xl font-bold mb-3" style={{ color: '#111827' }}>Camera Access Needed</h2>
                <p className="mb-6 leading-relaxed" style={{ color: '#6b7280' }}>
                  To scan a partner's QR code, we need access to your camera. 
                  Your browser will ask for permission.
                </p>
                <button 
                  onClick={startCamera}
                  className="w-full font-bold py-4 px-6 rounded-xl mb-4 transition-colors text-white hover:opacity-90"
                  style={{ backgroundColor: BLUE }}
                >
                  📷 Allow Camera & Start Scanning
                </button>
                <button 
                  onClick={handleManualInput}
                  className="w-full font-medium py-3 px-6 rounded-xl transition-colors"
                  style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
                >
                  📋 Enter Partner ID Manually
                </button>
              </div>
            ) : (
              /* Camera View */
              <div>
                <p className="text-center mb-4" style={{ color: '#6b7280' }}>
                  Point your camera at the partner's QR code
                </p>
                <div className="relative bg-black rounded-xl overflow-hidden mb-4 aspect-square">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover" 
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Scanning Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 rounded-xl relative" style={{ borderColor: BLUE }}>
                      {/* Corner indicators */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 rounded-tl-lg" style={{ borderColor: BLUE }}></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 rounded-tr-lg" style={{ borderColor: BLUE }}></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 rounded-bl-lg" style={{ borderColor: BLUE }}></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 rounded-br-lg" style={{ borderColor: BLUE }}></div>
                    </div>
                  </div>
                  
                  {scanning && (
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: BLUE }}>
                        🔍 Scanning for QR code...
                      </span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleManualInput}
                  className="w-full font-medium py-3 px-6 rounded-xl transition-colors"
                  style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
                >
                  📋 Enter Partner ID Manually
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Partner Found */
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(26, 85, 139, 0.1)' }}>
              <span className="text-3xl">🏪</span>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#111827' }}>Partner Found!</h2>
            <p className="font-bold text-lg mb-2" style={{ color: BLUE }}>{partnerName}</p>
            <p className="text-sm mb-6 font-mono rounded-lg p-2" style={{ color: '#6b7280', backgroundColor: '#f9fafb' }}>
              ID: {scannedPartnerId}
            </p>
            <button 
              onClick={handleConnect} 
              disabled={connecting}
              className="w-full font-bold py-4 px-6 rounded-xl mb-3 transition-colors disabled:opacity-50 text-white hover:opacity-90"
              style={{ backgroundColor: BLUE }}
            >
              {connecting ? '⏳ Connecting...' : '✅ Connect to Partner'}
            </button>
            <button 
              onClick={() => { 
                setscannedPartnerId(''); 
                setShopName(''); 
                setError(''); 
                setPermissionAsked(false);
              }}
              className="w-full font-medium py-3 px-6 rounded-xl transition-colors"
              style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
            >
              🔄 Scan Different Partner
            </button>
          </div>
        )}
      </div>
    </MemberLayout>
  );
}
