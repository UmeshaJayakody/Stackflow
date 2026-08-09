'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingDots from '../components/LoadingDots';
import ProductDetailsModal from './components/ProductDetailsModal';
import PurchaseModal from './components/PurchaseModal';
import SaleModal from './components/SaleModal';
import AddSupplierModal from './components/AddSupplierModal';
import AddCustomerModal from './components/AddCustomerModal';
import AddProductModal from './components/AddProductModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import EditProductModal from './components/EditProductModal';
import ProductsTable from './components/ProductsTable';

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
  const toast = useToast();
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
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editProductForm, setEditProductForm] = useState({
    productId: 0,
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
  const [newProductForm, setNewProductForm] = useState({
    productName: '',
    sku: '',
    category: '',
    unitPrice: '',
    minimumQuantity: '0',
    maximumQuantity: '0',
    warehouseId: '',
    supplierId: '',
  });

  // Calculate if product is low stock (current <= min + 10% of range)
  const isLowStock = (product: Product) => {
    const range = product.maximumQuantity - product.minimumQuantity;
    const threshold = product.minimumQuantity + (range * 0.10);
    return product.quantity <= threshold;
  };

  // Handle productId from URL query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const productId = searchParams.get('productId');
    
    if (productId && products.length > 0) {
      const product = products.find(p => p.productId === parseInt(productId));
      if (product) {
        openProductDetails(product);
        // Clean up URL
        window.history.replaceState({}, '', '/products');
      }
    }
  }, [products]);

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
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setIsLoading(true);
    try {
      // Create a sale for all quantity at $0 before deleting
      if (productToDelete.quantity > 0 && customers.length > 0) {
        await fetch('/api/sales', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-id': user?.userId.toString() || '',
          },
          body: JSON.stringify({
            customerId: customers[0].customerId, // Use first customer
            productId: productToDelete.productId,
            soldQuantity: productToDelete.quantity,
            salePrice: 0,
            createdBy: user?.userId,
          }),
        });
      }

      const response = await fetch(`/api/products/${productToDelete.productId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.userId.toString() || '',
        },
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success('Product deleted successfully with sale record created');
        fetchProducts();
        setShowDeleteModal(false);
        setProductToDelete(null);
      } else {
        toast.error('Failed to delete product: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('An error occurred while deleting the product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPurchase = async (product: Product) => {
    if (suppliers.length === 0) {
      toast.warning('Please add a supplier first');
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
        toast.success('Purchase of 1 unit recorded successfully');
        fetchProducts();
      } else {
        toast.error('Failed to record purchase');
      }
    } catch (error) {
      console.error('Error recording purchase:', error);
      toast.error('An error occurred while recording purchase');
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${editProductForm.productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: editProductForm.productName,
          sku: editProductForm.sku,
          category: editProductForm.category,
          unitPrice: parseFloat(editProductForm.unitPrice),
          quantity: parseInt(editProductForm.quantity),
          minimumQuantity: parseInt(editProductForm.minimumQuantity),
          maximumQuantity: parseInt(editProductForm.maximumQuantity),
          warehouseId: parseInt(editProductForm.warehouseId),
          supplierId: parseInt(editProductForm.supplierId),
        }),
      });

      if (response.ok) {
        toast.success('Product updated successfully');
        setShowEditProductModal(false);
        setEditProductForm({
          productId: 0,
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
        fetchProducts();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An error occurred while updating product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSale = async (product: Product) => {
    if (customers.length === 0) {
      toast.warning('Please add a customer first');
      return;
    }

    if (product.quantity < 1) {
      toast.warning('Insufficient stock');
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
        toast.success('Sale of 1 unit recorded successfully');
        fetchProducts();
      } else {
        toast.error('Failed to record sale');
      }
    } catch (error) {
      console.error('Error recording sale:', error);
      toast.error('An error occurred while recording sale');
    }
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailPopup(true);
    // Fetch stock batches for this product
    fetchStockBatches(product.productId);
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
        if (showPurchaseModal) {
          setShowPurchaseModal(true);
        } else {
          setShowAddProductModal(true);
        }
        // Set the newly created supplier as selected in the appropriate modal
        setTimeout(() => {
          const selectElement = document.querySelector('select[name="supplierId"]') as HTMLSelectElement;
          if (selectElement) {
            selectElement.value = newSupplier.supplierId.toString();
            // Update the form state if we're in add product modal
            if (showAddProductModal) {
              setNewProductForm(prev => ({ ...prev, supplierId: newSupplier.supplierId.toString() }));
            }
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

  const handleAddWarehouse = () => {
    // Navigate to warehouse management page
    window.location.href = '/warehouses';
  };

  const handleAddSupplierFromProduct = () => {
    setShowAddProductModal(false);
    setShowAddSupplierModal(true);
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
        toast.error('Failed to add customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
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
          minimumQuantity: parseInt(newProductForm.minimumQuantity),
          maximumQuantity: parseInt(newProductForm.maximumQuantity),
          warehouseId: parseInt(newProductForm.warehouseId),
          supplierId: parseInt(newProductForm.supplierId),
        }),
      });
      
      if (response.ok) {
        toast.success('Product added successfully!');
        setShowAddProductModal(false);
        setNewProductForm({
          productName: '',
          sku: '',
          category: '',
          unitPrice: '',
          minimumQuantity: '0',
          maximumQuantity: '0',
          warehouseId: '',
          supplierId: '',
        });
        fetchProducts();
      } else {
        const result = await response.json();
        toast.error('Failed to add product: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('An error occurred while adding the product');
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
        toast.success('Purchase recorded successfully');
        setShowPurchaseModal(false);
        setSelectedProduct(null);
        fetchProducts();
      } else {
        toast.error('Failed to record purchase');
      }
    } catch (error) {
      console.error('Error recording purchase:', error);
      toast.error('An error occurred');
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
        toast.success('Sale recorded successfully');
        setShowSaleModal(false);
        setSelectedProduct(null);
        fetchProducts();
      } else {
        const result = await response.json();
        toast.error('Failed to record sale: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error recording sale:', error);
      toast.error('An error occurred');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/40 backdrop-blur-md shadow-2xl border-b border-gray-200/50 pt-16">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 py-6">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Products</h1>
              <p className="text-gray-600 mt-1">Manage your inventory</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        {/* Filters */}
        <div className="bg-gradient-to-br from-blue-50/60 to-cyan-50/40 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-3xl border border-blue-200/50 p-6 mb-6 transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Filter Products</h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600/80 backdrop-blur-sm rounded-lg hover:bg-blue-700/90 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 border border-blue-500/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
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
                  <option key={supplier.supplierId} value={supplier.supplierId.toString()}>
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
                  <option key={warehouse.warehouseId} value={warehouse.warehouseId.toString()}>
                    {warehouse.warehouseName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl hover:shadow-3xl overflow-hidden transition-shadow duration-300">
            <div className="px-6 py-4 border-b border-gray-200/50 bg-blue-600/90">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-blue-600/80 backdrop-blur-sm shadow-3xl shadow-blue-600/50 ring-4 ring-blue-100/30 border border-blue-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              </span>
              <span>All Products ({products.length})</span>
            </h2>
            </div>
          
          <ProductsTable
            products={products}
            loading={loading}
            isLowStock={isLowStock}
            onProductClick={openProductDetails}
            onEdit={(product) => {
              setEditProductForm({
                productId: product.productId,
                productName: product.productName,
                sku: product.sku,
                category: product.category || '',
                unitPrice: product.unitPrice.toString(),
                quantity: product.quantity.toString(),
                minimumQuantity: product.minimumQuantity.toString(),
                maximumQuantity: product.maximumQuantity.toString(),
                warehouseId: product.warehouse?.warehouseId.toString() || '',
                supplierId: product.supplier?.supplierId.toString() || '',
              });
              setShowEditProductModal(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {/* Modals */}
      {showDetailPopup && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          stockBatches={stockBatches}
          onClose={() => { setShowDetailPopup(false); setSelectedProduct(null); }}
          onDelete={handleDelete}
          onOpenPurchase={openPurchaseModal}
          onOpenSale={openSaleModal}
          onEdit={(product) => {
            setEditProductForm({
              productId: product.productId,
              productName: product.productName,
              sku: product.sku,
              category: product.category || '',
              unitPrice: product.unitPrice.toString(),
              quantity: product.quantity.toString(),
              minimumQuantity: product.minimumQuantity.toString(),
              maximumQuantity: product.maximumQuantity.toString(),
              warehouseId: product.warehouse?.warehouseId.toString() || '',
              supplierId: product.supplier?.supplierId.toString() || '',
            });
            setShowEditProductModal(true);
          }}
          isLowStock={isLowStock}
        />
      )}

      {showPurchaseModal && selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          suppliers={suppliers}
          onClose={() => { setShowPurchaseModal(false); setShowDetailPopup(true); }}
          onSubmit={handlePurchaseSubmit}
          onAddSupplier={() => { setShowPurchaseModal(false); setShowAddSupplierModal(true); }}
        />
      )}

      {showSaleModal && selectedProduct && (
        <SaleModal
          product={selectedProduct}
          customers={customers}
          onClose={() => { setShowSaleModal(false); setShowDetailPopup(true); }}
          onSubmit={handleSaleSubmit}
          onAddCustomer={() => { setShowSaleModal(false); setShowAddCustomerModal(true); }}
        />
      )}

      {showAddSupplierModal && (
        <AddSupplierModal
          onClose={() => { setShowAddSupplierModal(false); setShowPurchaseModal(true); }}
          onSubmit={handleAddSupplier}
        />
      )}

      {showAddCustomerModal && (
        <AddCustomerModal
          onClose={() => { setShowAddCustomerModal(false); setShowSaleModal(true); }}
          onSubmit={handleAddCustomer}
        />
      )}

      <AddProductModal
        show={showAddProductModal}
        form={newProductForm}
        warehouses={warehouses}
        suppliers={suppliers}
        onClose={() => setShowAddProductModal(false)}
        onSubmit={handleAddProduct}
        onFormChange={setNewProductForm}
        onAddSupplier={handleAddSupplierFromProduct}
        onAddWarehouse={handleAddWarehouse}
      />

      <EditProductModal
        show={showEditProductModal}
        form={editProductForm}
        warehouses={warehouses}
        suppliers={suppliers}
        isLoading={isLoading}
        onClose={() => setShowEditProductModal(false)}
        onSubmit={handleEditProduct}
        onFormChange={setEditProductForm}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        product={productToDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
