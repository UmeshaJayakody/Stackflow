'use client';

interface AddSupplierModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function AddSupplierModal({ onClose, onSubmit }: AddSupplierModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border-2 border-green-200/50">
        <div className="bg-green-600 p-6 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add New Supplier
          </h2>
          <p className="text-green-100 mt-1">Create a new supplier account</p>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            <div>
              <label htmlFor="supplierName" className="block text-sm font-bold text-gray-900 mb-2">
                Supplier Name *
              </label>
              <input
                type="text"
                id="supplierName"
                name="supplierName"
                required
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="contactPerson" className="block text-sm font-bold text-gray-900 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-bold text-gray-900 mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-700/90 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-500/30"
            >
              Add Supplier
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-800 rounded-xl hover:bg-white/90 font-semibold transition-all duration-300 border border-gray-300/50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
