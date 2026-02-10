// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';

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


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* PROTECTED APP */}
          <Route element={<MainLayout />}>
            
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="products/retail"
              element={
                <ProtectedRoute>
                  <RetailProducts />
                </ProtectedRoute>
              }
            />

            <Route
              path="products/wholesale"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <WholesaleProducts />
                </ProtectedRoute>
              }
            />

            <Route
              path="categories"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <Categories />
                </ProtectedRoute>
              }
            />

            <Route
              path="staff-management"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <StaffManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="orders/retail"
              element={
                <ProtectedRoute>
                  <RetailOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path="orders/wholesale"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <WholesaleOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path="locations"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <Locations />
                </ProtectedRoute>
              }
            />

            <Route
              path="settings"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
