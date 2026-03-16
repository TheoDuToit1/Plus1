// plus1-rewards/src/components/mobile/TrustBadge.tsx
export default function TrustBadge() {
  return (
    <section className="px-4 py-8">
      <div className="bg-background-dark border border-primary/20 rounded-2xl overflow-hidden">
        <div className="h-32 bg-primary/10 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-4xl">medical_services</span>
            <div className="h-8 w-px bg-primary/30"></div>
            <span className="text-xl font-black text-primary italic uppercase tracking-tighter">Day1 Health</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Trusted Insurance Partner</h2>
          <p className="text-slate-400 text-sm">All rewards are backed by Day1 Health, providing you with access to private doctors, dentists, and emergency services across the country.</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-slate-200">
              <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
              Unlimited GP Consultations
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-200">
              <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
              Chronic Medication Support
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-200">
              <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
              24/7 Emergency Assistance
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
