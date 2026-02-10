import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Package, Users, ShoppingCart, MapPin, Settings, 
  ChevronDown, ChevronRight, ShoppingBag, Store, Coffee,
  LogOut, Menu as MenuIcon, X, Search, User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [productsOpen, setProductsOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdowns when sidebar collapses
  useEffect(() => {
    if (!isOpen) {
      setProductsOpen(false);
      setOrdersOpen(false);
    }
  }, [isOpen]);

  // Get user role and location
  const userRole = user?.role || 'staff';
  const userLocation = user?.location || 'Not Assigned';

  // Dynamic menu items based on role
  const menuItems = [
    { 
      path: '/dashboard', 
      icon: <Home size={20} />, 
      label: 'Dashboard',
      roles: ['super_admin', 'staff']
    },
    { 
      type: 'dropdown',
      label: 'Products',
      icon: <Package size={20} />,
      isOpen: productsOpen,
      toggle: () => setProductsOpen(!productsOpen),
      roles: ['super_admin', 'staff'],
      subItems: [
        { 
          path: '/products/retail', 
          label: 'Retail', 
          icon: <Store size={16} />,
          roles: ['super_admin', 'staff']
        },
        ...(userRole === 'super_admin' ? [
          { 
            path: '/products/wholesale', 
            label: 'Wholesale', 
            icon: <ShoppingBag size={16} />,
            roles: ['super_admin']
          },
          { 
            path: '/categories', 
            label: 'Categories', 
            icon: <Package size={16} />,
            roles: ['super_admin']
          }
        ] : [])
      ]
    },
    { 
      type: 'dropdown',
      label: 'Orders',
      icon: <ShoppingCart size={20} />,
      isOpen: ordersOpen,
      toggle: () => setOrdersOpen(!ordersOpen),
      roles: ['super_admin', 'staff'],
      subItems: [
        { 
          path: '/orders/retail', 
          label: 'Retail',
          roles: ['super_admin', 'staff']
        },
        ...(userRole === 'super_admin' ? [
          { 
            path: '/orders/wholesale', 
            label: 'Wholesale',
            roles: ['super_admin']
          }
        ] : [])
      ]
    },
    ...(userRole === 'super_admin' ? [
      { 
        path: '/staff-management', 
        icon: <Users size={20} />, 
        label: 'Staff Management',
        roles: ['super_admin']
      },
      { 
        path: '/locations', 
        icon: <MapPin size={20} />, 
        label: 'KOVERA Locations',
        roles: ['super_admin']
      }
    ] : []),
    ...(userRole === 'super_admin' ? [
      { 
        path: '/settings', 
        icon: <Settings size={20} />, 
        label: 'Settings',
        roles: ['super_admin']
      }
    ] : [])
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.roles && !item.roles.includes(userRole)) return false;
    return true;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      setSearchQuery('');
    }
  };

  // Handle navigation click
  const handleNavClick = () => {
    // Only close sidebar on mobile screens
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  // Get status badge color based on role
  const getRoleBadgeColor = () => {
    return userRole === 'super_admin' 
      ? 'bg-purple-600 text-white' 
      : 'bg-blue-600 text-white';
  };

  // Get status text
  const getStatusText = () => {
    return userRole === 'super_admin' ? 'Active' : 'Limited Access';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 lg:w-64
        bg-gray-900 text-white
        flex flex-col
        transition-all duration-300 ease-in-out
        shadow-xl lg:shadow-none
        h-screen
      `}>
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {/* Logo and Brand Name */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="font-bold text-lg">K</span>
              </div>
              
              {/* Show brand name only when sidebar is open */}
              <div className="transition-all duration-300 overflow-hidden">
                <div>
                  <h1 className="font-bold text-lg tracking-tight whitespace-nowrap">KOVERA</h1>
                  <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
                </div>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg ml-auto"
            >
              <X size={20} />
            </button>
          </div>

        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item, index) => (
            <div key={index} className="mb-1">
              {item.type === 'dropdown' ? (
                <>
                  <button
                    onClick={item.toggle}
                    className="flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="text-gray-400 group-hover:text-white transition-colors flex-shrink-0">
                        {item.icon}
                      </div>
                      {/* Menu label with smooth transition */}
                      <span className="transition-all duration-300 truncate opacity-100 w-auto">
                        {item.label}
                      </span>
                    </div>
                    {/* Dropdown arrow - only show when sidebar is open */}
                    <div className="flex-shrink-0 ml-2">
                      {item.isOpen ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {/* Dropdown content */}
                  <div className={`
                    transition-all duration-200 overflow-hidden
                    ${item.isOpen ? 'max-h-96' : 'max-h-0'}
                    ml-2 pl-10 border-l border-gray-700
                  `}>
                    <div className="pt-1 space-y-1 pl-2">
                      {item.subItems
                        .filter(subItem => !subItem.roles || subItem.roles.includes(userRole))
                        .map((subItem, subIndex) => (
                          <NavLink
                            key={subIndex}
                            to={subItem.path}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                              `flex items-center space-x-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200
                              ${isActive 
                                ? 'bg-blue-900/30 text-blue-300 border-l-2 border-blue-500' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                              }`
                            }
                          >
                            {/* Subitem icon */}
                            {subItem.icon && (
                              <span className="opacity-70 flex-shrink-0">
                                {subItem.icon}
                              </span>
                            )}
                            {/* Subitem label */}
                            <span className="transition-all duration-300 truncate opacity-100 w-auto">
                              {subItem.label}
                            </span>
                          </NavLink>
                        ))
                      }
                    </div>
                  </div>
                </>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-900/30 to-blue-900/10 text-white border-l-2 border-blue-500' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="text-gray-400 group-hover:text-white transition-colors flex-shrink-0">
                      {item.icon}
                    </div>
                    {/* Menu label */}
                    <span className="transition-all duration-300 truncate opacity-100 w-auto">
                      {item.label}
                    </span>
                  </div>
                </NavLink>
              )}
            </div>
          ))}
        </nav>

      
      </div>
    </>
  );
};

export default Sidebar;