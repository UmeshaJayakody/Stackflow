'use client';

import Link from 'next/link';
import LoadingDots from '../../components/LoadingDots';

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

interface EditProductForm {
  productId: number;
  productName: string;
  sku: string;
  category: string;
  unitPrice: string;
  quantity: string;
  minimumQuantity: string;
  maximumQuantity: string;
  warehouseId: string;
  supplierId: string;
}

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  isLowStock: (product: Product) => boolean;
  onProductClick: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductsTable({
  products,
  loading,
  isLowStock,
  onProductClick,
  onEdit,
  onDelete
}: ProductsTableProps) {
  if (loading) {
    return (
      <div className="text-center py-12 bg-white/40">
        <LoadingDots />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white/40">
        <p className="text-gray-700 font-semibold">No products found</p>
        <Link
          href="/products/new"
          className="mt-4 inline-block px-4 py-2 bg-gray-900/80 backdrop-blur-sm text-white rounded-xl hover:bg-gray-800/90 font-semibold shadow-lg transition-all duration-300 border border-gray-700/30"
        >
          Add Your First Product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-600/90">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Supplier
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Warehouse
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Recorded By
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white/80 divide-y divide-gray-200">
          {products.map((product, index) => (
            <tr 
              key={product.productId} 
              className={`hover:bg-blue-50/60 cursor-pointer transition-all duration-200 ${index % 2 === 0 ? 'bg-white/70' : 'bg-blue-50/40'}`}
              onClick={() => onProductClick(product)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900">
                  {product.productName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-blue-700">{product.sku}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 text-xs font-bold bg-purple-200/70 text-purple-800 rounded-full">
                  {product.category || 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">{product.supplier?.supplierName || 'N/A'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-green-700">
                  ${Number(product.unitPrice).toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${
                      isLowStock(product)
                        ? 'bg-red-200/80 text-red-800'
                        : 'bg-green-200/70 text-green-800'
                    }`}
                  >
                    {product.quantity} units
                  </span>
                  {isLowStock(product) && (
                    <span className="text-xs text-red-600 mt-1 font-semibold">Low Stock!</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {product.warehouse?.warehouseName || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                {product.creator?.fullName || 'System'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onEdit(product);
                    }}
                    className="px-3 py-1.5 bg-blue-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700/90 font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/30"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(product); }}
                    className="px-3 py-1.5 bg-red-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-700/90 font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-300 border border-red-500/30"
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
  );
}
