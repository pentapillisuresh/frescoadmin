// src/services/staffService.js
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

// Helper function for handling API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function for adding auth token to headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  console.log('Token from storage:', token ? 'Present' : 'Missing');
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const staffService = {
  // Get all staff members (admin/staff users)
  getAllStaff: async () => {
    try {
      console.log('Fetching staff from:', `${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_LIST}`);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_LIST}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await handleResponse(response);
      console.log('Staff data received:', data);
      return data.users || data.data || data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  // Get staff member by ID
  getStaffById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_UPDATE(id)}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching staff by ID:', error);
      throw error;
    }
  },

  // Create new staff member (super-admin only)
  createStaff: async (staffData) => {
    try {
      // Prepare data according to backend requirements
      const payload = {
        name: staffData.name,           // Changed from username to name
        email: staffData.email,
        password: staffData.password,
        role: staffData.role,
        isActive: staffData.isActive,
        location: "Main Branch"        // Add default location since backend requires it
      };

      console.log('Creating staff with payload:', payload);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_CREATE}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  },

  // Update staff member (super-admin only)
  updateStaff: async (id, staffData) => {
    try {
      // Prepare data for update
      const payload = {
        name: staffData.name,           // Changed from username to name
        email: staffData.email,
        role: staffData.role,
        isActive: staffData.isActive,
        location: "Main Branch"        // Add default location since backend requires it
      };
      
      // Only include password if it's provided (for update)
      if (staffData.password && staffData.password.trim() !== '') {
        payload.password = staffData.password;
      }

      console.log('Updating staff with payload:', payload);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_UPDATE(id)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  },

  // Delete staff member
  deleteStaff: async (id) => {
    try {
      console.log('Deleting staff with ID:', id);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_UPDATE(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  },

  // Toggle staff status
  toggleStaffStatus: async (id, isActive) => {
    try {
      console.log('Toggling staff status:', id, isActive);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_UPDATE(id)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error toggling staff status:', error);
      throw error;
    }
  },

  // Get staff by role
  getStaffByRole: async (role) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_LIST}?role=${role}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await handleResponse(response);
      return data.users || data.data || data;
    } catch (error) {
      console.error('Error fetching staff by role:', error);
      throw error;
    }
  },
};

export default staffService;