// src/pages/Products/Categories.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, ChevronDown, ChevronRight, X, Upload, Image as ImageIcon } from 'lucide-react';
import categoryService from '../../services/categoryService';
import API_BASE_URL from '../../config/api';

const Categories = () => {
  const [groceryCategories, setGroceryCategories] = useState([]);
  const [cookedFoodCategories, setCookedFoodCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categoryType: 'groceries',
    subCategories: [],
    image: null,
    imagePreview: null
  });
  const [newSubcategory, setNewSubcategory] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Load categories from API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      // Fetch all categories
      const allCategories = await categoryService.getAllCategories();
      
      // Separate categories by type
      const groceries = allCategories.filter(cat => cat.categoryType === 'groceries');
      const cookedFood = allCategories.filter(cat => cat.categoryType === 'kovera');
      
      setGroceryCategories(groceries);
      setCookedFoodCategories(cookedFood);
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter category name');
      return;
    }

    setUploading(true);
    
    try {
      // Prepare FormData for API
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('categoryType', formData.categoryType);
      
      // Add subcategories if any
      if (formData.subCategories && formData.subCategories.length > 0) {
        formData.subCategories.forEach(subcat => {
          submitData.append('subCategories', subcat);
        });
      }
      
      // Add image if selected
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      let response;
      if (selectedCategory) {
        // Update existing category
        response = await categoryService.updateCategory(selectedCategory._id, submitData);
      } else {
        // Create new category
        response = await categoryService.createCategory(submitData);
      }
      
      // Clear image preview URL
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
      
      // Reload categories
      await loadCategories();
      
      // Close form and reset state
      setShowForm(false);
      setSelectedCategory(null);
      setFormData({
        name: '',
        categoryType: 'groceries',
        subCategories: [],
        image: null,
        imagePreview: null
      });
      
      alert(selectedCategory ? 'Category updated successfully!' : 'Category created successfully!');
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.response?.data?.message || 'Failed to save category. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      categoryType: category.categoryType,
      subCategories: category.subCategories || [],
      image: null,
      imagePreview: category.imageUrl || null
    });
    setShowForm(true);
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      try {
        await categoryService.deleteCategory(category._id);
        await loadCategories();
        alert('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(error.response?.data?.message || 'Failed to delete category. Please try again.');
      }
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleAddSubcategory = async (category) => {
    const subcategory = prompt('Enter new subcategory name:');
    if (subcategory && subcategory.trim()) {
      try {
        await categoryService.addSubcategory(category._id, subcategory.trim());
        await loadCategories();
      } catch (error) {
        console.error('Error adding subcategory:', error);
        alert('Failed to add subcategory. Please try again.');
      }
    }
  };

  const handleRemoveSubcategory = async (category, subcategoryToRemove) => {
    if (window.confirm(`Are you sure you want to remove "${subcategoryToRemove}"?`)) {
      try {
        await categoryService.removeSubcategory(category._id, subcategoryToRemove);
        await loadCategories();
      } catch (error) {
        console.error('Error removing subcategory:', error);
        alert('Failed to remove subcategory. Please try again.');
      }
    }
  };

  const handleAddSubcategoryToForm = () => {
    if (newSubcategory.trim()) {
      setFormData(prev => ({
        ...prev,
        subCategories: [...prev.subCategories, newSubcategory.trim()]
      }));
      setNewSubcategory('');
    }
  };

  const handleRemoveSubcategoryFromForm = (index) => {
    setFormData(prev => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, i) => i !== index)
    }));
  };

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}/${imagePath}`;
  };

  const CategoryCard = ({ category, type }) => {
    const imageUrl = category.imageUrl || getFullImageUrl(category.image);
    
    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={() => toggleCategory(category._id)}
              className="p-1 hover:bg-gray-100 rounded mt-1"
            >
              {expandedCategories[category._id] ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>
            
            {/* Category Image */}
            {imageUrl ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img 
                  src={imageUrl} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                  }}
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-gray-100 flex items-center justify-center">
                <ImageIcon size={20} className="text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                {type === 'kovera' && (
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                    KOVERA
                  </span>
                )}
              </div>
              {category.description && (
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => handleEdit(category)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit category"
            >
              <Edit size={16} className="text-blue-600" />
            </button>
            <button
              onClick={() => handleDelete(category)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Delete category"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        </div>

        {expandedCategories[category._id] && (
          <div className="mt-4 pl-12 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Subcategories:</span>
              <button
                onClick={() => handleAddSubcategory(category)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Plus size={14} />
                <span>Add Subcategory</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.subCategories && category.subCategories.length > 0 ? (
                category.subCategories.map((subcat, index) => (
                  <div key={index} className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 rounded-full">
                    <span className="text-sm text-gray-700">{subcat}</span>
                    <button
                      onClick={() => handleRemoveSubcategory(category, subcat)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-400">No subcategories</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading && groceryCategories.length === 0 && cookedFoodCategories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories and subcategories</p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setFormData({
              name: '',
              categoryType: 'groceries',
              subCategories: [],
              image: null,
              imagePreview: null
            });
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grocery Categories */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <Tag className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Grocery Categories</h3>
                <p className="text-sm text-gray-600">Manage retail grocery categories</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {groceryCategories.length} categories
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {groceryCategories.length > 0 ? (
              groceryCategories.map(category => (
                <CategoryCard key={category._id} category={category} type="groceries" />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No grocery categories found. Click "Add Category" to create one.
              </div>
            )}
          </div>
        </div>

        {/* KOVERA Food Categories */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <Tag className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">KOVERA Food Categories</h3>
                <p className="text-sm text-gray-600">Managed under fixed brand "KOVERA"</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {cookedFoodCategories.length} categories
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {cookedFoodCategories.length > 0 ? (
              cookedFoodCategories.map(category => (
                <CategoryCard key={category._id} category={category} type="kovera" />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No KOVERA food categories found. Click "Add Category" to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.categoryType === 'groceries' ? 'Grocery Category' : 'KOVERA Food Category'}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setSelectedCategory(null);
                  if (formData.imagePreview) {
                    URL.revokeObjectURL(formData.imagePreview);
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Category Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Type *
                </label>
                <select
                  value={formData.categoryType}
                  onChange={(e) => setFormData({...formData, categoryType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="groceries">Groceries</option>
                  <option value="kovera">KOVERA Food</option>
                </select>
              </div>

              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter category name"
                  required
                />
              </div>

              {/* Category Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img 
                        src={formData.imagePreview} 
                        alt="Category preview" 
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.imagePreview && !formData.image) {
                            URL.revokeObjectURL(formData.imagePreview);
                          }
                          setFormData({...formData, image: null, imagePreview: null});
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Upload size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-600">Choose Image</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  <p className="text-xs text-gray-500">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
                </div>
              </div>

              {/* Subcategories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategories (Optional)
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="e.g., Fresh Fruits, Vegetables, etc."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubcategoryToForm();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSubcategoryToForm}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.subCategories.length > 0 && (
                    <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {formData.subCategories.map((subcat, index) => (
                          <div key={index} className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 rounded-full">
                            <span className="text-sm text-blue-700">{subcat}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubcategoryFromForm(index)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {formData.categoryType === 'kovera' && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    This category will be automatically assigned to the "KOVERA" brand.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedCategory(null);
                    if (formData.imagePreview && !formData.image) {
                      URL.revokeObjectURL(formData.imagePreview);
                    }
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <span className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </span>
                  ) : (
                    selectedCategory ? 'Update Category' : 'Add Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;