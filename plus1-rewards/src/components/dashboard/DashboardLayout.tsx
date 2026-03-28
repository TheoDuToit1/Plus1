// plus1-rewards/src/components/dashboard/DashboardLayout.tsx
import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with hamburger */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl text-gray-700">menu</span>
          </button>
          <img 
            src="/logo.png" 
            alt="+1 Rewards" 
            className="h-8 object-contain"
          />
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        
        {children}
      </div>
    </div>
  );
}
