// src/components/Orders/OrderList.jsx
import React from 'react';
import { Eye, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import StatusBadge from '../Shared/StatusBadge';

const OrderList = ({ 
  orders, 
  onView, 
  type = 'retail',
  userRole 
}) => {
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'processing':
        return <Clock className="text-yellow-500" size={16} />;
      case 'pending':
        return <Clock className="text-orange-500" size={16} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Truck className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <Truck size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-sm mt-2">All orders will appear here</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="font-mono font-medium text-gray-900 dark:text-gray-100">
                      {order.orderNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.customerEmail || order.customerPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(order.date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {order.total}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <StatusBadge status={order.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      order.type === 'retail' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {order.type === 'retail' ? 'Retail' : 'Wholesale'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onView(order)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;