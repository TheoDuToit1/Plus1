// plus1-rewards/src/components/mobile/CTASection.tsx
const BLUE = '#1a558b'

export default function CTASection() {
  return (
    <section className="px-4 py-12 mb-20 text-center" style={{ backgroundColor: '#f5f8fc' }}>
      <h3 className="text-2xl font-bold mb-3 text-gray-900">Ready to start earning?</h3>
      <p className="text-gray-500 mb-8 text-sm leading-relaxed">
        Join thousands of people getting health cover through their daily shopping.
      </p>
      <div className="flex flex-col gap-4">
        <button
          className="py-4 px-8 rounded-xl font-bold text-lg shadow-lg text-white active:scale-[0.98] transition-transform"
          style={{ backgroundColor: BLUE }}
          onClick={() => window.location.href = '/register'}
        >
          Download for Android
        </button>
        <button
          className="py-4 px-8 rounded-xl font-bold text-lg border active:scale-[0.98] transition-transform"
          style={{ borderColor: BLUE, color: BLUE, backgroundColor: 'transparent' }}
          onClick={() => window.location.href = '/partner/register'}
        >
          Register a Shop
        </button>
      </div>
    </section>
  );
}
