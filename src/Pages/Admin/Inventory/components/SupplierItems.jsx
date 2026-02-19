import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaLink, FaSearch, FaRupeeSign, FaBox } from 'react-icons/fa';
import Config from '../../../../Config/Config';
import axiosInstance from '../../../../apiHandler/axiosInstance';
import './SupplierItems.css';

const SupplierItems = () => {
  const [supplierItems, setSupplierItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    supplier: '',
    rawMaterial: '',
    lastPurchasePrice: 0,
    isActive: true
  });

  useEffect(() => {
    fetchSupplierItems();
    fetchSuppliers();
    fetchRawMaterials();
  }, []);

  const fetchSupplierItems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_SUPPLIER_ITEMS']);
      const data = await response.data;
      setSupplierItems(data.data || []);
    } catch (error) {
      console.error('Error fetching supplier items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_SUPPLIER']);
      const data = await response.data;
      setSuppliers(data.data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchRawMaterials = async () => {
    try {
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL']);
      const data = await response.data;
      setRawMaterials(data.data || []);
    } catch (error) {
      console.error('Error fetching raw materials:', error);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.supplier) {
    return alert("Supplier is required");
  }

  if (!formData.rawMaterial) {
    return alert("Raw material is required");
  }

  setSubmitting(true);

  try {
    const isEdit = Boolean(editingItem);

    const url = isEdit
      ? `${Config.END_POINT_LIST['UPDATE_SUPPLIER_ITEM']}/${editingItem._id}`
      : Config.END_POINT_LIST['CREATE_SUPPLIER_ITEM'];

    const response = isEdit
      ? await axiosInstance.put(url, formData)   // ✅ PUT for update
      : await axiosInstance.post(url, formData);

    if (response?.data?.success) {
      const savedData = response.data.data;

      setSupplierItems((prev) => {
        if (isEdit) {
          return prev.map((item) =>
            item._id === editingItem._id
              ? savedData   // ✅ backend ka actual updated object
              : item
          );
        } else {
          return [...prev, savedData];  // ✅ directly backend response add
        }
      });

      setShowModal(false);
      setEditingItem(null);

      setFormData({
        supplier: "",
        rawMaterial: "",
        lastPurchasePrice: 0,
        isActive: true,
      });
    }
  } catch (error) {
    console.error(
      "Error saving supplier item:",
      error?.response?.data || error.message
    );
    alert(error?.response?.data?.message || "Something went wrong");
  } finally {
    setSubmitting(false);
  }
};


  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      supplier: item.supplier._id,
      rawMaterial: item.rawMaterial._id,
      lastPurchasePrice: item.lastPurchasePrice,
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this supplier item link?')) {
      try {
        const response = await axiosInstance.delete(`${Config.END_POINT_LIST['DELETE_SUPPLIER_ITEM']}/${id}`);
        
        if (response.data.success) {
          // Direct state update - remove item from list
          setSupplierItems(prev => prev.filter(item => item._id !== id));
        }
      } catch (error) {
        console.error('Error deleting supplier item:', error);
      }
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const response = await axiosInstance.put(
        `${Config.END_POINT_LIST['UPDATE_SUPPLIER_ITEM']}/${item._id}`,
        { ...item, isActive: !item.isActive }
      );
      
      if (response.data.success) {
        // Direct state update - toggle status
        setSupplierItems(prev => prev.map(supItem => 
          supItem._id === item._id 
            ? { ...supItem, isActive: !supItem.isActive }
            : supItem
        ));
      }
    } catch (error) {
      console.error('Error toggling supplier item status:', error);
    }
  };

  const filteredItems = supplierItems.filter(item =>
    item.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rawMaterial?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="supplier-items">
      <div className="section-header">
        <h2>Supplier Items</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Link Supplier Item
        </button>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search supplier items..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading supplier items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <FaLink className="empty-state-icon" />
          <h3>No supplier items found</h3>
          <p>Link raw materials to their suppliers</p>
        </div>
      ) : (
        <div className="supplier-items-grid">
          {filteredItems.map(item => (
            <div key={item._id} className="supplier-item-card">
              <div className="item-header">
                <h3>{item.rawMaterial?.name}</h3>
                <div className="item-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleEdit(item)}
                    title="Edit Supplier Item"
                    disabled={submitting}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDelete(item._id)}
                    title="Delete Supplier Item"
                    disabled={submitting}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="item-details">
                <div className="detail-row">
                  <span className="label">Supplier:</span>
                  <span className="value">{item.supplier?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Material:</span>
                  <span className="value">{item.rawMaterial?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Unit:</span>
                  <span className="value">{item.rawMaterial?.unit}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Last Purchase Price:</span>
                  <span className="value price">
                    <FaRupeeSign />
                    {item.lastPurchasePrice?.toFixed(2)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Avg Cost:</span>
                  <span className="value">
                    <FaRupeeSign />
                    {item.rawMaterial?.averageCost?.toFixed(2)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span 
                    className={`status-badge ${item.isActive ? 'active' : 'inactive'} clickable`}
                    onClick={() => handleToggleStatus(item)}
                    title={`Click to ${item.isActive ? 'deactivate' : 'activate'}`}
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Supplier Item' : 'Link Supplier Item'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Supplier*</label>
                <select
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Raw Material*</label>
                <select
                  value={formData.rawMaterial}
                  onChange={(e) => setFormData({...formData, rawMaterial: e.target.value})}
                  required
                >
                  <option value="">Select Raw Material</option>
                  {rawMaterials.map(material => (
                    <option key={material._id} value={material._id}>
                      {material.name} ({material.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Last Purchase Price</label>
                <input
                  type="number"
                  value={formData.lastPurchasePrice}
                  onChange={(e) => setFormData({...formData, lastPurchasePrice: Number(e.target.value)})}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <span className="checkmark"></span>
                  Active Supplier Item
                </label>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingItem ? 'Update' : 'Link') + ' Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierItems;
