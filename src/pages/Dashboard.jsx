// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, Users, DollarSign, 
  TrendingUp, TrendingDown, Store, Coffee 
} from 'lucide-react';

const Dashboard = ({ userRole }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalStaff: 0,
    revenue: '₱ 0'
  });

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const staff = JSON.parse(localStorage.getItem('staff') || '[]');
    const cookedFood = JSON.parse(localStorage.getItem('cookedFood') || '[]');

    setStats({
      totalProducts: products.length + cookedFood.length,
      totalOrders: orders.length,
      totalStaff: staff.length - 1, // Exclude super admin
      revenue: '₱ 25,480'
    });
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Package className="text-blue-600" size={24} />,
      change: '+12%',
      trend: 'up',
      color: 'blue'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingCart className="text-green-600" size={24} />,
      change: '+8%',
      trend: 'up',
      color: 'green'
    },
    {
      title: 'Staff Members',
      value: stats.totalStaff,
      icon: <Users className="text-purple-600" size={24} />,
      change: '+2',
      trend: 'up',
      color: 'purple'
    },
    {
      title: 'Total Revenue',
      value: stats.revenue,
      icon: <DollarSign className="text-yellow-600" size={24} />,
      change: '+15%',
      trend: 'up',
      color: 'yellow'
    }
  ];

  const recentOrders = [
    { id: 1, orderNumber: 'ORD-001', customer: 'John Doe', amount: '₱ 1,250', status: 'Completed' },
    { id: 2, orderNumber: 'ORD-002', customer: 'Jane Smith', amount: '₱ 890', status: 'Processing' },
    { id: 3, orderNumber: 'ORD-003', customer: 'Robert Johnson', amount: '₱ 2,340', status: 'Pending' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to KOVERA Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="text-green-500" size={16} />
                  ) : (
                    <TrendingDown className="text-red-500" size={16} />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View all →
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{order.amount}</p>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Product Categories</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Store className="text-blue-600" size={20} />
                <span className="font-medium">Groceries</span>
              </div>
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                15 Products
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Coffee className="text-green-600" size={20} />
                <span className="font-medium">KOVERA Food</span>
              </div>
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                8 Products
              </span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="text-sm text-gray-600">
              <p className="font-medium">Quick Actions:</p>
              <div className="flex space-x-4 mt-3">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Add Product
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                  View Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;