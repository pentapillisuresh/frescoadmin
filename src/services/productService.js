import axiosInstance from '../utils/axiosInterceptor';
import { API_ENDPOINTS } from '../config/api';
import API_BASE_URL from '../config/api';

const productService = {
  // Get all products (retail)
  getAllRetailProducts: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.BASE, {
        params: { isWholesale: false }
      });
      const products = response.data?.products || response.data || [];
      return products.map(product => ({
        ...product,
        imageUrl: product.image ? `${API_BASE_URL}${product.image.startsWith('/') ? product.image : '/' + product.image}` : null
      }));
    } catch (error) {
      console.error('Error fetching retail products:', error);
      throw error;
    }
  },

  // Get all wholesale products
  getAllWholesaleProducts: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.BASE, {
        params: { isWholesale: true }
      });
      const products = response.data?.products || response.data || [];
      return products.map(product => ({
        ...product,
        imageUrl: product.image ? `${API_BASE_URL}${product.image.startsWith('/') ? product.image : '/' + product.image}` : null
      }));
    } catch (error) {
      console.error('Error fetching wholesale products:', error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (formData, productType = 'retail') => {
    try {
      formData.append('isWholesale', productType === 'wholesale');
      
      const response = await axiosInstance.post(
        API_ENDPOINTS.PRODUCTS.BASE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      const product = response.data;
      return {
        ...product,
        imageUrl: product.image ? `${API_BASE_URL}${product.image.startsWith('/') ? product.image : '/' + product.image}` : null
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (productId, formData, productType = 'retail') => {
    try {
      const url = `${API_ENDPOINTS.PRODUCTS.BASE}/${productId}`;
      console.log('Updating product at URL:', url);
      
      const response = await axiosInstance.put(
        url,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
       console.log('Update response:', response.data);
      const product = response.data;
      return {
        ...product,
        imageUrl: product.image ? `${API_BASE_URL}${product.image.startsWith('/') ? product.image : '/' + product.image}` : null
      };
    } catch (error) {
      console.error('Error updating product:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const url = `${API_ENDPOINTS.PRODUCTS.BASE}/${productId}`;
      console.log('Deleting product at URL:', url);
      
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${productId}`);
      const product = response.data;
      return {
        ...product,
        imageUrl: product.image ? `${API_BASE_URL}${product.image.startsWith('/') ? product.image : '/' + product.image}` : null
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Toggle product status
  toggleProductStatus: async (productId, isActive) => {
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.PRODUCTS.BASE}/${productId}/status`,
        { isActive }
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling product status:', error);
      throw error;
    }
  }
};

export default productService;