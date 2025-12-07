'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '../context/ToastContext';

interface Warehouse {
  warehouseId: number;
  warehouseName: string;
}

interface Supplier {
  supplierId: number;
  supplierName: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    category: '',
    unitPrice: '',
    quantity: '0',
    minimumQuantity: '0',
    maximumQuantity: '0',
    warehouseId: '',
    supplierId: '',
  });

  useEffect(() => {
    fetchWarehouses();
    fetchSuppliers();
  }, []);  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/warehouses');
      const result = await response.json();
      if (result.success) {
        setWarehouses(result.data);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers');
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleAddSupplier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user?.userId.toString() || ''
        },
        body: JSON.stringify({
          supplierName: formData.get('supplierName'),
          contactPerson: formData.get('contactPerson'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          address: formData.get('address'),
        }),
      });
      
      if (response.ok) {
        const newSupplier = await response.json();
        await fetchSuppliers();
        setShowAddSupplierModal(false);
        // Set the newly created supplier as selected
        setFormData(prev => ({
          ...prev,
          supplierId: newSupplier.supplierId.toString()
        }));
      } else {
        toast.error('Failed to add supplier');
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast.error('An error occurred');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdBy: user?.userId,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Product created successfully!');
        router.push('/products');
      } else {
        toast.error('Failed to create product: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('An error occurred while creating the product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600 mt-1">Create a new product in your inventory</p>
            </div>
            <Link
              href="/products"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              {/* SKU */}
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Stock Keeping Unit) *
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., PROD001, LAP-HP-001"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Unique identifier for this product
                </p>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Electronics, Accessories"
                />
              </div>

              {/* Unit Price */}
              <div>
                <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price ($) *
                </label>
                <input
                  type="number"
                  id="unitPrice"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value="0"
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    title="Quantity is managed through purchases and sales"
                  />
                  <p className="text-xs text-gray-500 mt-1">Updated via purchases</p>
                </div>

                <div>
                  <label htmlFor="minimumQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Min Quantity
                  </label>
                  <input
                    type="number"
                    id="minimumQuantity"
                    name="minimumQuantity"
                    value={formData.minimumQuantity}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="maximumQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Quantity
                  </label>
                  <input
                    type="number"
                    id="maximumQuantity"
                    name="maximumQuantity"
                    value={formData.maximumQuantity}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Warehouse */}
              <div>
                <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700 mb-2">
                  Warehouse
                </label>
                <select
                  id="warehouseId"
                  name="warehouseId"
                  value={formData.warehouseId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Warehouse (Optional)</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.warehouseId} value={warehouse.warehouseId}>
                      {warehouse.warehouseName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Supplier */}
              <div>
                <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <div className="flex gap-2">
                  <select
                    id="supplierId"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Supplier (Optional)</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.supplierId} value={supplier.supplierId}>
                        {supplier.supplierName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddSupplierModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium whitespace-nowrap"
                    title="Add New Supplier"
                  >
                    + Add New
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Creating...' : 'Create Product'}
                </button>
                <Link
                  href="/products"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Add Supplier Modal */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Supplier</h2>
            
            <form onSubmit={handleAddSupplier}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    id="supplierName"
                    name="supplierName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  Add Supplier
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
