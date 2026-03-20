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
          backgroundImage: 'url(/background image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-11 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-2xl">{portalIcon}</span>
          </div>
          <span className="text-xl font-black text-white tracking-tight uppercase">{portalName}</span>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-5">
          <h1 className="text-5xl font-black text-white leading-tight">{headline}</h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-sm">{subheadline}</p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-10">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="text-2xl font-black text-white">{s.value}</span>
              <span className="text-blue-300 text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center py-10 px-6 bg-[#f5f8fc]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: BLUE }}>
              <span className="material-symbols-outlined text-white">{portalIcon}</span>
            </div>
            <span className="font-black text-gray-900 text-lg uppercase tracking-tight">{portalName}</span>
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
