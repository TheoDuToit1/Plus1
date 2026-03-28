// plus1-rewards/src/components/mobile/Header.tsx
const BLUE = '#1a558b'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center p-4 justify-between" style={{
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-3xl" style={{ color: BLUE }}>add_circle</span>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-gray-900">+1 Rewards</h2>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button
          className="flex items-center justify-center p-2 rounded-full text-white"
          style={{ backgroundColor: BLUE }}
        >
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
