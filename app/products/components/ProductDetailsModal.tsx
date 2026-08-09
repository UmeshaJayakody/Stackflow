'use client';

import { useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { useToast } from '../../context/ToastContext';

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

interface ProductDetailsModalProps {
  product: Product;
  stockBatches: StockBatch[];
  onClose: () => void;
  onDelete: (product: Product) => void;
  onOpenPurchase: () => void;
  onOpenSale: () => void;
  onEdit: (product: Product) => void;
  isLowStock: (product: Product) => boolean;
}

export default function ProductDetailsModal({
  product,
  stockBatches,
  onClose,
  onDelete,
  onOpenPurchase,
  onOpenSale,
  onEdit,
  isLowStock
}: ProductDetailsModalProps) {
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (product && qrCodeRef.current) {
      QRCode.toCanvas(qrCodeRef.current, product.sku, {
        width: 200,
        margin: 2,
      });
    }
  }, [product]);

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const url = qrCodeRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${product.sku}-qrcode.png`;
      link.href = url;
      link.click();
    }
  };

  const shareQRCode = async () => {
    if (qrCodeRef.current) {
      try {
        const blob = await new Promise<Blob>((resolve) => {
          qrCodeRef.current!.toBlob((blob) => resolve(blob!));
        });

        const file = new File([blob], `${product.sku}-qrcode.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `QR Code for ${product.productName}`,
            text: `SKU: ${product.sku}`,
            files: [file],
          });
        } else {
          downloadQRCode();
          toast.info('Sharing not supported. QR code has been downloaded instead.');
        }
      } catch (error) {
        console.error('Error sharing QR code:', error);
        toast.error('Failed to share QR code');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border-2 border-blue-200/50">
        <div className="bg-blue-600 p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white">{product.productName}</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
              title="Close"
              aria-label="Close popup"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm">
              <p className="text-sm text-blue-700 font-medium mb-1">SKU</p>
              <p className="text-lg font-bold text-blue-900">{product.sku}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
              <p className="text-sm text-green-700 font-medium mb-1">Category</p>
              <p className="text-lg font-bold text-green-900">{product.category || 'N/A'}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 shadow-sm">
              <p className="text-sm text-purple-700 font-medium mb-1">Unit Price</p>
              <p className="text-lg font-bold text-purple-900">${Number(product.unitPrice).toFixed(2)}</p>
            </div>
            <div className={`p-4 rounded-xl border shadow-sm ${isLowStock(product) ? 'bg-red-50 border-red-200' : 'bg-cyan-50 border-cyan-200'}`}>
              <p className={`text-sm font-medium mb-1 ${isLowStock(product) ? 'text-red-700' : 'text-cyan-700'}`}>Current Stock</p>
              <p className={`text-lg font-bold ${isLowStock(product) ? 'text-red-900' : 'text-cyan-900'}`}>
                {product.quantity} units
                {isLowStock(product) && <span className="text-sm ml-2 text-red-600">(Low Stock!)</span>}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 shadow-sm">
              <p className="text-sm text-yellow-700 font-medium mb-1">Minimum Quantity</p>
              <p className="text-lg font-bold text-yellow-900">{product.minimumQuantity}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 shadow-sm">
              <p className="text-sm text-indigo-700 font-medium mb-1">Maximum Quantity</p>
              <p className="text-lg font-bold text-indigo-900">{product.maximumQuantity}</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 shadow-sm">
              <p className="text-sm text-pink-700 font-medium mb-1">Warehouse</p>
              <p className="text-lg font-bold text-gray-900">{product.warehouse?.warehouseName || 'N/A'}</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 shadow-sm">
              <p className="text-sm text-teal-700 font-medium mb-1">Supplier</p>
              <p className="text-lg font-bold text-teal-900">{product.supplier?.supplierName || 'N/A'}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Product QR Code</h3>
            <div className="flex flex-col items-center mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
              <canvas ref={qrCodeRef} className="border-2 border-blue-300 rounded-lg mb-4 shadow-md"></canvas>
              <p className="text-sm font-semibold text-blue-800 mb-4">SKU: {product.sku}</p>
              <div className="flex gap-3">
                <button
                  onClick={downloadQRCode}
                  className="px-4 py-2 bg-green-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-green-700/90 active:bg-green-800 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl active:shadow-2xl transition-all duration-300 border border-green-500/30 active:border-green-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={shareQRCode}
                  className="px-4 py-2 bg-blue-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700/90 active:bg-blue-800 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl active:shadow-2xl transition-all duration-300 border border-blue-500/30 active:border-blue-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4 border-t pt-4">Stock Batches (FIFO)</h3>
            <div className="mb-6">
              {stockBatches.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Batch Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Supplier
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Purchase Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Qty In
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Remaining
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
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
                              <span className="px-2 py-1 bg-gray-300 text-gray-800 rounded-full text-xs font-bold">
                                Depleted
                              </span>
                            ) : batch.quantityRemaining < (batch.quantityIn * 0.1) ? (
                              <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                                Critical
                              </span>
                            ) : batch.quantityRemaining < (batch.quantityIn * 0.2) ? (
                              <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">
                                Low Stock
                              </span>
                            ) : batch.quantityRemaining < batch.quantityIn ? (
                              <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
                                Partial
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-bold">
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
                <p className="text-blue-600 text-center py-4 bg-blue-50 rounded border border-blue-200">No stock batches found</p>
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4 border-t pt-4">Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { onEdit(product); onClose(); }}
                className="px-6 py-3 bg-blue-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-blue-700/90 active:bg-blue-800 font-semibold shadow-lg hover:shadow-xl active:shadow-2xl transition-all duration-300 border border-blue-500/30 active:border-blue-600"
              >
                Edit Product
              </button>
              <button
                onClick={onOpenPurchase}
                className="px-6 py-3 bg-green-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-700/90 active:bg-green-800 font-semibold shadow-lg hover:shadow-xl active:shadow-2xl transition-all duration-300 border border-green-500/30 active:border-green-600"
              >
                Record Purchase
              </button>
              <button
                onClick={onOpenSale}
                className="px-6 py-3 bg-orange-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-orange-700/90 active:bg-orange-800 font-semibold shadow-lg hover:shadow-xl active:shadow-2xl transition-all duration-300 border border-orange-500/30 active:border-orange-600"
              >
                Record Sale
              </button>
              <button
                onClick={() => { onDelete(product); onClose(); }}
                className="px-6 py-3 bg-red-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-red-700/90 active:bg-red-800 font-semibold shadow-lg hover:shadow-xl active:shadow-2xl transition-all duration-300 border border-red-500/30 active:border-red-600"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
