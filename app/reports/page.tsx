'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ReportsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Redirect if not admin
    if (user && !isAdmin) {
      router.push('/');
      return;
    }
  }, [user, isAdmin, router]);

  const downloadReport = async (reportType: string, fileName: string) => {
    try {
      const response = await fetch(`/api/reports/${reportType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data = await response.json();

      if (data.length === 0) {
        alert(`No ${reportType} data available to export`);
        return;
      }

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, reportType.charAt(0).toUpperCase() + reportType.slice(1));

      // Generate Excel file and download
      XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  const reports = [
    {
      title: 'Products Report',
      description: 'Export all products with details including SKU, pricing, quantity, and warehouse',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'green',
      reportType: 'products',
      fileName: 'products_report',
    },
    {
      title: 'Purchases Report',
      description: 'Export all purchase records with supplier details, quantities, and costs',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'purple',
      reportType: 'purchases',
      fileName: 'purchases_report',
    },
    {
      title: 'Sales Report',
      description: 'Export all sales records with customer details, revenue, and profit/loss',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'orange',
      reportType: 'sales',
      fileName: 'sales_report',
    },
    {
      title: 'Users Report',
      description: 'Export all user accounts with roles and account creation dates',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'blue',
      reportType: 'users',
      fileName: 'users_report',
    },
    {
      title: 'Customers Report',
      description: 'Export all customer information including contact details',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'teal',
      reportType: 'customers',
      fileName: 'customers_report',
    },
    {
      title: 'Suppliers Report',
      description: 'Export all supplier information including contact details',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'indigo',
      reportType: 'suppliers',
      fileName: 'suppliers_report',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; hover: string } } = {
      green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-50' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-50' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-50' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-50' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', hover: 'hover:bg-teal-50' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hover: 'hover:bg-indigo-50' },
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Reports</h1>
              <p className="text-gray-600 mt-1">Download Excel reports for all system data</p>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const colorClasses = getColorClasses(report.color);
            return (
              <div
                key={report.reportType}
                className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center mb-4">
                  <div className={`${colorClasses.bg} rounded-xl p-3 mr-4 ${colorClasses.text} shadow-lg`}>
                    {report.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{report.title}</h2>
                </div>
                <p className="text-gray-600 mb-6 text-sm">{report.description}</p>
                <button
                  onClick={() => downloadReport(report.reportType, report.fileName)}
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Excel
                </button>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50/60 backdrop-blur-md border border-blue-200/50 rounded-2xl shadow-xl p-6">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-blue-600 mr-3 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-blue-900 font-semibold mb-2">About Reports</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Reports are generated in Excel (.xlsx) format</li>
                <li>• File names include the current date for easy identification</li>
                <li>• All data is exported with complete details and formatting</li>
                <li>• Reports are available to admin users only</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
