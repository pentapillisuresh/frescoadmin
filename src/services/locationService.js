// src/services/locationService.js
import axiosInstance from '../utils/axiosInterceptor';
import { API_ENDPOINTS } from '../config/api';
import API_BASE_URL from '../config/api';

const locationService = {
  // Get all locations
  getAllLocations: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LOCATIONS);
      // Transform any image URLs or additional data if needed
      const locations = response.data.map(location => ({
        ...location,
        // Convert time format if needed (24h to 12h)
        startTime: location.startTime ? convertTo12HourFormat(location.startTime) : '09:00 AM',
        endTime: location.endTime ? convertTo12HourFormat(location.endTime) : '09:00 PM'
      }));
      return locations;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },

  // Get location by ID
  getLocationById: async (locationId) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.LOCATIONS}/${locationId}`);
      const location = response.data;
      return {
        ...location,
        startTime: location.startTime ? convertTo12HourFormat(location.startTime) : '09:00 AM',
        endTime: location.endTime ? convertTo12HourFormat(location.endTime) : '09:00 PM'
      };
    } catch (error) {
      console.error('Error fetching location:', error);
      throw error;
    }
  },

  // Create new location
  createLocation: async (locationData) => {
    try {
      // Convert times to 24-hour format for API
      const formattedData = {
        ...locationData,
        startTime: convertTo24HourFormat(locationData.startTime),
        endTime: convertTo24HourFormat(locationData.endTime)
      };
      
      const response = await axiosInstance.post(
        API_ENDPOINTS.LOCATIONS,
        formattedData
      );
      
      const location = response.data;
      return {
        ...location,
        startTime: location.startTime ? convertTo12HourFormat(location.startTime) : '09:00 AM',
        endTime: location.endTime ? convertTo12HourFormat(location.endTime) : '09:00 PM'
      };
    } catch (error) {
      console.error('Error creating location:', error);
      throw error;
    }
  },

  // Update location
  updateLocation: async (locationId, locationData) => {
    try {
      // Convert times to 24-hour format for API
      const formattedData = {
        ...locationData,
        startTime: convertTo24HourFormat(locationData.startTime),
        endTime: convertTo24HourFormat(locationData.endTime)
      };
      
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.LOCATIONS}/${locationId}`,
        formattedData
      );
      
      const location = response.data;
      return {
        ...location,
        startTime: location.startTime ? convertTo12HourFormat(location.startTime) : '09:00 AM',
        endTime: location.endTime ? convertTo12HourFormat(location.endTime) : '09:00 PM'
      };
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  },

  // Delete location
  deleteLocation: async (locationId) => {
    try {
      const response = await axiosInstance.delete(`${API_ENDPOINTS.LOCATIONS}/${locationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  },

  // Toggle location active status
  toggleLocationStatus: async (locationId, isActive) => {
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.LOCATIONS}/${locationId}/status`,
        { isActive }
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling location status:', error);
      throw error;
    }
  },

  // Get locations by city
  getLocationsByCity: async (city) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LOCATIONS, {
        params: { city }
      });
      const locations = response.data.map(location => ({
        ...location,
        startTime: location.startTime ? convertTo12HourFormat(location.startTime) : '09:00 AM',
        endTime: location.endTime ? convertTo12HourFormat(location.endTime) : '09:00 PM'
      }));
      return locations;
    } catch (error) {
      console.error('Error fetching locations by city:', error);
      throw error;
    }
  },

  // Get locations by pincode
  getLocationsByPincode: async (pincode) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LOCATIONS, {
        params: { pincode }
      });
      const locations = response.data.map(location => ({
        ...location,
        startTime: location.startTime ? convertTo12HourFormat(location.startTime) : '09:00 AM',
        endTime: location.endTime ? convertTo12HourFormat(location.endTime) : '09:00 PM'
      }));
      return locations;
    } catch (error) {
      console.error('Error fetching locations by pincode:', error);
      throw error;
    }
  }
};

// Helper function to convert 24-hour format to 12-hour format
const convertTo12HourFormat = (time24) => {
  if (!time24) return '09:00 AM';
  
  // If time is already in 12-hour format with AM/PM, return as is
  if (time24.includes('AM') || time24.includes('PM')) {
    return time24;
  }
  
  // Convert 24-hour format to 12-hour format
  const [hours, minutes] = time24.split(':');
  let period = 'AM';
  let hour12 = parseInt(hours);
  
  if (hour12 === 0) {
    hour12 = 12;
  } else if (hour12 === 12) {
    period = 'PM';
  } else if (hour12 > 12) {
    hour12 -= 12;
    period = 'PM';
  }
  
  return `${hour12.toString().padStart(2, '0')}:${minutes} ${period}`;
};

// Helper function to convert 12-hour format to 24-hour format
const convertTo24HourFormat = (time12) => {
  if (!time12) return '21:00';
  
  // If time is already in 24-hour format, return as is
  if (!time12.includes('AM') && !time12.includes('PM')) {
    return time12;
  }
  
  const [time, period] = time12.split(' ');
  let [hours, minutes] = time.split(':');
  let hour24 = parseInt(hours);
  
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes}`;
};

export default locationService;