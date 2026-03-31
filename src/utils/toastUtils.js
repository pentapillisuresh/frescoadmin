// src/utils/toastUtils.js
import toast from 'react-hot-toast';

export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 3000,
    icon: '✅',
    style: {
      background: '#10b981',
      color: '#fff',
      borderRadius: '10px',
      padding: '12px 20px',
    },
    ...options,
  });
};

export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: 4000,
    icon: '❌',
    style: {
      background: '#ef4444',
      color: '#fff',
      borderRadius: '10px',
      padding: '12px 20px',
    },
    ...options,
  });
};

export const showInfo = (message, options = {}) => {
  return toast(message, {
    duration: 3000,
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
      borderRadius: '10px',
      padding: '12px 20px',
    },
    ...options,
  });
};

export const showWarning = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#fff',
      borderRadius: '10px',
      padding: '12px 20px',
    },
    ...options,
  });
};

export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    duration: Infinity,
    style: {
      background: '#363636',
      color: '#fff',
      borderRadius: '10px',
      padding: '12px 20px',
    },
    ...options,
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};