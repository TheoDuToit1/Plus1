// plus1-rewards/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import MemberLogin from './pages/MemberLogin'
import MemberRegister from './pages/MemberRegister'
import ShopLogin from './pages/ShopLogin'
import ShopRegister from './pages/ShopRegister'
import AgentLogin from './pages/AgentLogin'
import AgentRegister from './pages/AgentRegister'
import PolicyProviderLogin from './pages/PolicyProviderLogin'
import { PolicyProviderRegister } from './pages/PolicyProviderRegister'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './components/dashboard/Dashboard'
import MembersPage from './components/dashboard/pages/MembersPage'
import ShopsPage from './components/dashboard/pages/ShopsPage'
import AgentsPage from './components/dashboard/pages/AgentsPage'
import PolicyProvidersPage from './components/dashboard/pages/PolicyProvidersPage'
import PoliciesPage from './components/dashboard/pages/PoliciesPage'
import TransactionsPage from './components/dashboard/pages/TransactionsPage'
import { MemberDashboard } from './pages/MemberDashboard'
import { ShopDashboard } from './pages/ShopDashboard'
import { AgentDashboard } from './pages/AgentDashboard'
import { PolicyProviderDashboard } from './pages/PolicyProviderDashboard'
import { MemberScanShop } from './pages/MemberScanShop'
import { MemberPolicySelector } from './pages/MemberPolicySelector'
import { MemberHistory } from './pages/MemberHistory'
import { MemberProfile } from './pages/MemberProfile'
import { MemberQR } from './pages/MemberQR'
import { MemberFindShops } from './pages/MemberFindShops'

export default function App() {
  return (
    <div className="min-h-screen w-full bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display overflow-x-hidden">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/member/login" element={<MemberLogin />} />
          <Route path="/member/register" element={<MemberRegister />} />
          <Route path="/shop/login" element={<ShopLogin />} />
          <Route path="/shop/register" element={<ShopRegister />} />
          <Route path="/agent/login" element={<AgentLogin />} />
          <Route path="/agent/register" element={<AgentRegister />} />
          <Route path="/provider/login" element={<PolicyProviderLogin />} />
          <Route path="/provider/register" element={<PolicyProviderRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/members" element={<MembersPage />} />
          <Route path="/admin/shops" element={<ShopsPage />} />
          <Route path="/admin/agents" element={<AgentsPage />} />
          <Route path="/admin/providers" element={<PolicyProvidersPage />} />
          <Route path="/admin/policies" element={<PoliciesPage />} />
          <Route path="/admin/transactions" element={<TransactionsPage />} />
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/member/scan-shop" element={<MemberScanShop />} />
          <Route path="/member/policy-selector" element={<MemberPolicySelector />} />
          <Route path="/member/history" element={<MemberHistory />} />
          <Route path="/member/profile" element={<MemberProfile />} />
          <Route path="/member/qr" element={<MemberQR />} />
          <Route path="/member/find-shops" element={<MemberFindShops />} />
          <Route path="/shop/dashboard" element={<ShopDashboard />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/provider/dashboard" element={<PolicyProviderDashboard />} />
        </Routes>
      </Router>
    </div>
  )
}