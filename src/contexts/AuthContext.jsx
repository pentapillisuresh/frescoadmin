// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Get staff data from localStorage
    const staffData = JSON.parse(localStorage.getItem('staff') || '[]');
    
    // Find user in staff data
    const foundUser = staffData.find(staff => 
      (staff.username === username || staff.email === username) && 
      staff.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        location: foundUser.location,
        isActive: foundUser.isActive
      };

      if (!userData.isActive) {
        throw new Error('Account is disabled. Please contact administrator.');
      }

      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    } else {
      // Check if it's default super admin (for initial setup)
      if (username === 'admin@kovera.com' && password === 'admin123') {
        const superAdmin = {
          id: 999,
          username: 'admin',
          email: 'admin@kovera.com',
          role: 'super_admin',
          location: 'All',
          isActive: true
        };
        
        setUser(superAdmin);
        localStorage.setItem('currentUser', JSON.stringify(superAdmin));
        return superAdmin;
      }
      
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};