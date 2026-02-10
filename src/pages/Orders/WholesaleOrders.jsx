// src/pages/Orders/WholesaleOrders.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Filter, Download, Eye, Package, AlertCircle,CheckCircle } from 'lucide-react';
import OrderList from '../../components/Orders/OrderList';

const WholesaleOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Initialize orders data
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const wholesaleOrders = storedOrders.filter(order => order.type === 'wholesale');
    setOrders(wholesaleOrders);
    setFilteredOrders(wholesaleOrders);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleExport = () => {
    const csv = [
      ['Order ID', 'Customer', 'Date', 'Amount', 'Status', 'MOQ Met'],
      ...filteredOrders.map(order => [
        order.orderNumber,
        order.customerName,
        new Date(order.date).toLocaleDateString(),
        order.total,
        order.status,
        order.moqMet ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wholesale-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Wholesale Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage wholesale orders with MOQ requirements</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Note: Wholesale orders handled manually outside system
          </div>
          <button
            onClick={handleExport}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            <Download size={20} />
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={32} />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">Wholesale Order Processing</h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              Wholesale orders are based on MOQ and handled manually outside the system. 
              No payment gateway or automated tracking is available for wholesale orders.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wholesale orders..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">MOQ Status</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            >
              <option>MOQ verification required</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{orders.length}</p>
            </div>
            <Package className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">MOQ Compliant</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {orders.filter(o => o.moqMet).length}
              </p>
            </div>
            <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                ₱ {orders.reduce((sum, order) => {
                  const amount = parseFloat(order.total.replace('₱ ', '').replace(',', '')) || 0;
                  return sum + amount;
                }, 0).toLocaleString()}
              </p>
            </div>
            <Filter className="text-purple-600 dark:text-purple-400" size={32} />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrderList
        orders={filteredOrders}
        onView={handleViewOrder}
        type="wholesale"
        userRole={user?.role}
      />

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowOrderDetails(false)}>
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
              <div className="px-6 py-4 border-b dark:border-gray-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Wholesale Order Details - {selectedOrder.orderNumber}
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.customerName}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {new Date(selectedOrder.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={20} />
                      <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-400">Manual Processing Required</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          This wholesale order requires manual processing. Please contact the customer directly 
                          for payment and delivery arrangements.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t dark:border-gray-800 pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedOrder.total}</p>
                      </div>
                      <button
                        onClick={() => setShowOrderDetails(false)}
                        className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WholesaleOrders;