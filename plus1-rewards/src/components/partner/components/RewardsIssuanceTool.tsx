// src/components/shop/components/RewardsIssuanceTool.tsx
import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

interface MemberDetails {
  id: string;
  name: string;
  phone: string;
  balance?: number;
}

interface RewardsIssuanceToolProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  purchaseAmount: string;
  setPurchaseAmount: (amount: string) => void;
  selectedMemberId: string | null;
  memberDetails: MemberDetails | null;
  commissionRate: number;
  onIssueRewards: () => void;
  onSearchMember: (phone: string) => void;
  onQRScanned: (memberId: string) => void;
  onClearMember: () => void;
  isLoading?: boolean;
}

export default function RewardsIssuanceTool({
  activeTab,
  setActiveTab,
  purchaseAmount,
  setPurchaseAmount,
  selectedMemberId,
  memberDetails,
  commissionRate,
  onIssueRewards,
  onSearchMember,
  onQRScanned,
  onClearMember,
  isLoading = false,
}: RewardsIssuanceToolProps) {
  const [searchPhone, setSearchPhone] = useState('');
  const [scanningQR, setScanningQR] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Calculate member reward: commission rate minus 2% (1% agent + 1% platform)
  const memberRewardRate = Math.max(0, commissionRate - 2);
  const calculatedReward = purchaseAmount ? (parseFloat(purchaseAmount) * memberRewardRate / 100) : 0;

  // QR Code scanning logic
  useEffect(() => {
    if (scanningQR && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const scanQRCode = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code && code.data) {
            // QR code detected
            handleStopQRScanner();
            onQRScanned(code.data);
          }
        }
      };

      scanIntervalRef.current = window.setInterval(scanQRCode, 100);
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [scanningQR, onQRScanned]);

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
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
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
    <div className="flex flex-col rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-gray-900 text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1a558b]">add_circle</span>
          Issue Member Rewards
        </h2>
      </div>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex p-1 bg-gray-100 rounded-lg border border-gray-200">
          <button
            onClick={() => {
              setActiveTab('scan');
              if (scanningQR) handleStopQRScanner();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-bold transition-all ${
              activeTab === 'scan'
                ? 'bg-white text-[#1a558b] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
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
                ? 'bg-white text-[#1a558b] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
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
                className="w-full flex items-center justify-center gap-3 py-6 border-2 border-dashed border-[#1a558b]/40 rounded-xl bg-[#1a558b]/10 hover:bg-[#1a558b]/20 transition-all group"
                title="Click to open camera and scan QR code"
              >
                <div className="size-12 rounded-full bg-[#1a558b] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined font-bold text-2xl">photo_camera</span>
                </div>
                <div className="text-left">
                  <p className="text-gray-900 font-bold">Start QR Scanner</p>
                  <p className="text-gray-600 text-xs">Scan customer&apos;s membership card</p>
                </div>
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 rounded-lg bg-black object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-4 border-[#1a558b] rounded-lg"></div>
                  </div>
                </div>
                <button
                  onClick={handleStopQRScanner}
                  className="w-full py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
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
              className="member-input-override w-full px-4 py-3 bg-[#f5f8fc] border-2 border-[#1a558b] rounded-lg focus:ring-2 focus:ring-[#1a558b] focus:border-[#1a558b] outline-none text-gray-900 placeholder:text-gray-400"
            />
            <button
              onClick={handleSearch}
              className="w-full py-2 bg-[#1a558b]/10 text-[#1a558b] rounded-lg font-medium hover:bg-[#1a558b]/20 transition-colors"
              title="Search for member by phone number"
            >
              Search Member
            </button>
          </div>
        )}

        {selectedMemberId && memberDetails && (
          <div className="p-4 bg-[#1a558b]/10 border border-[#1a558b]/30 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 text-[#1a558b] font-bold">
                <span className="material-symbols-outlined">check_circle</span>
                <span>Member Selected</span>
              </div>
              <button
                onClick={onClearMember}
                className="text-gray-400 hover:text-gray-900 transition-colors"
                title="Clear selection"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-900 font-medium">{memberDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="text-gray-900 font-medium">{memberDetails.phone}</span>
              </div>
              {memberDetails.balance !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance:</span>
                  <span className="text-[#1a558b] font-bold">R{memberDetails.balance.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Purchase Amount (R)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold">R</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="member-input-override w-full pl-10 pr-4 py-3 bg-[#f5f8fc] border-2 border-[#1a558b] rounded-lg focus:ring-2 focus:ring-[#1a558b] focus:border-[#1a558b] outline-none text-lg font-bold text-gray-900 placeholder:text-gray-400"
              />
            </div>
            {purchaseAmount && parseFloat(purchaseAmount) > 0 && (
              <div className="mt-2 p-3 bg-[#1a558b]/10 border border-[#1a558b]/30 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600 text-xs">Member will receive:</span>
                  <span className="text-[#1a558b] text-lg font-black">R{calculatedReward.toFixed(2)}</span>
                </div>
                <div className="text-gray-500 text-xs">
                  {memberRewardRate}% of purchase (Your {commissionRate}% commission - 2% fees)
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onIssueRewards}
            disabled={isLoading || !selectedMemberId || !purchaseAmount || parseFloat(purchaseAmount) <= 0}
            className="w-full h-14 bg-[#1a558b] text-white font-black text-lg rounded-xl hover:bg-[#1a558b]/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Issue rewards to selected member"
          >
            {isLoading ? 'Processing...' : 'ISSUE REWARDS'}
          </button>
        </div>
      </div>
    </div>
  );
}
