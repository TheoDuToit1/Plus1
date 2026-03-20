// plus1-rewards/src/components/landing/FAQ.tsx
import { useState } from 'react'

const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.10)'
const BLUE_BORDER = 'rgba(26,85,139,0.35)'

const faqs = [
  {
    q: 'How do I start earning?',
    a: 'Simply sign up as a member, get your unique QR code, and show it to the cashier whenever you buy at a partner store.',
  },
  {
    q: 'Is the medical cover comprehensive?',
    a: 'Yes! The Day1 Health plan includes GP visits, medication, basic dentistry, and emergency services.',
  },
  {
    q: "What happens if I don't reach R385 this month?",
    a: "Your rewards balance rolls over to the next month. You'll never lose your progress towards coverage.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

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
      </div>
    </section>
  )
}