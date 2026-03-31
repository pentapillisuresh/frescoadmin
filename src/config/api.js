const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  AUTH: {
    ADMIN_LOGIN: '/auth/admin-login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VERIFY_TOKEN: '/auth/verify-token',
  },
  USERS: {
    // Admin/Staff endpoints (v1)
    ADMIN_CREATE: '/v1/users/admin',
    ADMIN_UPDATE: (id) => `/v1/users/admin/${id}`,
    ADMIN_LIST: '/v1/users',
    
    // Regular user endpoints
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
    BASE: '/v1/orders',
    RETAIL: '/orders/retail',
    WHOLESALE: '/orders/wholesale',
  },
  MENU_ITEMS: {
    BASE: '/v1/menu-items',
    GET_ALL: '/v1/menu-items',
    GET_BY_ID: (id) => `/v1/menu-items/${id}`,
    CREATE: '/v1/menu-items',
    UPDATE: (id) => `/v1/menu-items/${id}`,
    DELETE: (id) => `/v1/menu-items/${id}`,
    TOGGLE_STATUS: (id) => `/v1/menu-items/${id}/status`,
  },
   LOCATIONS: '/v1/kovera-locations',
  SETTINGS: '/settings',
};

export default API_BASE_URL;