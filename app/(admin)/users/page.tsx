"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import LoadingDots from "../../components/LoadingDots";
import DeleteUserModal from "./components/DeleteUserModal";
import ResetPasswordModal from "./components/ResetPasswordModal";

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
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAdminUserModal, setShowAdminUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const fetchUsers = useCallback(async () => {
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
  }, [isAdmin]);

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userToDelete.userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        setShowDeleteModal(false);
        setUserToDelete(null);
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (newPassword: string) => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.userId,
          newPassword
        })
      });

      if (response.ok) {
        toast.success('Password reset successfully');
        setShowResetPasswordModal(false);
        setShowAdminUserModal(false);
        setSelectedUser(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
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
  }, [user, isAdmin, router, fetchUsers]);

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
          <div className="flex justify-center items-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Users Management</h1>
              <p className="text-gray-600 mt-1">Manage system users and permissions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        {/* Stats */}
        <div className="bg-gradient-to-br from-purple-50/60 to-violet-50/40 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-3xl border border-purple-200/50 p-6 mb-8 transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-purple-900">User Dashboard</h3>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-6 py-2.5 bg-purple-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-purple-700/90 font-medium shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 border border-purple-500/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add User
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-gradient-to-br from-purple-50/80 to-violet-50/60 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl border border-purple-200/50 p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wide">Total Users</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">{users.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-600/80 backdrop-blur-sm shadow-lg shadow-purple-500/20 text-white transform group-hover:rotate-12 transition-transform duration-300 border border-purple-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-violet-50/80 to-purple-50/60 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl border border-violet-200/50 p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-violet-700 uppercase tracking-wide">Admins</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-violet-600/80 backdrop-blur-sm shadow-lg shadow-violet-500/20 text-white transform group-hover:rotate-12 transition-transform duration-300 border border-violet-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-purple-50/80 to-violet-50/60 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl border border-purple-200/50 p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wide">Staff</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {users.filter(u => u.role === 'staff').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-600/80 backdrop-blur-sm shadow-lg shadow-purple-500/20 text-white transform group-hover:rotate-12 transition-transform duration-300 border border-purple-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl hover:shadow-3xl overflow-hidden transition-shadow duration-300">
          <div className="px-6 py-4 border-b border-gray-200/50 bg-purple-600/90">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-purple-600/80 backdrop-blur-sm shadow-3xl shadow-purple-600/50 ring-4 ring-purple-100/30 border border-purple-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              </span>
              <span>All Users ({users.length})</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-600/90">
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
                  users.map((user, index) => (
                    <tr key={user.userId} className={`${index % 2 === 0 ? 'bg-purple-50/30' : 'bg-violet-50/30'} hover:bg-purple-100/50 transition-all duration-200`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-700">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin' 
                            ? 'bg-violet-600 text-white' 
                            : 'bg-purple-200 text-violet-900'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-violet-700">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAdminUserModal(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:from-purple-500 hover:to-violet-500 font-bold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-purple-500/30"
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
            <div className="bg-purple-600 p-6 rounded-t-3xl border-b-2 border-purple-500">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add New User
              </h2>
              <p className="text-purple-200 mt-1">Create a new user account</p>
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
                  className="flex-1 px-4 py-3 text-purple-800 bg-purple-100/80 backdrop-blur-sm rounded-xl hover:bg-purple-200/90 transition-all duration-300 font-semibold border border-purple-300/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-purple-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-purple-700/90 transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-xl font-semibold border border-purple-500/30"
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
            <div className="bg-purple-600 p-6 rounded-t-3xl border-b-2 border-purple-500">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage User
              </h2>
              <p className="text-purple-200 mt-1">Update user settings and permissions</p>
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
                    setShowResetPasswordModal(true);
                    setShowAdminUserModal(false);
                  }}
                  className="w-full px-4 py-3 bg-purple-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-purple-700/90 transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-xl flex items-center justify-center gap-2 font-semibold border border-purple-500/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Reset Password
                </button>

                <button
                  onClick={() => {
                    setUserToDelete(selectedUser);
                    setShowDeleteModal(true);
                    setShowAdminUserModal(false);
                  }}
                  className="w-full px-4 py-3 bg-red-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-red-700/90 transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-xl flex items-center justify-center gap-2 font-semibold border border-red-500/30"
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
                  className="w-full px-4 py-3 text-purple-800 bg-purple-100/80 backdrop-blur-sm rounded-xl hover:bg-purple-200/90 transition-all duration-300 font-semibold border border-purple-300/50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteUserModal
        isOpen={showDeleteModal}
        user={userToDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={loading}
      />

      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        user={selectedUser}
        onClose={() => {
          setShowResetPasswordModal(false);
          setSelectedUser(null);
        }}
        onConfirm={resetPassword}
        isLoading={loading}
      />
    </div>
  );
}
