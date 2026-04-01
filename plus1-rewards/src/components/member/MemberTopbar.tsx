// plus1-rewards/src/components/member/MemberTopbar.tsx
interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  qr_code: string;
}

interface MemberTopbarProps {
  member: Member | null;
  isOnline: boolean;
  pendingTransactions: number;
  onSignOut: () => void;
}

const BLUE = '#1a558b';

export default function MemberTopbar({ member, isOnline, pendingTransactions, onSignOut }: MemberTopbarProps) {
  const avatarUrl = member ? 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1a558b&color=ffffff&size=128&bold=true` : 
    '';

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="flex items-center gap-3">
        {/* Plus1 Rewards Logo - clickable, goes to Rewards landing page */}
        <a href="/" className="hover:opacity-80 transition-opacity">
          <img 
            src="/logo.png" 
            alt="+1 Rewards" 
            className="h-10 w-auto object-contain"
          />
        </a>
        
        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>
        
        {/* Spacer */}
        <div className="w-4"></div>
      </div>
      <div className="flex flex-1 justify-end items-center gap-6">
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: '#6b7280' }}>Member Portal</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(26, 85, 139, 0.1)', border: `1px solid rgba(26, 85, 139, 0.2)` }}>
            <span className={`flex h-2 w-2 rounded-full`} style={{ backgroundColor: isOnline ? BLUE : '#6b7280' }}></span>
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: isOnline ? BLUE : '#6b7280' }}>
              {isOnline ? 'Online' : `Offline · ${pendingTransactions} pending`}
            </span>
          </div>
        </div>
        <button 
          onClick={onSignOut}
          className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 text-sm font-bold transition-all hover:opacity-90 text-white"
          style={{ backgroundColor: BLUE }}
        >
          Sign out
        </button>
        {avatarUrl && (
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
            data-alt={`User profile avatar of ${member?.name}`}
            style={{
              backgroundImage: `url("${avatarUrl}")`,
              border: `2px solid ${BLUE}40`
            }}
          ></div>
        )}
      </div>
    </header>
  );
}
