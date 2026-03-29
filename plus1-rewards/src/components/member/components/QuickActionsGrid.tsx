// plus1-rewards/src/components/member/components/QuickActionsGrid.tsx
interface QuickAction {
  icon: string;
  label: string;
  onClick: () => void;
  badge?: boolean;
}

interface QuickActionsGridProps {
  onScanQR: () => void;
  onMyPolicies: () => void;
  onHistory: () => void;
  onMyProfile: () => void;
  showProfileBadge?: boolean;
}

const BLUE = '#1a558b';
const BLUE_LIGHT = 'rgba(26, 85, 139, 0.08)';

export default function QuickActionsGrid({ onScanQR, onMyPolicies, onHistory, onMyProfile, showProfileBadge }: QuickActionsGridProps) {
  const actions: QuickAction[] = [
    { icon: 'qr_code_scanner', label: 'Scan Partner QR', onClick: onScanQR },
    { icon: 'shield_with_heart', label: 'My Policies', onClick: onMyPolicies },
    { icon: 'history', label: 'History', onClick: onHistory },
    { icon: 'person_outline', label: 'Edit Profile', onClick: onMyProfile, badge: showProfileBadge },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button 
          key={index}
          onClick={action.onClick}
          className="flex flex-col items-center justify-center p-4 rounded-xl transition-all group relative hover:shadow-md"
          style={{
            backgroundColor: '#ffffff',
            border: `1px solid #e5e7eb`,
          }}
        >
          {action.badge && (
            <div className="absolute top-2 right-2">
              <div className="relative">
                <span className="material-symbols-outlined text-yellow-500 text-2xl animate-pulse">
                  notifications
                </span>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
              </div>
            </div>
          )}
          <span className="material-symbols-outlined mb-2 text-3xl group-hover:scale-110 transition-transform" style={{ color: BLUE }}>
            {action.icon}
          </span>
          <span className="text-sm font-semibold" style={{ color: '#374151' }}>{action.label}</span>
        </button>
      ))}
    </section>
  );
}
