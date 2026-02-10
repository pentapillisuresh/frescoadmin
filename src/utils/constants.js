// src/utils/constants.js
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  STAFF: 'staff'
};

export const PRODUCT_TYPES = {
  GROCERIES: 'groceries',
  COOKED_FOOD: 'cooked_food'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const CATEGORIES = {
  GROCERIES: [
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Beverages',
    'Seafood',
    'Exotics',
    'Snacks',
    'Veg Meat',
    'Cooked Food'
  ],
  
  COOKED_FOOD: {
    Pulav: ['Chicken Pulav', 'Vegetable Pulav', 'Mutton Pulav', 'Egg Pulav'],
    Fry: ['Chicken Fry', 'Fish Fry', 'Vegetable Fry', 'Paneer Fry'],
    Snacks: ['Veg Snacks', 'Non-Veg Snacks', 'Chinese Snacks', 'Indian Snacks'],
    Salads: ['Fruit Salad', 'Vegetable Salad', 'Mixed Salad', 'Protein Salad']
  }
};

export const DEFAULT_LOCATIONS = [
  'Main Branch',
  'North Branch',
  'South Branch',
  'East Branch',
  'West Branch'
];

export const CURRENCY = '₱ PHP';