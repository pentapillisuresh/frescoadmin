// src/pages/Products/Categories.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, ChevronDown, ChevronRight, X, Upload, Image as ImageIcon } from 'lucide-react';
import categoryService from '../../services/categoryService';
import API_BASE_URL from '../../config/api';

const Categories = () => {
  const [groceryCategories, setGroceryCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
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
      
      // Filter only grocery categories
      const groceries = allCategories.filter(cat => cat.categoryType === 'groceries');
      
      setGroceryCategories(groceries);
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
      submitData.append('categoryType', 'groceries'); // Always set as groceries
      
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

  const CategoryCard = ({ category }) => {
    const imageUrl = category.imageUrl || getFullImageUrl(category.image);
    const isExpanded = expandedCategories[category._id];
    
    return (
      <div className="bg-white border rounded-xl hover:shadow-lg transition-all duration-200 overflow-hidden">
        {/* Category Header with Image */}
        <div className="p-4">
          <div className="flex flex-col items-center text-center">
            {/* Category Image */}
            <div className="mb-3">
              {imageUrl ? (
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <img 
                    src={imageUrl} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center border-2 border-gray-200">
                  <ImageIcon size={32} className="text-blue-500" />
                </div>
              )}
            </div>
            
            {/* Category Name */}
            <h4 className="font-semibold text-gray-900 text-lg mb-1">{category.name}</h4>
            
            {/* Category Type Badge */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3">
              Groceries
            </span>
            
            {/* Expand/Collapse Button */}
            <button
              onClick={() => toggleCategory(category._id)}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
            >
              {isExpanded ? (
                <>
                  <ChevronDown size={14} />
                  <span>Hide Subcategories</span>
                </>
              ) : (
                <>
                  <ChevronRight size={14} />
                  <span>View Subcategories</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Subcategories Section */}
        {isExpanded && (
          <div className="border-t bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Subcategories:</span>
              <button
                onClick={() => handleAddSubcategory(category)}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Plus size={12} />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {category.subCategories && category.subCategories.length > 0 ? (
                category.subCategories.map((subcat, index) => (
                  <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-white rounded-full border">
                    <span className="text-xs text-gray-700">{subcat}</span>
                    <button
                      onClick={() => handleRemoveSubcategory(category, subcat)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-xs text-gray-400">No subcategories</span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t p-3 flex justify-center space-x-2">
          <button
            onClick={() => handleEdit(category)}
            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1"
          >
            <Edit size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDelete(category)}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    );
  };

  if (loading && groceryCategories.length === 0) {
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
          <p className="text-gray-600">Manage grocery product categories and subcategories</p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setFormData({
              name: '',
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

      {/* Categories Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groceryCategories.length > 0 ? (
          groceryCategories.map(category => (
            <CategoryCard key={category._id} category={category} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border">
            <Tag size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No grocery categories found.</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Category" to create one.</p>
          </div>
        )}
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
                  Grocery Category
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
              {/* Category Type - Disabled, always Groceries */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Type
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value="Groceries"
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Category type is fixed as Groceries</p>
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