"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

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
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
              <p className="text-gray-600 mt-1">Manage system users and permissions</p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No users found. Add a new user to get started.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAdminUserModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
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
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New User</h2>
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
                  alert(error.error || 'Failed to add user');
                }
              } catch (error) {
                console.error('Error adding user:', error);
                alert('Failed to add user');
              }
            }}>
              <div className="mb-4">
                <label htmlFor="userFullName" className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="userFullName"
                  type="text"
                  name="fullName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="userEmail" className="block text-gray-700 text-sm font-bold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="userEmail"
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="userPassword" className="block text-gray-700 text-sm font-bold mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="userPassword"
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div className="mb-6">
                <label htmlFor="userRole" className="block text-gray-700 text-sm font-bold mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="userRole"
                  name="role"
                  defaultValue="staff"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage User</h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Full Name</p>
              <p className="font-semibold text-gray-900">{selectedUser.fullName}</p>
              
              <p className="text-sm text-gray-600 mb-1 mt-3">Email</p>
              <p className="font-semibold text-gray-900">{selectedUser.email}</p>
              
              <p className="text-sm text-gray-600 mb-1 mt-3">Role</p>
              <p className="font-semibold text-gray-900 capitalize">{selectedUser.role}</p>
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
                        alert('Password reset successfully');
                        setShowAdminUserModal(false);
                        setSelectedUser(null);
                      } else {
                        const error = await response.json();
                        alert(error.error || 'Failed to reset password');
                      }
                    }).catch(() => alert('Failed to reset password'));
                  } else if (newPassword !== null) {
                    alert('Password must be at least 6 characters');
                  }
                }}
                className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
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
                        alert('User deleted successfully');
                        setShowAdminUserModal(false);
                        setSelectedUser(null);
                        fetchUsers();
                      } else {
                        const error = await response.json();
                        alert(error.error || 'Failed to delete user');
                      }
                    }).catch(() => alert('Failed to delete user'));
                  }
                }}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
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
                className="w-full px-4 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
