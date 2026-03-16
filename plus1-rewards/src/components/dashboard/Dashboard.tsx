// plus1-rewards/src/components/dashboard/Dashboard.tsx
import DashboardLayout from './DashboardLayout';
import Topbar from './Topbar';
import StatsCards from './StatsCards';
import FinancialOverview from './FinancialOverview';
import PlatformStatus from './PlatformStatus';
import QuickActions from './QuickActions';
import Footer from './Footer';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-10">
        <Topbar />
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FinancialOverview />
            <PlatformStatus />
          </div>
          
          <QuickActions />
        </div>
        
        <Footer />
      </main>
    </DashboardLayout>
  );
}
