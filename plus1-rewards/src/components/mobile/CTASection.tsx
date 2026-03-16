// plus1-rewards/src/components/mobile/CTASection.tsx
export default function CTASection() {
  return (
    <section className="px-4 py-12 mb-20 text-center">
      <h3 className="text-2xl font-bold mb-4">Ready to start earning?</h3>
      <p className="text-slate-400 mb-8">Join thousands of people getting health cover through their daily shop.</p>
      <div className="flex flex-col gap-4">
        <button className="bg-primary text-background-dark py-4 px-8 rounded-xl font-bold text-lg shadow-xl shadow-primary/20">Download for Android</button>
        <button className="bg-background-dark border border-primary text-primary py-4 px-8 rounded-xl font-bold text-lg">Register a Shop</button>
      </div>
    </section>
  );
}
