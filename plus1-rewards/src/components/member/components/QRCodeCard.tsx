// plus1-rewards/src/components/member/components/QRCodeCard.tsx
interface QRCodeCardProps {
  phone: string;
  qrCodeUrl: string;
  qrLoading: boolean;
  onRefresh: () => void;
  onFullScreen: () => void;
}

const BLUE = '#1a558b';

export default function QRCodeCard({ phone, qrCodeUrl, qrLoading, onRefresh, onFullScreen }: QRCodeCardProps) {
  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(phone);
    alert('Phone number copied to clipboard!');
  };

  return (
    <div className="flex flex-col items-stretch justify-start rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
      <div className="p-6 pb-0 flex items-center justify-between">
        <p className="text-lg font-bold" style={{ color: '#111827' }}>Your Rewards QR</p>
        <span className="material-symbols-outlined" style={{ color: BLUE }}>qr_code_2</span>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div 
          className="bg-white p-3 rounded-xl aspect-square w-40 mx-auto shadow-md flex items-center justify-center group relative"
          style={{ border: `2px solid ${BLUE}` }}
        >
          {qrLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(26, 85, 139, 0.2)', borderTopColor: BLUE }} />
            </div>
          ) : qrCodeUrl ? (
            <>
              <img
                src={qrCodeUrl}
                alt="Member QR Code"
                className="w-full h-full rounded-lg opacity-90"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: '#9ca3af' }}>
              QR unavailable
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Show at shops</p>
          <p className="text-base font-bold tracking-widest" style={{ color: '#111827' }}>{phone}</p>
        </div>
        <div className="flex gap-2 justify-center pt-2">
          <button 
            onClick={onFullScreen}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-3 text-xs font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: BLUE, color: '#ffffff' }}
            title="View QR code in full screen"
          >
            <span className="material-symbols-outlined text-sm">fullscreen</span>
            Full Screen
          </button>
          <button 
            onClick={handleCopyPhone}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-3 text-xs font-bold transition-all"
            style={{ backgroundColor: 'rgba(26, 85, 139, 0.1)', color: BLUE, border: `1px solid ${BLUE}40` }}
            title="Copy phone number to clipboard"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Copy Phone
          </button>
          <button 
            onClick={onRefresh}
            className="p-2 rounded-lg transition-all"
            style={{ backgroundColor: 'rgba(26, 85, 139, 0.1)', color: BLUE }}
            title="Refresh QR code"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
