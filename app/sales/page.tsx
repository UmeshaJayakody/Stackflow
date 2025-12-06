'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import LoadingDots from '../components/LoadingDots';

interface Customer {
  customerId: number;
  customerName: string;
}

interface Product {
  productId: number;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
}

interface Sale {
  saleId: number;
  saleDate: string;
  soldQuantity: number;
  salePrice: number;
  product: Product;
  customer: Customer;
  user: {
    fullName: string;
  } | null;
  profit?: number;
  costOfGoodsSold?: number;
}

export default function SalesPage() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    productId: '',
    soldQuantity: '',
    salePrice: '',
  });

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/sales');
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
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

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user?.userId.toString() || ''
        },
        body: JSON.stringify({
          customerName: formData.get('customerName'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          address: formData.get('address'),
        }),
      });
      
      if (response.ok) {
        const newCustomer = await response.json();
        await fetchCustomers();
        setShowAddCustomerModal(false);
        setShowModal(true);
        // Set the newly created customer as selected
        setTimeout(() => {
          const selectElement = document.getElementById('customerId') as HTMLSelectElement;
          if (selectElement) {
            selectElement.value = newCustomer.customerId.toString();
          }
        }, 100);
      } else {
        alert('Failed to add customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('An error occurred');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdBy: user?.userId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Sale recorded successfully! Stock updated.');
        setShowModal(false);
        setFormData({
          customerId: '',
          productId: '',
          soldQuantity: '',
          salePrice: '',
        });
        fetchSales();
        fetchProducts(); // Refresh to update available stock
      } else {
        alert('Failed to record sale: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('An error occurred while recording the sale');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-fill sale price with product unit price when product is selected
    if (name === 'productId' && value) {
      const selectedProduct = products.find(p => p.productId === parseInt(value));
      if (selectedProduct && !formData.salePrice) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          salePrice: selectedProduct.unitPrice.toString(),
        }));
      }
    }
  };

  const getTotalRevenue = () => {
    return sales.reduce((sum, s) => sum + (s.soldQuantity * parseFloat(s.salePrice.toString())), 0);
  };

  const getSelectedProductStock = () => {
    const selectedProduct = products.find(p => p.productId === parseInt(formData.productId));
    return selectedProduct?.quantity || 0;
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white/40 backdrop-blur-md shadow-lg border-b border-gray-200/50 pt-16">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Sales Management</h1>
              <p className="text-gray-600 mt-1">Record and track product sales</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                + New Sale
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-gray-200/50 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Sales</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">{sales.length}</p>
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
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Items Sold</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {sales.reduce((sum, s) => sum + s.soldQuantity, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-600 p-4 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-gray-200/50 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Revenue</h3>
                <p className="text-4xl font-bold text-gray-900 mt-3">${getTotalRevenue().toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-br from-black to-gray-800 p-4 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-900 to-gray-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Sales History
            </h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12 bg-white/40">
              <LoadingDots />
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-12 bg-white/40">
              <p className="text-gray-700 font-semibold">No sales recorded yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 font-semibold shadow-lg transition-all duration-300"
              >
                Record First Sale
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Customer
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
                      Profit/Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Recorded By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/80 divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.saleId} className="hover:bg-gray-100/80 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {new Date(sale.saleDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{sale.product.productName}</div>
                        <div className="text-sm font-semibold text-gray-600">{sale.product.sku}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sale.customer.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sale.soldQuantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${parseFloat(sale.salePrice.toString()).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${(sale.soldQuantity * parseFloat(sale.salePrice.toString())).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                        {sale.profit !== undefined ? (
                          <span className={sale.profit >= 0 ? 'text-gray-900' : 'text-gray-600'}>
                            {sale.profit >= 0 ? (
                              <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            ${Math.abs(sale.profit).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                        {sale.user?.fullName || 'System'}
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
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border-2 border-gray-300/50">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-4 rounded-t-3xl border-b-2 border-gray-700">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Record New Sale
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerId" className="block text-sm font-bold text-gray-700 mb-2">
                    Customer *
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="customerId"
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                      required
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                    >
                      <option value="">Select Customer</option>
                      {customers.map((customer) => (
                        <option key={customer.customerId} value={customer.customerId}>
                          {customer.customerName}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => { setShowModal(false); setShowAddCustomerModal(true); }}
                      className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-500 font-bold whitespace-nowrap shadow-lg transition-all duration-300"
                      title="Add New Customer"
                    >
                      + Add
                    </button>
                  </div>
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
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.productName} ({product.sku}) - Stock: {product.quantity}
                      </option>
                    ))}
                  </select>
                  {formData.productId && (
                    <p className="text-sm text-gray-600 font-semibold mt-1">
                      Available stock: {getSelectedProductStock()} units
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="soldQuantity" className="block text-sm font-bold text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="soldQuantity"
                    name="soldQuantity"
                    value={formData.soldQuantity}
                    onChange={handleChange}
                    required
                    min="1"
                    max={getSelectedProductStock()}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="salePrice" className="block text-sm font-bold text-gray-700 mb-2">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    id="salePrice"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>

                {formData.soldQuantity && formData.salePrice && (
                  <div className="bg-gray-100 p-3 rounded-xl border-2 border-gray-300">
                    <p className="text-sm font-bold text-gray-900">
                      Total Amount: ${(parseInt(formData.soldQuantity) * parseFloat(formData.salePrice)).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl hover:from-black hover:to-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  {loading ? <LoadingDots /> : 'Record Sale'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 font-bold shadow-md transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border-2 border-gray-300/50 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-4 border-b-2 border-gray-700">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Add New Customer
              </h2>
            </div>
            
            <form onSubmit={handleAddCustomer} className="p-6 overflow-y-auto" style={{maxHeight: 'calc(90vh - 120px)'}}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-bold text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-bold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="phone"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-bold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="email"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor="customerAddress" className="block text-sm font-bold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="customerAddress"
                    name="address"
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl hover:from-black hover:to-gray-900 font-bold shadow-lg transition-all duration-300"
                >
                  Add Customer
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddCustomerModal(false); setShowModal(true); }}
                  className="flex-1 px-6 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 font-bold shadow-md transition-all duration-300"
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
