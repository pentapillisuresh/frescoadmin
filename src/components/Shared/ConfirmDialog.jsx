// src/components/Shared/ConfirmDialog.jsx
import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={48} />;
      case 'error':
        return <XCircle className="text-red-500" size={48} />;
      case 'info':
        return <Info className="text-blue-500" size={48} />;
      default:
        return <AlertTriangle className="text-yellow-500" size={48} />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="px-6 py-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                {getIcon()}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`px-6 py-3 text-white rounded-xl font-medium transition-colors ${getButtonColor()} disabled:opacity-50`}
              >
                {loading ? 'Processing...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;