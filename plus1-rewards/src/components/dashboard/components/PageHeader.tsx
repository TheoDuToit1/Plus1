// plus1-rewards/src/components/dashboard/components/PageHeader.tsx
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onRefresh?: () => void;
  showSearch?: boolean;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  onRefresh,
  showSearch = true,
  actions
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      {/* Top Action Bar */}
      <header className="flex flex-col gap-3 md:gap-4 p-4 md:p-6 lg:p-10 pb-4 md:pb-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {showSearch && onSearchChange ? (
            <div className="flex-1 max-w-2xl w-full">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg md:text-xl">
                  search
                </span>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 md:py-2.5 pl-9 md:pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-[#1a558b] focus:border-[#1a558b] outline-none transition-all placeholder:text-gray-400"
                  placeholder={searchPlaceholder}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {actions}
            
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 font-bold rounded-lg border border-[#1a558b] bg-white text-[#1a558b] hover:bg-[#1a558b] hover:text-white transition-all text-xs md:text-sm"
              >
                <span className="material-symbols-outlined text-base md:text-lg">refresh</span>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 bg-[#1a558b] text-white rounded-lg hover:opacity-90 transition-all text-xs md:text-sm font-bold"
            >
              <span className="material-symbols-outlined text-base md:text-lg">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Title Section */}
      <div className="px-4 md:px-6 lg:px-10 pt-6 md:pt-8 pb-4 md:pb-6">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{title}</h2>
        <p className="text-sm md:text-base text-gray-600 mt-1">{description}</p>
      </div>
    </>
  );
}
