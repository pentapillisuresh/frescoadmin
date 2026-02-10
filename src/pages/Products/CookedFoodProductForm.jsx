// src/pages/Products/CookedFoodProductForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Clock, Users, Flame } from 'lucide-react';
import { storage } from '../../utils/storage';

const CookedFoodProductForm = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    preparationTime: '',
    servingSize: '',
    spiceLevel: 'medium',
    ingredients: '',
    image: '',
    isAvailable: true,
    ...product
  });

  const [categories, setCategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState('');

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = () => {
      const cookedFoodCategories = storage.getCookedFoodCategories();
      setCategories(cookedFoodCategories);
    };
    loadCategories();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const selectedCategory = categories.find(cat => cat.name === formData.category);
      if (selectedCategory) {
        setAvailableSubcategories(selectedCategory.subcategories || []);
        // Auto-select first subcategory if none selected
        if (!formData.subcategory || !selectedCategory.subcategories.includes(formData.subcategory)) {
          setFormData(prev => ({
            ...prev,
            subcategory: selectedCategory.subcategories[0] || ''
          }));
        }
      } else {
        setAvailableSubcategories([]);
      }
    }
  }, [formData.category, categories]);

  // Handle image preview
  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.subcategory || !formData.price || !formData.preparationTime) {
      alert('Please fill in all required fields');
      return;
    }

    // Format price values
    const formattedData = { ...formData };
    formattedData.price = parseFloat(formData.price) || 0;
    
    onSave(formattedData);
  };

  const spiceLevels = [
    { value: 'mild', label: 'Mild', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'spicy', label: 'Spicy', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { value: 'very_spicy', label: 'Very Spicy', color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {product ? 'Edit KOVERA Food Item' : 'Add New KOVERA Food Item'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Managed under fixed brand "KOVERA"
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
                    Food Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="e.g., Chicken Biryani, Vegetable Fried Rice, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory *
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    required
                    disabled={availableSubcategories.length === 0}
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
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Describe the food item, special features, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients
                  </label>
                  <textarea
                    name="ingredients"
                    value={formData.ingredients || ''}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="List main ingredients (optional)"
                  />
                </div>
              </div>

              {/* Pricing & Details Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₱) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preparation Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="preparationTime"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="e.g., 30-45 mins, 15-20 mins"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serving Size
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="servingSize"
                        value={formData.servingSize || ''}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="e.g., 1 plate, 2 persons"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Spice Level */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Spice Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {spiceLevels.map(level => (
                    <label
                      key={level.value}
                      className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.spiceLevel === level.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="spiceLevel"
                        value={level.value}
                        checked={formData.spiceLevel === level.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center">
                        <Flame className={`${level.color} mb-2`} size={20} />
                        <span className="text-sm font-medium text-gray-700">{level.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Image & Status */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Food Preview" 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image: '' }));
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-sm text-gray-600 mb-2">Food Image</p>
                    <p className="text-xs text-gray-500 mb-4">Upload a photo of the food item</p>
                  </div>
                )}
                
                <label className="cursor-pointer inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                  <Upload size={16} />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Status */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">K</span>
                  </div>
                  <span>KOVERA Brand Settings</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Brand</span>
                      <div className="text-xs text-gray-500">Fixed to "KOVERA"</div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                      KOVERA
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Availability</span>
                      <div className="text-xs text-gray-500">Item available for order</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600 mb-2">Note:</div>
                    <p className="text-xs text-gray-500">
                      All KOVERA food items are automatically assigned to the "KOVERA" brand and cannot be changed.
                    </p>
                  </div>
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
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
              >
                {product ? 'Update Food Item' : 'Add Food Item'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CookedFoodProductForm;