'use client';

import Link from 'next/link';
import { Cookie } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 sm:pt-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl shadow-lg">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Cookie Policy
              </h1>
            </div>
            <p className="text-gray-600 text-sm">How we use cookies and tracking technologies</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-500 mb-8">Last updated: December 7, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and understanding how you use our service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This Cookie Policy explains how StackFlow uses cookies and similar technologies to enhance your experience with our inventory management system.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Essential Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>User authentication and session management</li>
                <li>Security features and fraud prevention</li>
                <li>Remembering your login status</li>
                <li>Maintaining your shopping cart or form data</li>
              </ul>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800"><strong>Note:</strong> These cookies cannot be disabled as they are essential for the service to work.</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Functional Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These cookies enhance your experience by remembering your preferences and settings:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Language preferences</li>
                <li>Display settings and themes</li>
                <li>Custom dashboard layouts</li>
                <li>Report format preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Analytics Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use analytics cookies to understand how users interact with our service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Pages visited and time spent</li>
                <li>Features used most frequently</li>
                <li>User journey patterns</li>
                <li>Performance metrics and error tracking</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Marketing Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These cookies help us deliver relevant advertisements and measure campaign effectiveness:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Tracking ad performance</li>
                <li>Retargeting based on interests</li>
                <li>Social media integration</li>
                <li>Conversion tracking</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Third-Party Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may use third-party services that place their own cookies. These include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Google Analytics:</strong> For website analytics and user behavior insights</li>
                <li><strong>Stripe/Payment Processors:</strong> For secure payment processing</li>
                <li><strong>Customer Support Tools:</strong> For live chat and support ticket management</li>
                <li><strong>Content Delivery Networks:</strong> For faster content loading</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                These third parties have their own privacy policies and cookie practices, which we encourage you to review.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookie Management</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Browser Settings</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>View what cookies are stored</li>
                <li>Delete existing cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Block all cookies</li>
                <li>Clear cookies when you close the browser</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Our Cookie Preferences</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can manage your cookie preferences directly through our service. Non-essential cookies will only be placed with your consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Impact of Disabling Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Please note that disabling certain cookies may affect your experience with StackFlow:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Essential cookies:</strong> Disabling these will prevent the service from functioning properly</li>
                <li><strong>Functional cookies:</strong> You may need to reconfigure preferences on each visit</li>
                <li><strong>Analytics cookies:</strong> We won&apos;t be able to improve the service based on usage data</li>
                <li><strong>Marketing cookies:</strong> You may see less relevant advertisements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Storage and Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies typically expire after a set period, but the exact duration depends on the cookie type:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent cookies:</strong> Remain until deleted or expired (typically 30 days to 2 years)</li>
                <li><strong>Authentication cookies:</strong> Usually expire after a period of inactivity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Updates to This Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any material changes and update the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under applicable privacy laws, you have rights regarding your personal data collected through cookies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Right to access information about data collection</li>
                <li>Right to withdraw consent for non-essential cookies</li>
                <li>Right to request deletion of personal data</li>
                <li>Right to object to certain data processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about our use of cookies or this policy, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> privacy@stackflow.com</p>
                <p className="text-gray-700"><strong>Address:</strong> Wakanda Road, Homagama, Sri Lanka</p>
                <p className="text-gray-700"><strong>Phone:</strong> +94 77 123 4567</p>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                For more information about our general privacy practices, please see our <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cookie List</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Here&apos;s a detailed list of cookies we use:
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 text-sm text-gray-900">stackflow_session</td>
                      <td className="px-4 py-2 text-sm text-gray-600">User authentication</td>
                      <td className="px-4 py-2 text-sm text-gray-600">24 hours</td>
                      <td className="px-4 py-2 text-sm text-green-600">Essential</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm text-gray-900">stackflow_prefs</td>
                      <td className="px-4 py-2 text-sm text-gray-600">User preferences</td>
                      <td className="px-4 py-2 text-sm text-gray-600">30 days</td>
                      <td className="px-4 py-2 text-sm text-blue-600">Functional</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm text-gray-900">_ga</td>
                      <td className="px-4 py-2 text-sm text-gray-600">Google Analytics</td>
                      <td className="px-4 py-2 text-sm text-gray-600">2 years</td>
                      <td className="px-4 py-2 text-sm text-purple-600">Analytics</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm text-gray-900">stackflow_theme</td>
                      <td className="px-4 py-2 text-sm text-gray-600">Theme preference</td>
                      <td className="px-4 py-2 text-sm text-gray-600">1 year</td>
                      <td className="px-4 py-2 text-sm text-blue-600">Functional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}