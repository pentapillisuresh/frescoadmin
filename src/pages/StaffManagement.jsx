// src/pages/StaffManagement.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Mail, Lock, MapPin } from 'lucide-react';

const StaffManagement = ({ userRole }) => {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff',
    location: '',
    isActive: true
  });

  useEffect(() => {
    const storedStaff = JSON.parse(localStorage.getItem('staff') || '[]');
    setStaff(storedStaff);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingStaff) {
      // Update staff
      const updatedStaff = staff.map(s => 
        s.id === editingStaff.id ? { ...s, ...formData } : s
      );
      setStaff(updatedStaff);
      localStorage.setItem('staff', JSON.stringify(updatedStaff));
    } else {
      // Add new staff
      const newStaff = {
        id: Date.now(),
        ...formData
      };
      const updatedStaff = [...staff, newStaff];
      setStaff(updatedStaff);
      localStorage.setItem('staff', JSON.stringify(updatedStaff));
    }
    
    setShowForm(false);
    setEditingStaff(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'staff',
      location: '',
      isActive: true
    });
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData(staffMember);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      const updatedStaff = staff.filter(s => s.id !== id);
      setStaff(updatedStaff);
      localStorage.setItem('staff', JSON.stringify(updatedStaff));
    }
  };

  const handleToggleStatus = (id) => {
    const updatedStaff = staff.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    );
    setStaff(updatedStaff);
    localStorage.setItem('staff', JSON.stringify(updatedStaff));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-600">Manage staff accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Staff</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map(staffMember => (
          <div key={staffMember.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User size={24} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{staffMember.username}</h3>
                  <p className="text-sm text-gray-500 flex items-center space-x-1">
                    <Mail size={14} />
                    <span>{staffMember.email}</span>
                  </p>
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
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Location</span>
                </div>
                <span className="font-medium">{staffMember.location}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Status</span>
                <button
                  onClick={() => handleToggleStatus(staffMember.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    staffMember.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {staffMember.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
              <button
                onClick={() => handleEdit(staffMember)}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
              {staffMember.role !== 'super_admin' && (
                <button
                  onClick={() => handleDelete(staffMember.id)}
                  className="px-4 py-2 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingStaff ? 'Edit Staff' : 'Add New Staff'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter username"
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
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter password"
                />
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Location</option>
                  <option value="Main Branch">Main Branch</option>
                  <option value="North Branch">North Branch</option>
                  <option value="South Branch">South Branch</option>
                  <option value="All">All Locations</option>
                </select>
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
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingStaff ? 'Update Staff' : 'Add Staff'}
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