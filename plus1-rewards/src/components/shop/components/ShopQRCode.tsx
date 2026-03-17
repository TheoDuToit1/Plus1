// src/components/shop/components/ShopQRCode.tsx
import { useRef } from 'react';

interface ShopQRCodeProps {
  shopId?: string;
}

export default function ShopQRCode({ shopId }: ShopQRCodeProps) {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleCopyShopId = () => {
    if (shopId) {
      navigator.clipboard.writeText(shopId.substring(0, 8).toUpperCase());
      alert('Shop ID copied to clipboard!');
    }
  };

  const handleDownloadQR = async () => {
    try {
      const link = document.createElement('a');
      link.href = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYMWlLRSwTfE7jVA8ZKqxUVtTFGMfBbDEGcNhiJOQYuU2sgf_jWo6aTdAyXdfdSGD-0q_tiTvq8AXS3zF6sBT4obPdWBv527ZzrNfFHYPl2FDax_XPpPxxLI-aOrh9XpeFPk5uOEtqt5tZSZGYYPE2EDEXX3abXSyrqqCPhSjXeIiUEcB2UcXNR0e8WYlxd2HmGu_7VP0A_3NrMfpnZMl50rOnSxmPJTOMZ8icjEDP7ChoqW5dpl_AuVO892NeZJmAEM4GlKcuypmr';
      link.download = `shop-qr-${shopId?.substring(0, 8)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('QR code downloaded successfully!');
    } catch (err) {
      alert('Failed to download QR code');
    }
  };

  const displayId = shopId ? shopId.substring(0, 8).toUpperCase() : 'SH-88291';

  return (
    <div className="flex flex-col rounded-2xl bg-[#162d1e] border border-[#1a3324] overflow-hidden shadow-2xl" style={{ borderWidth: '0.2px' }}>
      <div className="p-6 bg-[#193322] border-b border-[#1a3324]" style={{ borderWidth: '0.2px' }}>
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">qr_code_2</span>
          My Shop QR Code
        </h2>
        <p className="text-slate-400 text-sm mt-1">Customers scan this to earn rewards instantly at checkout</p>
      </div>
      <div className="p-8 flex flex-col items-center gap-8">
        <div className="relative p-6 bg-white rounded-2xl shadow-inner border border-[#1a3324]" style={{ borderWidth: '0.2px' }}>
          <div className="size-56 bg-slate-100 rounded flex items-center justify-center relative overflow-hidden">
            <div className="w-full h-full bg-[radial-gradient(#112217_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            <div className="absolute inset-4 border-[12px] border-slate-900 rounded-sm"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-primary font-black">loyalty</span>
              </div>
            </div>
            <img
              alt="QR Code"
              className="absolute inset-0 w-full h-full p-2"
              data-alt={`Official QR code for shop ${displayId}`}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYMWlLRSwTfE7jVA8ZKqxUVtTFGMfBbDEGcNhiJOQYuU2sgf_jWo6aTdAyXdfdSGD-0q_tiTvq8AXS3zF6sBT4obPdWBv527ZzrNfFHYPl2FDax_XPpPxxLI-aOrh9XpeFPk5uOEtqt5tZSZGYYPE2EDEXX3abXSyrqqCPhSjXeIiUEcB2UcXNR0e8WYlxd2HmGu_7VP0A_3NrMfpnZMl50rOnSxmPJTOMZ8icjEDP7ChoqW5dpl_AuVO892NeZJmAEM4GlKcuypmr"
            />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 rounded-full text-[10px] font-black text-background-dark uppercase tracking-tighter">Scan Me</div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Shop ID for manual entry</p>
          <div className="flex items-center gap-2 p-3 bg-[#0a1a10] border border-[#1a3324] rounded-lg" style={{ borderWidth: '0.2px' }}>
            <span className="flex-1 font-mono text-lg font-bold text-white tracking-widest text-center">{displayId}</span>
            <button
              onClick={handleCopyShopId}
              className="size-10 flex items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              title="Copy Shop ID"
            >
              <span className="material-symbols-outlined text-xl">content_copy</span>
            </button>
          </div>
          <button
            onClick={handleDownloadQR}
            className="w-full flex items-center justify-center gap-2 py-3 border border-[#1a3324] rounded-lg text-sm font-medium text-white hover:bg-[#1a3324] transition-colors" 
            style={{ borderWidth: '0.2px' }}
            title="Download QR code as image"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download Print Version
          </button>
        </div>
      </div>
      <canvas ref={qrCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}
