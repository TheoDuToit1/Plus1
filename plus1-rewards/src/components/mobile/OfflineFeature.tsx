// plus1-rewards/src/components/mobile/OfflineFeature.tsx
export default function OfflineFeature() {
  return (
    <section className="px-4 py-12">
      <div className="bg-primary rounded-3xl p-8 flex flex-col gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-background-dark">
            <span className="material-symbols-outlined">signal_cellular_connected_no_internet_4_bar</span>
            <span className="font-bold text-sm uppercase tracking-widest">Smart Tech</span>
          </div>
          <h2 className="text-3xl font-black text-background-dark leading-none">Works Without Data</h2>
        </div>
        <p className="text-background-dark/80 text-lg leading-snug">Our unique offline QR technology allows you to earn points even when you have no data or internet connection.</p>
        <div className="bg-background-dark/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-background-dark rounded-xl p-3">
            <span className="material-symbols-outlined text-primary text-4xl">qr_code_2</span>
          </div>
          <p className="text-background-dark text-sm font-medium">Just present your card or app, scan, and you&apos;re done.</p>
        </div>
      </div>
    </section>
  );
}
