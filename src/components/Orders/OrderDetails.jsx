// src/components/Orders/OrderDetails.jsx
import React, { useState } from 'react';
import { X, Truck, CheckCircle, Clock, AlertCircle, Package, User, Phone, Mail, MapPin, Calendar, CreditCard } from 'lucide-react';

const OrderDetails = ({ order, onClose, onUpdateStatus, userRole, type = 'retail' }) => {
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const statusOptions = {
    retail: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
    wholesale: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      out_for_delivery: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
      partially_refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return;
    
    setUpdating(true);
    try {
      await onUpdateStatus(order.id, selectedStatus);
      // Status update successful
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert status on error
      setSelectedStatus(order.status);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Order #{order.orderNumber}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Placed on {new Date(order.date).toLocaleString()}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X size={24} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Status and Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <Truck size={20} className="text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Order Status</h3>
          </div>
          
          {userRole === 'super_admin' || userRole === 'admin' ? (
            <div className="space-y-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                disabled={updating}
              >
                {statusOptions[type].map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
              {selectedStatus !== order.status && (
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              )}
            </div>
          ) : (
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status?.replace('_', ' ').toUpperCase()}
            </span>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <CreditCard size={20} className="text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Payment Status</h3>
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center space-x-3 mb-4">
          <User size={20} className="text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Customer Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <User size={16} className="text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{order.customerName}</p>
            </div>
          </div>
          
          {order.customerEmail && (
            <div className="flex items-center space-x-3">
              <Mail size={16} className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{order.customerEmail}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Phone size={16} className="text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{order.customerPhone || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin size={20} className="text-orange-600 dark:text-orange-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Shipping Address</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
            {order.shippingAddress.country}
          </p>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <Package size={20} className="text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Order Items</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Unit Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Quantity</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {order.items && order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.itemName || item.name}</p>
                    {item.note && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Note: {item.note}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      ₱ {(item.unitPrice || item.price).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.quantity} {item.unit}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      ₱ {(item.totalPrice || (item.quantity * (item.unitPrice || item.price))).toLocaleString()}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Order Summary */}
        <div className="px-6 py-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                ₱ {order.subtotal?.toLocaleString() || '0'}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  -₱ {order.discount.toLocaleString()}
                </span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ₱ {order.tax.toLocaleString()}
                </span>
              </div>
            )}
            {order.deliveryCharge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Delivery Charge:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ₱ {order.deliveryCharge.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-gray-100">Total:</span>
              <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
                ₱ {order.total?.replace('₱ ', '').replace(/,/g, '') || order.total || '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wholesale Note */}
      {type === 'wholesale' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-400">Wholesale Order Note</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                This is a wholesale order. Please verify MOQ compliance and process manually. 
                Contact the customer directly for payment and delivery arrangements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Close Button */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;