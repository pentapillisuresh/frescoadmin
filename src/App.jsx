import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import './utils/axiosInterceptor';

import Login from './pages/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import RetailProducts from './pages/Products/RetailProducts';
import WholesaleProducts from './pages/Products/WholesaleProducts';
import Categories from './pages/Products/Categories';
import StaffManagement from './pages/StaffManagement';
import RetailOrders from './pages/Orders/RetailOrders';
import WholesaleOrders from './pages/Orders/WholesaleOrders';
import Locations from './pages/Locations';
import Settings from './pages/Settings';
import MainLayout from './components/Layout/MainLayout';
import MenuItems from './pages/kovera/MenuItems';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="products/retail" element={<ProtectedRoute><RetailProducts /></ProtectedRoute>} />
            <Route path="products/wholesale" element={<ProtectedRoute allowedRoles={['super_admin']}><WholesaleProducts /></ProtectedRoute>} />
            <Route path="categories" element={<ProtectedRoute allowedRoles={['super_admin']}><Categories /></ProtectedRoute>} />
            <Route path="staff-management" element={<ProtectedRoute allowedRoles={['super_admin']}><StaffManagement /></ProtectedRoute>} />
            <Route path="orders/retail" element={<ProtectedRoute><RetailOrders /></ProtectedRoute>} />
            <Route path="orders/wholesale" element={<ProtectedRoute allowedRoles={['super_admin']}><WholesaleOrders /></ProtectedRoute>} />
            <Route path="locations" element={<ProtectedRoute allowedRoles={['super_admin']}><Locations /></ProtectedRoute>} />
            
            {/* Add the new route for Menu Items */}
            <Route path="kovera/menu-items" element={<ProtectedRoute allowedRoles={['super_admin']}><MenuItems /></ProtectedRoute>} />
            
            <Route path="settings" element={<ProtectedRoute allowedRoles={['super_admin']}><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;