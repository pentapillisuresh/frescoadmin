// src/components/Shared/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const getStatusConfig = (status) => {
    const configs = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Active' },
      inactive: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Inactive' },
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending' },
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Completed' },
      processing: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Processing' },
      cancelled: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Cancelled' },
      super_admin: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', label: 'Super Admin' },
      staff: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Staff' },
      default: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400', label: status }
    };

    return configs[status?.toLowerCase()] || configs.default;
  };

  const { color, label } = getStatusConfig(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${color} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
};

export default StatusBadge;