// plus1-rewards/src/components/landing/Roles.tsx
const BLUE = '#1a558b'
const BLUE_LIGHT = 'rgba(26,85,139,0.08)'
const BLUE_BORDER = 'rgba(26,85,139,0.35)'
const BLUE_ICON_BG = 'rgba(26,85,139,0.12)'

export default function Roles() {
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const roles = [
    {
      icon: 'group',
      title: 'Members',
      desc: 'Earn comprehensive healthcare coverage simply by doing your everyday shopping at local partner stores.',
      features: ['R0 joining fee', 'Secure your family'],
      loginPath: '/member/login',
      registerPath: '/member/register',
      highlight: true,
    },
    {
      icon: 'storefront',
      title: 'Shop Owners',
      desc: 'Build intense customer loyalty and attract new shoppers by offering a life-changing rewards program.',
      features: ['Increase foot traffic', 'Better customer retention'],
      loginPath: '/partner/login',
      registerPath: '/partner/register',
      highlight: false,
    },
  ]

  return (
    <section className="py-24 px-6 lg:px-20" style={{ backgroundColor: '#ffffff' }} id="roles">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
          <div className="max-w-xl">
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
              style={{ backgroundColor: BLUE_ICON_BG, color: BLUE }}
            >
              For Everyone
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">A Solution for Everyone</h2>
            <p className="text-gray-500">+1 Rewards benefits members, retailers, and dedicated agents alike.</p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {roles.map((role, i) => (
            <div
              key={i}
              className="border rounded-2xl p-7 flex flex-col transition-all duration-200 group hover:shadow-lg"
              style={{
                backgroundColor: role.highlight ? BLUE_LIGHT : '#fff',
                borderColor: role.highlight ? BLUE_BORDER : '#e5e7eb',
              }}
            >
              <div
                className="size-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ backgroundColor: BLUE_ICON_BG, color: BLUE }}
              >
                <span className="material-symbols-outlined text-3xl">{role.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{role.title}</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">{role.desc}</p>
              <ul className="space-y-2 mb-6">
                {role.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="material-symbols-outlined text-sm" style={{ color: BLUE }}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleNavigation(role.loginPath)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: BLUE }}
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation(role.registerPath)}
                  className="flex-1 py-2.5 border rounded-xl font-bold text-sm transition-all hover:bg-blue-50"
                  style={{ borderColor: BLUE, color: BLUE }}
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}