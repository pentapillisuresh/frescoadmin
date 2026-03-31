// src/services/staffService.js
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

// Handle API response
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error Response:', errorData);
    throw new Error(
      errorData.message ||
      errorData.error ||
      `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

// Auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// ✅ REQUIRED BY BACKEND
const DEFAULT_LOCATION = "all";

const staffService = {
  // ✅ Get all staff
  getAllStaff: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_LIST}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      const data = await handleResponse(response);
      console.log('Raw staff data from API:', data);
      
      // Handle different response structures
      let staffList = [];
      if (Array.isArray(data)) {
        staffList = data;
      } else if (data.users && Array.isArray(data.users)) {
        staffList = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        staffList = data.data;
      }
      
      // Ensure each staff member has a name field (convert username to name if needed)
      staffList = staffList.map(staff => ({
        ...staff,
        name: staff.name || staff.username || staff.fullName || 'No Name',
        id: staff.id || staff._id
      }));
      
      console.log('Processed staff list:', staffList);
      return staffList;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  // ✅ Get by ID
  getStaffById: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_UPDATE(id)}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );
      const data = await handleResponse(response);
      return {
        ...data,
        name: data.name || data.username || data.fullName || 'No Name',
        id: data.id || data._id
      };
    } catch (error) {
      console.error('Error fetching staff by ID:', error);
      throw error;
    }
  },

  // ✅ CREATE STAFF (SAFE PAYLOAD)
  createStaff: async (staffData) => {
    try {
      const payload = {
        name: staffData.name,  // Using name as per backend requirement
        email: staffData.email,
        password: staffData.password,
        role: staffData.role,
        location: DEFAULT_LOCATION,
        isActive: staffData.isActive !== undefined ? staffData.isActive : true
      };

      // Add phone if provided
      if (staffData.phone) {
        payload.phone = staffData.phone;
      }

      console.log('Creating staff payload:', payload);

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_CREATE}`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const result = await handleResponse(response);
      console.log('Staff created successfully:', result);
      return {
        ...result,
        name: result.name || result.username || staffData.name,
        id: result.id || result._id
      };
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  },

  // ✅ UPDATE STAFF
  updateStaff: async (id, staffData) => {
    try {
      const payload = {
        name: staffData.name,
        email: staffData.email,
        role: staffData.role,
        location: DEFAULT_LOCATION,
        isActive: staffData.isActive !== undefined ? staffData.isActive : true
      };

      // Add phone if provided
      if (staffData.phone) {
        payload.phone = staffData.phone;
      }

      // Only include password if it's provided
      if (staffData.password && staffData.password.trim() !== '') {
        payload.password = staffData.password;
      }

      console.log('Updating staff payload:', payload);

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_UPDATE(id)}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const result = await handleResponse(response);
      console.log('Staff updated successfully:', result);
      return {
        ...result,
        name: result.name || result.username || staffData.name,
        id: result.id || result._id || id
      };
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  },

  // ✅ DELETE
  deleteStaff: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_UPDATE(id)}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  },

  // ✅ TOGGLE STATUS
  toggleStaffStatus: async (id, isActive) => {
    try {
      const payload = {
        isActive,
        location: DEFAULT_LOCATION,
      };

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_UPDATE(id)}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error('Error toggling staff status:', error);
      throw error;
    }
  },

  // ✅ Filter by role
  getStaffByRole: async (role) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_LIST}?role=${role}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      const data = await handleResponse(response);
      let staffList = data.users || data.data || data;
      
      if (!Array.isArray(staffList)) {
        staffList = [];
      }
      
      return staffList.map(staff => ({
        ...staff,
        name: staff.name || staff.username || staff.fullName || 'No Name',
        id: staff.id || staff._id
      }));
    } catch (error) {
      console.error('Error fetching staff by role:', error);
      throw error;
    }
  },
};

export default staffService;