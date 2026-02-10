// src/components/Staff/StaffList.jsx
import React from 'react';
import { Edit, Trash2, User, Mail, MapPin, Lock } from 'lucide-react';
import StatusBadge from '../Shared/StatusBadge';

const StaffList = ({ 
  staff, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  userRole 
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Staff Member
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {staff.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <User size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">No staff members found</p>
                    <p className="text-sm mt-2">Add your first staff member to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              staff.map(staffMember => (
                <tr key={staffMember.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center mr-4">
                        <User size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {staffMember.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Mail size={12} className="mr-1" />
                          {staffMember.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={staffMember.role} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <MapPin size={14} className="mr-2" />
                      {staffMember.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={staffMember.isActive ? 'active' : 'inactive'} />
                      <button
                        onClick={() => onToggleStatus(staffMember)}
                        className={`p-1.5 rounded-lg ${
                          staffMember.isActive 
                            ? 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30' 
                            : 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30'
                        }`}
                        title={staffMember.isActive ? 'Disable Account' : 'Enable Account'}
                      >
                        <Lock size={14} className={
                          staffMember.isActive 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-green-600 dark:text-green-400'
                        } />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {staffMember.lastLogin || 'Never logged in'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(staffMember)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      {staffMember.role !== 'super_admin' && (
                        <button
                          onClick={() => onDelete(staffMember)}
                          className="px-4 py-2 border border-red-300 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;