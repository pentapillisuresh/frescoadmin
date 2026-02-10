// src/components/Products/ProductCard.jsx
import React from 'react';
import { Edit, Trash2, Store, Coffee, Package } from 'lucide-react';
import StatusBadge from '../Shared/StatusBadge';

const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  type = 'groceries',
  userRole,
  showActions = true
}) => {
  const getProductIcon = () => {
    if (type === 'cooked_food') {
      return <Coffee className="text-yellow-600 dark:text-yellow-400" size={24} />;
    }
    return <Store className="text-blue-600 dark:text-blue-400" size={24} />;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
            {getProductIcon()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {product.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                {product.category}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                {product.subcategory}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <StatusBadge status={product.isActive ? 'active' : 'inactive'} size="sm" />
          {showActions && userRole === 'super_admin' && (
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(product)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Edit Product"
              >
                <Edit size={14} className="text-blue-600 dark:text-blue-400" />
              </button>
              <button
                onClick={() => onDelete(product)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Delete Product"
              >
                <Trash2 size={14} className="text-red-600 dark:text-red-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {type === 'groceries' ? (
          <>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Retail Price</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {product.retailPrice}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Wholesale Price</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {product.wholesalePrice}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">MOQ</span>
              <span className="font-bold text-yellow-600 dark:text-yellow-400">
                {product.wholesaleMOQ} units
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {product.price}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Prep Time</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {product.preparationTime}
              </span>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Brand</span>
              <div className="font-bold text-green-600 dark:text-green-400 mt-1">
                {product.brand}
              </div>
              {product.locations && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Available at: {product.locations.join(', ')}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {product.description && (
        <div className="mt-4 pt-4 border-t dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCard;