'use client';

import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 sm:pt-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
            </div>
            <p className="text-gray-600 text-sm">How we protect and handle your data</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-500 mb-8">Last updated: December 7, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                StackFlow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our inventory management system.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using StackFlow, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect personally identifiable information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Account credentials (username, password)</li>
                <li>Business information and preferences</li>
                <li>Communication history with our support team</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Usage Data</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We automatically collect certain information when you use our service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>IP address and location information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our platform</li>
                <li>Device information and operating system</li>
                <li>Activity logs and usage patterns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We use the collected information for:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Providing and maintaining our inventory management service</li>
                <li>Processing transactions and managing your account</li>
                <li>Communicating with you about updates and support</li>
                <li>Analyzing usage patterns to improve our service</li>
                <li>Ensuring security and preventing fraudulent activities</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure database infrastructure</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict certain processing activities</li>
                <li>Data portability</li>
                <li>Withdraw consent where applicable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience. For detailed information about our cookie practices, please refer to our <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-700 underline">Cookie Policy</Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information only as long as necessary for the purposes outlined in this policy, unless a longer retention period is required by law. When we no longer need your information, we securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> privacy@stackflow.com</p>
                <p className="text-gray-700"><strong>Address:</strong> Wakanda Road, Homagama, Sri Lanka</p>
                <p className="text-gray-700"><strong>Phone:</strong> +94 77 123 4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}