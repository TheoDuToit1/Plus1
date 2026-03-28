// plus1-rewards/src/components/landing/CoverStatus.tsx
export default function CoverStatus() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Control Your Cover Status
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Shop where it counts. Protect your family's health.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Active Status */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-center mb-6">
              <div className="size-20 rounded-full bg-green-100 flex items-center justify-center">
                <div className="size-12 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-3xl">🟢</span>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 text-center mb-3">
              Active
            </h3>
            <p className="text-center text-gray-600 text-lg leading-relaxed">
              Your cover is paid
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                Keep shopping where it counts to keep your cover active.
              </p>
            </div>
          </div>

          {/* Suspended Status */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-red-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-center mb-6">
              <div className="size-20 rounded-full bg-red-100 flex items-center justify-center">
                <div className="size-12 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-3xl">🔴</span>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 text-center mb-3">
              Suspended
            </h3>
            <p className="text-center text-gray-600 text-lg leading-relaxed">
              Not there yet
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                Keep shopping where it counts to get your cover active again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
