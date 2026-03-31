// src/pages/Orders/WholesaleOrders.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Filter, Download, Eye, Package, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import OrderList from '../../components/Orders/OrderList';
import OrderDetails from '../../components/Orders/OrderDetails';
import orderService from '../../services/orderService';
import { showSuccess, showError, showLoading, dismissToast } from '../../utils/toastUtils';

const WholesaleOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });
  
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch wholesale orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getWholesaleOrders(filters);
      
      console.log('API Response:', response); // Debug log
      
      const transformedOrders = response.orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customerName: order.user?.firstName && order.user?.lastName 
          ? `${order.user.firstName} ${order.user.lastName}`.trim()
          : order.user?.phone || 'Wholesale Customer',
        customerEmail: order.user?.email || '',
        customerPhone: order.user?.phone || '',
        date: order.createdAt,
        total: `₱ ${order.total.toLocaleString()}`,
        status: order.status,
        paymentStatus: order.paymentStatus,
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount || 0,
        tax: order.tax || 0,
        deliveryCharge: order.deliveryCharge || 0,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        moqMet: true
      }));
      
      setOrders(transformedOrders);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      });
    } catch (error) {
      console.error('Error fetching wholesale orders:', error);
      showError(error.response?.data?.message || 'Failed to fetch wholesale orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  // Handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const filtered = orders.filter(order => 
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setOrders(filtered);
      } else {
        fetchOrders();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleViewOrder = (order) => {
    console.log('Viewing order:', order); // Debug log
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const loadingToast = showLoading('Updating order status...');
    
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      showSuccess('Order status updated successfully');
      dismissToast(loadingToast);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      showError(error.response?.data?.message || 'Failed to update order status');
      dismissToast(loadingToast);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const exportFilters = {
        status: filters.status || undefined,
        paymentStatus: filters.paymentStatus || undefined,
        isWholesale: true,
        startDate: filters.startDate,
        endDate: filters.endDate
      };
      
      const blob = await orderService.exportOrders(exportFilters);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wholesale-orders-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showSuccess('Orders exported successfully');
    } catch (error) {
      console.error('Error exporting orders:', error);
      showError('Failed to export orders');
    } finally {
      setExporting(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const totalValue = orders.reduce((sum, order) => {
    const amount = parseFloat(order.total.replace('₱ ', '').replace(/,/g, '')) || 0;
    return sum + amount;
  }, 0);

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Wholesale Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage wholesale orders with MOQ requirements</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
        >
          {exporting ? <Loader className="animate-spin" size={20} /> : <Download size={20} />}
          <span>{exporting ? 'Exporting...' : 'Export Orders'}</span>
        </button>
      </div>

      {/* Alert */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={32} />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">Wholesale Order Processing</h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              Wholesale orders are based on MOQ and require manual processing. Please verify MOQ compliance 
              before confirming orders.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                placeholder="Search by order # or customer..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{pagination.total}</p>
            </div>
            <Package className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {orders.filter(o => o.status === 'delivered').length}
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
                ₱ {totalValue.toLocaleString()}
              </p>
            </div>
            <Filter className="text-purple-600 dark:text-purple-400" size={32} />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrderList
        orders={orders}
        onView={handleViewOrder}
        onUpdateStatus={handleUpdateStatus}
        type="wholesale"
        userRole={user?.role}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => handleFilterChange('page', page)}
      />

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowOrderDetails(false)}>
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
              <div className="p-6">
                <OrderDetails 
                  order={selectedOrder} 
                  onClose={() => {
                    setShowOrderDetails(false);
                    setSelectedOrder(null);
                  }}
                  onUpdateStatus={handleUpdateStatus}
                  userRole={user?.role}
                  type="wholesale"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WholesaleOrders;