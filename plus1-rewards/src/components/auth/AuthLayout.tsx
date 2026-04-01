// Shared layout shell for all auth pages
import type { ReactNode } from 'react'

const BLUE = '#1a558b'
const BLUE_DARK = '#0f3a63'

interface Stat { label: string; value: string }
interface AuthLayoutProps {
  portalIcon: string
  portalName: string
  headline: ReactNode
  subheadline: string
  stats: Stat[]
  children: ReactNode
}

export default function AuthLayout({ portalIcon, portalName, headline, subheadline, stats, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ── Left Brand Panel ── */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-14 overflow-hidden"
        style={{ 
          backgroundImage: 'url("/background%20image.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <a href="/" className="cursor-pointer">
            <img 
              src="/logo.png" 
              alt="+1 Rewards" 
              className="w-auto object-contain hover:opacity-80 transition-opacity"
              style={{ height: '70px' }}
            />
          </a>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-5">
          <h1 className="text-5xl font-black text-white leading-tight">{headline}</h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-sm">{subheadline}</p>
        </div>

        {/* Empty spacer to maintain layout */}
        <div className="relative z-10"></div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center py-10 px-6 bg-[#f5f8fc]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <a href="/" className="cursor-pointer">
              <img 
                src="/logo.png" 
                alt="+1 Rewards" 
                className="w-auto object-contain hover:opacity-80 transition-opacity"
                style={{ height: '60px' }}
              />
            </a>
          </div>

          {/* Back link */}
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold mb-8 transition-colors group"
            style={{ color: BLUE }}
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            Back to home
          </a>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
