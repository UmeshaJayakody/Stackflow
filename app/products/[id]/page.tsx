'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Warehouse {
  warehouseId: number;
  warehouseName: string;
}

interface Supplier {
  supplierId: number;
  supplierName: string;
}

interface Product {
  productId: number;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  minimumQuantity: number;
  maximumQuantity: number;
  warehouseId: number | null;
  supplierId: number | null;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
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

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchWarehouses();
      fetchSuppliers();
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`);
      const result = await response.json();
      
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
        toast.error('Product not found');
        router.push('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('An error occurred while loading the product');
    } finally {
      setFetching(false);
    }
  };

  const fetchWarehouses = async () => {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-1">Update product information</p>
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
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                <select
                  id="supplierId"
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Supplier (Optional)</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.supplierId} value={supplier.supplierId}>
                      {supplier.supplierName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Updating...' : 'Update Product'}
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
    </div>
  );
}
