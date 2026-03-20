// plus1-rewards/src/components/mobile/FAQ.tsx
const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.08)'
const BLUE_BORDER = 'rgba(26,85,139,0.18)'

export default function FAQ() {
  return (
    <section className="px-4 py-12" style={{ backgroundColor: '#ffffff' }}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Frequently Asked</h2>
      <div className="space-y-4">
        {[
          {
            q: 'How many points do I need?',
            a: 'Most plans activate after spending approximately R1,500 per month at participating stores, though this varies by plan level.',
          },
          {
            q: 'Where can I use my card?',
            a: 'Look for the +1 Rewards sticker in shop windows or check the "Partners" tab in the app for a full map of local providers.',
          },
          {
            q: 'Is my family covered?',
            a: 'Yes! You can choose family plans that cover your spouse and up to three children by pooling your shopping rewards.',
          },
        ].map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border p-4"
            style={{ backgroundColor: BLUE_LIGHT, borderColor: BLUE_BORDER }}
          >
            <summary className="flex items-center justify-between font-semibold list-none cursor-pointer text-gray-900">
              <span>{item.q}</span>
              <span
                className="material-symbols-outlined group-open:rotate-180 transition-transform flex-shrink-0 ml-2"
                style={{ color: BLUE }}
              >
                expand_more
              </span>
            </summary>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
