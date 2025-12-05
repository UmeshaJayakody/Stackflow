'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface Product {
  productId: number;
  productName: string;
  sku: string;
  category: string | null;
  unitPrice: number;
  quantity: number;
  minimumQuantity: number;
  maximumQuantity: number;
  warehouse: {
    warehouseId: number;
    warehouseName: string;
  } | null;
  supplier: {
    supplierId: number;
    supplierName: string;
  } | null;
  creator: {
    userId: number;
    fullName: string;
  } | null;
  createdAt: string;
}

interface Warehouse {
  warehouseId: number;
  warehouseName: string;
}

interface Supplier {
  supplierId: number;
  supplierName: string;
}

interface StockBatch {
  batchId: number;
  productId: number;
  purchaseId: number;
  quantityIn: number;
  quantityRemaining: number;
  purchasePrice: number;
  batchDate: string;
  purchase: {
    supplier: {
      supplierName: string;
    };
  };
}

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [stockBatches, setStockBatches] = useState<StockBatch[]>([]);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  // Calculate if product is low stock (current <= min + 10% of range)
  const isLowStock = (product: Product) => {
    const range = product.maximumQuantity - product.minimumQuantity;
    const threshold = product.minimumQuantity + (range * 0.10);
    return product.quantity <= threshold;
  };

  useEffect(() => {
    fetchWarehouses();
    fetchSuppliers();
    fetchProducts();
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedWarehouse, selectedCategory, selectedSupplier]);

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

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchStockBatches = async (productId: number) => {
    try {
      const response = await fetch(`/api/stock-batches?productId=${productId}`);
      const data = await response.json();
      setStockBatches(data);
    } catch (error) {
      console.error('Error fetching stock batches:', error);
      setStockBatches([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedWarehouse) params.append('warehouseId', selectedWarehouse);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSupplier) params.append('supplierId', selectedSupplier);

      const response = await fetch(`/api/products?${params}`);
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(result.data.map((p: Product) => p.category).filter(Boolean))] as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete ${product.productName}? This will create a sale record for ${product.quantity} units at $0.`)) return;

    try {
      // Create a sale for all quantity at $0 before deleting
      if (product.quantity > 0 && customers.length > 0) {
        await fetch('/api/sales', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-id': user?.userId.toString() || '',
          },
          body: JSON.stringify({
            customerId: customers[0].customerId, // Use first customer
            productId: product.productId,
            soldQuantity: product.quantity,
            salePrice: 0,
            createdBy: user?.userId,
          }),
        });
      }

      const response = await fetch(`/api/products/${product.productId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.userId.toString() || '',
        },
      });
      const result = await response.json();
      
      if (result.success) {
        alert('Product deleted successfully with sale record created');
        fetchProducts();
      } else {
        alert('Failed to delete product: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product');
    }
  };

  const handleQuickPurchase = async (product: Product) => {
    if (suppliers.length === 0) {
      alert('Please add a supplier first');
      return;
    }

    try {
      const supplierId = product.supplier?.supplierId || suppliers[0].supplierId;
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId,
          productId: product.productId,
          purchasedQuantity: 1,
          purchasePrice: product.unitPrice,
        }),
      });
      
      if (response.ok) {
        alert('Purchase of 1 unit recorded successfully');
        fetchProducts();
      } else {
        alert('Failed to record purchase');
      }
    } catch (error) {
      console.error('Error recording purchase:', error);
      alert('An error occurred while recording purchase');
    }
  };

  const handleQuickSale = async (product: Product) => {
    if (customers.length === 0) {
      alert('Please add a customer first');
      return;
    }

    if (product.quantity < 1) {
      alert('Insufficient stock');
      return;
    }

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customers[0].customerId,
          productId: product.productId,
          soldQuantity: 1,
          salePrice: product.unitPrice,
        }),
      });
      
      if (response.ok) {
        alert('Sale of 1 unit recorded successfully');
        fetchProducts();
      } else {
        alert('Failed to record sale');
      }
    } catch (error) {
      console.error('Error recording sale:', error);
      alert('An error occurred while recording sale');
    }
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailPopup(true);
    // Generate QR code after popup opens
    setTimeout(() => generateQRCode(product.sku), 100);
    // Fetch stock batches for this product
    fetchStockBatches(product.productId);
  };

  const generateQRCode = async (sku: string) => {
    const canvas = qrCodeRef.current;
    if (!canvas) return;

    const QRCode = (await import('qrcode')).default;
    try {
      await QRCode.toCanvas(canvas, sku, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    const canvas = qrCodeRef.current;
    if (!canvas || !selectedProduct) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${selectedProduct.sku}-qrcode.png`;
    link.href = url;
    link.click();
  };

  const shareQRCode = async () => {
    const canvas = qrCodeRef.current;
    if (!canvas || !selectedProduct) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], `${selectedProduct.sku}-qrcode.png`, { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `QR Code - ${selectedProduct.productName}`,
            text: `SKU: ${selectedProduct.sku}`,
            files: [file],
          });
        } else {
          // Fallback: copy to clipboard or download
          canvas.toBlob(async (blob) => {
            if (blob && navigator.clipboard) {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              alert('QR code copied to clipboard!');
            } else {
              downloadQRCode();
            }
          });
        }
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      alert('Unable to share. QR code will be downloaded instead.');
      downloadQRCode();
    }
  };

  const openPurchaseModal = () => {
    setShowDetailPopup(false);
    setShowPurchaseModal(true);
  };

  const openSaleModal = () => {
    setShowDetailPopup(false);
    setShowSaleModal(true);
  };

  const handleAddSupplier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
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
        setShowPurchaseModal(true);
        // Set the newly created supplier as selected
        setTimeout(() => {
          const selectElement = document.getElementById('supplierId') as HTMLSelectElement;
          if (selectElement) {
            selectElement.value = newSupplier.supplierId.toString();
          }
        }, 100);
      } else {
        alert('Failed to add supplier');
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('An error occurred');
    }
  };

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
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
        setShowSaleModal(true);
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

  const handlePurchaseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: formData.get('supplierId'),
          productId: selectedProduct?.productId,
          purchasedQuantity: formData.get('quantity'),
          purchasePrice: formData.get('price'),
        }),
      });
      
      if (response.ok) {
        alert('Purchase recorded successfully');
        setShowPurchaseModal(false);
        setSelectedProduct(null);
        fetchProducts();
      } else {
        alert('Failed to record purchase');
      }
    } catch (error) {
      console.error('Error recording purchase:', error);
      alert('An error occurred');
    }
  };

  const handleSaleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: formData.get('customerId'),
          productId: selectedProduct?.productId,
          soldQuantity: formData.get('quantity'),
          salePrice: formData.get('price'),
        }),
      });
      
      if (response.ok) {
        alert('Sale recorded successfully');
        setShowSaleModal(false);
        setSelectedProduct(null);
        fetchProducts();
      } else {
        const result = await response.json();
        alert('Failed to record sale: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error recording sale:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">Manage your inventory</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                ← Home
              </Link>
              <Link
                href="/products/new"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                + Add Product
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name or SKU
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter product name or SKU..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="supplierFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Supplier
              </label>
              <select
                id="supplierFilter"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.supplierName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="warehouseFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Warehouse
              </label>
              <select
                id="warehouseFilter"
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Warehouses</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.warehouseId} value={warehouse.warehouseId}>
                    {warehouse.warehouseName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Products ({products.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
              <Link
                href="/products/new"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Warehouse
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recorded By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr 
                      key={product.productId} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => openProductDetails(product)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.productName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.sku}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          {product.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.supplier?.supplierName || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${Number(product.unitPrice).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isLowStock(product)
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {product.quantity} units
                          </span>
                          {isLowStock(product) && (
                            <span className="text-xs text-red-600 mt-1">Low Stock!</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.warehouse?.warehouseName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.creator?.fullName || 'System'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/products/${product.productId}`); }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(product); }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Product Details Popup */}
      {showDetailPopup && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.productName}</h2>
              <button
                onClick={() => { setShowDetailPopup(false); setSelectedProduct(null); }}
                className="text-gray-400 hover:text-gray-600"
                title="Close"
                aria-label="Close popup"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">SKU</p>
                <p className="text-lg font-semibold text-gray-900">{selectedProduct.sku}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="text-lg font-semibold text-gray-900">{selectedProduct.category || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unit Price</p>
                <p className="text-lg font-semibold text-green-600">${Number(selectedProduct.unitPrice).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Stock</p>
                <p className={`text-lg font-semibold ${isLowStock(selectedProduct) ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedProduct.quantity} units
                  {isLowStock(selectedProduct) && <span className="text-sm ml-2">(Low Stock!)</span>}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Minimum Quantity</p>
                <p className="text-lg font-semibold text-gray-900">{selectedProduct.minimumQuantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Maximum Quantity</p>
                <p className="text-lg font-semibold text-gray-900">{selectedProduct.maximumQuantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Warehouse</p>
                <p className="text-lg font-semibold text-gray-900">{selectedProduct.warehouse?.warehouseName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Supplier</p>
                <p className="text-lg font-semibold text-gray-900">{selectedProduct.supplier?.supplierName || 'N/A'}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product QR Code</h3>
              <div className="flex flex-col items-center mb-6">
                <canvas ref={qrCodeRef} className="border-2 border-gray-300 rounded-lg mb-4"></canvas>
                <p className="text-sm text-gray-600 mb-4">SKU: {selectedProduct.sku}</p>
                <div className="flex gap-3">
                  <button
                    onClick={downloadQRCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={shareQRCode}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-t pt-4">Stock Batches (FIFO)</h3>
              <div className="mb-6">
                {stockBatches.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Batch Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Supplier
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Purchase Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Qty In
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remaining
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stockBatches.map((batch) => (
                          <tr key={batch.batchId}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {new Date(batch.batchDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {batch.purchase.supplier.supplierName}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${parseFloat(batch.purchasePrice.toString()).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {batch.quantityIn}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {batch.quantityRemaining}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {batch.quantityRemaining === 0 ? (
                                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                                  Depleted
                                </span>
                              ) : batch.quantityRemaining < batch.quantityIn ? (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                  Partial
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                  Available
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4 bg-gray-50 rounded">No stock batches found</p>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-t pt-4">Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={openPurchaseModal}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Record Purchase
                </button>
                <button
                  onClick={openSaleModal}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Record Sale
                </button>
                <button
                  onClick={() => { handleDelete(selectedProduct); setShowDetailPopup(false); setSelectedProduct(null); }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium col-span-2"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Record Purchase</h2>
            <p className="text-gray-600 mb-4">Product: <span className="font-semibold">{selectedProduct.productName}</span></p>
            
            <form onSubmit={handlePurchaseSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier *
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="supplierId"
                      name="supplierId"
                      required
                      defaultValue={selectedProduct.supplier?.supplierId || ''}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                      onClick={() => { setShowPurchaseModal(false); setShowAddSupplierModal(true); }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium whitespace-nowrap"
                      title="Add New Supplier"
                    >
                      + Add New
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    min="1"
                    defaultValue="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price (per unit) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    step="0.01"
                    min="0"
                    defaultValue={Number(selectedProduct.unitPrice).toFixed(2)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Record Purchase
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPurchaseModal(false); setShowDetailPopup(true); }}
                  className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sale Modal */}
      {showSaleModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Record Sale</h2>
            <p className="text-gray-600 mb-4">Product: <span className="font-semibold">{selectedProduct.productName}</span></p>
            <p className="text-sm text-gray-600 mb-4">Available Stock: <span className="font-semibold text-green-600">{selectedProduct.quantity} units</span></p>
            
            <form onSubmit={handleSaleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer *
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="customerId"
                      name="customerId"
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                      onClick={() => { setShowSaleModal(false); setShowAddCustomerModal(true); }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium whitespace-nowrap"
                      title="Add New Customer"
                    >
                      + Add New
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="saleQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="saleQuantity"
                    name="quantity"
                    required
                    min="1"
                    max={selectedProduct.quantity}
                    defaultValue="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price (per unit) *
                  </label>
                  <input
                    type="number"
                    id="salePrice"
                    name="price"
                    required
                    step="0.01"
                    min="0"
                    defaultValue={Number(selectedProduct.unitPrice).toFixed(2)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
                >
                  Record Sale
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSaleModal(false); setShowDetailPopup(true); }}
                  className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
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
                  onClick={() => { setShowAddSupplierModal(false); setShowPurchaseModal(true); }}
                  className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Customer</h2>
            
            <form onSubmit={handleAddCustomer}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="customerAddress"
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
                  Add Customer
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddCustomerModal(false); setShowSaleModal(true); }}
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
