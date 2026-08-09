'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isAdmin } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white mt-16 border-t border-gray-200">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
      
      <div className="relative container mx-auto px-6 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section with Navbar Logo */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 group cursor-pointer">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <Image 
                  src="/StackFlow.svg" 
                  alt="StackFlow Logo" 
                  width={48}
                  height={48}
                  className="relative z-10"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-800 group-hover:to-gray-600 transition-all duration-300">StackFlow</h3>
                <p className="text-xs text-gray-500">Inventory Management System</p>
              </div>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Professional inventory management system for modern businesses. Track, manage, and optimize your stock efficiently with real-time analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/sales" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Sales
                </Link>
              </li>
              <li>
                <Link href="/purchases" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Purchases
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link href="/reports" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Reports
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Resources</h4>
            <ul className="space-y-2">
              {isAdmin && (
                <li>
                  <Link href="/logs" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Activity Logs
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link href="/documentation" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Documentation
                  </Link>
                </li>
              )}
              <li>
                <Link href="/support" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600 text-sm">
                <Mail className="w-4 h-4" />
                <span>stackflow.team@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Wakanda Road, Homagama.</span>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 rounded-lg transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-700 rounded-lg transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-100 hover:bg-blue-700 hover:text-white text-gray-700 rounded-lg transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-100 hover:bg-gray-700 hover:text-white text-gray-700 rounded-lg transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} StackFlow. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-600 hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
