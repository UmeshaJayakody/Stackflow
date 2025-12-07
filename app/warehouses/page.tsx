'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingDots from '../components/LoadingDots';
import DeleteWarehouseModal from './components/DeleteWarehouseModal';

interface Warehouse {
  warehouseId: number;
  warehouseName: string;
  location: string | null;
  _count?: {
    products: number;
  };
}

export default function WarehousesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState({
    warehouseName: '',
    location: '',
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/warehouses');
      const result = await response.json();
      setWarehouses(result.data || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setWarehouses([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingWarehouse 
        ? `/api/warehouses/${editingWarehouse.warehouseId}`
        : '/api/warehouses';
      
      const method = editingWarehouse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.userId.toString() || '',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchWarehouses();
        setShowModal(false);
        setEditingWarehouse(null);
        setFormData({ warehouseName: '', location: '' });
        toast.success(editingWarehouse ? 'Warehouse updated successfully!' : 'Warehouse created successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save warehouse');
      }
    } catch (error) {
      console.error('Error saving warehouse:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      warehouseName: warehouse.warehouseName,
      location: warehouse.location || '',
    });
    setShowModal(true);
  };

  const handleDelete = (warehouse: Warehouse) => {
    setWarehouseToDelete(warehouse);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!warehouseToDelete) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/warehouses/${warehouseToDelete.warehouseId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.userId.toString() || '',
        },
      });

      if (response.ok) {
        await fetchWarehouses();
        toast.success('Warehouse deleted successfully!');
        setShowDeleteModal(false);
        setWarehouseToDelete(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete warehouse');
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingWarehouse(null);
    setFormData({ warehouseName: '', location: '' });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white/40 backdrop-blur-md shadow-lg border-b border-gray-200/50 pt-16">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 py-6">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Warehouse Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your storage locations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        {/* Stats */}
        <div className="bg-gradient-to-br from-yellow-50/60 to-amber-50/40 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-3xl border border-yellow-200/50 p-6 mb-8 transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-yellow-900">Warehouse Dashboard</h3>
            <button
              onClick={openAddModal}
              className="px-6 py-2.5 bg-yellow-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-yellow-700/90 font-medium shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 border border-yellow-500/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Warehouse
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-gradient-to-br from-yellow-50/80 to-amber-50/60 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl border border-yellow-200/50 p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-yellow-700 uppercase tracking-wide">Total Warehouses</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">{warehouses.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-600/80 backdrop-blur-sm shadow-lg shadow-yellow-500/20 text-white transform group-hover:rotate-12 transition-transform duration-300 border border-yellow-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-yellow-50/80 to-amber-50/60 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl border border-yellow-200/50 p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-yellow-700 uppercase tracking-wide">Total Products</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {warehouses.reduce((sum, w) => sum + (w._count?.products || 0), 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-600/80 backdrop-blur-sm shadow-lg shadow-yellow-500/20 text-white transform group-hover:rotate-12 transition-transform duration-300 border border-yellow-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-yellow-50/80 to-amber-50/60 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl border border-yellow-200/50 p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-yellow-700 uppercase tracking-wide">Avg Products/Warehouse</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {warehouses.length > 0
                    ? Math.round(warehouses.reduce((sum, w) => sum + (w._count?.products || 0), 0) / warehouses.length)
                    : 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-600/80 backdrop-blur-sm shadow-lg shadow-yellow-500/20 text-white transform group-hover:rotate-12 transition-transform duration-300 border border-yellow-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Warehouses Grid */}
        <div className="bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/50 bg-yellow-600/90">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              All Warehouses
            </h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12 bg-white/40">
              <LoadingDots />
            </div>
          ) : warehouses.length === 0 ? (
            <div className="text-center py-12 bg-white/40">
              <p className="text-gray-700 font-semibold">No warehouses found</p>
              <button
                onClick={openAddModal}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 font-semibold shadow-lg transition-all duration-300"
              >
                Add First Warehouse
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {warehouses.map((warehouse) => (
                <div
                  key={warehouse.warehouseId}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-yellow-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="bg-yellow-600 px-4 py-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {warehouse.warehouseName}
                    </h3>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-yellow-700 uppercase">Location</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {warehouse.location || 'No location specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-yellow-200">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-yellow-700 uppercase">Products</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {warehouse._count?.products || 0}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-3 border-t border-yellow-200">
                      <button
                        onClick={() => handleEdit(warehouse)}
                        className="flex-1 px-4 py-2 bg-yellow-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-yellow-700/90 font-bold text-sm shadow-lg shadow-yellow-600/20 transition-all duration-300 border border-yellow-500/30"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(warehouse)}
                        className="flex-1 px-4 py-2 bg-red-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-red-700/90 font-bold text-sm shadow-lg shadow-red-600/20 transition-all duration-300 border border-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Warehouse Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border-2 border-gray-300/50">
            <div className="bg-yellow-600 px-6 py-4 rounded-t-3xl border-b-2 border-yellow-500">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="warehouseName" className="block text-sm font-bold text-gray-700 mb-2">
                    Warehouse Name *
                  </label>
                  <input
                    type="text"
                    id="warehouseName"
                    name="warehouseName"
                    value={formData.warehouseName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                    placeholder="e.g., Main Warehouse"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">
                    Location
                  </label>
                  <textarea
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                    placeholder="e.g., 123 Main St, City, Country"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-yellow-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-yellow-700/90 disabled:bg-yellow-400/50 disabled:cursor-not-allowed font-bold shadow-lg shadow-yellow-600/20 transition-all duration-300 flex items-center justify-center border border-yellow-500/30"
                >
                  {loading ? <LoadingDots /> : editingWarehouse ? 'Update Warehouse' : 'Add Warehouse'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingWarehouse(null);
                    setFormData({ warehouseName: '', location: '' });
                  }}
                  className="px-6 py-3 bg-yellow-100/80 backdrop-blur-sm text-yellow-800 rounded-xl hover:bg-yellow-200/90 font-bold shadow-md transition-all duration-300 border border-yellow-300/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteWarehouseModal
        isOpen={showDeleteModal}
        warehouse={warehouseToDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setWarehouseToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={loading}
      />
    </div>
  );
}
