// src/components/Products/GroceryProductForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { storage } from '../../utils/storage';

const GroceryProductForm = ({ product, onSave, onClose, productType = 'retail' }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    retailPrice: '',
    wholesalePrice: '',
    wholesaleMOQ: productType === 'wholesale' ? '10' : '',
    stockQuantity: '',
    unit: 'piece',
    weight: '',
    dimensions: '',
    image: '',
    isActive: true,
    ...product
  });

  const [categories, setCategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState('');

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = () => {
      if (productType === 'wholesale') {
        const wholesaleCategories = storage.getWholesaleCategories();
        setCategories(wholesaleCategories);
      } else {
        const groceryCategories = storage.getGroceryCategories();
        setCategories(groceryCategories);
      }
    };
    loadCategories();
  }, [productType]);

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
    if (!formData.name || !formData.category || !formData.subcategory) {
      alert('Please fill in all required fields');
      return;
    }

    if (productType === 'retail' && (!formData.retailPrice || !formData.wholesalePrice)) {
      alert('Please enter both retail and wholesale prices');
      return;
    }

    if (productType === 'wholesale' && (!formData.wholesalePrice || !formData.wholesaleMOQ)) {
      alert('Please enter wholesale price and MOQ');
      return;
    }

    // Format price values
    const formattedData = { ...formData };
    
    if (productType === 'retail') {
      formattedData.retailPrice = parseFloat(formData.retailPrice) || 0;
      formattedData.wholesalePrice = parseFloat(formData.wholesalePrice) || 0;
      formattedData.wholesaleMOQ = parseInt(formData.wholesaleMOQ) || 1;
    } else {
      formattedData.wholesalePrice = parseFloat(formData.wholesalePrice) || 0;
      formattedData.wholesaleMOQ = parseInt(formData.wholesaleMOQ) || 10;
      formattedData.retailPrice = parseFloat(formData.retailPrice) || 0;
    }
    
    formattedData.stockQuantity = parseInt(formData.stockQuantity) || 0;
    formattedData.weight = parseFloat(formData.weight) || null;
    
    onSave(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {productType === 'wholesale' ? 'Wholesale Grocery Item' : 'Retail Grocery Item'}
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
                    placeholder="Product description..."
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {productType === 'retail' && (
                    <>
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
                          placeholder="e.g., 10"
                        />
                      </div>
                    </>
                  )}

                  {productType === 'wholesale' && (
                    <>
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
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          MOQ (Minimum Order Quantity) *
                        </label>
                        <input
                          type="number"
                          name="wholesaleMOQ"
                          value={formData.wholesaleMOQ}
                          onChange={handleChange}
                          required
                          min="1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          placeholder="e.g., 50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Retail Price (₱)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                          <input
                            type="number"
                            name="retailPrice"
                            value={formData.retailPrice}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Inventory & Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="0"
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
                  >
                    <option value="piece">Piece</option>
                    <option value="kg">Kilogram</option>
                    <option value="g">Gram</option>
                    <option value="liter">Liter</option>
                    <option value="ml">Milliliter</option>
                    <option value="pack">Pack</option>
                    <option value="bunch">Bunch</option>
                    <option value="dozen">Dozen</option>
                    <option value="box">Box</option>
                    <option value="case">Case</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="e.g., 1.5"
                  />
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
                      alt="Product Preview" 
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
                    <p className="text-sm text-gray-600 mb-2">Product Image</p>
                    <p className="text-xs text-gray-500 mb-4">Upload a product photo</p>
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
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Product Active</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {productType === 'wholesale' && (
                    <div className="pt-4 border-t">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Package Dimensions
                      </label>
                      <input
                        type="text"
                        name="dimensions"
                        value={formData.dimensions || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="e.g., 30x20x15 cm"
                      />
                    </div>
                  )}
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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {product ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroceryProductForm;