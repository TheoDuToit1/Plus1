import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: March 22, 2026</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p>
                Plus1 Rewards ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name</li>
                <li>Mobile phone number</li>
                <li>ID number (for cover plan verification)</li>
                <li>Email address (optional)</li>
                <li>6-digit PIN (encrypted)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Transaction Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Purchase amounts and dates</li>
                <li>Partner store information</li>
                <li>Cashback amounts and allocations</li>
                <li>Cover plan funding history</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Technical Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device information</li>
                <li>IP address</li>
                <li>Browser type</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To create and manage your member account</li>
                <li>To process transactions and allocate cashback rewards</li>
                <li>To manage your cover plan funding and status</li>
                <li>To communicate with you about your account and transactions</li>
                <li>To verify your identity and prevent fraud</li>
                <li>To improve our Service and user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Information Sharing</h2>
              <p className="mb-3">We may share your information with:</p>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Healthcare Providers</h3>
              <p>
                We share necessary information with approved healthcare providers to activate and maintain your 
                cover plans. This includes your name, ID number, and cover plan details.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Partner Stores</h3>
              <p>
                Limited transaction information is shared with partner stores to process cashback rewards.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Agents</h3>
              <p>
                Your assigned agent may access your account information to provide support and assistance.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Legal Requirements</h3>
              <p>
                We may disclose your information when required by law or to protect our rights and safety.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Security</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All data is encrypted in transit and at rest</li>
                <li>PINs are hashed and never stored in plain text</li>
                <li>Access to personal information is restricted to authorized personnel only</li>
                <li>Regular security audits and monitoring</li>
                <li>Secure database with row-level security policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Object to processing of your information</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with the Information Regulator</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide 
                services. After account closure, we may retain certain information for legal, regulatory, or 
                legitimate business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Children's Privacy</h2>
              <p>
                Our Service is not intended for individuals under 18 years of age. We do not knowingly collect 
                personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. POPIA Compliance</h2>
              <p>
                We comply with the Protection of Personal Information Act (POPIA) and process your information 
                lawfully, fairly, and transparently. We implement appropriate technical and organizational measures 
                to ensure data security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes 
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
              <p>
                For questions about this Privacy Policy or to exercise your rights, please contact:
                <br />
                <br />
                <strong>Information Officer</strong>
                <br />
                Plus1 Rewards
                <br />
                Email: privacy@plus1rewards.co.za
                <br />
                Phone: 0800 PLUS1 (75871)
                <br />
                <br />
                <strong>Information Regulator</strong>
                <br />
                If you are not satisfied with our response, you may lodge a complaint with:
                <br />
                The Information Regulator (South Africa)
                <br />
                Website: www.inforegulator.org.za
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
