// plus1-rewards/src/components/landing/Footer.tsx
const BLUE = '#1a558b'

export default function Footer() {
  return (
    <footer className="border-t py-16 px-6 lg:px-20" style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-3xl" style={{ color: BLUE }}>add_circle</span>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">+1Rewards</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed">
              Bridging the gap between daily commerce and universal healthcare access for all South Africans.
            </p>
            <div className="flex gap-3">
              <a
                className="size-10 rounded-full border flex items-center justify-center text-gray-500 transition-all hover:border-blue-700"
                style={{ borderColor: '#e5e7eb' }}
                href="#"
                aria-label="Social"
                onMouseEnter={e => (e.currentTarget.style.color = BLUE)}
                onMouseLeave={e => (e.currentTarget.style.color = '')}
              >
                <span className="material-symbols-outlined text-lg">social_leaderboard</span>
              </a>
              <a
                className="size-10 rounded-full border flex items-center justify-center text-gray-500 transition-all hover:border-blue-700"
                style={{ borderColor: '#e5e7eb' }}
                href="#"
                aria-label="Share"
                onMouseEnter={e => (e.currentTarget.style.color = BLUE)}
                onMouseLeave={e => (e.currentTarget.style.color = '')}
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-bold mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a className="hover:text-blue-800 transition-colors" href="#how-it-works">How it Works</a></li>
              <li><a className="hover:text-blue-800 transition-colors" href="#roles">Partner Stores</a></li>
              <li><a className="hover:text-blue-800 transition-colors" href="/agent/register">Become an Agent</a></li>
              <li><a className="hover:text-blue-800 transition-colors" href="#faq">Day1 Health Details</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-gray-900 font-bold mb-5">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a className="hover:text-blue-800 transition-colors" href="/legal/popia">Privacy Policy</a></li>
              <li><a className="hover:text-blue-800 transition-colors" href="/legal/member-terms">Terms of Service</a></li>
              <li><a className="hover:text-blue-800 transition-colors" href="#">Insurance Disclosure</a></li>
              <li><a className="hover:text-blue-800 transition-colors" href="#faq">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400" style={{ borderColor: '#e5e7eb' }}>
          <p>&copy; {new Date().getFullYear()} +1 Rewards (Pty) Ltd. All rights reserved.</p>
          <p>Healthcare policies underwritten by Day1 Health (Pty) Ltd — FSP Licensed</p>
        </div>
      </div>
    </footer>
  )
}