// src/components/partner/components/PartnerQRCode.tsx
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { encodePartnerQR } from '../../../lib/config';

interface PartnerQRCodeProps {
  partnerId?: string;
}

export default function PartnerQRCode({ partnerId }: PartnerQRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    if (partnerId) {
      generateQRCode();
    }
  }, [partnerId]);

  const generateQRCode = async () => {
    if (!partnerId) return;
    
    setQrLoading(true);
    try {
      const qrValue = encodePartnerQR(partnerId);
      const url = await QRCode.toDataURL(qrValue, {
        width: 210,
        margin: 2,
        color: { dark: '#102216', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
      try {
        // Fallback to simple shop ID
        const url = await QRCode.toDataURL(`PARTNER:${partnerId}`, {
          width: 210,
          margin: 2,
          color: { dark: '#102216', light: '#ffffff' },
          errorCorrectionLevel: 'M',
        });
        setQrCodeUrl(url);
      } catch (fallbackError) {
        console.error('Fallback QR generation failed:', fallbackError);
      }
    } finally {
      setQrLoading(false);
    }
  };

  const handleCopyShopId = () => {
    if (partnerId) {
      navigator.clipboard?.writeText(partnerId);
      alert('Shop ID copied to clipboard!');
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `shop-qr-${partnerId?.substring(0, 8)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const displayId = partnerId ? partnerId.substring(0, 8).toUpperCase() : 'LOADING...';

  return (
    <div className="flex flex-col items-stretch justify-start rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-200">
      <div className="p-6 pb-0 flex items-center justify-between">
        <p className="text-gray-900 text-lg font-bold">Your Business QR</p>
        <span className="material-symbols-outlined text-[#1a558b]">qr_code_2</span>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div 
          className="bg-white p-3 rounded-xl aspect-square w-40 mx-auto shadow-sm flex items-center justify-center group relative border-2"
          style={{ borderColor: '#1a558b' }}
        >
          {qrLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#1a558b]/20 border-t-[#1a558b] rounded-full animate-spin" />
            </div>
          ) : qrCodeUrl ? (
            <>
              <img
                src={qrCodeUrl}
                alt="Partner QR Code"
                className="w-full h-full rounded-lg opacity-90"
              />
              <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              QR unavailable
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm font-medium">Members scan this</p>
          <p className="text-gray-900 text-base font-bold tracking-widest">{displayId}</p>
        </div>
        <div className="flex gap-2 justify-center pt-2">
          <button 
            onClick={handleDownloadQR}
            disabled={!qrCodeUrl}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-3 bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
            title="Download QR code"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download
          </button>
          <button 
            onClick={handleCopyShopId}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-3 bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-all"
            title="Copy Partner ID to clipboard"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Copy ID
          </button>
          <button 
            onClick={generateQRCode}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="Refresh QR code"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
