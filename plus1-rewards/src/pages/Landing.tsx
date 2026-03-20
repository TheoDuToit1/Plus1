// plus1-rewards/src/pages/Landing.tsx
import { useState, useEffect } from 'react'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import Roles from '../components/landing/Roles'
import TrustBadge from '../components/landing/TrustBadge'
import OfflineFeature from '../components/landing/OfflineFeature'
import FAQ from '../components/landing/FAQ'
import Footer from '../components/landing/Footer'
import MobileLanding from '../components/mobile/MobileLanding'

export default function Landing() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    return <MobileLanding />
  }

  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Roles />
      <TrustBadge />
      <OfflineFeature />
      <FAQ />
      <Footer />
    </>
  )
}