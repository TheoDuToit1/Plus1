// plus1-rewards/src/components/mobile/HowItWorks.tsx
const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.10)'
const BLUE_BORDER = 'rgba(26,85,139,0.20)'

export default function HowItWorks() {
  const steps = [
    {
      icon: 'shopping_basket',
      title: 'Shop at partners',
      desc: 'Visit any of our 500+ registered local shops and vendors in your neighborhood.',
      hasLine: true,
    },
    {
      icon: 'monetization_on',
      title: 'Earn +1 points',
      desc: 'Scan your unique QR code at checkout to collect rewards on every purchase you make.',
      hasLine: true,
    },
    {
      icon: 'health_and_safety',
      title: 'Activate health cover',
      desc: 'Once you reach your monthly goal, your Day1 Health insurance is automatically activated.',
      hasLine: false,
    },
  ]

  return (
    <section className="px-4 py-8" style={{ backgroundColor: '#ffffff' }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
        <span className="material-symbols-outlined" style={{ color: BLUE }}>auto_awesome</span>
        How It Works
      </h2>
      <div className="space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div
                className="size-12 rounded-full flex items-center justify-center border"
                style={{ backgroundColor: BLUE_LIGHT, borderColor: BLUE_BORDER }}
              >
                <span className="material-symbols-outlined" style={{ color: BLUE }}>{step.icon}</span>
              </div>
              {step.hasLine && (
                <div
                  className="w-0.5 h-full my-2"
                  style={{ background: `linear-gradient(to bottom, rgba(26,85,139,0.3), transparent)` }}
                />
              )}
            </div>
            <div className="pb-6">
              <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="text-gray-500 mt-1 text-sm">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
