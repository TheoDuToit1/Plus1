// plus1-rewards/src/components/member/BlockedFundsNotification.tsx
interface BlockedFundsNotificationProps {
  blockedAmount: number;
  onSelectPolicy: () => void;
}

export default function BlockedFundsNotification({ blockedAmount, onSelectPolicy }: BlockedFundsNotificationProps) {
  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  if (blockedAmount <= 0) return null;

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <span className="material-symbols-outlined text-yellow-500 text-2xl">warning</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-yellow-400 mb-1">Funds Blocked - Policy Required</h3>
          <p className="text-sm text-yellow-200 mb-3">
            You have <strong>{formatCurrency(blockedAmount)}</strong> in blocked rewards. 
            These funds cannot be accessed until you select a policy plan.
          </p>
          <button
            onClick={onSelectPolicy}
            className="bg-yellow-500 text-background-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">shield_with_heart</span>
            Select Policy Now
          </button>
        </div>
      </div>
    </div>
  );
}