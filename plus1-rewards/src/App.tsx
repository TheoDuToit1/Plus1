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
import AdminLogin from './pages/AdminLogin'

export default function App() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display">
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
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </div>
  )
}