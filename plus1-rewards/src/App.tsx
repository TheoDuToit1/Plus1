// plus1-rewards/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import MemberLogin from './pages/MemberLogin'
import MemberRegister from './pages/MemberRegister'
import PartnerLogin from './pages/PartnerLogin'
import PartnerRegister from './pages/PartnerRegister'
import AgentLogin from './pages/AgentLogin'
import AgentRegister from './pages/AgentRegister'
import PolicyProviderLogin from './pages/PolicyProviderLogin'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './components/dashboard/Dashboard'
import MembersPage from './components/dashboard/pages/MembersPage'
import PartnersPage from './components/dashboard/pages/PartnersPage'
import AgentsPage from './components/dashboard/pages/AgentsPage'
import PoliciesPage from './components/dashboard/pages/PoliciesPage'
import TransactionsPage from './components/dashboard/pages/TransactionsPage'
import { MemberDashboard } from './pages/MemberDashboard'
import PartnerDashboard from './components/partner/PartnerDashboard'
import TransactionHistory from './components/partner/pages/TransactionHistory'
import MonthlyInvoice from './components/partner/pages/MonthlyInvoice'
import { AgentDashboard } from './pages/AgentDashboard'
import { PolicyProviderDashboard } from './pages/PolicyProviderDashboard'
import { MemberScanPartner } from './pages/MemberScanPartner'
import { MemberPolicySelector } from './pages/MemberPolicySelector'
import MemberPolicies from './pages/MemberPolicies'
import { MemberHistory } from './pages/MemberHistory'
import { MemberProfile } from './pages/MemberProfile'
import { MemberQR } from './pages/MemberQR'
import { MemberFindPartners } from './pages/MemberFindPartners'
import ProtectedPolicyProviderRoute from './components/ProtectedPolicyProviderRoute'

export default function App() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 antialiased font-display overflow-x-hidden">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/member/login" element={<MemberLogin />} />
          <Route path="/member/register" element={<MemberRegister />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
          <Route path="/partner/register" element={<PartnerRegister />} />
          <Route path="/agent/login" element={<AgentLogin />} />
          <Route path="/agent/register" element={<AgentRegister />} />
          <Route path="/provider/login" element={<PolicyProviderLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/members" element={<MembersPage />} />
          <Route path="/admin/partners" element={<PartnersPage />} />
          <Route path="/admin/agents" element={<AgentsPage />} />
          <Route path="/admin/policies" element={<PoliciesPage />} />
          <Route path="/admin/transactions" element={<TransactionsPage />} />
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/member/scan-partner" element={<MemberScanPartner />} />
          <Route path="/member/policy-selector" element={<MemberPolicySelector />} />
          <Route path="/member/policies" element={<MemberPolicies />} />
          <Route path="/member/history" element={<MemberHistory />} />
          <Route path="/member/profile" element={<MemberProfile />} />
          <Route path="/member/qr" element={<MemberQR />} />
          <Route path="/member/find-partners" element={<MemberFindPartners />} />
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="/partner/transaction-history" element={<TransactionHistory />} />
          <Route path="/partner/monthly-invoice" element={<MonthlyInvoice />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/provider/dashboard" element={
            <ProtectedPolicyProviderRoute>
              <PolicyProviderDashboard />
            </ProtectedPolicyProviderRoute>
          } />
        </Routes>
      </Router>
    </div>
  )
}