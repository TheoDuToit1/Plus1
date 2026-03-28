// plus1-rewards/src/components/mobile/MobileLanding.tsx
import Header from './Header';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import CoverStatus from './CoverStatus';
import RolesCarousel from './RolesCarousel';
import OfflineFeature from './OfflineFeature';
import FAQ from './FAQ';
import CTASection from './CTASection';
import BottomNav from './BottomNav';

export default function MobileLanding() {
  return (
    <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: '#f5f8fc' }}>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <CoverStatus />
        <RolesCarousel />
        <OfflineFeature />
        <FAQ />
        <CTASection />
      </main>
      <BottomNav />
    </div>
  );
}
