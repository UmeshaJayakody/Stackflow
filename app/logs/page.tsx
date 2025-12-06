'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface ActivityLog {
  logId: number;
  userId: number | null;
  action: string;
  entityType: string;
  entityId: number;
  entityName: string;
  details: string;
  createdAt: string;
  user: {
    userId: number;
    fullName: string;
    email: string;
  } | null;
}

export default function LogsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');
  const [filterEntityType, setFilterEntityType] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (user && !isAdmin) {
      router.push('/');
      return;
    }

    if (user) {
      fetchLogs();
    }
  }, [user, isAdmin, router]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        console.error('Failed to fetch logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterAction && log.action !== filterAction) return false;
    if (filterEntityType && log.entityType !== filterEntityType) return false;
    return true;
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntityTypeColor = (entityType: string) => {
    switch (entityType) {
      case 'PRODUCT':
        return 'bg-purple-100 text-purple-800';
      case 'PURCHASE':
        return 'bg-indigo-100 text-indigo-800';
      case 'SALE':
        return 'bg-pink-100 text-pink-800';
      case 'SUPPLIER':
        return 'bg-orange-100 text-orange-800';
      case 'CUSTOMER':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <header className="bg-white/40 backdrop-blur-md shadow-lg border-b border-gray-200/50 pt-16">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Activity Logs</h1>
              <p className="text-gray-600 mt-1">System audit trail and activity history</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-gray-200/50 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Logs</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">{logs.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-4 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-gray-200/50 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Creates</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {logs.filter(l => l.action === 'CREATE').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-600 p-4 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-gray-200/50 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Updates</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {logs.filter(l => l.action === 'UPDATE').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-500 p-4 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-gray-200/50 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Deletes</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {logs.filter(l => l.action === 'DELETE').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-black to-gray-800 p-4 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-gray-200/50 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="filterAction" className="block text-sm font-bold text-gray-700 mb-2">
                Filter by Action
              </label>
              <select
                id="filterAction"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
              >
                <option value="">All Actions</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label htmlFor="filterEntityType" className="block text-sm font-bold text-gray-700 mb-2">
                Filter by Entity Type
              </label>
              <select
                id="filterEntityType"
                value={filterEntityType}
                onChange={(e) => setFilterEntityType(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
              >
                <option value="">All Types</option>
                <option value="PRODUCT">PRODUCT</option>
                <option value="PURCHASE">PURCHASE</option>
                <option value="SALE">SALE</option>
                <option value="SUPPLIER">SUPPLIER</option>
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="WAREHOUSE">WAREHOUSE</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterAction('');
                  setFilterEntityType('');
                }}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-900 to-gray-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Activity History
            </h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12 bg-white/40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-900 font-semibold">Loading logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 bg-white/40">
              <p className="text-gray-700 font-semibold">No logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Entity Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/80 divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.logId} className="hover:bg-gray-100/80 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {log.user ? (
                          <div>
                            <div className="font-bold text-gray-900">{log.user.fullName}</div>
                            <div className="text-gray-600 text-xs font-semibold">{log.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500 font-semibold">System</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-200 text-gray-900">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-800 text-white">
                          {log.entityType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-bold text-gray-900">{log.entityName}</div>
                        <div className="text-gray-600 text-xs font-semibold">ID: {log.entityId}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border-2 border-gray-200/50 p-4">
          <p className="text-sm font-bold text-gray-900">
            Showing <span className="text-gray-900">{filteredLogs.length}</span> of <span className="text-gray-900">{logs.length}</span> log entries
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
