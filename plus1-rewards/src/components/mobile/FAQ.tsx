// plus1-rewards/src/components/mobile/FAQ.tsx
export default function FAQ() {
  return (
    <section className="px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked</h2>
      <div className="space-y-4">
        <details className="group bg-primary/5 rounded-xl border border-primary/10 p-4">
          <summary className="flex items-center justify-between font-semibold list-none cursor-pointer">
            <span>How many points do I need?</span>
            <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">Most plans activate after spending approximately R1,500 per month at participating stores, though this varies by plan level.</p>
        </details>
        <details className="group bg-primary/5 rounded-xl border border-primary/10 p-4">
          <summary className="flex items-center justify-between font-semibold list-none cursor-pointer">
            <span>Where can I use my card?</span>
            <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">Look for the +1 Rewards sticker in shop windows or check the &ldquo;Partners&rdquo; tab in the app for a full map of local providers.</p>
        </details>
        <details className="group bg-primary/5 rounded-xl border border-primary/10 p-4">
          <summary className="flex items-center justify-between font-semibold list-none cursor-pointer">
            <span>Is my family covered?</span>
            <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">Yes! You can choose family plans that cover your spouse and up to three children by pooling your shopping rewards.</p>
        </details>
      </div>
    </section>
  );
}
