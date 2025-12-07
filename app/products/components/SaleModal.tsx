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

interface Customer {
  customerId: number;
  customerName: string;
}

interface SaleModalProps {
  product: Product;
  customers: Customer[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onAddCustomer: () => void;
}

export default function SaleModal({
  product,
  customers,
  onClose,
  onSubmit,
  onAddCustomer
}: SaleModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border-2 border-orange-200/50">
        <div className="bg-orange-600 p-6 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Record Sale
          </h2>
          <div className="flex items-center justify-between mt-2">
            <p className="text-orange-100">Product: <span className="font-bold">{product.productName}</span></p>
            <p className="text-sm text-orange-100">Stock: <span className="font-bold">{product.quantity}</span></p>
          </div>
        </div>
        
        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="customerId" className="block text-sm font-bold text-gray-900 mb-2">
                Customer *
              </label>
              <div className="flex gap-2">
                <select
                  id="customerId"
                  name="customerId"
                  required
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                  onClick={onAddCustomer}
                  className="px-4 py-2.5 bg-orange-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-orange-700/90 active:bg-orange-800 font-semibold whitespace-nowrap shadow-lg hover:shadow-xl active:shadow-2xl transition-all duration-300 border border-orange-500/30 active:border-orange-600"
                  title="Add New Customer"
                >
                  + Add
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="saleQuantity" className="block text-sm font-bold text-gray-900 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                id="saleQuantity"
                name="quantity"
                required
                min="1"
                max={product.quantity}
                defaultValue="1"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="salePrice" className="block text-sm font-bold text-gray-900 mb-2">
                Sale Price (per unit) *
              </label>
              <input
                type="number"
                id="salePrice"
                name="price"
                required
                step="0.01"
                min="0"
                defaultValue={Number(product.unitPrice).toFixed(2)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-orange-700/90 active:bg-orange-800 font-semibold shadow-xl hover:shadow-2xl active:shadow-2xl transition-all duration-300 border border-orange-500/30 active:border-orange-600"
            >
              Record Sale
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-800 rounded-xl hover:bg-white/90 active:bg-white/95 font-semibold transition-all duration-300 border border-gray-300/50 active:border-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
