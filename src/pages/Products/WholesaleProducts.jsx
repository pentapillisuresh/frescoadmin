// src/pages/Products/WholesaleProducts.jsx
import React, { useState, useEffect } from 'react';
import { Package, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import GroceryProductForm from '../../pages/Products/GroceryProductForm';
import { storage } from '../../utils/storage';

const WholesaleProducts = ({ userRole }) => {
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = () => {
    const storedProducts = storage.getWholesaleProducts();
    setProducts(storedProducts);
  };

 const loadCategories = () => {
  try {
    // Get all categories and filter for wholesale ones
    const allCategories = storage.getCategories();
    const wholesaleCategories = allCategories.filter(cat => cat.type === 'wholesale');
    setCategories(wholesaleCategories);
  } catch (error) {
    console.error('Error loading wholesale categories:', error);
    setCategories([]);
  }
};

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this wholesale product?')) {
      storage.deleteWholesaleProduct(id);
      loadProducts();
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      storage.updateWholesaleProduct(editingProduct.id, productData);
    } else {
      storage.addWholesaleProduct(productData);
    }
    
    loadProducts();
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // Get unique categories and subcategories for filters
  const uniqueCategories = ['all', ...new Set(products.map(p => p.category))];
  const uniqueSubcategories = ['all', ...new Set(products.map(p => p.subcategory))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Wholesale Products</h1>
          <p className="text-gray-600">Manage wholesale products with MOQ and bulk pricing</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Wholesale Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search wholesale products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('all');
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
              >
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={selectedCategory === 'all'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              {uniqueSubcategories.map(subcategory => (
                <option key={subcategory} value={subcategory}>
                  {subcategory === 'all' ? 'All Subcategories' : subcategory}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="text-purple-600" size={24} />
            <div>
              <h3 className="font-bold text-lg text-gray-800">Wholesale Inventory</h3>
              <p className="text-gray-600 text-sm">
                {filteredProducts.length} products • Total MOQ: {
                  filteredProducts.reduce((sum, p) => sum + parseInt(p.wholesaleMOQ || 0), 0)
                } units
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Wholesale Value</p>
            <p className="text-2xl font-bold text-purple-600">
              ₱{filteredProducts.reduce((sum, p) => sum + (p.stockQuantity * p.wholesalePrice), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wholesale Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MOQ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retail Price
                  </th>
                  {userRole === 'super_admin' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package size={20} className="text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.subcategory}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-600">
                        ₱{parseFloat(product.wholesalePrice).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        {product.wholesaleMOQ} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        product.stockQuantity > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stockQuantity} {product.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        ₱{product.retailPrice ? parseFloat(product.retailPrice).toFixed(2) : 'N/A'}
                      </span>
                    </td>
                    {userRole === 'super_admin' && (
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-300" size={64} />
            <h3 className="mt-6 text-xl font-medium text-gray-600">No wholesale products found</h3>
            <p className="text-gray-500 mt-2">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try changing your search or filters' 
                : 'Add your first wholesale product to get started'}
            </p>
            <button
              onClick={handleAddProduct}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add First Product</span>
            </button>
          </div>
        )}
      </div>

      {/* Wholesale Product Form Modal */}
      {showProductForm && (
        <GroceryProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          productType="wholesale"
        />
      )}
    </div>
  );
};

export default WholesaleProducts;