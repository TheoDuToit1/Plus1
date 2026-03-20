// plus1-rewards/src/components/member/components/RewardsBalanceCard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PolicyOverflowModal from '../PolicyOverflowModal';

interface PolicyInfo {
  name: string;
  monthly_target: number;
  current_amount: number;
}

interface RewardsBalanceCardProps {
  balance: number;
  lastUpdated: string;
  policyInfo?: PolicyInfo | null;
  memberId?: string;
  onOverflowHandled?: () => void;
}

const BLUE = '#1a558b';

export default function RewardsBalanceCard({ 
  balance, 
  lastUpdated, 
  policyInfo, 
  memberId,
  onOverflowHandled 
}: RewardsBalanceCardProps) {
  const navigate = useNavigate();
  const [showOverflowModal, setShowOverflowModal] = useState(false);

  const handleDetailsClick = () => {
    navigate('/member/history');
  };

  const progressPercentage = policyInfo 
    ? Math.min((policyInfo.current_amount / policyInfo.monthly_target) * 100, 100)
    : 0;

  const remainingAmount = policyInfo 
    ? Math.max(policyInfo.monthly_target - policyInfo.current_amount, 0)
    : 0;

  const overflowAmount = policyInfo && policyInfo.current_amount > policyInfo.monthly_target
    ? policyInfo.current_amount - policyInfo.monthly_target
    : 0;

  const hasOverflow = overflowAmount > 0;

  const handleOverflowClick = () => {
    if (hasOverflow && memberId) {
      setShowOverflowModal(true);
    }
  };

  return (
    <>
      <div className="flex flex-col items-stretch justify-start rounded-2xl overflow-hidden shadow-lg relative" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
        {/* Decorative icon in top right */}
        <div className="absolute -top-12 -right-12 opacity-5">
          <span className="material-symbols-outlined block" style={{ fontSize: '240px', fontVariationSettings: '"FILL" 0, "wght" 200', color: BLUE }}>payments</span>
        </div>
        
        <div className="flex flex-col p-6 gap-2 relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: BLUE }}>Rewards Overview</p>
          <div className="flex items-baseline gap-2 my-4">
            <p className="text-5xl font-black leading-tight" style={{ color: '#111827' }}>R{balance.toFixed(2)}</p>
            <span className="material-symbols-outlined text-lg" style={{ color: BLUE }}>trending_up</span>
          </div>
          <p className="text-base font-normal mb-4" style={{ color: '#6b7280' }}>Total Rewards Balance</p>
          
          {/* Policy Information */}
          {policyInfo && (
            <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'rgba(26, 85, 139, 0.05)', border: `1px solid rgba(26, 85, 139, 0.2)` }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm" style={{ color: '#111827' }}>{policyInfo.name}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>Monthly Policy Target</p>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={{ color: BLUE }}>R{policyInfo.current_amount.toFixed(2)}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>of R{policyInfo.monthly_target.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full rounded-full h-2 mb-2" style={{ backgroundColor: '#e5e7eb' }}>
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(progressPercentage, 100)}%`,
                    backgroundColor: hasOverflow ? '#fbbf24' : BLUE
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-xs mb-2">
                <span style={{ color: '#6b7280' }}>{progressPercentage.toFixed(1)}% complete</span>
                {remainingAmount > 0 ? (
                  <span style={{ color: '#f59e0b' }}>R{remainingAmount.toFixed(2)} remaining</span>
                ) : (
                  <span className="font-bold" style={{ color: BLUE }}>✓ Target reached!</span>
                )}
              </div>

              {/* Overflow Alert */}
              {hasOverflow && (
                <div className="rounded-lg p-3 mt-3" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#f59e0b' }}>🎉 Overflow: R{overflowAmount.toFixed(2)}</p>
                      <p className="text-xs" style={{ color: '#d97706' }}>You've exceeded your policy target!</p>
                    </div>
                    <button
                      onClick={handleOverflowClick}
                      className="font-bold px-3 py-1 rounded-lg text-xs transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#f59e0b', color: '#000' }}
                    >
                      Manage
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="pt-4 flex justify-between items-center" style={{ borderTop: '1px solid #e5e7eb' }}>
            <span className="text-xs italic" style={{ color: '#9ca3af' }}>Last updated: {lastUpdated}</span>
            <button 
              onClick={handleDetailsClick}
              className="text-sm font-bold hover:underline"
              style={{ color: BLUE }}
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Policy Overflow Modal */}
      <PolicyOverflowModal
        isOpen={showOverflowModal}
        onClose={() => setShowOverflowModal(false)}
        overflowAmount={overflowAmount}
        currentPolicyName={policyInfo?.name || ''}
        memberId={memberId || ''}
        onOverflowHandled={() => {
          setShowOverflowModal(false);
          onOverflowHandled?.();
        }}
      />
    </>
  );
}
