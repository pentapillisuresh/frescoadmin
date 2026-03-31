// src/services/orderService.js
import axiosInstance from '../utils/axiosInterceptor';
import { API_ENDPOINTS } from '../config/api';

const orderService = {
  // Get all orders with filters
  getAllOrders: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.isWholesale !== undefined) params.append('isWholesale', filters.isWholesale);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS.BASE}?${params.toString()}`);
      
      // Transform and return orders
      return {
        orders: response.data.orders || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        totalPages: response.data.totalPages || 0
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get retail orders (isWholesale = false)
  getRetailOrders: async (filters = {}) => {
    try {
      const retailFilters = {
        ...filters,
        isWholesale: false
      };
      return await orderService.getAllOrders(retailFilters);
    } catch (error) {
      console.error('Error fetching retail orders:', error);
      throw error;
    }
  },

  // Get wholesale orders (isWholesale = true)
  getWholesaleOrders: async (filters = {}) => {
    try {
      const wholesaleFilters = {
        ...filters,
        isWholesale: true
      };
      return await orderService.getAllOrders(wholesaleFilters);
    } catch (error) {
      console.error('Error fetching wholesale orders:', error);
      throw error;
    }
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS.BASE}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.ORDERS.BASE}/${orderId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderId, paymentStatus) => {
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.ORDERS.BASE}/${orderId}/payment`,
        { paymentStatus }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId, reason = '') => {
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.ORDERS.BASE}/${orderId}/cancel`,
        { reason }
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  // Export orders to CSV
  exportOrders: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.isWholesale !== undefined) params.append('isWholesale', filters.isWholesale);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.ORDERS.BASE}/export?${params.toString()}`,
        { responseType: 'blob' }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.ORDERS.BASE}/stats?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
};

export default orderService;