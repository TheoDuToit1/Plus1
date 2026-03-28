// plus1-rewards/src/components/landing/OfflineFeature.tsx
const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.10)'

export default function OfflineFeature() {
  return (
    <section className="py-24 px-6 lg:px-20 relative overflow-hidden" style={{ backgroundColor: '#ffffff' }} id="features">
      <div className="max-w-[1800px] mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* Image */}
        <div className="relative order-2 md:order-1">
          <div
            className="absolute -inset-6 rounded-3xl blur-[60px] opacity-15"
            style={{ backgroundColor: BLUE }}
          />
          <img
            alt="Customer scanning QR code in a local shop"
            className="rounded-3xl shadow-xl relative z-10 border w-full object-cover"
            style={{ borderColor: '#e5e7eb' }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrChp-rJw6gwciGLXkYyh6v8Sf0Pbu42DOiuN12h8xMQtitpDrR2WE68lVzoAwCjuvqsUf4ghwaRh3yCAFlJLn-9H5MM-I-mXllz59_xWXA74wV3UpnoT0mK-ST-F-4o0mVUcmvx6tV1aY8BwMfKw_DwOd9Fn5xJ0kzM99Q4pYZQ2zDzYXGNHL2xoDZJdZsw72j8f5S96nZUYAmgFB0AfrKpN5QkacJcNvO_LUiptUqTLUttbTqYi9E8WQ7_vYHdiWWE1FqwmMjtcB"
          />
          <div
            className="absolute -bottom-5 -right-5 text-white p-5 rounded-2xl shadow-xl z-20 max-w-[180px]"
            style={{ backgroundColor: BLUE }}
          >
            <span className="material-symbols-outlined text-white text-3xl mb-1">offline_pin</span>
            <p className="font-black text-sm leading-tight text-white">Works 100% Offline</p>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-7 order-1 md:order-2">
          <span
            className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ backgroundColor: BLUE_LIGHT, color: BLUE }}
          >
            Built for Africa
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">No data?<br />No problem.</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            +1 Rewards is made for real South African conditions. Even when data is finished or signal is weak, you can still open the app, access your code, and use it at checkout. When your phone reconnects, your information updates in the background.
          </p>
          <div className="space-y-4">
            {[
              {
                title: 'Works without data',
                desc: 'Access your code and use it at checkout',
              },
              {
                title: 'Updates when signal returns',
                desc: 'Your information comes through when you reconnect',
              },
              {
                title: 'Built for real life',
                desc: 'Made for everyday South African shopping',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="size-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: BLUE_LIGHT }}
                >
                  <span className="material-symbols-outlined text-sm" style={{ color: BLUE }}>check</span>
                </div>
                <div>
                  <p className="text-gray-900 font-bold">{item.title}</p>
                  <p className="text-gray-600 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}