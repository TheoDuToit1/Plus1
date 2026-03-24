// plus1-rewards/src/components/mobile/CoverStatus.tsx
export default function CoverStatus() {
  return (
    <section className="py-12 px-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-md mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Your Cover Status is Always Clear
          </h2>
          <p className="text-sm text-gray-600">
            No confusion, no surprises. Know exactly where you stand.
          </p>
        </div>

        {/* Status Cards */}
        <div className="space-y-4">
          {/* Active Status */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="size-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-3xl">🟢</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Active
                </h3>
                <p className="text-sm text-gray-600">
                  You're fully covered
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Your cashback reached the target. Cover active for 30 days.
              </p>
            </div>
          </div>

          {/* In Progress Status */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-200">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="size-16 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-3xl">🟡</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  In Progress
                </h3>
                <p className="text-sm text-gray-600">
                  Cashback building up
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Keep shopping to reach your cover target!
              </p>
            </div>
          </div>

          {/* Suspended Status */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="size-16 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-3xl">🔴</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Suspended
                </h3>
                <p className="text-sm text-gray-600">
                  Not enough yet
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Shop more or top-up to reactivate your cover.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a558b]/10 px-6 py-3 rounded-full">
            <span className="text-xl">👉</span>
            <p className="text-sm font-bold text-[#1a558b]">
              Removes confusion + builds trust
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-[#1a558b] to-[#2d7ab8] rounded-xl p-6 text-white">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">info</span>
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold mb-2">Always in Control</h4>
                <p className="text-sm text-white/90 leading-relaxed">
                  Check your status anytime in your dashboard. Complete transparency, every step of the way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
