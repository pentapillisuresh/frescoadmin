// src/components/Orders/OrderDetails.jsx
import React from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Package, CreditCard, Truck, CheckCircle,
  Printer, Download, Share2 
} from 'lucide-react';
import StatusBadge from '../Shared/StatusBadge';

const OrderDetails = ({ order, onClose, userRole }) => {
  if (!order) return null;

  const orderItems = [
    { id: 1, name: 'Fresh Tomatoes', quantity: 2, price: '₱ 240', total: '₱ 480' },
    { id: 2, name: 'Milk 1L', quantity: 1, price: '₱ 80', total: '₱ 80' },
    { id: 3, name: 'Chicken Pulav', quantity: 3, price: '₱ 200', total: '₱ 600' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Order Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {order.orderNumber} • {order.type === 'retail' ? 'Retail Order' : 'Wholesale Order'}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Print Order"
          >
            <Printer size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Close"
          >
            <Download size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Order Items
            </h3>
            <div className="space-y-4">
              {orderItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Package size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {item.price}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total: {item.total}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t dark:border-gray-800">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium">₱ 1,160</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium">₱ 50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium">₱ 116</span>
                </div>
                <div className="flex justify-between pt-3 border-t dark:border-gray-800">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {order.total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Notes */}
          {order.notes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                Customer Notes
              </h4>
              <p className="text-yellow-700 dark:text-yellow-300">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar - Order & Customer Info */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Order Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Truck className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Status</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CreditCard className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Payment</p>
                    <StatusBadge status={order.paymentStatus || 'paid'} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Order Date</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {userRole === 'super_admin' && (
              <div className="mt-6 space-y-2">
                <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Update Status
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                  Send Notification
                </button>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Customer Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="text-gray-500 dark:text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {order.customerName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-500 dark:text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {order.customerEmail || 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-500 dark:text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {order.customerPhone || 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="text-gray-500 dark:text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {order.customerAddress || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;