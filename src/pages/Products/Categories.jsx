// src/pages/Products/Categories.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, ChevronDown, ChevronRight } from 'lucide-react';
import { storage } from '../../utils/storage';

const Categories = () => {
  const [groceryCategories, setGroceryCategories] = useState([]);
  const [cookedFoodCategories, setCookedFoodCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'groceries',
    description: '',
    subcategories: []
  });
  const [newSubcategory, setNewSubcategory] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Load categories from localStorage
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const groceryCats = storage.getCategories('groceries');
    const cookedCats = storage.getCategories('cooked_food');
    setGroceryCategories(groceryCats);
    setCookedFoodCategories(cookedCats);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter category name');
      return;
    }

    if (selectedCategory) {
      // Update category
      storage.updateCategory(selectedCategory.id, formData);
    } else {
      // Add new category
      const newCategory = {
        ...formData,
        id: Date.now() + Math.random(),
        isActive: true,
        ...(formData.type === 'cooked_food' && { brand: 'KOVERA' })
      };
      storage.addCategory(newCategory);
    }

    loadCategories();
    setShowForm(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      type: 'groceries',
      description: '',
      subcategories: []
    });
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      description: category.description || '',
      subcategories: category.subcategories || []
    });
    setShowForm(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    storage.deleteCategory(selectedCategory.id);
    loadCategories();
    setShowDeleteDialog(false);
    setSelectedCategory(null);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleAddSubcategory = (category) => {
    const subcategory = prompt('Enter new subcategory name:');
    if (subcategory && subcategory.trim()) {
      const updatedCategory = {
        ...category,
        subcategories: [...category.subcategories, subcategory.trim()]
      };
      storage.updateCategory(category.id, updatedCategory);
      loadCategories();
    }
  };

  const handleRemoveSubcategory = (category, subcategoryToRemove) => {
    if (window.confirm(`Are you sure you want to remove "${subcategoryToRemove}"?`)) {
      const updatedCategory = {
        ...category,
        subcategories: category.subcategories.filter(sub => sub !== subcategoryToRemove)
      };
      storage.updateCategory(category.id, updatedCategory);
      loadCategories();
    }
  };

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
              type: 'groceries',
              description: '',
              subcategories: []
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

          <div className="space-y-4">
            {groceryCategories.map(category => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedCategories[category.id] ? (
                        <ChevronDown size={16} className="text-gray-500" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-500" />
                      )}
                    </button>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit size={16} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>

                {expandedCategories[category.id] && (
                  <div className="mt-4 pl-8 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Subcategories:</span>
                      <button
                        onClick={() => handleAddSubcategory(category)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Subcategory
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((subcat, index) => (
                        <div key={index} className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 rounded-full">
                          <span className="text-sm text-gray-700">{subcat}</span>
                          <button
                            onClick={() => handleRemoveSubcategory(category, subcat)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
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

          <div className="space-y-4">
            {cookedFoodCategories.map(category => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedCategories[category.id] ? (
                        <ChevronDown size={16} className="text-gray-500" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-500" />
                      )}
                    </button>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500">{category.description}</p>
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        {category.brand}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit size={16} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>

                {expandedCategories[category.id] && (
                  <div className="mt-4 pl-8 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Subcategories:</span>
                      <button
                        onClick={() => handleAddSubcategory(category)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Subcategory
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((subcat, index) => (
                        <div key={index} className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 rounded-full">
                          <span className="text-sm text-gray-700">{subcat}</span>
                          <button
                            onClick={() => handleRemoveSubcategory(category, subcat)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.type === 'groceries' ? 'Grocery Category' : 'KOVERA Food Category'}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setSelectedCategory(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="groceries">Groceries</option>
                  <option value="cooked_food">KOVERA Food</option>
                </select>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter category description"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategories
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="e.g., Fresh Fruits, Chicken, etc."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newSubcategory.trim()) {
                            setFormData(prev => ({
                              ...prev,
                              subcategories: [...prev.subcategories, newSubcategory.trim()]
                            }));
                            setNewSubcategory('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSubcategory.trim()) {
                          setFormData(prev => ({
                            ...prev,
                            subcategories: [...prev.subcategories, newSubcategory.trim()]
                          }));
                          setNewSubcategory('');
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.subcategories.length > 0 && (
                    <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                      <ul className="space-y-2">
                        {formData.subcategories.map((subcat, index) => (
                          <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{subcat}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  subcategories: prev.subcategories.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {formData.type === 'cooked_food' && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    This category will be automatically assigned to the "KOVERA" brand.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedCategory(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  {selectedCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Category</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setSelectedCategory(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;