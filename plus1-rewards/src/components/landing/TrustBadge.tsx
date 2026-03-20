// plus1-rewards/src/components/landing/TrustBadge.tsx
const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.10)'

export default function TrustBadge() {
  return (
    <section className="py-16 px-6 lg:px-20" style={{ backgroundColor: '#f5f8fc' }}>
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-2xl border p-10 flex flex-col md:flex-row items-center gap-10 justify-between"
          style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
        >
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BLUE }}>
              Our Trusted Insurance Partner
            </p>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div
                className="size-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: BLUE_LIGHT }}
              >
                <span className="material-symbols-outlined text-3xl" style={{ color: BLUE }}>shield</span>
              </div>
              <span className="text-2xl font-black text-gray-900">Day1 Health</span>
            </div>
          </div>

          <div className="hidden md:block h-16 w-px" style={{ backgroundColor: '#e5e7eb' }} />

          <div className="text-center md:text-left">
            <p className="font-bold text-gray-800">FSP Licensed</p>
            <p className="text-sm text-gray-500">Regulated by the FSCA</p>
          </div>

          <div className="hidden md:block h-16 w-px" style={{ backgroundColor: '#e5e7eb' }} />

          <p className="text-sm text-gray-500 max-w-sm leading-relaxed italic text-center md:text-left">
            &ldquo;+1 Rewards acts as a facilitator for community-based rewards. All healthcare policies are underwritten and managed by Day1 Health (Pty) Ltd, an authorized financial services provider.&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}