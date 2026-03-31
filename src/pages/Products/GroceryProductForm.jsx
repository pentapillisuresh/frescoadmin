import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Loader } from 'lucide-react';
import categoryService from '../../services/categoryService';
import productService from '../../services/productService';
import API_BASE_URL from '../../config/api';

const GroceryProductForm = ({ product, onSave, onClose, productType = 'retail' }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    categoryId: '',
    subCategory: '',
    description: '',
    retailPrice: '',
    wholesalePrice: '',
    wholesaleMOQ: '',
    availableQuantity: '',
    unit: 'piece',
    weight: '',
    image: null,
    imagePreview: null,
    isActive: true
  });

  const [categories, setCategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (product) {
      const categoryId = typeof product.category === 'object' 
        ? product.category._id 
        : product.category;
      
      const categoryName = typeof product.category === 'object' 
        ? product.category.name 
        : product.category;

      setFormData({
        name: product.name || '',
        category: categoryName || '',
        categoryId: categoryId || '',
        subCategory: product.subCategory || '',
        description: product.description || '',
        retailPrice: product.retailPrice || '',
        wholesalePrice: product.wholesalePrice || '',
        wholesaleMOQ: product.wholesaleMOQ || '',
        availableQuantity: product.availableQuantity || '',
        unit: product.unit || 'piece',
        weight: product.weight || '',
        image: null,
        imagePreview: product.imageUrl || null,
        isActive: product.isActive !== false
      });

      if (categoryId) {
        const selectedCat = categories.find(c => c._id === categoryId);
        if (selectedCat) {
          setAvailableSubcategories(selectedCat.subCategories || []);
        }
      }
    }
  }, [product, categories]);

  useEffect(() => {
    if (formData.categoryId) {
      const selectedCategory = categories.find(cat => cat._id === formData.categoryId);
      if (selectedCategory) {
        setAvailableSubcategories(selectedCategory.subCategories || []);
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [formData.categoryId, categories]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const allCategories = await categoryService.getAllCategories();
      const groceryCategories = allCategories.filter(cat => 
        cat.categoryType === 'groceries' || cat.categoryType === 'grocery'
      );
      setCategories(groceryCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find(cat => cat._id === categoryId);
    setFormData(prev => ({
      ...prev,
      categoryId: categoryId,
      category: selectedCategory?.name || '',
      subCategory: ''
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.name.trim()) {
    alert('Please enter product name');
    return;
  }

  if (!formData.categoryId) {
    alert('Please select a category');
    return;
  }

  if (!formData.retailPrice) {
    alert('Please enter retail price');
    return;
  }

  if (parseFloat(formData.retailPrice) <= 0) {
    alert('Retail price must be greater than 0');
    return;
  }

  if (!formData.wholesalePrice) {
    alert('Please enter wholesale price');
    return;
  }

  if (parseFloat(formData.wholesalePrice) <= 0) {
    alert('Wholesale price must be greater than 0');
    return;
  }

  if (!formData.wholesaleMOQ) {
    alert('Please enter wholesale minimum order quantity');
    return;
  }

  if (!formData.unit) {
    alert('Please select a unit');
    return;
  }

  setUploading(true);
  
  try {
    const submitData = new FormData();
    submitData.append('name', formData.name);
    
    // IMPORTANT: Only send category field with the ID, not categoryId
    // The backend expects 'category' field with the category ID
    submitData.append('category', formData.categoryId);
    
    if (formData.subCategory) {
      submitData.append('subCategory', formData.subCategory);
    }
    
    if (formData.description) {
      submitData.append('description', formData.description);
    }
    
    submitData.append('retailPrice', parseFloat(formData.retailPrice));
    submitData.append('wholesalePrice', parseFloat(formData.wholesalePrice));
    submitData.append('wholesaleMOQ', parseInt(formData.wholesaleMOQ));
    
    if (formData.availableQuantity) {
      submitData.append('availableQuantity', parseInt(formData.availableQuantity));
    }
    
    submitData.append('unit', formData.unit);
    
    if (formData.weight) {
      submitData.append('weight', parseFloat(formData.weight));
    }
    
    // Only append image if it's a new file (not existing image)
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    submitData.append('isActive', formData.isActive);

    let savedProduct;
    if (product && product._id) {
      console.log('Updating product with ID:', product._id);
      
      // Log all form data being sent for debugging
      console.log('Form data being sent:');
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      savedProduct = await productService.updateProduct(product._id, submitData, productType);
      console.log('Update response:', savedProduct);
    } else {
      savedProduct = await productService.createProduct(submitData, productType);
    }
    
    if (formData.imagePreview && formData.image) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    
    onSave(savedProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to save product. Please try again.';
    
    // Show more detailed error
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = Object.values(errors).flat();
      alert(errorMessages.join('\n'));
    } else if (Array.isArray(errorMessage)) {
      alert(errorMessage.join('\n'));
    } else {
      alert(errorMessage);
    }
  } finally {
    setUploading(false);
  }
};

  const unitOptions = [
    'piece', 'kilogram', 'gram', 'liter', 'milliliter', 
    'pack', 'bunch', 'dozen', 'box', 'case'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {productType === 'wholesale' ? 'Wholesale Product' : 'Retail Product'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="e.g., Fresh Apples, Organic Rice, etc."
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleCategoryChange}
                    required
                    disabled={loading || uploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-50"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    disabled={availableSubcategories.length === 0 || uploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Subcategory</option>
                    {availableSubcategories.map(subcat => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Product description..."
                    disabled={uploading}
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retail Price (₱) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                      <input
                        type="number"
                        name="retailPrice"
                        value={formData.retailPrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="0.00"
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wholesale Price (₱) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                      <input
                        type="number"
                        name="wholesalePrice"
                        value={formData.wholesalePrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="0.00"
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wholesale MOQ *
                    </label>
                    <input
                      type="number"
                      name="wholesaleMOQ"
                      value={formData.wholesaleMOQ}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Minimum order quantity"
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              {/* Inventory & Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    name="availableQuantity"
                    value={formData.availableQuantity}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="0"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    disabled={uploading}
                  >
                    {unitOptions.map(unit => (
                      <option key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="e.g., 1.5"
                    disabled={uploading}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Image & Status */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                {formData.imagePreview ? (
                  <div className="relative">
                    <img 
                      src={formData.imagePreview} 
                      alt="Product Preview" 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.imagePreview && formData.image) {
                          URL.revokeObjectURL(formData.imagePreview);
                        }
                        setFormData(prev => ({ ...prev, image: null, imagePreview: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      disabled={uploading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-sm text-gray-600 mb-2">Product Image</p>
                    <p className="text-xs text-gray-500 mb-4">Upload a product photo</p>
                  </div>
                )}
                
                <label className={`cursor-pointer inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload size={16} />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">Max size: 5MB. JPG, PNG, GIF</p>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Status</h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Product Active</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="sr-only peer"
                      disabled={uploading}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading && <Loader className="animate-spin" size={20} />}
                {uploading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroceryProductForm;