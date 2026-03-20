// plus1-rewards/src/components/mobile/TrustBadge.tsx
const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.10)'

export default function TrustBadge() {
  return (
    <section className="px-4 py-8" style={{ backgroundColor: '#f5f8fc' }}>
      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
        {/* Header banner */}
        <div className="h-28 flex items-center justify-center" style={{ backgroundColor: BLUE_LIGHT }}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl" style={{ color: BLUE }}>medical_services</span>
            <div className="h-8 w-px" style={{ backgroundColor: 'rgba(26,85,139,0.3)' }} />
            <span className="text-xl font-black italic uppercase tracking-tighter" style={{ color: BLUE }}>Day1 Health</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Trusted Insurance Partner</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            All rewards are backed by Day1 Health, providing you with access to private doctors, dentists, and emergency services across the country.
          </p>
          <ul className="space-y-2">
            {[
              'Unlimited GP Consultations',
              'Chronic Medication Support',
              '24/7 Emergency Assistance',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="material-symbols-outlined text-lg" style={{ color: BLUE }}>check_circle</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
