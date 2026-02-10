// src/components/Products/ProductList.jsx
import React from 'react';
import { Edit, Trash2, Eye, Package } from 'lucide-react';
import StatusBadge from '../Shared/StatusBadge';

const ProductList = ({ 
  products, 
  onEdit, 
  onDelete, 
  onView, 
  type = 'retail',
  userRole 
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {type === 'retail' ? 'Retail Price' : 'Wholesale Price'}
              </th>
              {type === 'wholesale' && (
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  MOQ
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              {userRole === 'super_admin' && (
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {products.length === 0 ? (
              <tr>
                <td colSpan={type === 'wholesale' ? 6 : 5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <Package size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">No products found</p>
                    <p className="text-sm mt-2">Add your first product to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4">
                        {product.image ? (
                          <img 
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package size={24} className="text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.subcategory}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {type === 'retail' ? product.retailPrice : product.wholesalePrice}
                    </span>
                  </td>
                  {type === 'wholesale' && (
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-sm rounded-full">
                        {product.wholesaleMOQ} units
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <StatusBadge status={product.isActive ? 'active' : 'inactive'} />
                  </td>
                  {userRole === 'super_admin' && (
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onView(product)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} className="text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          onClick={() => onDelete(product)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;