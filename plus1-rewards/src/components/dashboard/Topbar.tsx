// plus1-rewards/src/components/dashboard/Topbar.tsx
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onRefresh?: () => void;
}

export default function Topbar({ onRefresh }: TopbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase text-gray-900">Admin Control Center</h1>
        <p className="font-medium mt-1 text-[#1a558b]">Complete Platform Management</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg border transition-all text-sm hover:bg-[#1a558b]/5 bg-white text-[#1a558b] border-[#1a558b]"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Refresh All Data
        </button>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1a558b] rounded-lg hover:bg-[#1a558b]/90 transition-all text-sm text-white"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Logout
        </button>
        
        <div className="size-11 rounded-full border-2 border-[#1a558b] p-0.5 ml-2">
          <div className="w-full h-full rounded-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZTVGWF5d9bUsTI1U_LA3u4Y-VW_tV7rVaCbr2bBcopKZ6aUEHak7Ad9ln4DGdmBcA4N_9IKOEwo_ZTgYugg0o3iWvRKoqrWDyBrw7mtjHatTwJ33VZI6nS8OIhyQl1DNFVnLMy5g9mboPCvWqWHPBke7YtYx4A7Ny8R8SF3z24w7nM33LYsSZVYbQQMyEhfI9bUKhfbdf6UBFROSXG5deW8I1Twmv3QDRJbOGQADi06UdXRXlEIqzBN95vQGSGpy4mn-lBnbfZr0r')"}}></div>
        </div>
      </div>
    </header>
  );
}
