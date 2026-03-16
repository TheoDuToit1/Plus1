// plus1-rewards/src/pages/Landing.tsx
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import ValueBar from '../components/landing/ValueBar'
import HowItWorks from '../components/landing/HowItWorks'
import Roles from '../components/landing/Roles'
import TrustBadge from '../components/landing/TrustBadge'
import OfflineFeature from '../components/landing/OfflineFeature'
import FAQ from '../components/landing/FAQ'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <ValueBar />
      <HowItWorks />
      <Roles />
      <TrustBadge />
      <OfflineFeature />
      <FAQ />
      <Footer />
    </>
  )
}