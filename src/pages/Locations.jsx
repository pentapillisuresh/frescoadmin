// src/pages/Locations.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Clock, Check, X, Loader } from 'lucide-react';
import ConfirmDialog from '../components/Shared/ConfirmDialog';
import locationService from '../services/locationService';
import toast from 'react-hot-toast';

const Locations = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    email: '',
    startTime: '09:00 AM',
    endTime: '09:00 PM',
    latitude: 0,
    longitude: 0
  });

  // Fetch locations from API
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await locationService.getAllLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to fetch locations');
      // Fallback to empty array
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      
      if (selectedLocation) {
        // Update location
        const updatedLocation = await locationService.updateLocation(
          selectedLocation._id,
          formData
        );
        setLocations(locations.map(loc => 
          loc._id === selectedLocation._id ? updatedLocation : loc
        ));
        toast.success('Location updated successfully');
      } else {
        // Add new location
        const newLocation = await locationService.createLocation(formData);
        setLocations([...locations, newLocation]);
        toast.success('Location added successfully');
      }
      
      setShowForm(false);
      setSelectedLocation(null);
      resetForm();
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error(error.response?.data?.message || 'Failed to save location');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
      pincode: location.pincode,
      phone: location.phone,
      email: location.email,
      startTime: location.startTime,
      endTime: location.endTime,
      latitude: location.latitude || 0,
      longitude: location.longitude || 0
    });
    setShowForm(true);
  };

  const handleDelete = (location) => {
    setSelectedLocation(location);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setFormLoading(true);
      await locationService.deleteLocation(selectedLocation._id);
      setLocations(locations.filter(loc => loc._id !== selectedLocation._id));
      toast.success('Location deleted successfully');
      setShowDeleteDialog(false);
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error(error.response?.data?.message || 'Failed to delete location');
    } finally {
      setFormLoading(false);
    }
  };

  const toggleStatus = async (location) => {
    try {
      const updatedLocation = await locationService.toggleLocationStatus(
        location._id,
        !location.isActive
      );
      setLocations(locations.map(loc => 
        loc._id === location._id ? updatedLocation : loc
      ));
      toast.success(`Location ${!location.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling location status:', error);
      toast.error(error.response?.data?.message || 'Failed to update location status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      pincode: '',
      phone: '',
      email: '',
      startTime: '09:00 AM',
      endTime: '09:00 PM',
      latitude: 0,
      longitude: 0
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

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
            resetForm();
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
        >
          <Plus size={20} />
          <span>Add Location</span>
        </button>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl">
          <MapPin className="mx-auto text-gray-400" size={48} />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No locations found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Get started by adding your first location</p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Location
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map(location => (
            <div key={location._id} className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6 ${
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
                        {location.startTime} - {location.endTime}
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
      )}

      {/* Location Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => !formLoading && setShowForm(false)}>
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
                      disabled={formLoading}
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
                      disabled={formLoading}
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
                    disabled={formLoading}
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
                      disabled={formLoading}
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
                      disabled={formLoading}
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
                      disabled={formLoading}
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
                          value={formData.startTime}
                          onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={formLoading}
                        />
                      </div>
                      <div>
                        <input
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={formLoading}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Use 24-hour format (e.g., 09:00, 21:00)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Latitude (Optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 14.5995"
                      disabled={formLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Longitude (Optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 120.9842"
                      disabled={formLoading}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => !formLoading && setShowForm(false)}
                    className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    disabled={formLoading}
                  >
                    {formLoading && <Loader className="animate-spin" size={20} />}
                    <span>{selectedLocation ? 'Update Location' : 'Add Location'}</span>
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
        message={`Are you sure you want to delete "${selectedLocation?.name}"? This action cannot be undone.`}
        type="error"
        confirmText="Delete"
        loading={formLoading}
      />
    </div>
  );
};

export default Locations;