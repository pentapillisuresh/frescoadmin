// src/pages/Products/RetailProducts.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Store, Search, Filter, Eye, XCircle, CheckCircle } from 'lucide-react';
import GroceryProductForm from '../../pages/Products/GroceryProductForm';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { showSuccess, showError, showLoading, dismissToast } from '../../utils/toastUtils';

const RetailProducts = ({ userRole }) => {
  const [products, setProducts] = useState([]);
  const [showGroceryForm, setShowGroceryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const retailProducts = await productService.getAllRetailProducts();
      setProducts(retailProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      showError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const allCategories = await categoryService.getAllCategories();
      const groceryCategories = allCategories.filter(cat => 
        cat.categoryType === 'groceries' || cat.categoryType === 'grocery'
      );
      setCategories(groceryCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowGroceryForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowGroceryForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const loadingToast = showLoading('Deleting product...');
      try {
        await productService.deleteProduct(id, 'retail');
        await loadProducts();
        showSuccess('Product deleted successfully!');
        dismissToast(loadingToast);
      } catch (error) {
        console.error('Error deleting product:', error);
        showError('Failed to delete product');
        dismissToast(loadingToast);
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    await loadProducts();
    setShowGroceryForm(false);
    setEditingProduct(null);
  };

  const handleToggleStatus = async (product) => {
    const loadingToast = showLoading('Updating product status...');
    try {
      await productService.toggleProductStatus(product._id, !product.isActive);
      await loadProducts();
      showSuccess(`Product ${!product.isActive ? 'activated' : 'deactivated'} successfully`);
      dismissToast(loadingToast);
    } catch (error) {
      console.error('Error toggling product status:', error);
      showError('Failed to update product status');
      dismissToast(loadingToast);
    }
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
    
    const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || product.subCategory === selectedSubcategory;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // Get unique categories for filters
  const uniqueCategories = ['all', ...new Set(products.map(p => {
    const cat = p.category;
    return typeof cat === 'object' ? cat?.name : cat;
  }).filter(Boolean))];
  
  const uniqueSubcategories = ['all', ...new Set(products.map(p => p.subCategory).filter(Boolean))];

  const totalInventoryValue = filteredProducts.reduce((sum, p) => 
    sum + ((p.availableQuantity || 0) * (p.retailPrice || 0)), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Retail Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your retail product inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Store className="text-green-600 dark:text-green-400" size={24} />
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Grocery Products</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {filteredProducts.length} products • {categories.length} categories
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Inventory Value</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₱{totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
            
            return (
              <div key={product._id} className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6 hover:shadow-md transition-shadow ${!product.isActive ? 'opacity-75' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <Store size={24} className="text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{product.name}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                            {categoryName}
                          </span>
                          {product.subCategory && (
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                              {product.subCategory}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {product.description && (
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStatus(product)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title={product.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {product.isActive ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <XCircle size={16} className="text-red-600" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    {userRole === 'super_admin' && (
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Retail Price</span>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Per {product.unit}</div>
                    </div>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      ₱{parseFloat(product.retailPrice).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Wholesale Price</span>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Min. {product.wholesaleMOQ} units</div>
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      ₱{parseFloat(product.wholesalePrice).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Available Stock</div>
                      <div className={`font-bold ${(product.availableQuantity || 0) > 0 ? 'text-gray-800 dark:text-gray-100' : 'text-red-600'}`}>
                        {product.availableQuantity || 0} {product.unit}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                      <div className={`font-bold ${product.isActive !== false ? 'text-green-600' : 'text-red-600'}`}>
                        {product.isActive !== false ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800">
          <Store className="mx-auto text-gray-300 dark:text-gray-600" size={64} />
          <h3 className="mt-6 text-xl font-medium text-gray-600 dark:text-gray-400">No products found</h3>
          <p className="text-gray-500 dark:text-gray-500 mt-2">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try changing your search or filters' 
              : 'Add your first product to get started'}
          </p>
          <button
            onClick={handleAddProduct}
            className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add First Product</span>
          </button>
        </div>
      )}

      {/* Product Form Modal */}
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