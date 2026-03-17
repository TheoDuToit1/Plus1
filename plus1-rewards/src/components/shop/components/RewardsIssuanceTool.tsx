// src/components/shop/components/RewardsIssuanceTool.tsx
import { useState, useRef } from 'react';

interface RewardsIssuanceToolProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  purchaseAmount: string;
  setPurchaseAmount: (amount: string) => void;
  selectedMemberId: string | null;
  onIssueRewards: () => void;
  onSearchMember: (phone: string) => void;
  isLoading?: boolean;
}

export default function RewardsIssuanceTool({
  activeTab,
  setActiveTab,
  purchaseAmount,
  setPurchaseAmount,
  selectedMemberId,
  onIssueRewards,
  onSearchMember,
  isLoading = false,
}: RewardsIssuanceToolProps) {
  const [searchPhone, setSearchPhone] = useState('');
  const [scanningQR, setScanningQR] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartQRScanner = async () => {
    setScanningQR(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Unable to access camera. Please check permissions.');
      setScanningQR(false);
    }
  };

  const handleStopQRScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setScanningQR(false);
  };

  const handleSearch = () => {
    if (searchPhone) {
      onSearchMember(searchPhone);
      setSearchPhone('');
    }
  };

  return (
    <div className="flex flex-col rounded-2xl bg-[#162d1e] border border-[#1a3324] overflow-hidden shadow-2xl" style={{ borderWidth: '0.2px' }}>
      <div className="p-6 border-b border-[#1a3324]" style={{ borderWidth: '0.2px' }}>
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">add_circle</span>
          Issue Member Rewards
        </h2>
      </div>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex p-1 bg-[#0a1a10] rounded-lg border border-[#1a3324]" style={{ borderWidth: '0.2px' }}>
          <button
            onClick={() => {
              setActiveTab('scan');
              if (scanningQR) handleStopQRScanner();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-bold transition-all ${
              activeTab === 'scan'
                ? 'bg-[#1a3324] text-primary shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
            Scan QR
          </button>
          <button
            onClick={() => {
              setActiveTab('search');
              if (scanningQR) handleStopQRScanner();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'search'
                ? 'bg-[#1a3324] text-primary shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">search</span>
            Phone Search
          </button>
        </div>

        {activeTab === 'scan' && (
          <>
            {!scanningQR ? (
              <button
                onClick={handleStartQRScanner}
                className="w-full flex items-center justify-center gap-3 py-6 border-2 border-dashed border-primary/40 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all group"
                title="Click to open camera and scan QR code"
              >
                <div className="size-12 rounded-full bg-primary flex items-center justify-center text-background-dark group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined font-bold text-2xl">photo_camera</span>
                </div>
                <div className="text-left">
                  <p className="text-white font-bold">Start QR Scanner</p>
                  <p className="text-slate-400 text-xs">Scan customer&apos;s membership card</p>
                </div>
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 rounded-lg bg-black object-cover"
                />
                <button
                  onClick={handleStopQRScanner}
                  className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
                >
                  Stop Scanner
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'search' && (
          <div className="flex flex-col gap-3">
            <input
              type="tel"
              placeholder="Enter member phone number"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a1a10] border border-[#1a3324] rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-slate-500"
              style={{ borderWidth: '0.2px' }}
            />
            <button
              onClick={handleSearch}
              className="w-full py-2 bg-primary/20 text-primary rounded-lg font-medium hover:bg-primary/30 transition-colors"
              title="Search for member by phone number"
            >
              Search Member
            </button>
          </div>
        )}

        {selectedMemberId && (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm font-medium" style={{ borderWidth: '0.2px' }}>
            ✓ Member selected
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">Purchase Amount (R)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0a1a10] border border-[#1a3324] rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg font-bold text-white placeholder-slate-500"
                style={{ borderWidth: '0.2px' }}
              />
            </div>
          </div>
          <button
            onClick={onIssueRewards}
            disabled={isLoading || !selectedMemberId || !purchaseAmount}
            className="w-full h-14 bg-primary text-background-dark font-black text-lg rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Issue rewards to selected member"
          >
            {isLoading ? 'Processing...' : 'ISSUE REWARDS'}
          </button>
        </div>
      </div>
    </div>
  );
}
