// plus1-rewards/src/components/landing/Navbar.tsx
import { useState } from 'react'

const BLUE = '#1a558b'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-20 py-3" style={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}>
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl" style={{ color: BLUE }}>add_circle</span>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">+1Rewards</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <a className="hover:text-blue-700 transition-colors" href="#how-it-works">How it Works</a>
          <a className="hover:text-blue-700 transition-colors" href="#roles">Roles</a>
          <a className="hover:text-blue-700 transition-colors" href="#features">Offline Tech</a>
          <a className="hover:text-blue-700 transition-colors" href="#faq">FAQ</a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a href="/member/login" className="hidden md:inline text-sm font-semibold text-gray-800 hover:text-blue-800 transition-colors">
            Sign In
          </a>
          <button
            className="hidden md:block px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm text-white hover:opacity-90"
            style={{ backgroundColor: BLUE }}
            onClick={() => window.location.href = '/member/register'}
          >
            Start Earning Free Cover &rarr;
          </button>
          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-6 border-t border-gray-200 flex flex-col gap-1 pt-6" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <a 
            href="#how-it-works" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-800 hover:bg-blue-50 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-xl" style={{ color: BLUE }}>info</span>
            <span>How it Works</span>
          </a>
          <a 
            href="#roles" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-800 hover:bg-blue-50 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-xl" style={{ color: BLUE }}>groups</span>
            <span>Roles</span>
          </a>
          <a 
            href="#features" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-800 hover:bg-blue-50 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-xl" style={{ color: BLUE }}>wifi_off</span>
            <span>Offline Tech</span>
          </a>
          <a 
            href="#faq" 
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-800 hover:bg-blue-50 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-xl" style={{ color: BLUE }}>help</span>
            <span>FAQ</span>
          </a>
          <div className="mt-2 px-4 flex flex-col gap-3">
            <a 
              href="/member/login" 
              className="text-center py-3 text-base font-semibold rounded-lg transition-all border-2"
              style={{ color: BLUE, borderColor: BLUE }}
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </a>
            <button
              className="py-3 rounded-lg font-bold text-base transition-all shadow-md text-white"
              style={{ backgroundColor: BLUE }}
              onClick={() => window.location.href = '/member/register'}
            >
              Get Started →
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}