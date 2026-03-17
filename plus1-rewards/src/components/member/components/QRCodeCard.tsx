// plus1-rewards/src/components/member/components/QRCodeCard.tsx
interface QRCodeCardProps {
  phone: string;
  qrCodeUrl: string;
  qrLoading: boolean;
  onRefresh: () => void;
  onFullScreen: () => void;
}

export default function QRCodeCard({ phone, qrCodeUrl, qrLoading, onRefresh, onFullScreen }: QRCodeCardProps) {
  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(phone);
  };

  return (
    <div className="flex flex-col items-stretch justify-start rounded-2xl overflow-hidden shadow-2xl bg-[#193322] border border-[#1a3324]">
      <div className="p-6 pb-0 flex items-center justify-between">
        <p className="text-white text-lg font-bold">Your Rewards QR</p>
        <span className="material-symbols-outlined text-primary">qr_code_2</span>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div 
          className="bg-white p-3 rounded-xl aspect-square w-40 mx-auto shadow-inner flex items-center justify-center group relative"
          style={{ borderWidth: '0.2px', borderColor: '#11d452', borderStyle: 'solid' }}
        >
          {qrLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : qrCodeUrl ? (
            <>
              <img
                src={qrCodeUrl}
                alt="Member QR Code"
                className="w-full h-full rounded-lg opacity-90"
              />
              <div className="absolute inset-0 bg-background-dark/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              QR unavailable
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-sm font-medium">Show at shops</p>
          <p className="text-white text-base font-bold tracking-widest">{phone}</p>
        </div>
        <div className="flex gap-2 justify-center pt-2">
          <button 
            onClick={onFullScreen}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-3 bg-[#1a3324] text-white text-xs font-bold hover:bg-[#23482f] transition-all"
          >
            <span className="material-symbols-outlined text-sm">fullscreen</span>
            Full Screen
          </button>
          <button 
            onClick={handleCopyPhone}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-3 bg-[#1a3324] text-white text-xs font-bold hover:bg-[#23482f] transition-all"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Copy Phone
          </button>
          <button 
            onClick={onRefresh}
            className="p-2 rounded-lg bg-[#1a3324] text-white hover:bg-[#23482f]"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
