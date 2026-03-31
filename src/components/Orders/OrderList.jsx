// src/components/Orders/OrderList.jsx
import React from 'react';
import { Eye, Truck, CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

const OrderList = ({ orders, onView, onUpdateStatus, type, userRole, loading, pagination, onPageChange }) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600 dark:text-red-400" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Truck size={16} className="text-blue-600 dark:text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-12">
        <div className="flex justify-center items-center">
          <Loader className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No orders found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Payment</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-mono text-sm text-gray-900 dark:text-gray-100">{order.orderNumber}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{order.customerName}</p>
                  {order.customerEmail && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerEmail}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{order.total}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onView(order)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye size={18} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t dark:border-gray-800 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;