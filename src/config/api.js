// src/config/api.js
const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  AUTH: {
    ADMIN_LOGIN: '/auth/admin-login',
    STAFF_LOGIN: '/auth/staff-login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VERIFY_TOKEN: '/auth/verify-token',
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },
  PRODUCTS: {
     BASE: '/v1/products',
    RETAIL: '/products/retail',
    WHOLESALE: '/products/wholesale',
    CATEGORIES: '/v1/categories',
  },
  ORDERS: {
    BASE: '/v1/orders', // Updated to match API endpoint
    RETAIL: '/orders/retail',
    WHOLESALE: '/orders/wholesale',
  },
  LOCATIONS: '/v1/kovera-locations',
  SETTINGS: '/settings',
  STAFF: '/staff',
};

export default API_BASE_URL;