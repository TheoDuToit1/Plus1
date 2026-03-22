// plus1-rewards/src/components/landing/ValueBar.tsx
const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.10)'

export default function ValueBar() {
  const items = [
    { icon: 'payments', title: 'No Upfront Costs', sub: 'Join for R0 today' },
    { icon: 'signal_wifi_off', title: 'Works Offline', sub: 'No data? No problem' },
    { icon: 'verified_user', title: 'Day1 Health Partner', sub: 'Trusted insurance coverage' },
  ]

  return (
    <section className="border-y py-10 px-6" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 group ${i === 1 ? 'md:border-x md:px-8' : ''}`}
            style={i === 1 ? { borderColor: '#e5e7eb' } : {}}
          >
            <div
              className="size-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: BLUE_LIGHT, color: BLUE }}
            >
              <span className="material-symbols-outlined text-3xl">{item.icon}</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}