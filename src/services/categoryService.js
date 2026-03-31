// src/services/categoryService.js
import axiosInstance from '../utils/axiosInterceptor';
import { API_ENDPOINTS } from '../config/api';
import API_BASE_URL from '../config/api';

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.CATEGORIES);
      // Transform image URLs to full URLs
      const categories = response.data.map(category => ({
        ...category,
        imageUrl: category.image ? `${API_BASE_URL}/${category.image}` : null
      }));
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get categories by type
  getCategoriesByType: async (categoryType) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.CATEGORIES, {
        params: { categoryType }
      });
      // Transform image URLs to full URLs
      const categories = response.data.map(category => ({
        ...category,
        imageUrl: category.image ? `${API_BASE_URL}/${category.image}` : null
      }));
      return categories;
    } catch (error) {
      console.error(`Error fetching ${categoryType} categories:`, error);
      throw error;
    }
  },

  // Create new category with image
  createCategory: async (formData) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.PRODUCTS.CATEGORIES,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // Transform image URL to full URL
      const category = response.data;
      return {
        ...category,
        imageUrl: category.image ? `${API_BASE_URL}/${category.image}` : null
      };
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update category
  updateCategory: async (categoryId, formData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.PRODUCTS.CATEGORIES}/${categoryId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // Transform image URL to full URL
      const category = response.data;
      return {
        ...category,
        imageUrl: category.image ? `${API_BASE_URL}/${category.image}` : null
      };
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.PRODUCTS.CATEGORIES}/${categoryId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Add subcategory to existing category
  addSubcategory: async (categoryId, subcategory) => {
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.PRODUCTS.CATEGORIES}/${categoryId}/subcategories`,
        { subcategory }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding subcategory:', error);
      throw error;
    }
  },

  // Remove subcategory
  removeSubcategory: async (categoryId, subcategory) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.PRODUCTS.CATEGORIES}/${categoryId}/subcategories`,
        { data: { subcategory } }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing subcategory:', error);
      throw error;
    }
  },
};

export default categoryService;