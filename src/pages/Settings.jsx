// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, Bell, Mail, Phone, Globe, Shield, CreditCard, Truck, Database, RefreshCw } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // Notification Settings
    adminEmail: 'admin@kovera.com',
    adminWhatsApp: '+63 912 345 6789',
    emailNotifications: true,
    whatsappNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    
    // Payment Settings
    paymentGateway: 'Stripe',
    currency: '₱ PHP',
    testMode: false,
    
    // System Settings
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '30',
    
    // API Settings
    enableApi: false,
    apiKey: '',
    webhookUrl: '',
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    ipWhitelist: '',
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('settings'));
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('settings', JSON.stringify(settings));
      setSaving(false);
      setSaveMessage('Settings saved successfully!');
      
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }, 1000);
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaultSettings = {
        adminEmail: 'admin@kovera.com',
        adminWhatsApp: '+63 912 345 6789',
        emailNotifications: true,
        whatsappNotifications: true,
        orderAlerts: true,
        lowStockAlerts: true,
        paymentGateway: 'Stripe',
        currency: '₱ PHP',
        testMode: false,
        maintenanceMode: false,
        autoBackup: true,
        backupFrequency: 'daily',
        dataRetention: '30',
        enableApi: false,
        apiKey: '',
        webhookUrl: '',
        twoFactorAuth: false,
        sessionTimeout: '30',
        ipWhitelist: '',
      };
      
      setSettings(defaultSettings);
      localStorage.setItem('settings', JSON.stringify(defaultSettings));
      setSaveMessage('Settings reset to defaults!');
      
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard size={18} /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck size={18} /> },
    { id: 'system', label: 'System', icon: <Database size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure system settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          {saveMessage && (
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm rounded-lg">
              {saveMessage}
            </span>
          )}
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800">
        {/* Tabs */}
        <div className="border-b dark:border-gray-800">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="max-w-3xl mx-auto">
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notification Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Admin Email
                      </label>
                      <div className="flex items-center">
                        <Mail size={18} className="text-gray-400 mr-3" />
                        <input
                          type="email"
                          name="adminEmail"
                          value={settings.adminEmail}
                          onChange={handleChange}
                          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="admin@kovera.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Admin WhatsApp
                      </label>
                      <div className="flex items-center">
                        <Phone size={18} className="text-gray-400 mr-3" />
                        <input
                          type="tel"
                          name="adminWhatsApp"
                          value={settings.adminWhatsApp}
                          onChange={handleChange}
                          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+63 912 345 6789"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive order notifications via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={settings.emailNotifications}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Phone size={20} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">WhatsApp Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive order notifications via WhatsApp</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="whatsappNotifications"
                        checked={settings.whatsappNotifications}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Order Alerts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts for new orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="orderAlerts"
                        checked={settings.orderAlerts}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Low Stock Alerts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts for low stock items</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="lowStockAlerts"
                        checked={settings.lowStockAlerts}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Gateway
                    </label>
                    <select
                      name="paymentGateway"
                      value={settings.paymentGateway}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Stripe">Stripe</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Razorpay">Razorpay</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="₱ PHP">₱ PHP - Philippine Peso</option>
                      <option value="$ USD">$ USD - US Dollar</option>
                      <option value="€ EUR">€ EUR - Euro</option>
                      <option value="₹ INR">₹ INR - Indian Rupee</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard size={20} className="text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Test Mode</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable test payments for development</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="testMode"
                      checked={settings.testMode}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-600"></div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">System Settings</h3>
                
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield size={20} className="text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Maintenance Mode</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Temporarily disable the system for maintenance</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database size={20} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Auto Backup</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Automatically backup system data</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="autoBackup"
                        checked={settings.autoBackup}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Backup Frequency
                    </label>
                    <select
                      name="backupFrequency"
                      value={settings.backupFrequency}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data Retention (Days)
                    </label>
                    <input
                      type="number"
                      name="dataRetention"
                      value={settings.dataRetention}
                      onChange={handleChange}
                      min="1"
                      max="365"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Security Settings</h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield size={20} className="text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for admin logins</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="twoFactorAuth"
                      checked={settings.twoFactorAuth}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Timeout (Minutes)
                  </label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    value={settings.sessionTimeout}
                    onChange={handleChange}
                    min="5"
                    max="480"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    IP Whitelist (Comma-separated)
                  </label>
                  <textarea
                    name="ipWhitelist"
                    value={settings.ipWhitelist}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="192.168.1.1, 10.0.0.1"
                    rows="3"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Leave empty to allow access from any IP address
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 border-t dark:border-gray-800">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;