// plus1-rewards/src/components/mobile/OfflineFeature.tsx
const BLUE = '#1a558b'
const BLUE_DARK = '#154a7a'

export default function OfflineFeature() {
  return (
    <section className="px-4 py-12" style={{ backgroundColor: '#ffffff' }}>
      <div className="rounded-3xl p-8 flex flex-col gap-6 text-white" style={{ backgroundColor: BLUE }}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-200">
            <span className="material-symbols-outlined">signal_cellular_connected_no_internet_4_bar</span>
            <span className="font-bold text-sm uppercase tracking-widest">Smart Tech</span>
          </div>
          <h2 className="text-3xl font-black text-white leading-none">Works Without Data</h2>
        </div>
        <p className="text-blue-100 text-lg leading-snug">
          Our unique offline QR technology allows you to earn points even when you have no data or internet connection.
        </p>
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <div className="rounded-xl p-3" style={{ backgroundColor: BLUE_DARK }}>
            <span className="material-symbols-outlined text-white text-4xl">qr_code_2</span>
          </div>
          <p className="text-white text-sm font-medium">Just present your card or app, scan, and you&apos;re done.</p>
        </div>
      </div>
    </section>
  );
}
