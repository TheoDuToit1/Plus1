import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import jsQR from 'jsqr';

export function MemberScanShop() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [scannedShopId, setScannedShopId] = useState('');
  const [shopName, setShopName] = useState('');
  const [permissionAsked, setPermissionAsked] = useState(false);

  // Do NOT auto-start — wait for user to click the allow button
  useEffect(() => { return () => { stopCamera(); cancelAnimationFrame(rafRef.current); }; }, []);

  const startCamera = async () => {
    setPermissionAsked(true);
    setError('');

    // Camera API requires HTTPS (except localhost)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(
        'Camera blocked: Your browser requires a secure HTTPS connection to use the camera. ' +
        'Please access this app via https:// or use localhost. ' +
        'As a workaround, use the \"Enter Shop ID Manually\" option below.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
        setError('Camera permission was denied. Please open your browser settings, allow camera access for this site, then try again.');
      } else if (err?.name === 'NotFoundError') {
        setError('No camera found on this device. Use the \"Enter Shop ID Manually\" option below.');
      } else {
        setError('Unable to start camera. Try using the manual input option instead.');
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
      rafRef.current = requestAnimationFrame(tick); return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) { rafRef.current = requestAnimationFrame(tick); return; }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
    if (code?.data) {
      stopCamera();
      setScanning(false);
      handleQRDecoded(code.data);
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const handleQRDecoded = async (data: string) => {
    // QR format: "SHOP:{shopId}" or raw shopId
    const shopId = data.startsWith('SHOP:') ? data.replace('SHOP:', '') : data;
    const { data: shopData } = await supabase.from('shops').select('id, name').eq('id', shopId).single();
    if (shopData) {
      setScannedShopId(shopData.id);
      setShopName(shopData.name);
    } else {
      setError('QR code not recognized as a +1 Rewards shop. Try entering the Shop ID manually.');
    }
  };

  const handleManualInput = async () => {
    const shopId = prompt('Enter Shop ID:');
    if (shopId?.trim()) {
      stopCamera(); setScanning(false);
      const { data } = await supabase.from('shops').select('id, name').eq('id', shopId.trim()).single();
      if (data) { setScannedShopId(data.id); setShopName(data.name); }
      else setError('Shop ID not found.');
    }
  };

  const handleConnect = async () => {
    if (!scannedShopId) return;
    setConnecting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/member/login'); return; }
      const { data: shopData } = await supabase.from('shops').select('id, name, status').eq('id', scannedShopId).single();
      if (!shopData) { setError('Shop not found.'); setConnecting(false); return; }
      if (shopData.status === 'suspended') { setError('This shop is currently suspended.'); setConnecting(false); return; }
      const { error: walletError } = await supabase.from('wallets').insert([{
        member_id: user.id, shop_id: scannedShopId,
        policies: { name: 'Day-to-Day Single', current: 0, target: 385, status: 'active' },
        rewards_total: 0,
      }]);
      if (walletError?.code === '23505') {
        // Already connected — still navigate to dashboard
        navigate('/member/dashboard'); return;
      }
      if (walletError) throw walletError;
      navigate('/member/dashboard');
    } catch (err) { setError(err instanceof Error ? err.message : 'Connection failed'); setConnecting(false); }
  };

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>📱 Scan Shop QR</h1>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Connect to a partner shop</p>
          </div>
          <button onClick={() => { stopCamera(); navigate('/member/dashboard'); }}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
            ✕ Close
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', alignItems: 'start', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <div className="alert alert-error">{error}</div>}

          {!scannedShopId ? (
            <div className="card" style={{ padding: '1.5rem' }}>

              {/* Permission prompt — shown before camera starts */}
              {!permissionAsked && (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📷</div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Camera Access Needed</h2>
                  <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                    To scan a shop's QR code, +1 Rewards needs access to your camera.
                    Your browser will ask for permission — please click <strong>Allow</strong>.
                  </p>
                  <button onClick={startCamera} className="btn btn-primary btn-block" style={{ height: '56px', borderRadius: '12px', fontSize: '1rem', marginBottom: '0.875rem' }}>
                    📷 Allow Camera & Start Scanning
                  </button>
                  <button onClick={handleManualInput} className="btn btn-ghost btn-block" style={{ borderRadius: '10px' }}>
                    📋 Enter Shop ID Manually Instead
                  </button>
                </div>
              )}

              {/* Live camera viewport — shown after permission granted */}
              {permissionAsked && (
                <>
                  <p style={{ color: 'var(--gray-text)', fontSize: '0.9375rem', textAlign: 'center', marginBottom: '1.25rem' }}>
                    Point your camera at the shop's QR code poster
                  </p>
                  <div style={{ position: 'relative', background: '#000', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.25rem', aspectRatio: '1' }}>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    {/* Overlay */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '200px', height: '200px', borderRadius: '12px', boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)', border: '2px solid var(--green)', position: 'relative' }}>
                        {['top:0;left:0', 'top:0;right:0', 'bottom:0;left:0', 'bottom:0;right:0'].map((pos, i) => {
                          const isTop = pos.includes('top:0'); const isLeft = pos.includes('left:0');
                          return (<div key={i} style={{ position: 'absolute', width: '20px', height: '20px', top: isTop ? 0 : 'auto', bottom: !isTop ? 0 : 'auto', left: isLeft ? 0 : 'auto', right: !isLeft ? 0 : 'auto', borderTop: isTop ? '3px solid #37d270' : 'none', borderBottom: !isTop ? '3px solid #37d270' : 'none', borderLeft: isLeft ? '3px solid #37d270' : 'none', borderRight: !isLeft ? '3px solid #37d270' : 'none' }} />);
                        })}
                      </div>
                    </div>
                    {scanning && (
                      <div style={{ position: 'absolute', bottom: '1rem', left: 0, right: 0, textAlign: 'center' }}>
                        <span style={{ background: 'rgba(0,0,0,0.6)', color: '#37d270', padding: '0.375rem 0.875rem', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600 }}>
                          🔍 Scanning for shop QR...
                        </span>
                      </div>
                    )}
                  </div>
                  <button onClick={handleManualInput} className="btn btn-outline btn-block" style={{ borderRadius: '10px' }}>
                    📋 Enter Shop ID Manually
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="card animate-fade-up" style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem' }}>
                🏪
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>Shop Found!</h2>
              <p style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem' }}>{shopName}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-light)', wordBreak: 'break-all', background: '#f9fafb', borderRadius: '8px', padding: '0.5rem', marginBottom: '1.5rem' }}>
                ID: {scannedShopId}
              </p>
              <button onClick={handleConnect} disabled={connecting} className="btn btn-green btn-block" style={{ borderRadius: '12px', height: '52px', marginBottom: '0.75rem' }}>
                {connecting ? '⏳ Connecting...' : '✓ Connect to This Shop'}
              </button>
              <button onClick={() => { setScannedShopId(''); setShopName(''); setError(''); startCamera(); }} className="btn btn-ghost btn-block" style={{ borderRadius: '12px' }}>
                🔄 Scan Different Shop
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
