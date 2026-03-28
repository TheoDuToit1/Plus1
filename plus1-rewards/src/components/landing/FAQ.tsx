// plus1-rewards/src/components/landing/FAQ.tsx
import { useState } from 'react'

const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.10)'
const BLUE_BORDER = 'rgba(26,85,139,0.35)'

const faqs = [
  {
    q: 'How do I start earning?',
    a: 'Join +1 Rewards and shop at any participating partner store. At checkout, give your cell phone number to earn cashback. You can also scan your QR code. Your cashback then goes toward your medical cover.',
  },
  {
    q: 'Is the medical cover comprehensive?',
    a: 'You get access to real medical cover, with your benefits clearly shown upfront so you can understand exactly what cover you have.',
  },
  {
    q: "What happens if I don't reach my target this month?",
    a: "If you do not reach your monthly target, your cover status may change. Keep shopping at +1 Rewards partners to help keep your cover active.",
  },
  {
    q: 'Is this the same as medical aid?',
    a: 'No. +1 Rewards is different from medical aid. It helps turn your everyday shopping into cashback that goes toward your medical cover.',
  },
  {
    q: 'Do I need a smartphone or internet to use +1 Rewards?',
    a: 'No. The quickest way is to give your cell phone number at checkout. You can also scan your QR code. +1 Rewards is built for real-life shopping, even when data is tight.',
  },
  {
    q: 'Which stores near me are +1 Rewards partners?',
    a: 'Look for the +1 Rewards sign at participating stores near you, or check the platform to find partner stores in your area.',
  },
]

export default function FAQ() {
  const [showFAQs, setShowFAQs] = useState(false)
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 px-6 lg:px-20" style={{ backgroundColor: '#f5f8fc' }} id="faq">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ backgroundColor: BLUE_LIGHT, color: BLUE }}
          >
            FAQ
          </span>
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>

        {/* Show/Hide FAQs Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowFAQs(!showFAQs)}
            className="px-6 py-3 rounded-lg font-bold text-base transition-all"
            style={{
              backgroundColor: showFAQs ? BLUE : BLUE_LIGHT,
              color: showFAQs ? '#fff' : BLUE,
              border: `2px solid ${BLUE}`
            }}
          >
            {showFAQs ? 'Hide FAQs' : 'Show FAQs'}
          </button>
        </div>

        {/* FAQs List - Hidden by default */}
        {showFAQs && (
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden transition-all"
                style={{ borderColor: open === i ? BLUE_BORDER : '#e5e7eb', backgroundColor: '#fff' }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-bold text-gray-900 text-base">{faq.q}</span>
                  <span
                    className="material-symbols-outlined text-xl flex-shrink-0 ml-4 transition-transform duration-200"
                    style={{
                      color: BLUE,
                      transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    expand_more
                  </span>
                </button>
                {open === i && (
                  <div className="px-6 pb-5 text-gray-500 leading-relaxed border-t" style={{ borderColor: '#f0f0f0' }}>
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}