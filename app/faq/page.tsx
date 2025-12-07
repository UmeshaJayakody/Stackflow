'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Home, Search, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs: FAQItem[] = [
    {
      category: 'Getting Started',
      question: 'How do I add a new product to the inventory?',
      answer: 'Navigate to the Products page and click the "Add Product" button. Fill in the required fields including product name, SKU, prices, and quantity levels. Select a warehouse and supplier, then click Save. The product will be immediately available in your inventory.',
    },
    {
      category: 'Getting Started',
      question: 'How do I create my first sale?',
      answer: 'Go to the Sales page and click "Add Sale". Select the customer and product from the dropdown menus, enter the quantity and selling price, then click Save. The system will automatically calculate COGS using FIFO methodology and update inventory levels.',
    },
    {
      category: 'Inventory Management',
      question: 'How does FIFO inventory valuation work?',
      answer: 'FIFO (First-In-First-Out) means that when you sell a product, the system automatically uses the cost from the oldest stock batch first. This ensures accurate profit calculations by matching sales revenue with the actual cost of the goods sold from the earliest purchase.',
    },
    {
      category: 'Inventory Management',
      question: 'How do I track stock across multiple warehouses?',
      answer: 'Each product can be assigned to a specific warehouse. When viewing the Products page, you can filter by warehouse to see stock levels for each location. The system tracks inventory separately for each warehouse and provides real-time stock counts.',
    },
    {
      category: 'Inventory Management',
      question: 'What happens when stock falls below minimum quantity?',
      answer: 'When a product\'s quantity drops below the minimum threshold you\'ve set, it will appear in the "Low Stock" filter on the Products page and in the dashboard alerts. This helps you identify items that need to be reordered.',
    },
    {
      category: 'Reports',
      question: 'How do I generate a profit and loss report?',
      answer: 'Navigate to the Reports page and select "Profit & Loss Report". Choose your desired date range (7, 30, or 90 days) and click Generate Report. The report will show total revenue, COGS, gross profit, and profit margin calculations.',
    },
    {
      category: 'Reports',
      question: 'Can I export reports to Excel?',
      answer: 'Yes! All reports have an "Export to Excel" button at the top right. Click it to download a formatted Excel file with all the report data, which you can then use for further analysis or presentations.',
    },
    {
      category: 'Reports',
      question: 'How are sales trends calculated?',
      answer: 'Sales trends analyze your transaction history over time. The system aggregates daily, weekly, or monthly sales data and displays it in charts showing revenue patterns, top-selling products, and customer purchase behavior.',
    },
    {
      category: 'User Management',
      question: 'How do I add a new user to the system?',
      answer: 'Only administrators can add users. Go to the Users page, click "Add User", enter their name, email, and password, then select their role (USER or ADMIN). Users will receive login credentials and can access the system based on their role permissions.',
    },
    {
      category: 'User Management',
      question: 'What\'s the difference between USER and ADMIN roles?',
      answer: 'ADMIN users have full access to all features including user management, system settings, and sensitive data. USER role has access to daily operations like products, sales, purchases, and reports, but cannot manage users or change system configurations.',
    },
    {
      category: 'User Management',
      question: 'How do I reset a forgotten password?',
      answer: 'On the login page, click "Forgot Password" and enter your email address. You\'ll receive a password reset link via email. Click the link, enter your new password, and you\'ll be able to login with the new credentials.',
    },
    {
      category: 'Purchases & Suppliers',
      question: 'How do I record a purchase from a supplier?',
      answer: 'Navigate to Purchases page, click "Add Purchase", select the supplier and product, enter quantity and unit price. The system will create a stock batch for FIFO tracking and automatically increase your inventory levels.',
    },
    {
      category: 'Purchases & Suppliers',
      question: 'Can I track multiple suppliers for the same product?',
      answer: 'Yes! Each product can be associated with multiple suppliers. When recording a purchase, you select which supplier you\'re buying from. This allows you to track supplier performance and compare pricing across vendors.',
    },
    {
      category: 'Technical',
      question: 'How do I backup my data?',
      answer: 'The database runs in a Docker container with persistent storage. To backup, you can export data using the report features or use PostgreSQL backup tools. For complete backups, use the Docker volume backup or run `pg_dump` on the database container.',
    },
    {
      category: 'Technical',
      question: 'Can I integrate with other systems via API?',
      answer: 'Yes! The application provides a comprehensive RESTful API. All endpoints are documented in the Documentation page. You can use these APIs to integrate with external systems, mobile apps, or automation tools.',
    },
    {
      category: 'Technical',
      question: 'Is there a mobile app available?',
      answer: 'The web application is fully responsive and works on mobile browsers. While there\'s no native mobile app currently, the responsive design provides an excellent mobile experience for managing inventory on the go.',
    },
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="text-gray-600 mt-1">Find answers to common questions about StackFlow</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSearchTerm(category)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-900 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No FAQs found matching your search.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-sm text-gray-900 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">{faq.question}</h3>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-900 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h2>
          <p className="text-gray-600 mb-4">Can't find the answer you're looking for? Please reach out to our support team.</p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
