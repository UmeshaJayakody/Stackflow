'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingDots from '../components/LoadingDots';

interface Supplier {
  supplierId: number;
  supplierName: string;
}

interface Warehouse {
  warehouseId: number;
  warehouseName: string;
}

interface Product {
  productId: number;
  productName: string;
  sku: string;
  unitPrice: number;
}

interface Purchase {
  purchaseId: number;
  purchaseDate: string;
  purchasedQuantity: number;
  purchasePrice: number;
  product: Product;
  supplier: Supplier;
  user: {
    fullName: string;
  } | null;
}

export default function PurchasesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
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
  const [formData, setFormData] = useState({
    supplierId: '',
    productId: '',
    purchasedQuantity: '',
    purchasePrice: '',
  });

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
    fetchProducts();
    fetchWarehouses();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases');
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
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

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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
        setShowModal(true);
        // Set the newly created supplier as selected
        setTimeout(() => {
          const selectElement = document.getElementById('supplierId') as HTMLSelectElement;
          if (selectElement) {
            selectElement.value = newSupplier.supplierId.toString();
          }
        }, 100);
      } else {
        toast.error('Failed to add supplier');
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast.error('An error occurred');
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user?.userId.toString() || ''
        },
        body: JSON.stringify({
          ...newProductForm,
          unitPrice: parseFloat(newProductForm.unitPrice),
          quantity: parseInt(newProductForm.quantity),
          minimumQuantity: parseInt(newProductForm.minimumQuantity),
          maximumQuantity: parseInt(newProductForm.maximumQuantity),
          warehouseId: parseInt(newProductForm.warehouseId),
          supplierId: parseInt(newProductForm.supplierId),
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        const newProduct = result.data || result;
        await fetchProducts();
        setShowAddProductModal(false);
        setShowModal(true);
        setNewProductForm({
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
        // Set the newly created product as selected
        setTimeout(() => {
          const selectElement = document.getElementById('productId') as HTMLSelectElement;
          if (selectElement && newProduct.productId) {
            selectElement.value = newProduct.productId.toString();
            setFormData(prev => ({ ...prev, productId: newProduct.productId.toString() }));
          }
        }, 100);
        toast.success('Product added successfully!');
      } else {
        const result = await response.json();
        toast.error('Failed to add product: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('An error occurred while adding the product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdBy: user?.userId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Purchase recorded successfully! Stock updated.');
        setShowModal(false);
        setFormData({
          supplierId: '',
          productId: '',
          purchasedQuantity: '',
          purchasePrice: '',
        });
        fetchPurchases();
      } else {
        toast.error('Failed to record purchase: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast.error('An error occurred while recording the purchase');
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

  const getTotalValue = () => {
    return purchases.reduce((sum, p) => sum + (p.purchasedQuantity * parseFloat(p.purchasePrice.toString())), 0);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white/40 backdrop-blur-md shadow-2xl border-b border-gray-200/50 pt-16">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 py-6">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Purchase Management</h1>
              <p className="text-gray-600 mt-1">Record and track product purchases</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        {/* Stats */}
        <div className="bg-gradient-to-br from-green-50/60 to-emerald-50/40 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-3xl border border-green-200/50 p-6 mb-8 transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-green-900">Purchase Dashboard</h3>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 bg-green-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-green-700/90 font-medium shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 border border-green-500/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Purchase
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl border border-green-200/50 p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide">Total Purchases</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">{purchases.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-600/80 backdrop-blur-sm shadow-lg shadow-green-500/20 text-white transform group-hover:rotate-12 transition-transform duration-300 border border-green-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl border border-green-200/50 p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide">Items Purchased</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {purchases.reduce((sum, p) => sum + p.purchasedQuantity, 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-600/80 backdrop-blur-sm shadow-lg shadow-green-500/20 text-white transform group-hover:rotate-12 transition-transform duration-300 border border-green-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl border border-green-200/50 p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide">Total Value</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">${getTotalValue().toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-600/80 backdrop-blur-sm shadow-lg shadow-green-500/20 text-white transform group-hover:rotate-12 transition-transform duration-300 border border-green-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Purchases Table */}
        <div className="bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl hover:shadow-3xl overflow-hidden transition-shadow duration-300">
          <div className="px-6 py-4 border-b border-gray-200/50 bg-green-600/90">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-green-600/80 backdrop-blur-sm shadow-3xl shadow-green-600/50 ring-4 ring-green-100/30 border border-green-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              </span>
              <span>Purchase History ({purchases.length})</span>
            </h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12 bg-white/40">
              <LoadingDots />
            </div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-12 bg-white/40">
              <p className="text-gray-700 font-semibold">No purchases recorded yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-6 py-2 bg-green-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-700/90 font-semibold shadow-lg shadow-green-600/20 transition-all duration-300 border border-green-500/30"
              >
                Record First Purchase
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Recorded By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/80 divide-y divide-gray-200">
                  {purchases.map((purchase, index) => (
                    <tr key={purchase.purchaseId} className={`${index % 2 === 0 ? 'bg-white/60' : 'bg-green-50/40'} hover:bg-green-100/60 transition-all duration-200`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{purchase.product.productName}</div>
                        <div className="text-sm font-semibold text-blue-600">{purchase.product.sku}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {purchase.supplier.supplierName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">
                        {purchase.purchasedQuantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ${parseFloat(purchase.purchasePrice.toString()).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ${(purchase.purchasedQuantity * parseFloat(purchase.purchasePrice.toString())).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {purchase.user?.fullName || 'System'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full border-2 border-gray-300/50">
            <div className="bg-green-600 px-6 py-4 rounded-t-3xl border-b-2 border-green-500">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Record New Purchase
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="supplierId" className="block text-sm font-bold text-gray-700 mb-2">
                    Supplier *
                  </label>
                  <select
                    id="supplierId"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold mb-2"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.supplierId} value={supplier.supplierId}>
                        {supplier.supplierName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setShowAddSupplierModal(true); }}
                    className="w-full px-4 py-2 bg-green-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-700/90 font-bold shadow-lg shadow-green-600/20 transition-all duration-300 border border-green-500/30"
                    title="Add New Supplier"
                  >
                    + Add New Supplier
                  </button>
                </div>

                <div>
                  <label htmlFor="productId" className="block text-sm font-bold text-gray-700 mb-2">
                    Product *
                  </label>
                  <select
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold mb-2"
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.productName.length > 50 
                          ? `${product.productName.substring(0, 50)}...` 
                          : product.productName} ({product.sku})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setShowAddProductModal(true); }}
                    className="w-full px-4 py-2 bg-green-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-700/90 font-bold shadow-lg shadow-green-600/20 transition-all duration-300 border border-green-500/30"
                    title="Add New Product"
                  >
                    + Add New Product
                  </button>
                </div>

                <div>
                  <label htmlFor="purchasedQuantity" className="block text-sm font-bold text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="purchasedQuantity"
                    name="purchasedQuantity"
                    value={formData.purchasedQuantity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="purchasePrice" className="block text-sm font-bold text-gray-700 mb-2">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    id="purchasePrice"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-green-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-700/90 disabled:bg-green-400/50 disabled:cursor-not-allowed font-bold shadow-lg shadow-green-600/20 transition-all duration-300 flex items-center justify-center border border-green-500/30"
                >
                  {loading ? <LoadingDots /> : 'Record Purchase'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-green-100/80 backdrop-blur-sm text-green-800 rounded-xl hover:bg-green-200/90 font-bold shadow-md transition-all duration-300 border border-green-300/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border-2 border-gray-300/50 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-green-600 px-6 py-4 border-b-2 border-green-500">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Add New Supplier
              </h2>
            </div>
            
            <form onSubmit={handleAddSupplier} className="p-6 overflow-y-auto" style={{maxHeight: 'calc(90vh - 120px)'}}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="supplierName" className="block text-sm font-bold text-gray-700 mb-2">
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    id="supplierName"
                    name="supplierName"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-bold text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-green-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-700/90 font-bold shadow-lg shadow-green-600/20 transition-all duration-300 border border-green-500/30"
                >
                  Add Supplier
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddSupplierModal(false); setShowModal(true); }}
                  className="flex-1 px-6 py-2 bg-green-100/80 backdrop-blur-sm text-green-800 rounded-xl hover:bg-green-200/90 font-bold shadow-md transition-all duration-300 border border-green-300/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border-2 border-gray-300/50">
            <div className="bg-green-600 p-6 rounded-t-3xl border-b-2 border-green-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Product
                  </h2>
                  <p className="text-gray-200 mt-1">Create a new product in your inventory</p>
                </div>
                <button
                  onClick={() => { setShowAddProductModal(false); setShowModal(true); }}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
                  title="Close"
                  aria-label="Close add product modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProductForm.productName}
                    onChange={(e) => setNewProductForm({...newProductForm, productName: e.target.value})}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({...newProductForm, sku: e.target.value})}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                    placeholder="e.g., PROD001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({...newProductForm, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                    placeholder="e.g., Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    value={newProductForm.unitPrice}
                    onChange={(e) => setNewProductForm({...newProductForm, unitPrice: e.target.value})}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Warehouse *
                  </label>
                  <select
                    value={newProductForm.warehouseId}
                    onChange={(e) => setNewProductForm({...newProductForm, warehouseId: e.target.value})}
                    required
                    title="Select a warehouse"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map((w) => (
                      <option key={w.warehouseId} value={w.warehouseId}>{w.warehouseName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Supplier *
                  </label>
                  <select
                    value={newProductForm.supplierId}
                    onChange={(e) => setNewProductForm({...newProductForm, supplierId: e.target.value})}
                    required
                    title="Select a supplier"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Quantity
                  </label>
                  <input
                    type="number"
                    value="0"
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed transition-all"
                    title="Quantity is managed through purchases and sales"
                  />
                  <p className="text-xs text-gray-500 mt-1">Quantity will be updated through purchases</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Quantity
                  </label>
                  <input
                    type="number"
                    value={newProductForm.minimumQuantity}
                    onChange={(e) => setNewProductForm({...newProductForm, minimumQuantity: e.target.value})}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Maximum Quantity
                  </label>
                  <input
                    type="number"
                    value={newProductForm.maximumQuantity}
                    onChange={(e) => setNewProductForm({...newProductForm, maximumQuantity: e.target.value})}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-700/90 font-semibold shadow-xl shadow-green-600/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-green-500/30"
                >
                  Create Product
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddProductModal(false); setShowModal(true); }}
                  className="px-6 py-3 bg-green-100/80 backdrop-blur-sm text-green-800 rounded-xl hover:bg-green-200/90 font-semibold transition-all duration-300 shadow-md hover:shadow-lg border border-green-300/50"
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
