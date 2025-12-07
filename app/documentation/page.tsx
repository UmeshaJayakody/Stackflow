'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, FileText, Code, Settings, Home, Layers, Database, Play, Wrench, Zap, Shield, BarChart3, Users, Package, Star, CheckCircle, ChevronRight } from 'lucide-react';


interface Section {
  icon: any;
  title: string;
  href: string;
  category: 'overview' | 'features' | 'technical' | 'setup' | 'usage' | 'development';
  priority: number;
}

interface DataCard {
  title: string;
  items: string[];
  icon: any;
  color: string;
  bgColor: string;
}

interface TechStackItem {
  name: string;
  version: string;
  description: string;
  category: 'frontend' | 'backend' | 'devops';
}

interface QuickAccessCard {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  bgColor: string;
}

interface InstallationStep {
  step: number;
  title: string;
  description: string;
  command?: string;
  code?: string;
  language?: string;
}

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  request?: string;
  response?: string;
}

interface Prerequisite {
  name: string;
  version: string;
  description: string;
  required: boolean;
}

export default function DocumentationPage() {
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/documentation')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReadmeContent(data.content);
          console.log('README loaded, length:', data.content.length);
          console.log('First 200 chars:', data.content.substring(0, 200));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading README:', err);
        setLoading(false);
      });
  }, []);

  // Structured data for better organization
  const coreFeatures: DataCard = {
    title: 'Core Features',
    items: [
      'Product Management with SKU generation and categorization',
      'Purchase Management with automatic stock batch creation',
      'Sales Management with FIFO cost calculation',
      'Multi-Warehouse Support with real-time stock levels',
      'Stock Movement Tracking with complete audit trails',
      'Customer & Supplier Management with transaction history',
      'User Management with role-based access control',
      'Activity Logging for compliance and troubleshooting'
    ],
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200'
  };

  const technicalFeatures: DataCard = {
    title: 'Technical Features',
    items: [
      'FIFO Inventory Valuation for accurate cost calculation',
      'Real-time Stock Updates across all warehouses',
      'Data Validation for data integrity',
      'Responsive Design for mobile accessibility',
      'API-First Architecture for external integrations',
      'Database Transactions with ACID compliance',
      'Email Notifications for password resets',
      'Low Stock Alerts with automatic notifications'
    ],
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200'
  };

  const reportingFeatures: DataCard = {
    title: 'Reporting Features',
    items: [
      'Sales Reports with date range and customer filtering',
      'Purchase Reports with supplier analytics',
      'Profit & Loss Reports with financial analysis',
      'Product Reports with inventory valuation',
      'Supplier Reports with performance metrics',
      'Customer Reports with revenue analysis',
      'User Activity Reports for system usage tracking',
      'Daily Profit/Loss Charts with visual trends'
    ],
    icon: BarChart3,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200'
  };

  const techStackItems: TechStackItem[] = [
    { name: 'Next.js', version: '16.0.7', description: 'React framework with App Router', category: 'frontend' },
    { name: 'React', version: '19.2.0', description: 'Modern UI library with hooks', category: 'frontend' },
    { name: 'TypeScript', version: '5.x', description: 'Static type checking', category: 'frontend' },
    { name: 'Tailwind CSS', version: '3.4.1', description: 'Utility-first CSS framework', category: 'frontend' },
    { name: 'Prisma', version: '6.19.0', description: 'Next-generation ORM', category: 'backend' },
    { name: 'PostgreSQL', version: '16', description: 'Advanced relational database', category: 'backend' },
    { name: 'Docker', version: 'latest', description: 'Containerization platform', category: 'devops' },
    { name: 'Docker Compose', version: 'latest', description: 'Multi-container orchestration', category: 'devops' }
  ];

  // Prerequisites data
  const prerequisites: Prerequisite[] = [
    { name: 'Node.js', version: '18.x or higher', description: 'JavaScript runtime environment', required: true },
    { name: 'npm', version: '9.x or higher', description: 'Package manager for Node.js', required: true },
    { name: 'Docker', version: '20.x or higher', description: 'Containerization platform', required: true },
    { name: 'Docker Compose', version: '2.x or higher', description: 'Multi-container orchestration', required: true },
    { name: 'Git', version: '2.x or higher', description: 'Version control system', required: true }
  ];

  // Installation steps
  const installationSteps: InstallationStep[] = [
    {
      step: 1,
      title: 'Clone the Repository',
      description: 'Download the project source code from GitHub',
      command: 'git clone https://github.com/UmeshaJayakody/stackflow.git'
    },
    {
      step: 2,
      title: 'Install Dependencies',
      description: 'Install all required Node.js packages',
      command: 'npm install'
    },
    {
      step: 3,
      title: 'Start PostgreSQL Database',
      description: 'Launch the database using Docker Compose',
      command: 'docker-compose up -d'
    },
    {
      step: 4,
      title: 'Verify Database Connection',
      description: 'Ensure the PostgreSQL container is running',
      command: 'docker ps'
    },
    {
      step: 5,
      title: 'Run Database Migrations',
      description: 'Initialize the database schema',
      command: 'npx prisma migrate deploy'
    },
    {
      step: 6,
      title: 'Seed Database (Optional)',
      description: 'Populate with sample data',
      command: 'npx prisma db seed'
    },
    {
      step: 7,
      title: 'Start Development Server',
      description: 'Launch the application',
      command: 'npm run dev'
    }
  ];

  // API Endpoints
  const apiEndpoints: APIEndpoint[] = [
    {
      method: 'POST',
      path: '/api/auth/login',
      description: 'Authenticate a user',
      request: `{
  "email": "admin@example.com",
  "password": "admin123"
}`,
      response: `{
  "success": true,
  "data": {
    "userId": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}`
    },
    {
      method: 'GET',
      path: '/api/products',
      description: 'Retrieve all products with filtering',
      response: `{
  "success": true,
  "data": [...]
}`
    },
    {
      method: 'POST',
      path: '/api/products',
      description: 'Create a new product',
      request: `{
  "name": "New Product",
  "sku": "PROD-002",
  "buyingPrice": 80.00,
  "sellingPrice": 120.00,
  "quantity": 30
}`,
      response: `{
  "success": true,
  "data": { "id": 2, ... }
}`
    },
    {
      method: 'GET',
      path: '/api/purchases',
      description: 'Retrieve all purchases',
      response: `{
  "success": true,
  "data": [...]
}`
    },
    {
      method: 'POST',
      path: '/api/purchases',
      description: 'Record a new purchase',
      request: `{
  "productId": 1,
  "supplierId": 1,
  "quantity": 20,
  "buyingPrice": 75.00
}`,
      response: `{
  "success": true,
  "data": { "id": 1, ... }
}`
    }
  ];

  const getCategoryColor = (category: Section['category']) => {
    switch (category) {
      case 'overview': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'features': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'technical': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'setup': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'usage': return 'text-green-600 bg-green-50 border-green-200';
      case 'development': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-16 sm:pt-20">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-14 sm:top-16 z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-lg">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                Documentation
              </h1>
              <p className="text-gray-600 text-sm mt-0.5">Complete guide to StackFlow Inventory System</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="max-w-4xl mx-auto">
            <div className="space-y-8">

              {/* Structured Data Cards */}
              <div className="space-y-8 mb-8">
                {/* Features Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {[coreFeatures, technicalFeatures, reportingFeatures].map((card, index) => (
                    <div key={card.title} className={`border-2 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ${card.bgColor}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2.5 rounded-xl bg-white shadow-md ${card.color}`}>
                          <card.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {card.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Technology Stack */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Technology Stack</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {techStackItems.map((tech, index) => (
                      <div key={tech.name} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{tech.name}</h4>
                          <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-1 rounded-md">
                            {tech.version}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{tech.description}</p>
                        <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                          tech.category === 'frontend' ? 'bg-blue-100 text-blue-700' :
                          tech.category === 'backend' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {tech.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Architecture Overview */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-md">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">System Architecture</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Layers className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Client Layer</h4>
                      <p className="text-sm text-gray-600">Next.js frontend with responsive UI components</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Settings className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Application Layer</h4>
                      <p className="text-sm text-gray-600">API routes with business logic and validation</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Database className="w-8 h-8 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Data Layer</h4>
                      <p className="text-sm text-gray-600">PostgreSQL database with Prisma ORM</p>
                    </div>
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl shadow-md">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Prerequisites</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prerequisites.map((prereq, index) => (
                      <div key={prereq.name} className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${prereq.required ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{prereq.name}</h4>
                            <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                              {prereq.version}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{prereq.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Installation Guide */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-md">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Installation Guide</h3>
                  </div>

                  <div className="space-y-4">
                    {installationSteps.map((step, index) => (
                      <div key={step.step} className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                          {step.command && (
                            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                              <code>{step.command}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Reference */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-md">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">API Reference</h3>
                  </div>

                  <div className="space-y-6">
                    {apiEndpoints.map((endpoint, index) => (
                      <div key={`${endpoint.method}-${endpoint.path}`} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{endpoint.description}</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {endpoint.request && (
                            <div>
                              <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Request</h5>
                              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                                <code>{endpoint.request}</code>
                              </pre>
                            </div>
                          )}
                          {endpoint.response && (
                            <div>
                              <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Response</h5>
                              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                                <code>{endpoint.response}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Database Commands */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-md">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Database Management</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Container Management</h4>
                      <div className="space-y-2">
                        <div className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono">
                          docker-compose stop
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono">
                          docker-compose start
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono">
                          docker-compose down
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Database Access</h4>
                      <div className="space-y-2">
                        <div className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono">
                          docker exec -it inventory_postgres psql -U inventory_user -d inventory_db
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono">
                          npx prisma studio
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Bottom Navigation */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/faq"
                  className="flex items-center justify-center gap-3 px-6 py-4 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-900 hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                >
                  <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>Frequently Asked Questions</span>
                </Link>
                <Link
                  href="/support"
                  className="flex items-center justify-center gap-3 px-6 py-4 text-sm font-semibold text-white bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-gray-900 rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                >
                  <span>Get Support</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #1f2937, #374151);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #111827, #1f2937);
          }
        `
      }} />
    </div>
  );
}
