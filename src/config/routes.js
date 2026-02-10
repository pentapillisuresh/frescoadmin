// src/config/routes.js
export const getRoutesForRole = (role) => {
  const commonRoutes = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/products/retail', label: 'Retail Products', icon: 'package' },
    { path: '/orders/retail', label: 'Retail Orders', icon: 'shopping-cart' }
  ];

  if (role === 'super_admin') {
    return [
      ...commonRoutes,
      { path: '/products/wholesale', label: 'Wholesale Products', icon: 'shopping-bag' },
      { path: '/categories', label: 'Categories', icon: 'list' },
      { path: '/orders/wholesale', label: 'Wholesale Orders', icon: 'truck' },
      { path: '/staff-management', label: 'Staff Management', icon: 'users' },
      { path: '/locations', label: 'KOVERA Locations', icon: 'map-pin' },
      { path: '/settings', label: 'Settings', icon: 'settings' }
    ];
  }

  return commonRoutes;
};