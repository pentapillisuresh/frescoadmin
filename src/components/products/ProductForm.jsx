// src/components/Products/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProductForm = ({ product, onSave, onClose, productType, categories, subcategories, userRole, getGrocerySubcategories }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: 'N/A',
    retailPrice: '',
    wholesalePrice: '',
    wholesaleMOQ: '',
    preparationTime: '',
    price: '',
    ...product
  });

  const [availableSubcategories, setAvailableSubcategories] = useState(subcategories || ['N/A']);

  // Update subcategories when category changes
  useEffect(() => {
    if (productType === 'groceries' && formData.category && getGrocerySubcategories) {
      const newSubcategories = getGrocerySubcategories(formData.category);
      setAvailableSubcategories(newSubcategories);
      
      // Reset subcategory if not in new list
      if (!newSubcategories.includes(formData.subcategory)) {
        setFormData(prev => ({ ...prev, subcategory: newSubcategories[0] || 'N/A' }));
      }
    } else if (productType === 'kovera_food' && formData.category) {
      // For cooked food, subcategories are passed as prop
      setAvailableSubcategories(subcategories);
      if (!subcategories.includes(formData.subcategory)) {
        setFormData(prev => ({ ...prev, subcategory: subcategories[0] || 'N/A' }));
      }
    }
  }, [formData.category, productType, getGrocerySubcategories, subcategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format price values
    const formattedData = { ...formData };
    
    if (productType === 'groceries') {
      formattedData.retailPrice = parseFloat(formData.retailPrice) || 0;
      formattedData.wholesalePrice = parseFloat(formData.wholesalePrice) || 0;
      formattedData.wholesaleMOQ = parseInt(formData.wholesaleMOQ) || 1;
    } else {
      formattedData.price = parseFloat(formData.price) || 0;
    }
    
    onSave(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {productType === 'groceries' ? 'Grocery Item' : 'KOVERA Food Item'}
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
                placeholder={productType === 'groceries' ? "e.g., Fresh Apples" : "e.g., Chicken Biryani"}
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
                  <option key={category} value={category}>{category}</option>
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
                {availableSubcategories.length === 0 ? (
                  <option value="">Select category first</option>
                ) : (
                  availableSubcategories.map(subcat => (
                    <option key={subcat} value={subcat}>{subcat}</option>
                  ))
                )}
              </select>
            </div>

            {productType === 'groceries' ? (
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
                    Minimum Order Quantity (MOQ) *
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Type
                  </label>
                  <select
                    name="unit"
                    value={formData.unit || 'piece'}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="piece">Piece</option>
                    <option value="kg">Kilogram</option>
                    <option value="g">Gram</option>
                    <option value="liter">Liter</option>
                    <option value="pack">Pack</option>
                    <option value="bunch">Bunch</option>
                  </select>
                </div>
              </>
            ) : (
              <>
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
                  <input
                    type="text"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="e.g., 30-45 mins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serving Size
                  </label>
                  <input
                    type="text"
                    name="servingSize"
                    value={formData.servingSize || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="e.g., 1 plate, 2 persons"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spice Level
                  </label>
                  <select
                    name="spiceLevel"
                    value={formData.spiceLevel || 'medium'}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="spicy">Spicy</option>
                    <option value="very_spicy">Very Spicy</option>
                  </select>
                </div>

                {userRole === 'super_admin' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Locations (Multiple select)
                    </label>
                    <select
                      multiple
                      value={formData.locations || []}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setFormData(prev => ({ ...prev, locations: selected }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors h-32"
                    >
                      <option value="Main Branch">Main Branch</option>
                      <option value="North Branch">North Branch</option>
                      <option value="South Branch">South Branch</option>
                      <option value="East Branch">East Branch</option>
                      <option value="West Branch">West Branch</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Hold Ctrl/Cmd to select multiple locations
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="pt-6 border-t">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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

export default ProductForm;