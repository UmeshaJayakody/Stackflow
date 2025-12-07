"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import LoadingDots from "../components/LoadingDots";

interface User {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAdminUserModal, setShowAdminUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    if (!isAdmin) return;
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if not admin
    if (user && !isAdmin) {
      router.push('/');
      return;
    }

    if (user) {
      fetchUsers();
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <LoadingDots />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white/40 backdrop-blur-md shadow-lg border-b border-gray-200/50 pt-16">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Users Management</h1>
              <p className="text-gray-600 mt-1">Manage system users and permissions</p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-gray-200/50 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Users</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">{users.length}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-4 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-gray-200/50 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Admins</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-600 p-4 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-gray-200/50 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Staff</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {users.filter(u => u.role === 'staff').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-black to-gray-800 p-4 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-900 to-gray-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              All Users
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/80 divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-700 font-semibold">
                      No users found. Add a new user to get started.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-100/80 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin' 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAdminUserModal(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-500 font-bold shadow-lg transition-all duration-300"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full mx-4 border-2 border-gray-200/50">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 rounded-t-3xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add New User
              </h2>
              <p className="text-gray-300 mt-1">Create a new user account</p>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              const userData = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                password: formData.get('password'),
                role: formData.get('role')
              };

              try {
                const response = await fetch('/api/users', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(userData)
                });

                if (response.ok) {
                  form.reset();
                  setShowAddUserModal(false);
                  fetchUsers();
                } else {
                  const error = await response.json();
                  toast.error(error.error || 'Failed to add user');
                }
              } catch (error) {
                console.error('Error adding user:', error);
                toast.error('Failed to add user');
              }
            }}>
              <div className="p-6 space-y-4">
              <div>
                <label htmlFor="userFullName" className="block text-gray-700 text-sm font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="userFullName"
                  type="text"
                  name="fullName"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="userEmail" className="block text-gray-700 text-sm font-semibold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="userEmail"
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="userPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="userPassword"
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label htmlFor="userRole" className="block text-gray-700 text-sm font-semibold mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="userRole"
                  name="role"
                  defaultValue="staff"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              </div>

              <div className="flex gap-4 px-6 pb-6 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin User Management Modal */}
      {showAdminUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full mx-4 border-2 border-gray-200/50">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 rounded-t-3xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage User
              </h2>
              <p className="text-gray-300 mt-1">Update user settings and permissions</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">Full Name</p>
                <p className="font-bold text-gray-900 text-lg">{selectedUser.fullName}</p>
                
                <p className="text-sm font-semibold text-gray-600 mb-1 mt-3">Email</p>
                <p className="font-bold text-gray-900">{selectedUser.email}</p>
                
                <p className="text-sm font-semibold text-gray-600 mb-1 mt-3">Role</p>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  selectedUser.role === 'admin' 
                    ? 'bg-gray-200 text-gray-900' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedUser.role}
                </span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    const newPassword = prompt('Enter new password for this user (minimum 6 characters):');
                    if (newPassword && newPassword.length >= 6) {
                      fetch('/api/users/reset-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          userId: selectedUser.userId,
                          newPassword
                        })
                      }).then(async (response) => {
                        if (response.ok) {
                          toast.success('Password reset successfully');
                          setShowAdminUserModal(false);
                          setSelectedUser(null);
                        } else {
                          const error = await response.json();
                          toast.error(error.error || 'Failed to reset password');
                        }
                      }).catch(() => toast.error('Failed to reset password'));
                    } else if (newPassword !== null) {
                      toast.success('Password must be at least 6 characters');
                    }
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Reset Password
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${selectedUser.fullName}? This action cannot be undone.`)) {
                      fetch(`/api/users/${selectedUser.userId}`, {
                        method: 'DELETE'
                      }).then(async (response) => {
                        if (response.ok) {
                          toast.success('User deleted successfully');
                          setShowAdminUserModal(false);
                          setSelectedUser(null);
                          fetchUsers();
                        } else {
                          const error = await response.json();
                          toast.error(error.error || 'Failed to delete user');
                        }
                      }).catch(() => toast.error('Failed to delete user'));
                    }
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete User
                </button>

                <button
                  onClick={() => {
                    setShowAdminUserModal(false);
                    setSelectedUser(null);
                  }}
                  className="w-full px-4 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
