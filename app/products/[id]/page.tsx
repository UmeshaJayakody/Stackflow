'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LoadingDots from '@/app/components/LoadingDots';
import { useToast } from '@/app/context/ToastContext';

interface Warehouse {
  warehouseId: number;
  warehouseName: string;
}

interface Supplier {
  supplierId: number;
  supplierName: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const toast = useToast();
  const [productId, setProductId] = useState<string | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    category: '',
    unitPrice: '',
    quantity: '',
    minimumQuantity: '',
    maximumQuantity: '',
    warehouseId: '',
    supplierId: '',
  });

  useEffect(() => {
    params.then((resolvedParams) => {
      setProductId(resolvedParams.id);
    });
  }, [params]);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await fetch(`/api/products/${productId}`);
      const result = await response.json();

      if (response.status === 404) {
        // Redirect to not found page
        notFound();
        return;
      }

      if (result.success) {
        const product = result.data;
        setFormData({
          productName: product.productName,
          sku: product.sku,
          category: product.category || '',
          unitPrice: product.unitPrice.toString(),
          quantity: product.quantity.toString(),
          minimumQuantity: product.minimumQuantity.toString(),
          maximumQuantity: product.maximumQuantity.toString(),
          warehouseId: product.warehouseId?.toString() || '',
          supplierId: product.supplierId?.toString() || '',
        });
      } else {
        toast.error('Failed to load product');
        router.push('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/products');
    } finally {
      setFetching(false);
    }
  }, [productId, router, toast]);

  const fetchWarehouses = useCallback(async () => {
    try {
      const response = await fetch('/api/warehouses');
      const result = await response.json();
      if (result.success) {
        setWarehouses(result.data);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  }, []);

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await fetch('/api/suppliers');
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchWarehouses();
      fetchSuppliers();
    }
  }, [productId, fetchProduct, fetchWarehouses, fetchSuppliers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    
    setLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Product updated successfully!');
        router.push('/products');
      } else {
        toast.error('Failed to update product: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An error occurred while updating the product');
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

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <LoadingDots />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Product
              </h1>
              <p className="text-gray-600 mt-1">Update product information</p>
            </div>
            <Link
              href="/products"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Product Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Product Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-900 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-900 mb-2">
                      SKU (Stock Keeping Unit) *
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder="e.g., PROD001"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder="e.g., Electronics"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Pricing & Inventory
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Unit Price */}
                  <div>
                    <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-900 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Current Quantity - LOCKED */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-900 mb-2">
                      Current Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      readOnly
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Min Quantity */}
                  <div>
                    <label htmlFor="minimumQuantity" className="block text-sm font-medium text-gray-900 mb-2">
                      Min Quantity
                    </label>
                    <input
                      type="number"
                      id="minimumQuantity"
                      name="minimumQuantity"
                      value={formData.minimumQuantity}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Max Quantity */}
                  <div>
                    <label htmlFor="maximumQuantity" className="block text-sm font-medium text-gray-900 mb-2">
                      Max Quantity
                    </label>
                    <input
                      type="number"
                      id="maximumQuantity"
                      name="maximumQuantity"
                      value={formData.maximumQuantity}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Warehouse & Supplier Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Warehouse & Supplier
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Warehouse */}
                  <div>
                    <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-900 mb-2">
                      Warehouse
                    </label>
                    <select
                      id="warehouseId"
                      name="warehouseId"
                      value={formData.warehouseId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
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
                    <label htmlFor="supplierId" className="block text-sm font-medium text-gray-900 mb-2">
                      Supplier
                    </label>
                    <select
                      id="supplierId"
                      name="supplierId"
                      value={formData.supplierId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select Supplier (Optional)</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.supplierId} value={supplier.supplierId}>
                          {supplier.supplierName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? <LoadingDots color="bg-white" /> : 'Update Product'}
                </button>
                <Link
                  href="/products"
                  className="px-6 py-3 bg-white text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-100 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
