// plus1-rewards/src/components/member/components/QuickActionsGrid.tsx
interface QuickAction {
  icon: string;
  label: string;
  onClick: () => void;
}

interface QuickActionsGridProps {
  onScanQR: () => void;
  onMyPolicies: () => void;
  onHistory: () => void;
  onMyProfile: () => void;
}

export default function QuickActionsGrid({ onScanQR, onMyPolicies, onHistory, onMyProfile }: QuickActionsGridProps) {
  const actions: QuickAction[] = [
    { icon: 'qr_code_scanner', label: 'Scan Shop QR', onClick: onScanQR },
    { icon: 'shield_with_heart', label: 'My Policies', onClick: onMyPolicies },
    { icon: 'history', label: 'History', onClick: onHistory },
    { icon: 'person_outline', label: 'My Profile', onClick: onMyProfile },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button 
          key={index}
          onClick={action.onClick}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#193322] border border-[#1a3324] hover:border-primary/50 transition-colors group"
        >
          <span className="material-symbols-outlined text-primary mb-2 text-3xl group-hover:scale-110 transition-transform">
            {action.icon}
          </span>
          <span className="text-sm font-semibold">{action.label}</span>
        </button>
      ))}
    </section>
  );
}
