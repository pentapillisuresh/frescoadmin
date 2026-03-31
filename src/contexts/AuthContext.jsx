// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Verify token validity with backend
      verifyToken(storedToken);
    }
    setLoading(false);
  }, []);

  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.VERIFY_TOKEN}`,
        {},
        {
          headers: { Authorization: `Bearer ${tokenToVerify}` }
        }
      );
      
      if (!response.data.valid) {
        // Token is invalid, logout
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  const login = async (email, password, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? API_ENDPOINTS.AUTH.ADMIN_LOGIN : API_ENDPOINTS.AUTH.STAFF_LOGIN;
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
        email,
        password
      });

      const { access_token, user: userData } = response.data;

      // Transform user data to match our app structure
      const transformedUser = {
        id: userData._id,
        username: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: userData.role === 'super-admin' ? 'super_admin' : userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        isPhoneVerified: userData.isPhoneVerified,
        location: userData.location || 'All',
        isActive: userData.isActive !== false
      };

      setUser(transformedUser);
      setToken(access_token);
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('user', JSON.stringify(transformedUser));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return transformedUser;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Invalid credentials');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('An error occurred. Please try again.');
      }
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`);
      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('accessToken', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      return access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    token,
    refreshToken,
    isAuthenticated: !!user && !!token,
    isSuperAdmin: user?.role === 'super_admin',
    isStaff: user?.role === 'staff' || user?.role === 'staff'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};