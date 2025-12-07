'use client';

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

interface Supplier {
  supplierId: number;
  supplierName: string;
}

interface PurchaseModalProps {
  product: Product;
  suppliers: Supplier[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onAddSupplier: () => void;
}

export default function PurchaseModal({
  product,
  suppliers,
  onClose,
  onSubmit,
  onAddSupplier
}: PurchaseModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border-2 border-green-200/50">
        <div className="bg-green-600 p-6 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Record Purchase
          </h2>
          <p className="text-green-100 mt-1">Product: <span className="font-bold">{product.productName}</span></p>
        </div>
        
        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="supplierId" className="block text-sm font-bold text-gray-900 mb-2">
                Supplier *
              </label>
              <div className="flex gap-2">
                <select
                  id="supplierId"
                  name="supplierId"
                  required
                  defaultValue={product.supplier?.supplierId || ''}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                  onClick={onAddSupplier}
                  className="px-4 py-2.5 bg-green-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-700/90 active:bg-green-800 font-semibold whitespace-nowrap shadow-lg hover:shadow-xl active:shadow-2xl transition-all duration-300 border border-green-500/30 active:border-green-600"
                  title="Add New Supplier"
                >
                  + Add
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-bold text-gray-900 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                required
                min="1"
                defaultValue="1"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-bold text-gray-900 mb-2">
                Purchase Price (per unit) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                step="0.01"
                min="0"
                defaultValue={Number(product.unitPrice).toFixed(2)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-700/90 active:bg-green-800 font-semibold shadow-xl hover:shadow-2xl active:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-green-500/30 active:border-green-600"
            >
              Record Purchase
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/60 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/80 active:bg-white/90 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl active:shadow-2xl border border-gray-200/50 active:border-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
