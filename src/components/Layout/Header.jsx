import React, { useState, useEffect } from 'react';
import { 
  Bell, User, ChevronDown, 
  LogOut, Settings, HelpCircle, Moon, Sun,
  Package, ShoppingCart, DollarSign, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: '₱ 0'
  });

  // Fetch stats from localStorage
  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const cookedFood = JSON.parse(localStorage.getItem('cookedFood') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    setStats({
      totalProducts: products.length + cookedFood.length,
      totalOrders: orders.length,
      revenue: '₱ 25,480'
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Notifications data
  const notifications = [
    { id: 1, title: 'New Order', message: 'Order #ORD-1234 has been placed', time: '5 min ago', read: false },
    { id: 2, title: 'Low Stock', message: 'Fresh Tomatoes running low', time: '1 hour ago', read: false },
    { id: 3, title: 'System Update', message: 'System maintenance scheduled', time: '2 hours ago', read: true },
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Get user role display
  const getUserRoleDisplay = () => {
    return user?.role === 'super_admin' ? 'Super Admin' : 'Staff';
  };

  // Get role badge color
  const getRoleBadgeClass = () => {
    return user?.role === 'super_admin' 
      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">KOVERA Admin</span>
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                {getUserRoleDisplay()} Dashboard
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              >
                <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border dark:border-gray-800 z-20">
                    <div className="p-4 border-b dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          Notifications
                        </h3>
                        <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer">
                          Mark all as read
                        </span>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              notification.title === 'New Order' ? 'bg-green-100 dark:bg-green-900/30' :
                              notification.title === 'Low Stock' ? 'bg-red-100 dark:bg-red-900/30' :
                              'bg-blue-100 dark:bg-blue-900/30'
                            }`}>
                              {notification.title === 'New Order' ? (
                                <ShoppingCart size={16} className="text-green-600 dark:text-green-400" />
                              ) : notification.title === 'Low Stock' ? (
                                <TrendingUp size={16} className="text-red-600 dark:text-red-400" />
                              ) : (
                                <Settings size={16} className="text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 border-t dark:border-gray-800">
                      <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="font-bold text-white text-sm">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {user?.username || 'User'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeClass()}`}>
                        {getUserRoleDisplay()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.location || 'Location'}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden lg:block" />
              </button>

              {/* User Menu Dropdown - Only Logout */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border dark:border-gray-800 z-20">
                    <div className="p-4 border-b dark:border-gray-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <span className="font-bold text-white text-md">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                            {user?.username || 'User'}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeClass()} font-medium`}>
                          {getUserRoleDisplay()}
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          ● Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-2 border-t dark:border-gray-800">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all duration-200"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="lg:hidden mt-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Products</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {stats.totalProducts}
                  </p>
                </div>
                <Package size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Orders</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {stats.totalOrders}
                  </p>
                </div>
                <ShoppingCart size={20} className="text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {stats.revenue}
                  </p>
                </div>
                <DollarSign size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;