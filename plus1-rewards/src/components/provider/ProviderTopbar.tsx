// src/components/provider/ProviderTopbar.tsx
interface ProviderTopbarProps {
  provider?: { id: string; name: string } | null;
  onSignOut?: () => void;
}

export default function ProviderTopbar({ onSignOut }: ProviderTopbarProps) {
  const handleLogout = () => {
    localStorage.removeItem('currentProvider');
    window.location.href = '/provider/login';
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap px-6 md:px-10 py-4 bg-background-dark/50 backdrop-blur-md sticky top-0 z-50" style={{ borderBottom: '0.2px solid rgba(17, 212, 82, 0.2)' }}>
      <div className="flex items-center gap-4 text-primary">
        <div className="size-8">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <h2 className="text-white text-xl font-bold leading-tight tracking-tight uppercase">
          +1 Rewards <span className="text-primary/70 font-light mx-2">|</span> Day1 Health
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-6 items-center">
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-slate-300 hover:text-primary text-sm font-medium transition-colors" href="#">
            Partner Portal
          </a>
          <a className="text-slate-300 hover:text-primary text-sm font-medium transition-colors" href="#">
            Support
          </a>
        </nav>
        <div className="h-6 w-px bg-primary/20 hidden md:block"></div>
        <button
          onClick={handleLogout}
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-background-dark text-sm font-bold transition-transform hover:scale-105 active:scale-95"
        >
          <span className="truncate">Logout</span>
        </button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/30"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBkZHoTyvQIHAMe8LO_gdOIijpT6IKT78a_cO1bR3VIkJJ5onST4QkjyKtqRydhyY9V9cMIz-hBHhNaT7y2NtNgRTnuTnfl8j2R5DWA1e59GIWgdWROtE5WbRjnKbh7S5C5k5AnAh2GeFSJcSCopBUq89tZDbWsG3RpUKNGRcs5i9IJngfsGO9E3KB24aTjF6WfpYHqSB9znhO4jSaDVauf2VZCRIR6tkheLqXIXW1lWtenRUMyeJiJRZXEaXFIhGQcQVvWrskYqOSE")',
          }}
          title="User profile avatar with green border"
        ></div>
      </div>
    </header>
  );
}
