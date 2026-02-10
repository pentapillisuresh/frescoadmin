// src/pages/Orders/RetailOrders.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Filter, Download, Eye, Truck, CheckCircle } from 'lucide-react';
import OrderList from '../../components/Orders/OrderList';
import OrderDetails from '../../components/Orders/OrderDetails';

const RetailOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Initialize orders data
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const retailOrders = storedOrders.filter(order => order.type === 'retail');
    setOrders(retailOrders);
    setFilteredOrders(retailOrders);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const orderDate = new Date(filtered.date);
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => 
            new Date(order.date).toDateString() === today.toDateString()
          );
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => new Date(order.date) >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => new Date(order.date) >= monthAgo);
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, dateFilter]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    // Update localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedAllOrders = allOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedAllOrders));
  };

  const handleExport = () => {
    // Export orders as CSV
    const csv = [
      ['Order ID', 'Customer', 'Date', 'Amount', 'Status', 'Payment'],
      ...filteredOrders.map(order => [
        order.orderNumber,
        order.customerName,
        new Date(order.date).toLocaleDateString(),
        order.total,
        order.status,
        order.paymentStatus || 'Paid'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retail-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: filteredOrders.length,
    completed: filteredOrders.filter(o => o.status === 'completed').length,
    processing: filteredOrders.filter(o => o.status === 'processing').length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Retail Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track retail customer orders</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
        >
          <Download size={20} />
          <span>Export Orders</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.total}</p>
            </div>
            <Truck className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.completed}</p>
            </div>
            <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.processing}</p>
            </div>
            <Truck className="text-yellow-600 dark:text-yellow-400" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.pending}</p>
            </div>
            <Filter className="text-red-600 dark:text-red-400" size={32} />
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
                placeholder="Search orders..."
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
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrderList
        orders={filteredOrders}
        onView={handleViewOrder}
        type="retail"
        userRole={user?.role}
      />

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowOrderDetails(false)}>
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl w-full">
              <div className="px-6 py-4 border-b dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Order Details - {selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <Eye size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <OrderDetails 
                  order={selectedOrder} 
                  onClose={() => setShowOrderDetails(false)}
                  userRole={user?.role}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailOrders;