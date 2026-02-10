// src/pages/Products/RetailProducts.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Store, Coffee, Search, Filter } from 'lucide-react';
import GroceryProductForm from '../../pages/Products/GroceryProductForm';
import { storage } from '../../utils/storage';

const RetailProducts = ({ userRole }) => {
  const [products, setProducts] = useState([]);
  const [cookedFood, setCookedFood] = useState([]);
  const [activeTab, setActiveTab] = useState('groceries');
  const [showGroceryForm, setShowGroceryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [categories, setCategories] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = () => {
    const storedProducts = storage.getGroceryProducts();
    const storedCookedFood = storage.getCookedFood();
    setProducts(storedProducts);
    setCookedFood(storedCookedFood);
  };

  const loadCategories = () => {
    const groceryCategories = storage.getGroceryCategories();
    setCategories(groceryCategories);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowGroceryForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowGroceryForm(true);
  };

  const handleDeleteProduct = (id, type) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      if (type === 'groceries') {
        storage.deleteGroceryProduct(id);
        loadProducts();
      } else {
        storage.deleteCookedFood(id);
        const updatedCookedFood = cookedFood.filter(p => p.id !== id);
        setCookedFood(updatedCookedFood);
      }
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      if (activeTab === 'groceries') {
        storage.updateGroceryProduct(editingProduct.id, productData);
      } else {
        storage.updateCookedFood(editingProduct.id, productData);
      }
    } else {
      // Add new product
      if (activeTab === 'groceries') {
        storage.addGroceryProduct(productData);
      } else {
        storage.addCookedFood(productData);
      }
    }
    
    loadProducts();
    setShowGroceryForm(false);
    setEditingProduct(null);
  };

  // Filter products based on search and filters
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Retail Products</h1>
          <p className="text-gray-600">Manage your retail product inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Grocery Product</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b">
        <button
          onClick={() => setActiveTab('groceries')}
          className={`px-4 py-3 font-medium text-sm flex items-center space-x-2 ${
            activeTab === 'groceries' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Store size={16} />
          <span>Groceries</span>
          {products.length > 0 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {products.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('kovera_food')}
          className={`px-4 py-3 font-medium text-sm flex items-center space-x-2 ${
            activeTab === 'kovera_food' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Coffee size={16} />
          <span>KOVERA Food</span>
          {cookedFood.length > 0 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {cookedFood.length}
            </span>
          )}
        </button>
      </div>

      {/* Groceries Tab Content */}
      {activeTab === 'groceries' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products by name or description..."
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Store className="text-green-600" size={24} />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Grocery Products</h3>
                  <p className="text-gray-600 text-sm">
                    {filteredProducts.length} products • {categories.length} categories
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ₱{filteredProducts.reduce((sum, p) => sum + (p.stockQuantity * p.retailPrice), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Store size={24} className="text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                              {product.category}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                              {product.subcategory}
                            </span>
                          </div>
                        </div>
                      </div>
                      {product.description && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      {userRole === 'super_admin' && (
                        <button
                          onClick={() => handleDeleteProduct(product.id, 'groceries')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <span className="text-sm text-gray-600">Retail Price</span>
                        <div className="text-xs text-gray-500">Per {product.unit}</div>
                      </div>
                      <span className="font-bold text-blue-600">
                        ₱{parseFloat(product.retailPrice).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <span className="text-sm text-gray-600">Wholesale Price</span>
                        <div className="text-xs text-gray-500">Min. {product.wholesaleMOQ} units</div>
                      </div>
                      <span className="font-bold text-green-600">
                        ₱{parseFloat(product.wholesalePrice).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500">Stock</div>
                        <div className={`font-bold ${product.stockQuantity > 0 ? 'text-gray-800' : 'text-red-600'}`}>
                          {product.stockQuantity} {product.unit}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500">Status</div>
                        <div className={`font-bold ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
              <Store className="mx-auto text-gray-300" size={64} />
              <h3 className="mt-6 text-xl font-medium text-gray-600">No grocery products found</h3>
              <p className="text-gray-500 mt-2">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try changing your search or filters' 
                  : 'Add your first grocery product to get started'}
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
      )}

      {/* KOVERA Food Tab Content */}
      {activeTab === 'kovera_food' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center space-x-3">
              <Coffee className="text-blue-600" size={24} />
              <div>
                <h3 className="font-bold text-lg text-gray-800">KOVERA Food</h3>
                <p className="text-gray-600 text-sm">Managed under fixed brand "KOVERA"</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cookedFood.length > 0 ? (
              cookedFood.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                          KOVERA
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                          {item.category}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                          {item.subcategory}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(item)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      {userRole === 'super_admin' && (
                        <button
                          onClick={() => handleDeleteProduct(item.id, 'cooked_food')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm text-gray-600">Price</span>
                      <span className="font-bold text-yellow-600">₱{parseFloat(item.price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm text-gray-600">Prep Time</span>
                      <span className="font-bold text-purple-600">{item.preparationTime}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 bg-white rounded-xl shadow-sm border">
                <Coffee className="mx-auto text-gray-300" size={64} />
                <h3 className="mt-6 text-xl font-medium text-gray-600">No KOVERA food items found</h3>
                <p className="text-gray-500 mt-2">Add your first KOVERA food item to get started</p>
                <button
                  onClick={handleAddProduct}
                  className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add First Item</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grocery Product Form Modal */}
      {showGroceryForm && (
        <GroceryProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowGroceryForm(false);
            setEditingProduct(null);
          }}
          productType="retail"
        />
      )}
    </div>
  );
};

export default RetailProducts;