'use client';

interface AddCustomerModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function AddCustomerModal({ onClose, onSubmit }: AddCustomerModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border-2 border-orange-200/50">
        <div className="bg-orange-600 p-6 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Add New Customer
          </h2>
          <p className="text-orange-100 mt-1">Create a new customer account</p>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-bold text-gray-900 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                required
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-bold text-gray-900 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="phone"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-bold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="customerEmail"
                name="email"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="customerAddress" className="block text-sm font-bold text-gray-900 mb-2">
                Address
              </label>
              <textarea
                id="customerAddress"
                name="address"
                rows={3}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-orange-700/90 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-500/30"
            >
              Add Customer
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
