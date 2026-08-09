'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 sm:pt-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Terms of Service
              </h1>
            </div>
            <p className="text-gray-600 text-sm">Legal terms and conditions for using StackFlow</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-500 mb-8">Last updated: December 7, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using StackFlow (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service (&quot;Terms&quot;) apply to all users of the StackFlow inventory management system.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                StackFlow is a comprehensive inventory management system that provides:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Product and inventory tracking</li>
                <li>Sales and purchase management</li>
                <li>Reporting and analytics</li>
                <li>User management and access control</li>
                <li>Data storage and backup services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use StackFlow, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Account Responsibilities</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Use the Service for any fraudulent or illegal purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Ownership and Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You retain ownership of all data you input into StackFlow. We respect your privacy and handle your data in accordance with our <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</Link>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for ensuring you have the right to use and store any data you upload to our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Service Availability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                While we strive to provide continuous service, we do not guarantee that StackFlow will be available at all times. We may perform maintenance, updates, or experience technical issues that temporarily interrupt service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We will make reasonable efforts to minimize service interruptions and notify users of scheduled maintenance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Fees and Payment</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                StackFlow may offer both free and paid plans. Fees for paid services are clearly displayed and must be paid in advance. We reserve the right to change pricing with 30 days notice.
              </p>
              <p className="text-gray-700 leading-relaxed">
                All fees are non-refundable except as required by law or as explicitly stated in our refund policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                StackFlow and its original content, features, and functionality are owned by us and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not reproduce, distribute, or create derivative works of our service without explicit permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                StackFlow is provided &quot;as is&quot; without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our total liability shall not exceed the amount paid by you for the service in the 12 months preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account immediately for violations of these Terms. Upon termination, your right to use the Service will cease immediately.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may terminate your account at any time by contacting our support team.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> legal@stackflow.com</p>
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