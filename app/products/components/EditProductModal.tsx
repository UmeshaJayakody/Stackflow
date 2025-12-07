'use client';

import LoadingDots from '../../components/LoadingDots';

interface Warehouse {
  warehouseId: number;
  warehouseName: string;
}

interface Supplier {
  supplierId: number;
  supplierName: string;
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

interface EditProductModalProps {
  show: boolean;
  form: EditProductForm;
  warehouses: Warehouse[];
  suppliers: Supplier[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onFormChange: (form: EditProductForm) => void;
}

export default function EditProductModal({
  show,
  form,
  warehouses,
  suppliers,
  isLoading,
  onClose,
  onSubmit,
  onFormChange
}: EditProductModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border-2 border-blue-200/50 max-h-[calc(90vh-88px)]">
        <div className="sticky top-0 bg-blue-600 text-white p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close edit product modal"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-176px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) => onFormChange({...form, productName: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-gray-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => onFormChange({...form, sku: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-gray-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => onFormChange({...form, category: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-gray-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={form.unitPrice}
                onChange={(e) => onFormChange({...form, unitPrice: e.target.value})}
                required
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-gray-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Warehouse *
              </label>
              <select
                value={form.warehouseId}
                onChange={(e) => onFormChange({...form, warehouseId: e.target.value})}
                required
                title="Select a warehouse"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-gray-500 transition-all"
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
                value={form.supplierId}
                onChange={(e) => onFormChange({...form, supplierId: e.target.value})}
                required
                title="Select a supplier"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-gray-500 transition-all"
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
                value={form.quantity}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed transition-all"
                title="Quantity is managed through purchases and sales"
              />
              <p className="text-xs text-gray-500 mt-1">Updated via purchases/sales</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Quantity
              </label>
              <input
                type="number"
                value={form.minimumQuantity}
                onChange={(e) => onFormChange({...form, minimumQuantity: e.target.value})}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-gray-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Quantity
              </label>
              <input
                type="number"
                value={form.maximumQuantity}
                onChange={(e) => onFormChange({...form, maximumQuantity: e.target.value})}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-gray-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-blue-700/90 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30"
            >
              {isLoading ? <LoadingDots /> : 'Update Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 bg-white/60 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/80 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200/50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
