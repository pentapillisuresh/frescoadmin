import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Store, Search, Filter, XCircle, CheckCircle, Loader } from 'lucide-react';
import GroceryProductForm from './GroceryProductForm';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import toast from 'react-hot-toast';

const RetailProducts = ({ userRole }) => {
  const [products, setProducts] = useState([]);
  const [showGroceryForm, setShowGroceryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debug: Log the actual role value
  console.log('=== RetailProducts Debug ===');
  console.log('User role received:', userRole);
  console.log('User role type:', typeof userRole);
  
  // Check if user has admin/super admin privileges - More comprehensive check
  const isAdmin = (() => {
    if (!userRole) {
      console.log('No user role provided');
      return false;
    }
    
    const roleLower = userRole.toString().toLowerCase();
    const adminRoles = ['super_admin', 'admin', 'super-admin', 'superadmin', 'administrator'];
    const isUserAdmin = adminRoles.includes(roleLower);
    
    console.log('Role lowercased:', roleLower);
    console.log('Is user admin?', isUserAdmin);
    
    return isUserAdmin;
  })();
  
  console.log('Final isAdmin value:', isAdmin);
  console.log('===========================');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const retailProducts = await productService.getAllRetailProducts();
      setProducts(Array.isArray(retailProducts) ? retailProducts : []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
      setProducts([]);
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

  // Helper function to get category name from category object or ID
  const getCategoryName = (category) => {
    if (!category) return 'Uncategorized';
    
    // If category is an object with name property
    if (typeof category === 'object' && category.name) {
      return category.name;
    }
    
    // If category is a string ID, find it in categories list
    if (typeof category === 'string') {
      const foundCategory = categories.find(cat => cat._id === category);
      return foundCategory ? foundCategory.name : 'Uncategorized';
    }
    
    return 'Uncategorized';
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowGroceryForm(true);
  };

  const handleEditProduct = (product) => {
  console.log('=== Edit Product Debug ===');
  console.log('Editing product object:', product);
  console.log('Product ID:', product._id);
  console.log('Product ID type:', typeof product._id);
  console.log('Product name:', product.name);
  
  if (!product._id) {
    console.error('Product ID is missing!');
    toast.error('Cannot edit product: ID missing');
    return;
  }
  
  setEditingProduct(product);
  setShowGroceryForm(true);
};

  const handleDeleteClick = (product) => {
    console.log('Delete clicked for product:', product.name);
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setDeleteLoading(true);
    try {
      await productService.deleteProduct(productToDelete._id);
      
      // Update UI immediately
      setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
      
      toast.success('Product deleted successfully');
      setShowDeleteDialog(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Delete failed';
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

 const handleSaveProduct = (updatedProduct) => {
  console.log('=== Save Product Debug ===');
  console.log('Received product from form:', updatedProduct);
  console.log('Product ID:', updatedProduct._id);
  console.log('Product name:', updatedProduct.name);
  console.log('Product category:', updatedProduct.category);
  
  try {
    // Update local state immediately
    setProducts(prev => {
      const exists = prev.some(p => p._id === updatedProduct._id);
      console.log('Product exists in list:', exists);
      
      if (exists) {
        console.log('Updating existing product with ID:', updatedProduct._id);
        const updatedList = prev.map(p =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
        console.log('Updated list length:', updatedList.length);
        return updatedList;
      } else {
        console.log('Adding new product');
        return [updatedProduct, ...prev];
      }
    });
    
    setShowGroceryForm(false);
    setEditingProduct(null);
    
    toast.success(`Product ${updatedProduct._id ? 'updated' : 'added'} successfully`);
    
    // Optional: Reload products to ensure data consistency
    setTimeout(() => {
      loadProducts();
    }, 1000);
  } catch (error) {
    console.error('Error in handleSaveProduct:', error);
    toast.error('Failed to save product');
  }
};
  const handleToggleStatus = async (product) => {
    try {
      await productService.toggleProductStatus(product._id, !product.isActive);
      toast.success(`Product ${!product.isActive ? 'activated' : 'deactivated'} successfully`);
      await loadProducts();
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Failed to update product status');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const categoryName = getCategoryName(product.category);
    
    const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || product.subCategory === selectedSubcategory;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const uniqueCategories = ['all', ...new Set(products.map(p => getCategoryName(p.category)).filter(Boolean))];
  
  const uniqueSubcategories = ['all', ...new Set(products.map(p => p.subCategory).filter(Boolean))];

  const totalInventoryValue = filteredProducts.reduce((sum, p) => 
    sum + ((p.availableQuantity || 0) * (p.retailPrice || 0)), 0
  );

  return (
    <div className="space-y-6">
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={48} />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const categoryName = getCategoryName(product.category);
            
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
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.innerHTML = '<div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                          }}
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
                    {/* Delete button - always visible for testing */}
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
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

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCancelDelete}></div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 z-10 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3">
                <Trash2 className="text-red-600 dark:text-red-400" size={24} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
              Delete Product
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                disabled={deleteLoading}
              >
                {deleteLoading && <Loader className="animate-spin" size={20} />}
                <span>{deleteLoading ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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