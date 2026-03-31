import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Globe, MapPin, X, Loader, Upload, DollarSign, Star, Eye, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import menuItemService from '../../services/menuItemService';
import locationService from '../../services/locationService';
import ConfirmDialog from '../../components/Shared/ConfirmDialog';

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    subCategory: '',
    rating: 0,
    reviewCount: 0,
    sortOrder: 0,
    tags: [],
    locationAvailability: [],
    nutritionalInfo: {
      protein: 0,
      calories: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0
    },
    image: null
  });

  const categories = ['Beverages', 'Food', 'Desserts', 'Snacks', 'Specials'];
  const API_BASE_URL = 'http://35.154.98.17:3002'; // Your backend URL

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Remove any double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
    return `${API_BASE_URL}${cleanPath}`;
  };

  useEffect(() => {
    fetchLocations();
    fetchMenuItems();
  }, []);

  const fetchLocations = async () => {
    try {
      const locationsData = await locationService.getAllLocations();
      setLocations(locationsData);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
      setLocations([]);
    }
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const data = await menuItemService.getAllMenuItems();
      let items = Array.isArray(data.menuItems) ? data.menuItems : (Array.isArray(data) ? data : []);
      // Add full image URLs
      items = items.map(item => ({
        ...item,
        imageUrl: getFullImageUrl(item.image)
      }));
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (name === 'tags') {
      const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData({ ...formData, tags: tagsArray });
    } else if (name.includes('nutritionalInfo.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        nutritionalInfo: {
          ...formData.nutritionalInfo,
          [field]: parseFloat(value) || 0
        }
      });
    } else {
      setFormData({ 
        ...formData, 
        [name]: type === 'number' ? parseFloat(value) || 0 : value 
      });
    }
  };

  const handleLocationAvailabilityChange = (locationId, isActive) => {
    const existingIndex = formData.locationAvailability.findIndex(
      loc => loc.location === locationId
    );
    
    let updatedLocations;
    if (existingIndex >= 0) {
      updatedLocations = [...formData.locationAvailability];
      updatedLocations[existingIndex] = { location: locationId, isActive };
    } else {
      updatedLocations = [...formData.locationAvailability, { location: locationId, isActive }];
    }
    
    setFormData({ ...formData, locationAvailability: updatedLocations });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast.error('Please fill in all required fields (Name and Price)');
      return;
    }

    setFormLoading(true);
    
    try {
      const submitData = new FormData();
      
      submitData.append('name', formData.name);
      submitData.append('description', formData.description || '');
      submitData.append('price', formData.price);
      submitData.append('originalPrice', formData.originalPrice || 0);
      if (formData.category) {
        submitData.append('category', formData.category);
      }
      if (formData.subCategory) {
        submitData.append('subCategory', formData.subCategory);
      }
      submitData.append('rating', formData.rating || 0);
      submitData.append('reviewCount', formData.reviewCount || 0);
      submitData.append('sortOrder', formData.sortOrder || 0);
      submitData.append('tags', JSON.stringify(formData.tags));
      submitData.append('locationAvailability', JSON.stringify(formData.locationAvailability));
      submitData.append('nutritionalInfo', JSON.stringify(formData.nutritionalInfo));
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      if (editingItem) {
        await menuItemService.updateMenuItem(editingItem._id, submitData);
        toast.success('Menu item updated successfully');
      } else {
        await menuItemService.createMenuItem(submitData);
        toast.success('Menu item added successfully');
      }
      
      fetchMenuItems();
      closeModal();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to save menu item');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    
    setFormLoading(true);
    try {
      await menuItemService.deleteMenuItem(selectedItem._id);
      toast.success('Menu item deleted successfully');
      fetchMenuItems();
      setShowDeleteDialog(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || 0,
      originalPrice: item.originalPrice || 0,
      category: item.category || '',
      subCategory: item.subCategory || '',
      rating: item.rating || 0,
      reviewCount: item.reviewCount || 0,
      sortOrder: item.sortOrder || 0,
      tags: item.tags || [],
      locationAvailability: item.locationAvailability || [],
      nutritionalInfo: item.nutritionalInfo || {
        protein: 0,
        calories: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0
      },
      image: null
    });
    setImagePreview(item.imageUrl || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setImagePreview(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      category: '',
      subCategory: '',
      rating: 0,
      reviewCount: 0,
      sortOrder: 0,
      tags: [],
      locationAvailability: [],
      nutritionalInfo: {
        protein: 0,
        calories: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0
      },
      image: null
    });
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || !selectedCategory || item.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || 
      (item.locationAvailability && item.locationAvailability.some(loc => loc.location === selectedLocation && loc.isActive));
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const uniqueCategories = ['all', ...new Set(menuItems.map(item => item.category).filter(Boolean))];

  // Get available locations for an item
  const getAvailableLocations = (item) => {
    if (!item.locationAvailability || item.locationAvailability.length === 0) return 'None';
    const available = item.locationAvailability.filter(loc => loc.isActive);
    if (available.length === 0) return 'None';
    const locationNames = available.map(loc => {
      const location = locations.find(l => l._id === loc.location);
      return location ? location.name : '';
    }).filter(Boolean);
    return locationNames.join(', ');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Menu Items</h1>
        <p className="text-gray-600">Manage your KOVERA menu items across all locations</p>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Locations</option>
              {locations.filter(loc => loc.isActive).map(loc => (
                <option key={loc._id} value={loc._id}>{loc.name}</option>
              ))}
            </select>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Menu Item
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Total Items</p>
          <p className="text-2xl font-bold">{menuItems.length}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Categories</p>
          <p className="text-2xl font-bold">{uniqueCategories.length - 1}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Active Locations</p>
          <p className="text-2xl font-bold">{locations.filter(l => l.isActive).length}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Filtered Results</p>
          <p className="text-2xl font-bold">{filteredItems.length}</p>
        </div>
      </div>

      {/* Table View */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Globe size={24} className="text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-gray-500 truncate max-w-xs">{item.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.category ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {item.category}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">${item.price}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.originalPrice > item.price ? (
                            <span className="text-gray-500 line-through">${item.originalPrice}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-600 truncate" title={getAvailableLocations(item)}>
                              {getAvailableLocations(item)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.rating > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{item.rating}</span>
                              {item.reviewCount > 0 && (
                                <span className="text-xs text-gray-400">({item.reviewCount})</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setShowDeleteDialog(true);
                              }}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <Globe size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
                        <p className="text-gray-500">
                          {searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all'
                            ? 'Try adjusting your search or filter criteria'
                            : 'Get started by adding your first menu item'}
                        </p>
                        {!searchTerm && selectedCategory === 'all' && selectedLocation === 'all' && (
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Plus size={20} />
                            Add Menu Item
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="px-4 py-1 bg-blue-600 text-white rounded-lg">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={formLoading} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category (Optional)</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={formLoading}>
                      <option value="">No Category</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={formLoading} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" min="0" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={formLoading} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (Optional)</label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} step="0.01" min="0" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={formLoading} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated) (Optional)</label>
                  <input type="text" name="tags" value={formData.tags.join(', ')} onChange={handleInputChange} placeholder="e.g., Popular, New, Spicy, Vegan" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={formLoading} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Availability</label>
                  <div className="space-y-2 border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {locations.filter(loc => loc.isActive).map(location => {
                      const isAvailable = formData.locationAvailability.some(loc => loc.location === location._id && loc.isActive);
                      return (
                        <div key={location._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <MapPin size={16} className="text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-700">{location.name}</p>
                              <p className="text-xs text-gray-500">{location.address}</p>
                            </div>
                          </div>
                          <button type="button" onClick={() => handleLocationAvailabilityChange(location._id, !isAvailable)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${isAvailable ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`} disabled={formLoading}>
                            {isAvailable ? 'Available' : 'Not Available'}
                          </button>
                        </div>
                      );
                    })}
                    {locations.filter(loc => loc.isActive).length === 0 && (
                      <p className="text-center text-gray-500 py-4">No active locations found</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nutritional Information (Optional)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border border-gray-200 rounded-lg p-4">
                    <div><label className="block text-xs text-gray-500 mb-1">Calories</label><input type="number" name="nutritionalInfo.calories" value={formData.nutritionalInfo.calories} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" disabled={formLoading} /></div>
                    <div><label className="block text-xs text-gray-500 mb-1">Protein (g)</label><input type="number" name="nutritionalInfo.protein" value={formData.nutritionalInfo.protein} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" disabled={formLoading} /></div>
                    <div><label className="block text-xs text-gray-500 mb-1">Carbs (g)</label><input type="number" name="nutritionalInfo.carbohydrates" value={formData.nutritionalInfo.carbohydrates} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" disabled={formLoading} /></div>
                    <div><label className="block text-xs text-gray-500 mb-1">Fat (g)</label><input type="number" name="nutritionalInfo.fat" value={formData.nutritionalInfo.fat} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" disabled={formLoading} /></div>
                    <div><label className="block text-xs text-gray-500 mb-1">Fiber (g)</label><input type="number" name="nutritionalInfo.fiber" value={formData.nutritionalInfo.fiber} onChange={handleInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" disabled={formLoading} /></div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <Upload size={24} className="text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                      <input type="file" name="image" accept="image/*" onChange={handleInputChange} className="hidden" disabled={formLoading} />
                    </label>
                    {(imagePreview || formData.image) && (
                      <div className="relative">
                        <img src={imagePreview || (typeof formData.image === 'string' ? getFullImageUrl(formData.image) : URL.createObjectURL(formData.image))} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                        <button type="button" onClick={() => { setImagePreview(null); setFormData({ ...formData, image: null }); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"><X size={14} /></button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order (Optional)</label>
                  <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleInputChange} min="0" className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={formLoading} />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {formLoading && <Loader className="animate-spin" size={20} />}
                    {editingItem ? 'Update' : 'Create'} Menu Item
                  </button>
                  <button type="button" onClick={closeModal} disabled={formLoading} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => { setShowDeleteDialog(false); setSelectedItem(null); }}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
        type="error"
        confirmText="Delete"
        loading={formLoading}
      />
    </div>
  );
};

export default MenuItems;