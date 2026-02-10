// src/utils/storage.js

// Initialize default data structure if not exists
const initializeStorage = () => {
  if (!localStorage.getItem('groceryProducts')) {
    localStorage.setItem('groceryProducts', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('wholesaleProducts')) {
    localStorage.setItem('wholesaleProducts', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('cookedFood')) {
    localStorage.setItem('cookedFood', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify([
      {
        id: 1,
        name: 'Fruits & Vegetables',
        type: 'groceries',
        description: 'Fresh fruits and vegetables',
        subcategories: ['Fresh Fruits', 'Fresh Vegetables', 'Herbs', 'Organic'],
        isActive: true
      },
      {
        id: 2,
        name: 'Dairy & Eggs',
        type: 'groceries',
        description: 'Milk, cheese, eggs, and dairy products',
        subcategories: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Eggs'],
        isActive: true
      },
      {
        id: 3,
        name: 'Beverages',
        type: 'groceries',
        description: 'Drinks and beverages',
        subcategories: ['Water', 'Juice', 'Soda', 'Energy Drinks', 'Coffee', 'Tea'],
        isActive: true
      },
      {
        id: 4,
        name: 'Seafood',
        type: 'groceries',
        description: 'Fresh and frozen seafood',
        subcategories: ['Fresh Fish', 'Shellfish', 'Frozen Seafood', 'Dried Fish'],
        isActive: true
      },
      {
        id: 5,
        name: 'Exotics',
        type: 'groceries',
        description: 'Exotic and specialty items',
        subcategories: ['Imported Fruits', 'Specialty Items', 'International'],
        isActive: true
      },
      {
        id: 6,
        name: 'Snacks',
        type: 'groceries',
        description: 'Snacks and quick bites',
        subcategories: ['Chips', 'Cookies', 'Crackers', 'Nuts', 'Chocolates'],
        isActive: true
      },
      {
        id: 7,
        name: 'Veg Meat',
        type: 'groceries',
        description: 'Vegetarian meat alternatives',
        subcategories: ['Plant-based Chicken', 'Plant-based Beef', 'Tofu', 'Tempeh'],
        isActive: true
      },
      // Add wholesale categories
      {
        id: 8,
        name: 'Bulk Foods',
        type: 'wholesale',
        description: 'Food items sold in bulk quantities',
        subcategories: ['Grains', 'Pulses', 'Spices', 'Dry Fruits'],
        isActive: true
      },
      {
        id: 9,
        name: 'Beverages (Bulk)',
        type: 'wholesale',
        description: 'Beverages in wholesale quantities',
        subcategories: ['Water Cases', 'Juice Cartons', 'Soda Cases', 'Energy Drinks'],
        isActive: true
      },
      {
        id: 10,
        name: 'Frozen Foods',
        type: 'wholesale',
        description: 'Frozen foods in bulk',
        subcategories: ['Frozen Vegetables', 'Frozen Meat', 'Ready-to-Eat', 'Ice Cream'],
        isActive: true
      },
      {
        id: 11,
        name: 'Snacks (Bulk)',
        type: 'wholesale',
        description: 'Snacks in wholesale packaging',
        subcategories: ['Chips Cases', 'Cookie Boxes', 'Cracker Cartons', 'Chocolate Bars'],
        isActive: true
      },
      {
        id: 101,
        name: 'Pulav',
        type: 'cooked_food',
        description: 'Traditional rice dishes',
        subcategories: ['Chicken Pulav', 'Vegetable Pulav', 'Mutton Pulav', 'Egg Pulav'],
        isActive: true,
        brand: 'KOVERA'
      },
      {
        id: 102,
        name: 'Fry',
        type: 'cooked_food',
        description: 'Fried snacks and items',
        subcategories: ['Chicken Fry', 'Fish Fry', 'Vegetable Fry', 'Paneer Fry'],
        isActive: true,
        brand: 'KOVERA'
      },
      {
        id: 103,
        name: 'Snacks',
        type: 'cooked_food',
        description: 'Quick snacks and bites',
        subcategories: ['Veg Snacks', 'Non-Veg Snacks', 'Chinese Snacks', 'Indian Snacks'],
        isActive: true,
        brand: 'KOVERA'
      },
      {
        id: 104,
        name: 'Salads',
        type: 'cooked_food',
        description: 'Fresh salads and healthy options',
        subcategories: ['Fruit Salad', 'Vegetable Salad', 'Mixed Salad', 'Protein Salad'],
        isActive: true,
        brand: 'KOVERA'
      }
    ]));
  }
  
  if (!localStorage.getItem('staff')) {
    localStorage.setItem('staff', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('locations')) {
    localStorage.setItem('locations', JSON.stringify([
      { id: 1, name: 'Main Branch', address: '123 Main St', isActive: true },
      { id: 2, name: 'North Branch', address: '456 North Ave', isActive: true },
      { id: 3, name: 'South Branch', address: '789 South Rd', isActive: true }
    ]));
  }
  
  if (!localStorage.getItem('settings')) {
    localStorage.setItem('settings', JSON.stringify({
      taxRate: 0.12,
      currency: 'PHP',
      companyName: 'KOVERA',
      theme: 'light'
    }));
  }
};

// Call initialization
initializeStorage();

export const storage = {
  // Grocery Products
  getGroceryProducts: () => {
    return JSON.parse(localStorage.getItem('groceryProducts') || '[]');
  },
  
  setGroceryProducts: (products) => {
    localStorage.setItem('groceryProducts', JSON.stringify(products));
    return products;
  },
  
  addGroceryProduct: (product) => {
    const products = this.getGroceryProducts();
    const newProduct = {
      ...product,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'grocery'
    };
    products.push(newProduct);
    this.setGroceryProducts(products);
    return newProduct;
  },
  
  updateGroceryProduct: (id, updates) => {
    const products = this.getGroceryProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.setGroceryProducts(products);
      return products[index];
    }
    return null;
  },
  
  deleteGroceryProduct: (id) => {
    const products = this.getGroceryProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    this.setGroceryProducts(filteredProducts);
    return filteredProducts;
  },
  
  // Wholesale Products
  getWholesaleProducts: () => {
    return JSON.parse(localStorage.getItem('wholesaleProducts') || '[]');
  },
  
  setWholesaleProducts: (products) => {
    localStorage.setItem('wholesaleProducts', JSON.stringify(products));
    return products;
  },
  
  addWholesaleProduct: (product) => {
    const products = this.getWholesaleProducts();
    const newProduct = {
      ...product,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'wholesale'
    };
    products.push(newProduct);
    this.setWholesaleProducts(products);
    return newProduct;
  },
  
  updateWholesaleProduct: (id, updates) => {
    const products = this.getWholesaleProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.setWholesaleProducts(products);
      return products[index];
    }
    return null;
  },
  
  deleteWholesaleProduct: (id) => {
    const products = this.getWholesaleProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    this.setWholesaleProducts(filteredProducts);
    return filteredProducts;
  },
  
  // Cooked Food
  getCookedFood: () => {
    return JSON.parse(localStorage.getItem('cookedFood') || '[]');
  },
  
  setCookedFood: (cookedFood) => {
    localStorage.setItem('cookedFood', JSON.stringify(cookedFood));
    return cookedFood;
  },
  
  addCookedFood: (item) => {
    const cookedFood = this.getCookedFood();
    const newItem = {
      ...item,
      id: Date.now() + Math.random(),
      brand: 'KOVERA',
      type: 'cooked_food',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    cookedFood.push(newItem);
    this.setCookedFood(cookedFood);
    return newItem;
  },
  
  updateCookedFood: (id, updates) => {
    const cookedFood = this.getCookedFood();
    const index = cookedFood.findIndex(p => p.id === id);
    if (index !== -1) {
      cookedFood[index] = {
        ...cookedFood[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.setCookedFood(cookedFood);
      return cookedFood[index];
    }
    return null;
  },
  
  deleteCookedFood: (id) => {
    const cookedFood = this.getCookedFood();
    const filteredCookedFood = cookedFood.filter(p => p.id !== id);
    this.setCookedFood(filteredCookedFood);
    return filteredCookedFood;
  },
  
  // Categories
  getCategories: (type = 'all') => {
    const allCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    if (type === 'all') return allCategories;
    return allCategories.filter(cat => cat.type === type);
  },
  
  setCategories: (categories) => {
    localStorage.setItem('categories', JSON.stringify(categories));
  },
  
  addCategory: (category) => {
    const categories = this.getCategories();
    const newCategory = {
      ...category,
      id: Date.now() + Math.random()
    };
    categories.push(newCategory);
    this.setCategories(categories);
    return newCategory;
  },
  
  updateCategory: (id, updates) => {
    const categories = this.getCategories();
    const index = categories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      categories[index] = {
        ...categories[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.setCategories(categories);
      return categories[index];
    }
    return null;
  },
  
  deleteCategory: (id) => {
    const categories = this.getCategories();
    const filteredCategories = categories.filter(cat => cat.id !== id);
    this.setCategories(filteredCategories);
    return filteredCategories;
  },
  
  // Get grocery categories only
  getGroceryCategories: () => {
    const allCategories = JSON.parse(localStorage.getItem('categories') || '[]');
  return allCategories.filter(cat => cat.type === 'groceries');
  },
  
  // Get cooked food categories only
  getCookedFoodCategories: () => {
    const allCategories = JSON.parse(localStorage.getItem('categories') || '[]');
  return allCategories.filter(cat => cat.type === 'cooked_food');
  },
  
  // Staff
  getStaff: () => {
    return JSON.parse(localStorage.getItem('staff') || '[]');
  },
  
  setStaff: (staff) => {
    localStorage.setItem('staff', JSON.stringify(staff));
  },
  
  // Orders
  getOrders: () => {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  },
  
  setOrders: (orders) => {
    localStorage.setItem('orders', JSON.stringify(orders));
  },
  
  // Locations
  getLocations: () => {
    return JSON.parse(localStorage.getItem('locations') || '[]');
  },
  
  setLocations: (locations) => {
    localStorage.setItem('locations', JSON.stringify(locations));
  },
  
  // Settings
  getSettings: () => {
    return JSON.parse(localStorage.getItem('settings') || '{}');
  },
  
  setSettings: (settings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
  },
  
  // Current User
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  },
  
  setCurrentUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  clearCurrentUser: () => {
    localStorage.removeItem('currentUser');
  },
  
  // Get all products
  getAllProducts: () => {
    const groceries = this.getGroceryProducts();
    const wholesale = this.getWholesaleProducts();
    const cookedFood = this.getCookedFood();
    return [...groceries, ...wholesale, ...cookedFood];
  },
  
  // Search products
  searchProducts: (query, type = 'all') => {
    let results = [];
    
    if (type === 'groceries' || type === 'all') {
      const groceries = this.getGroceryProducts();
      results = [...results, ...groceries.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(query.toLowerCase())
      )];
    }
    
    if (type === 'wholesale' || type === 'all') {
      const wholesale = this.getWholesaleProducts();
      results = [...results, ...wholesale.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(query.toLowerCase())
      )];
    }
    
    if (type === 'cooked_food' || type === 'all') {
      const cookedFood = this.getCookedFood();
      results = [...results, ...cookedFood.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(query.toLowerCase())
      )];
    }
    
    return results;
  },
  
  // Get product by ID
  getProductById: (id) => {
    const allProducts = this.getAllProducts();
    return allProducts.find(p => p.id === id);
  },
  
  // Clear all data (for development)
  clearAll: () => {
    localStorage.clear();
    initializeStorage();
  },
  
  // Export all data
  exportData: () => {
    return {
      groceryProducts: this.getGroceryProducts(),
      wholesaleProducts: this.getWholesaleProducts(),
      cookedFood: this.getCookedFood(),
      categories: this.getCategories(),
      staff: this.getStaff(),
      orders: this.getOrders(),
      locations: this.getLocations(),
      settings: this.getSettings(),
      currentUser: this.getCurrentUser()
    };
  },
  
  // Import data
  importData: (data) => {
    if (data.groceryProducts) localStorage.setItem('groceryProducts', JSON.stringify(data.groceryProducts));
    if (data.wholesaleProducts) localStorage.setItem('wholesaleProducts', JSON.stringify(data.wholesaleProducts));
    if (data.cookedFood) localStorage.setItem('cookedFood', JSON.stringify(data.cookedFood));
    if (data.categories) localStorage.setItem('categories', JSON.stringify(data.categories));
    if (data.staff) localStorage.setItem('staff', JSON.stringify(data.staff));
    if (data.orders) localStorage.setItem('orders', JSON.stringify(data.orders));
    if (data.locations) localStorage.setItem('locations', JSON.stringify(data.locations));
    if (data.settings) localStorage.setItem('settings', JSON.stringify(data.settings));
    if (data.currentUser) localStorage.setItem('currentUser', JSON.stringify(data.currentUser));
  }
};