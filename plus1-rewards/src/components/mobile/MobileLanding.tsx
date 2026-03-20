// plus1-rewards/src/components/mobile/MobileLanding.tsx
import Header from './Header';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import RolesCarousel from './RolesCarousel';
import OfflineFeature from './OfflineFeature';
import TrustBadge from './TrustBadge';
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
        <RolesCarousel />
        <OfflineFeature />
        <TrustBadge />
        <FAQ />
        <CTASection />
      </main>
      <BottomNav />
    </div>
  );
}
