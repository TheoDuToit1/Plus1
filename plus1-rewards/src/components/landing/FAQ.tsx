// plus1-rewards/src/components/landing/FAQ.tsx
import { useState } from 'react'

const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.10)'
const BLUE_BORDER = 'rgba(26,85,139,0.35)'

const faqs = [
  {
    q: 'How do I start earning?',
    a: 'Sign up free — no data needed, just enable Bluetooth and open Zii Chat, or scan our QR code. Once registered, you\'ll get your unique +1 Rewards QR code. Show it at the till at any partner store and you immediately start earning 3% cashback in rands on everything you buy.',
  },
  {
    q: 'Is the medical cover comprehensive?',
    a: 'Your Day1Health plan is medical insurance — not a medical aid scheme. It covers day-to-day medical expenses and emergencies based on the plan you choose. Plans are designed to be affordable and practical for South African families. Visit day1health.co.za to compare plan options.',
  },
  {
    q: "What happens if I don't reach R385 this month?",
    a: "Your cashback rands carry over — they never expire and never reset. Just keep shopping at partner stores and your balance builds until it covers your monthly premium. Most families earning at a single partner store reach R385 within 6–8 weeks.",
  },
  {
    q: 'Is this the same as medical aid?',
    a: 'No — and that\'s actually good news. Medical aid requires high monthly contributions regardless of your income. Day1Health through +1 Rewards is medical insurance — you choose a plan that fits your budget, and your cashback from everyday shopping pays toward it. It\'s designed to be accessible for every South African household.',
  },
  {
    q: 'Do I need a smartphone or internet to use +1 Rewards?',
    a: 'No. The +1 Rewards QR code works completely offline at the till. You can also sign up and communicate through Zii Chat, our free Bluetooth messaging app — no SIM card or mobile data needed. Just enable Bluetooth on any device.',
  },
  {
    q: 'Which stores near me are +1 Rewards partners?',
    a: 'Look for the green +1 Rewards sticker on the door or counter. We\'re actively signing up local retailers across the Voortrekker corridor and surrounding areas in Cape Town. The network grows every week — sign up now and start earning at the stores already on board.',
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