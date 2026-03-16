// plus1-rewards/src/components/landing/FAQ.tsx
export default function FAQ() {
  return (
    <section className="py-24 px-6 lg:px-20 bg-background-light dark:bg-[#0a160e]" id="faq">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-background-dark/50 border border-primary/10 rounded-xl p-6">
            <h4 className="text-white font-bold mb-2">How do I start earning?</h4>
            <p className="text-slate-400">Simply sign up as a member, get your unique QR code, and show it to the cashier whenever you buy at a partner store.</p>
          </div>
          <div className="bg-background-dark/50 border border-primary/10 rounded-xl p-6">
            <h4 className="text-white font-bold mb-2">Is the medical cover comprehensive?</h4>
            <p className="text-slate-400">Yes! The Day1 Health plan includes GP visits, medication, basic dentistry, and emergency services.</p>
          </div>
          <div className="bg-background-dark/50 border border-primary/10 rounded-xl p-6">
            <h4 className="text-white font-bold mb-2">What happens if I don&apos;t reach R385 this month?</h4>
            <p className="text-slate-400">Your rewards balance rolls over to the next month. You&apos;ll never lose your progress towards coverage.</p>
          </div>
        </div>
      </div>
    </section>
  )
}