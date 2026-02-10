// src/utils/initData.js
import { ROLES, CATEGORIES, DEFAULT_LOCATIONS, CURRENCY } from './constants';

export const initializeData = () => {
  // Initialize if localStorage is empty
  if (!localStorage.getItem('initialized')) {
    // Default Staff
    const defaultStaff = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@kovera.com',
        password: 'admin123',
        role: ROLES.SUPER_ADMIN,
        location: 'All',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        username: 'staff1',
        email: 'staff1@kovera.com',
        password: 'password123',
        role: ROLES.STAFF,
        location: 'Main Branch',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('staff', JSON.stringify(defaultStaff));

    // Default Products
    const defaultProducts = [
      {
        id: 1,
        name: 'Fresh Tomatoes',
        category: CATEGORIES.GROCERIES[0],
        subcategory: 'N/A',
        retailPrice: '₱ 120',
        wholesalePrice: '₱ 100',
        wholesaleMOQ: 10,
        type: 'groceries',
        description: 'Fresh organic tomatoes',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Milk 1L',
        category: CATEGORIES.GROCERIES[1],
        subcategory: 'N/A',
        retailPrice: '₱ 80',
        wholesalePrice: '₱ 70',
        wholesaleMOQ: 20,
        type: 'groceries',
        description: 'Fresh milk 1 liter',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Orange Juice',
        category: CATEGORIES.GROCERIES[2],
        subcategory: 'N/A',
        retailPrice: '₱ 150',
        wholesalePrice: '₱ 130',
        wholesaleMOQ: 15,
        type: 'groceries',
        description: 'Fresh orange juice',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('products', JSON.stringify(defaultProducts));

    // Default Cooked Food
    const defaultCookedFood = [
      {
        id: 101,
        name: 'Chicken Pulav',
        category: 'Pulav',
        subcategory: 'Chicken Pulav',
        price: '₱ 200',
        preparationTime: '30 mins',
        brand: 'KOVERA',
        locations: ['Main Branch'],
        type: 'cooked_food',
        description: 'Traditional chicken rice dish',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 102,
        name: 'Vegetable Fry',
        category: 'Fry',
        subcategory: 'Vegetable Fry',
        price: '₱ 150',
        preparationTime: '20 mins',
        brand: 'KOVERA',
        locations: ['Main Branch', 'North Branch'],
        type: 'cooked_food',
        description: 'Mixed vegetable fry',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('cookedFood', JSON.stringify(defaultCookedFood));

    // Default Categories
    const allCategories = [
      ...CATEGORIES.GROCERIES.map((name, index) => ({
        id: index + 1,
        name,
        type: 'groceries',
        description: `${name} category`,
        subcategories: ['N/A'],
        isActive: true
      })),
      ...Object.entries(CATEGORIES.COOKED_FOOD).map(([name, subcats], index) => ({
        id: 100 + index + 1,
        name,
        type: 'cooked_food',
        description: `KOVERA ${name} category`,
        subcategories: subcats,
        brand: 'KOVERA',
        isActive: true
      }))
    ];
    localStorage.setItem('categories', JSON.stringify(allCategories));

    // Default Locations
    const defaultLocations = DEFAULT_LOCATIONS.map((name, index) => ({
      id: index + 1,
      name,
      address: `${name} Address`,
      city: 'Manila',
      pincode: `${1000 + index * 100}`,
      phone: '+63 912 345 6789',
      email: `${name.toLowerCase().replace(' ', '_')}@kovera.com`,
      openingTime: '08:00',
      closingTime: '20:00',
      isActive: index < 3, // First 3 locations active
      createdAt: new Date().toISOString()
    }));
    localStorage.setItem('locations', JSON.stringify(defaultLocations));

    // Default Orders
    const defaultOrders = [
      {
        id: 1,
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+63 912 345 6789',
        type: 'retail',
        category: 'groceries',
        total: '₱ 350',
        status: 'completed',
        paymentStatus: 'paid',
        date: new Date('2024-01-15').toISOString(),
        items: [
          { id: 1, name: 'Fresh Tomatoes', quantity: 2, price: '₱ 120' },
          { id: 2, name: 'Milk 1L', quantity: 1, price: '₱ 80' },
          { id: 101, name: 'Chicken Pulav', quantity: 1, price: '₱ 200' }
        ]
      },
      {
        id: 2,
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+63 923 456 7890',
        type: 'wholesale',
        category: 'groceries',
        total: '₱ 1,500',
        status: 'pending',
        paymentStatus: 'pending',
        moqMet: true,
        date: new Date('2024-01-14').toISOString(),
        items: [
          { id: 1, name: 'Fresh Tomatoes', quantity: 10, price: '₱ 100' },
          { id: 3, name: 'Orange Juice', quantity: 5, price: '₱ 130' }
        ]
      }
    ];
    localStorage.setItem('orders', JSON.stringify(defaultOrders));

    // Default Settings
    const defaultSettings = {
      adminEmail: 'admin@kovera.com',
      adminWhatsApp: '+63 912 345 6789',
      emailNotifications: true,
      whatsappNotifications: true,
      orderAlerts: true,
      lowStockAlerts: true,
      paymentGateway: 'Stripe',
      currency: CURRENCY,
      testMode: false,
      maintenanceMode: false,
      autoBackup: true,
      backupFrequency: 'daily',
      dataRetention: '30',
      enableApi: false,
      apiKey: '',
      webhookUrl: '',
      twoFactorAuth: false,
      sessionTimeout: '30',
      ipWhitelist: '',
    };
    localStorage.setItem('settings', JSON.stringify(defaultSettings));

    // Mark as initialized
    localStorage.setItem('initialized', 'true');
  }
};

// Clear all data (development only)
export const clearAllData = () => {
  localStorage.clear();
  localStorage.setItem('initialized', 'true'); // Prevent auto-initialization
};