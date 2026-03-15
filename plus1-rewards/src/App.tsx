import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Landing } from './pages/Landing'
import MemberLogin from './pages/MemberLogin'
import MemberRegister from './pages/MemberRegister'
import { MemberDashboard } from './pages/MemberDashboard'
import { MemberScanShop } from './pages/MemberScanShop'
import { MemberPolicySelector } from './pages/MemberPolicySelector'
import { MemberHistory } from './pages/MemberHistory'
import { MemberQR } from './pages/MemberQR'
import { MemberFindShops } from './pages/MemberFindShops'
import { MemberProfile } from './pages/MemberProfile'
import { ShopRegister } from './pages/ShopRegister'
import { ShopLogin } from './pages/ShopLogin'
import { ShopDashboard } from './pages/ShopDashboard'
import { ShopHistory } from './pages/ShopHistory'
import { ShopInvoice } from './pages/ShopInvoice'
import { ShopFindMember } from './pages/ShopFindMember'
import { AgentRegister } from './pages/AgentRegister'
import { AgentLogin } from './pages/AgentLogin'
import { AgentDashboard } from './pages/AgentDashboard'
import { AgentAddShop } from './pages/AgentAddShop'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminInvoices } from './pages/AdminInvoices'
import { AdminSuspensions } from './pages/AdminSuspensions'
import { AdminAgentPayouts } from './pages/AdminAgentPayouts'
import { AdminDay1Batch } from './pages/AdminDay1Batch'
import { PolicyProviderLogin } from './pages/PolicyProviderLogin'
import { PolicyProviderDashboard } from './pages/PolicyProviderDashboard'
import { LegalPopia } from './pages/LegalPopia'
import { LegalMemberTerms } from './pages/LegalMemberTerms'
import { initDB } from './services/indexedDB'
import './index.css'

function App() {
  useEffect(() => {
    initDB().catch(console.error)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Member */}
        <Route path="/member/login" element={<MemberLogin />} />
        <Route path="/member/register" element={<MemberRegister />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/member/scan-shop" element={<MemberScanShop />} />
        <Route path="/member/policy-selector" element={<MemberPolicySelector />} />
        <Route path="/member/history" element={<MemberHistory />} />
        <Route path="/member/qr" element={<MemberQR />} />
        <Route path="/member/find-shops" element={<MemberFindShops />} />
        <Route path="/member/profile" element={<MemberProfile />} />
        {/* Shop */}
        <Route path="/shop/register" element={<ShopRegister />} />
        <Route path="/shop/login" element={<ShopLogin />} />
        <Route path="/shop/dashboard" element={<ShopDashboard />} />
        <Route path="/shop/history" element={<ShopHistory />} />
        <Route path="/shop/invoice" element={<ShopInvoice />} />
        <Route path="/shop/find-member" element={<ShopFindMember />} />
        {/* Agent */}
        <Route path="/agent/register" element={<AgentRegister />} />
        <Route path="/agent/login" element={<AgentLogin />} />
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/agent/add-shop" element={<AgentAddShop />} />
        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/invoices" element={<AdminInvoices />} />
        <Route path="/admin/suspensions" element={<AdminSuspensions />} />
        <Route path="/admin/agents" element={<AdminAgentPayouts />} />
        <Route path="/admin/day1-batch" element={<AdminDay1Batch />} />
        {/* Policy Provider */}
        <Route path="/provider/login" element={<PolicyProviderLogin />} />
        <Route path="/provider/dashboard" element={<PolicyProviderDashboard />} />
        {/* Legal */}
        <Route path="/legal/popia" element={<LegalPopia />} />
        <Route path="/legal/member-terms" element={<LegalMemberTerms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
