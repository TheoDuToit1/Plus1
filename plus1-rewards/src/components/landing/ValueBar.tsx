// plus1-rewards/src/components/landing/ValueBar.tsx
export default function ValueBar() {
  return (
    <section className="bg-primary/5 border-y border-primary/10 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center gap-4 group">
          <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">payments</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Upfront Costs</h3>
            <p className="text-slate-400 text-sm">Join for R0 today</p>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">signal_wifi_off</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Works Offline</h3>
            <p className="text-slate-400 text-sm">No data? No problem</p>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">verified_user</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Day1 Health Partner</h3>
            <p className="text-slate-400 text-sm">Trusted insurance coverage</p>
          </div>
        </div>
      </div>
    </section>
  )
}