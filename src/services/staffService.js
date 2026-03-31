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

// Required by backend
const DEFAULT_LOCATION = "all";

// Helper function to normalize staff data - FIXED to preserve ID correctly
const normalizeStaffData = (staff) => {
  if (!staff) return null;
  
  // CRITICAL: Ensure we always have an ID field (prefer id over _id)
  const normalizedId = staff.id || staff._id;
  
  if (!normalizedId) {
    console.error('Staff object missing ID:', staff);
  }
  
  const normalized = {
    ...staff,
    // Ensure id is always present and consistent
    id: normalizedId,
    _id: normalizedId, // Keep both for compatibility
    // Ensure name is always present
    name: staff.name || staff.username || staff.fullName || staff.email?.split('@')[0] || 'Unnamed Staff',
    // Keep original name fields for reference
    originalName: staff.name,
    originalUsername: staff.username,
    // Ensure email is always present
    email: staff.email || '',
    // Ensure role is always present
    role: staff.role || 'staff',
    // Ensure isActive is always present
    isActive: staff.isActive !== undefined ? staff.isActive : true
  };
  
  console.log('Normalized staff data:', { original: staff, normalized });
  return normalized;
};

// Helper function to normalize array of staff
const normalizeStaffList = (staffList) => {
  if (!Array.isArray(staffList)) return [];
  return staffList.map(staff => normalizeStaffData(staff));
};

const staffService = {
  // Get all staff with normalized data
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
      
      let staffList = [];
      if (Array.isArray(data)) {
        staffList = data;
      } else if (data.users && Array.isArray(data.users)) {
        staffList = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        staffList = data.data;
      }
      
      const normalizedStaff = normalizeStaffList(staffList);
      console.log('Normalized staff list:', normalizedStaff);
      
      return normalizedStaff;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  // Get by ID with normalized data
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
      return normalizeStaffData(data);
    } catch (error) {
      console.error('Error fetching staff by ID:', error);
      throw error;
    }
  },

  // CREATE STAFF
  createStaff: async (staffData) => {
    try {
      const payload = {
        name: staffData.name,
        email: staffData.email,
        password: staffData.password,
        role: staffData.role,
        location: DEFAULT_LOCATION,
        isActive: staffData.isActive !== undefined ? staffData.isActive : true
      };

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
      
      return normalizeStaffData(result);
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  },

  // UPDATE STAFF - FIXED to ensure we return normalized data
  updateStaff: async (id, staffData) => {
    try {
      // Build payload with only the fields that should be updated
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

      // Add password only if it's provided and not empty
      if (staffData.password && staffData.password.trim() !== '') {
        payload.password = staffData.password;
      }

      console.log('Updating staff - ID:', id);
      console.log('Updating staff payload:', payload);

      // Make sure we're using the correct endpoint
      const endpoint = `${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_UPDATE(id)}`;
      console.log('Update endpoint:', endpoint);

      const response = await fetch(
        endpoint,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const result = await handleResponse(response);
      console.log('Staff updated successfully - Raw response:', result);
      
      // CRITICAL: Ensure we return normalized data with the correct ID
      const normalizedResult = normalizeStaffData(result);
      console.log('Normalized update result:', normalizedResult);
      
      return normalizedResult;
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  },

  // DELETE STAFF
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

  // TOGGLE STATUS - FIXED to update correctly
  toggleStaffStatus: async (id, isActive) => {
    try {
      const payload = {
        isActive,
        location: DEFAULT_LOCATION,
      };

      console.log('Toggling status - ID:', id, 'New status:', isActive);
      console.log('Toggle payload:', payload);

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.USERS.ADMIN_UPDATE(id)}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const result = await handleResponse(response);
      console.log('Status toggled successfully:', result);
      
      return normalizeStaffData(result);
    } catch (error) {
      console.error('Error toggling staff status:', error);
      throw error;
    }
  },

  // Filter by role
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
      
      return normalizeStaffList(staffList);
    } catch (error) {
      console.error('Error fetching staff by role:', error);
      throw error;
    }
  },
};

export default staffService;