// src/pages/StaffManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, User, Mail, RefreshCw, AlertCircle, Phone } from 'lucide-react';
import staffService from '../services/staffService';
import { useAuth } from '../contexts/AuthContext';

const StaffManagement = () => {
  const { user, isSuperAdmin, loading: authLoading } = useAuth();
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'staff',
    isActive: true
  });

  console.log('StaffManagement - User from auth:', user);
  console.log('StaffManagement - Is super admin:', isSuperAdmin);

  // ✅ Memoized fetch function to prevent unnecessary re-renders
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getAllStaff();
      console.log('Fetched and normalized staff data:', data);
      
      // Data is already normalized by staffService
      setStaff(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch staff data');
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchStaff();
    }
  }, [isSuperAdmin, fetchStaff]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.email) {
        throw new Error('Name and email are required fields');
      }

      if (!editingStaff && !formData.password) {
        throw new Error('Password is required for new staff members');
      }

      if (!editingStaff && formData.password && formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        isActive: formData.isActive
      };

      if (formData.phone && formData.phone.trim()) {
        submitData.phone = formData.phone.trim();
      }

      console.log('Submitting staff data:', submitData);

      if (editingStaff) {
        // Update existing staff
        const updatedStaff = await staffService.updateStaff(
          editingStaff.id, 
          submitData
        );
        
        setStaff(prevStaff => 
          prevStaff.map(s => s.id === editingStaff.id ? updatedStaff : s)
        );
        setSuccessMessage('Staff member updated successfully!');
      } else {
        // Create new staff
        const newStaff = await staffService.createStaff(submitData);
        setStaff(prevStaff => [...prevStaff, newStaff]);
        setSuccessMessage('Staff member created successfully!');
      }
      
      setShowForm(false);
      setEditingStaff(null);
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save staff member');
      console.error('Error saving staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'staff',
      isActive: true
    });
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name || '',
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      password: '',
      role: staffMember.role || 'staff',
      isActive: staffMember.isActive !== undefined ? staffMember.isActive : true
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      setLoading(true);
      setError(null);
      try {
        await staffService.deleteStaff(id);
        setStaff(prevStaff => prevStaff.filter(s => s.id !== id));
        setSuccessMessage('Staff member deleted successfully!');
      } catch (err) {
        setError(err.message || 'Failed to delete staff member');
        console.error('Error deleting staff:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await staffService.toggleStaffStatus(id, !staff.find(s => s.id === id)?.isActive);
      setStaff(prevStaff => 
        prevStaff.map(s => 
          s.id === id ? { ...s, isActive: !s.isActive } : s
        )
      );
      setSuccessMessage('Staff status updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update staff status');
      console.error('Error toggling status:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper function to safely get display name
  const getDisplayName = (staffMember) => {
    if (!staffMember) return 'Unknown';
    // staffMember.name is guaranteed to exist because of normalization
    return staffMember.name || staffMember.email?.split('@')[0] || 'Unnamed Staff';
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <RefreshCw size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading user permissions...</p>
        </div>
      </div>
    );
  }

  // Check if user has permission to manage staff (super-admin only)
  if (!isSuperAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-gray-500 text-sm mt-2">Only Super Admins can manage staff members.</p>
          {user && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">Your role: {user.role}</p>
              <p className="text-xs text-gray-500">Required: super_admin</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading && staff.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <RefreshCw size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading staff data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-600">Manage staff accounts and permissions (Super Admin Only)</p>
          <p className="text-sm text-green-600 mt-1">
            ✓ Logged in as: {user?.name || user?.username || 'Admin'} ({user?.role})
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          <span>Add Staff</span>
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <RefreshCw size={16} className="text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle size={16} className="text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {staff.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <User size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Staff Members</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first staff member</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Staff Member</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map(staffMember => (
            <div key={staffMember.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <User size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {getDisplayName(staffMember)}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                      <Mail size={14} />
                      <span>{staffMember.email}</span>
                    </p>
                    {staffMember.phone && (
                      <p className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                        <Phone size={14} />
                        <span>{staffMember.phone}</span>
                      </p>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  staffMember.role === 'super_admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {staffMember.role === 'super_admin' ? 'Super Admin' : 'Staff'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Status</span>
                  <button
                    onClick={() => handleToggleStatus(staffMember.id)}
                    disabled={loading || staffMember.role === 'super_admin' || staffMember.id === user?.id}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      staffMember.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } ${(loading || staffMember.role === 'super_admin' || staffMember.id === user?.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {staffMember.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => handleEdit(staffMember)}
                  disabled={loading}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                {staffMember.role !== 'super_admin' && staffMember.id !== user?.id && (
                  <button
                    onClick={() => handleDelete(staffMember.id)}
                    disabled={loading}
                    className="px-4 py-2 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingStaff ? 'Edit Staff' : 'Add New Staff'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {editingStaff ? 'Update staff member information' : 'Create a new staff account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter phone number (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password {!editingStaff && '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingStaff}
                  minLength="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder={editingStaff ? "Leave blank to keep current password" : "Enter password (min 6 characters)"}
                />
                {editingStaff && (
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to keep current password
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="staff">Staff</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Super Admins have full access to manage all staff members
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active Account
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingStaff(null);
                    resetForm();
                    setError(null);
                  }}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading && <RefreshCw size={16} className="animate-spin" />}
                  <span>{editingStaff ? 'Update Staff' : 'Add Staff'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;