'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Home, MessageSquare } from 'lucide-react';
import LoadingDots from '../../components/LoadingDots';
import { useToast } from '../../context/ToastContext';

export default function SupportPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        toast.success('Message sent successfully');
      } else {
        toast.error('Failed to send message: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending support message:', error);
      toast.error('An error occurred while sending your message');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 sm:pt-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Support</h1>
            <p className="text-gray-600 mt-1">Get help from our support team</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 hover:bg-blue-50/70 transition-colors">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-sm text-gray-600">stackflow.team@gmail.com</p>
                    <p className="text-xs text-blue-500 mt-1">Response within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 hover:bg-green-50/70 transition-colors">
                  <Phone className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-sm text-gray-600">+94 77 123 4567</p>
                    <p className="text-xs text-green-500 mt-1">Mon-Fri, 9am-5pm PST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50/50 hover:bg-purple-50/70 transition-colors">
                  <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Office</h3>
                    <p className="text-sm text-gray-600">Wakanda Road, Homagama.</p>
                    <p className="text-xs text-purple-500 mt-1">Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-indigo-600" />
                Quick Help
              </h2>
              <div className="space-y-3">
                <Link
                  href="/documentation"
                  className="block p-4 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 hover:from-indigo-100/70 hover:to-blue-100/70 rounded-lg transition-all duration-300 border border-indigo-200/30 hover:border-indigo-300/50 hover:shadow-md group"
                >
                  <h3 className="font-medium text-gray-900 text-sm group-hover:text-indigo-700 transition-colors">Documentation</h3>
                  <p className="text-xs text-gray-600 mt-1 group-hover:text-indigo-600 transition-colors">Browse our complete guides</p>
                </Link>
                <Link
                  href="/faq"
                  className="block p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 hover:from-emerald-100/70 hover:to-teal-100/70 rounded-lg transition-all duration-300 border border-emerald-200/30 hover:border-emerald-300/50 hover:shadow-md group"
                >
                  <h3 className="font-medium text-gray-900 text-sm group-hover:text-emerald-700 transition-colors">FAQ</h3>
                  <p className="text-xs text-gray-600 mt-1 group-hover:text-emerald-600 transition-colors">Frequently asked questions</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400/80 to-emerald-500/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2">Message Sent!</h2>
                  <p className="text-gray-600 mb-6">We've received your message and will get back to you shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">Send us a message</h2>
                  <p className="text-gray-600 mb-6">Fill out the form below and we'll respond as soon as possible.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/80 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/90 transition-all duration-300 placeholder-gray-400"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/80 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/90 transition-all duration-300 placeholder-gray-400"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/80 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/90 transition-all duration-300 placeholder-gray-400"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-white/80 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/90 transition-all duration-300 resize-none placeholder-gray-400"
                        placeholder="Please describe your question or issue in detail..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {loading ? (
                          <LoadingDots />
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
