// src/pages/Locations.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Clock, Check, X } from 'lucide-react';
import ConfirmDialog from '../components/Shared/ConfirmDialog';

const Locations = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    email: '',
    openingTime: '09:00',
    closingTime: '21:00',
    isActive: true
  });

  // Initialize locations data
  useEffect(() => {
    const storedLocations = JSON.parse(localStorage.getItem('locations') || '[]');
    
    if (storedLocations.length === 0) {
      const defaultLocations = [
        {
          id: 1,
          name: 'Main Branch',
          address: '123 Main Street, Business District',
          city: 'Manila',
          pincode: '1000',
          phone: '+63 912 345 6789',
          email: 'main@kovera.com',
          openingTime: '08:00',
          closingTime: '22:00',
          isActive: true,
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          name: 'North Branch',
          address: '456 North Avenue, Commercial Center',
          city: 'Quezon City',
          pincode: '1100',
          phone: '+63 923 456 7890',
          email: 'north@kovera.com',
          openingTime: '09:00',
          closingTime: '21:00',
          isActive: true,
          createdAt: '2024-01-15'
        },
        {
          id: 3,
          name: 'South Branch',
          address: '789 South Boulevard, Shopping Complex',
          city: 'Makati',
          pincode: '1200',
          phone: '+63 934 567 8901',
          email: 'south@kovera.com',
          openingTime: '10:00',
          closingTime: '20:00',
          isActive: false,
          createdAt: '2024-02-01'
        }
      ];
      
      setLocations(defaultLocations);
      localStorage.setItem('locations', JSON.stringify(defaultLocations));
    } else {
      setLocations(storedLocations);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedLocation) {
      // Update location
      const updatedLocations = locations.map(loc => 
        loc.id === selectedLocation.id ? { ...loc, ...formData } : loc
      );
      setLocations(updatedLocations);
      localStorage.setItem('locations', JSON.stringify(updatedLocations));
    } else {
      // Add new location
      const newLocation = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      const updatedLocations = [...locations, newLocation];
      setLocations(updatedLocations);
      localStorage.setItem('locations', JSON.stringify(updatedLocations));
    }
    
    setShowForm(false);
    setSelectedLocation(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      pincode: '',
      phone: '',
      email: '',
      openingTime: '09:00',
      closingTime: '21:00',
      isActive: true
    });
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setFormData(location);
    setShowForm(true);
  };

  const handleDelete = (location) => {
    setSelectedLocation(location);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    const updatedLocations = locations.filter(loc => loc.id !== selectedLocation.id);
    setLocations(updatedLocations);
    localStorage.setItem('locations', JSON.stringify(updatedLocations));
    setShowDeleteDialog(false);
    setSelectedLocation(null);
  };

  const toggleStatus = (location) => {
    const updatedLocations = locations.map(loc => 
      loc.id === location.id ? { ...loc, isActive: !loc.isActive } : loc
    );
    setLocations(updatedLocations);
    localStorage.setItem('locations', JSON.stringify(updatedLocations));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">KOVERA Locations</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage operational locations and pincodes</p>
        </div>
        <button
          onClick={() => {
            setSelectedLocation(null);
            setFormData({
              name: '',
              address: '',
              city: '',
              pincode: '',
              phone: '',
              email: '',
              openingTime: '09:00',
              closingTime: '21:00',
              isActive: true
            });
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
        >
          <Plus size={20} />
          <span>Add Location</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map(location => (
          <div key={location.id} className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6 ${
            !location.isActive ? 'opacity-75' : ''
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${
                  location.isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' 
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800'
                }`}>
                  <MapPin className={location.isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'} size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{location.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      location.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {location.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      {location.pincode}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleStatus(location)}
                  className={`p-2 rounded-lg ${
                    location.isActive 
                      ? 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30' 
                      : 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30'
                  }`}
                  title={location.isActive ? 'Disable Location' : 'Enable Location'}
                >
                  {location.isActive ? (
                    <X size={16} className="text-red-600 dark:text-red-400" />
                  ) : (
                    <Check size={16} className="text-green-600 dark:text-green-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <MapPin size={16} className="text-gray-500 dark:text-gray-400 mt-1" />
                  <div className="text-sm">
                    <p className="text-gray-600 dark:text-gray-400">Address</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{location.address}</p>
                    <p className="text-gray-600 dark:text-gray-400">{location.city}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Phone size={14} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Phone</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {location.phone}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Mail size={14} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {location.email}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock size={16} className="text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Operating Hours</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {location.openingTime} - {location.closingTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t dark:border-gray-800">
              <button
                onClick={() => handleEdit(location)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(location)}
                className="px-4 py-2 border border-red-300 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm rounded-lg transition-colors flex items-center space-x-2"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Location Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowForm(false)}>
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="px-6 py-4 border-b dark:border-gray-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {selectedLocation ? 'Edit Location' : 'Add New Location'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Main Branch"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full address"
                    rows="2"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Manila"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+63 912 345 6789"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="location@kovera.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Operating Hours *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="time"
                          value={formData.openingTime}
                          onChange={(e) => setFormData({...formData, openingTime: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="time"
                          value={formData.closingTime}
                          onChange={(e) => setFormData({...formData, closingTime: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active Location
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    {selectedLocation ? 'Update Location' : 'Add Location'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedLocation(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Location"
        message={`Are you sure you want to delete "${selectedLocation?.name}"? This will remove all associated data.`}
        type="error"
        confirmText="Delete"
      />
    </div>
  );
};

export default Locations;