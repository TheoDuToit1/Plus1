import { useRef, useState, useEffect } from 'react';

interface AgentDigitalSignatureProps {
  onSign: (signatureDataUrl: string) => void;
  onCancel: () => void;
  agentName: string;
}

export default function AgentDigitalSignature({ 
  onSign, 
  onCancel, 
  agentName
}: AgentDigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set drawing style
    ctx.strokeStyle = '#1a558b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSign = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const signatureDataUrl = canvas.toDataURL('image/png');
    onSign(signatureDataUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-black text-gray-900">Sales Agent Agreement</h2>
            <p className="text-sm text-gray-600 mt-1">Please review and sign to complete registration</p>
          </div>

          {/* Agreement Content */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm max-h-64 overflow-y-auto">
            <h3 className="font-bold text-base text-[#1a558b]">Plus1 Rewards Sales Agent Agreement</h3>
            
            <div>
              <p className="font-semibold">Agent: {agentName}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">1. Commission Structure</h4>
              <p>You agree to work as a sales agent for Plus1 Rewards and earn 1% commission on all partner registrations and transactions you facilitate.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">2. Payment Terms</h4>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>Commissions are calculated and paid monthly</li>
                <li>Payment is processed on the 28th of each month</li>
                <li>Minimum commission threshold may apply</li>
                <li>All payments are made via EFT to your designated account</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">3. Agent Obligations</h4>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>Accurately register partners and members on behalf of Plus1 Rewards</li>
                <li>Verify identity and information before registration</li>
                <li>Maintain accurate records of all registrations</li>
                <li>Report any suspicious activity immediately</li>
                <li>Comply with all Plus1 Rewards policies and procedures</li>
                <li>Provide excellent customer service to all parties</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">4. Account Approval</h4>
              <p>Your account requires admin approval before activation. You will be notified via email once approved.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">5. Confidentiality</h4>
              <p>You agree to maintain confidentiality of all member and partner information and use it only for Plus1 Rewards business purposes.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">6. Termination</h4>
              <p>Either party may terminate this agreement with 30 days written notice. Outstanding commissions remain payable.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">7. Data Protection</h4>
              <p>You agree to protect member and partner data and comply with all data protection regulations.</p>
            </div>
          </div>

          {/* Signature Section */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1a558b]">
              Digital Signature
            </label>
            <p className="text-xs text-gray-600">Sign below using your mouse or touchscreen</p>
            <div className="border-2 border-[#1a558b] rounded-xl overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-40 cursor-crosshair touch-none"
                style={{ touchAction: 'none' }}
              />
            </div>
            <button
              type="button"
              onClick={clearSignature}
              className="text-xs text-gray-600 hover:text-gray-900 underline"
            >
              Clear Signature
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSign}
              disabled={!hasSignature}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: hasSignature ? '#1a558b' : '#9ca3af',
                cursor: hasSignature ? 'pointer' : 'not-allowed'
              }}
            >
              Sign & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
