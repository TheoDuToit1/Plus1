// plus1-rewards/src/components/landing/HowItWorks.tsx
const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.10)'
const BLUE_DARK = '#154a7a'

export default function HowItWorks() {
  const steps = [
    {
      icon: 'storefront',
      number: '1',
      title: 'Shop at partner stores',
      desc: 'Visit any participating local retailer in your community for your regular everyday shopping.',
    },
    {
      icon: 'qr_code_2',
      number: '2',
      title: 'Earn 3% Rewards',
      desc: 'Scan your unique QR code at checkout to earn 3% back on every single purchase you make.',
    },
    {
      icon: 'health_and_safety',
      number: '3',
      title: 'Policy Activates at R385',
      desc: 'Once your rewards reach R385, your Day1 Health coverage starts automatically.',
    },
  ]

  return (
    <section className="py-24 px-6 lg:px-20" style={{ backgroundColor: '#f5f8fc' }} id="how-it-works">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span
            className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ backgroundColor: BLUE_LIGHT, color: BLUE }}
          >
            Simple Process
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works in 3 Simple Steps</h2>
          <p className="text-gray-500 leading-relaxed">
            Turning your daily spending into security has never been easier. We&apos;ve simplified the path to healthcare.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div
                  className="size-20 rounded-full flex items-center justify-center text-white relative z-10 shadow-lg transition-transform group-hover:scale-105"
                  style={{ backgroundColor: BLUE }}
                >
                  <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                </div>
                <div
                  className="absolute -top-2 -right-2 size-7 rounded-full flex items-center justify-center text-xs font-black text-white z-20 shadow"
                  style={{ backgroundColor: BLUE_DARK }}
                >
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
          {/* Connector line */}
          <div
            className="hidden md:block absolute top-10 left-[28%] right-[28%] h-px"
            style={{ backgroundColor: 'rgba(26,85,139,0.25)' }}
          />
        </div>
      </div>
    </section>
  )
}