// src/pages/Products/index.jsx
import React, { useState } from 'react';
import { Package, Store, Truck, Coffee, BarChart3 } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Products = ({ userRole }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('retail');

  const tabs = [
    {
      id: 'retail',
      name: 'Retail Products',
      icon: Store,
      description: 'Manage retail grocery items',
      path: '/products/retail'
    },
    {
      id: 'wholesale',
      name: 'Wholesale Products',
      icon: Truck,
      description: 'Manage wholesale products',
      path: '/products/wholesale'
    },
    {
      id: 'cooked-food',
      name: 'KOVERA Food',
      icon: Coffee,
      description: 'Managed cooked food items',
      path: '/products/cooked-food'
    },
    {
      id: 'categories',
      name: 'Categories',
      icon: BarChart3,
      description: 'Manage product categories',
      path: '/products/categories'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Package className="text-blue-600" size={28} />
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          </div>
          <p className="text-gray-600">
            Manage all products, categories, and inventory in one place
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retail Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Store className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wholesale Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Truck className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <BarChart3 className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="flex border-b">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = location.pathname.startsWith(tab.path);
              
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex-1 px-6 py-4 text-center border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon size={20} />
                    <span className="font-medium">{tab.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">{tab.description}</p>
                </Link>
              );
            })}
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            <Outlet context={{ userRole }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;