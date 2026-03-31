import axiosInstance from '../utils/axiosInterceptor';
import { API_ENDPOINTS } from '../config/api';

const menuItemService = {
  // Get all menu items
  getAllMenuItems: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MENU_ITEMS.GET_ALL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  // Get menu item by ID
  getMenuItemById: async (id) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MENU_ITEMS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  },

  // Create new menu item with image upload
  createMenuItem: async (formData) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.MENU_ITEMS.CREATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  // Update menu item
  updateMenuItem: async (id, formData) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.MENU_ITEMS.UPDATE(id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  // Delete menu item
  deleteMenuItem: async (id) => {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.MENU_ITEMS.DELETE(id));
      return response.data;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  // Toggle menu item availability
  toggleMenuItemStatus: async (id, isActive) => {
    try {
      const response = await axiosInstance.patch(
        API_ENDPOINTS.MENU_ITEMS.TOGGLE_STATUS(id),
        { isActive }
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling menu item status:', error);
      throw error;
    }
  },

  // Get menu items by category
  getMenuItemsByCategory: async (category) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MENU_ITEMS.GET_ALL, {
        params: { category }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items by category:', error);
      throw error;
    }
  },

  // Get menu items by location
  getMenuItemsByLocation: async (locationId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MENU_ITEMS.GET_ALL, {
        params: { locationId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items by location:', error);
      throw error;
    }
  }
};

export default menuItemService;