import React, { useState, useEffect } from 'react';
import { FaCog, FaSave, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';
import './InventorySettings.css';

const InventorySettings = () => {
  const [settings, setSettings] = useState({
    autoDeductInventory: false,
    allowNegativeStock: false,
    lowStockAlertThreshold: 10,
    defaultCurrency: 'INR',
    stockUpdateFrequency: 'real-time'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/inventory/settings');
      const data = await response.json();
      if (data.data) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch('/api/v1/inventory/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading settings...</div>;
  }

  return (
    <div className="inventory-settings">
      <div className="section-header">
        <h2>Inventory Settings</h2>
        <FaCog className="settings-icon" />
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-grid">
          <div className="setting-card">
            <h3>Stock Management</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Auto Deduct Inventory</label>
                <p className="setting-description">
                  Automatically deduct stock when items are ordered
                </p>
              </div>
              <button
                type="button"
                className={`toggle-btn ${settings.autoDeductInventory ? 'active' : ''}`}
                onClick={() => handleToggle('autoDeductInventory')}
              >
                {settings.autoDeductInventory ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Allow Negative Stock</label>
                <p className="setting-description">
                  Allow stock to go below zero for orders
                </p>
              </div>
              <button
                type="button"
                className={`toggle-btn ${settings.allowNegativeStock ? 'active' : ''}`}
                onClick={() => handleToggle('allowNegativeStock')}
              >
                {settings.allowNegativeStock ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Low Stock Alert Threshold</label>
                <p className="setting-description">
                  Alert when stock is at or below this percentage
                </p>
              </div>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.lowStockAlertThreshold}
                onChange={(e) => handleChange('lowStockAlertThreshold', Number(e.target.value))}
                className="setting-input"
              />
              <span className="input-suffix">%</span>
            </div>
          </div>

          <div className="setting-card">
            <h3>Currency & Display</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Default Currency</label>
                <p className="setting-description">
                  Default currency for inventory pricing
                </p>
              </div>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => handleChange('defaultCurrency', e.target.value)}
                className="setting-select"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Stock Update Frequency</label>
                <p className="setting-description">
                  How often stock levels are updated
                </p>
              </div>
              <select
                value={settings.stockUpdateFrequency}
                onChange={(e) => handleChange('stockUpdateFrequency', e.target.value)}
                className="setting-select"
              >
                <option value="real-time">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            <FaSave />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventorySettings;
