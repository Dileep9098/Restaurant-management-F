import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import Config from '../../../../Config/Config';
import axiosInstance from '../../../../apiHandler/axiosInstance';
import './Suppliers.css';

const Suppliers = ({ onStatsUpdate }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: '',
    isActive: true
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_SUPPLIER']);
      const data = await response.data;
      setSuppliers(data.data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name?.trim()) {
    return alert("Supplier name is required");
  }

  setSubmitting(true);

  try {
    const isEdit = Boolean(editingSupplier);

    const url = isEdit
      ? `${Config.END_POINT_LIST['UPDATE_SUPPLIER']}/${editingSupplier._id}`
      : Config.END_POINT_LIST['CREATE_SUPPLIER'];

    const response = isEdit
      ? await axiosInstance.put(url, formData)   // ✅ PUT for update
      : await axiosInstance.post(url, formData);

    if (response?.data?.success) {
      const savedData = response.data.data;

      setSuppliers((prev) => {
        if (isEdit) {
          return prev.map((sup) =>
            sup._id === editingSupplier._id
              ? savedData   // ✅ backend ka updated object
              : sup
          );
        } else {
          return [...prev, savedData];  // ✅ backend se direct add
        }
      });

      setShowModal(false);
      setEditingSupplier(null);

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        gstNumber: "",
        isActive: true,
      });

      onStatsUpdate?.();
    }
  } catch (error) {
    console.error(
      "Error saving supplier:",
      error?.response?.data || error.message
    );
    alert(error?.response?.data?.message || "Something went wrong");
  } finally {
    setSubmitting(false);
  }
};


  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      gstNumber: supplier.gstNumber || '',
      isActive: supplier.isActive !== undefined ? supplier.isActive : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        const response = await axiosInstance.delete(`${Config.END_POINT_LIST['DELETE_SUPPLIER']}/${id}`);
        
        if (response.data.success) {
          // Direct state update - remove supplier from list
          setSuppliers(prev => prev.filter(sup => sup._id !== id));
          onStatsUpdate?.();
        }
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const handleToggleStatus = async (supplier) => {
    try {
      const response = await axiosInstance.put(
        `${Config.END_POINT_LIST['UPDATE_SUPPLIER']}/${supplier._id}`,
        { ...supplier, isActive: !supplier.isActive }
      );
      
      if (response.data.success) {
        // Direct state update - toggle status
        setSuppliers(prev => prev.map(sup => 
          sup._id === supplier._id 
            ? { ...sup, isActive: !sup.isActive }
            : sup
        ));
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error toggling supplier status:', error);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone?.includes(searchTerm)
  );

  return (
    <div className="suppliers">
      <div className="section-header">
        <h2>Suppliers</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Supplier
        </button>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search suppliers..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading suppliers...</div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="empty-state">
          <FaUsers className="empty-state-icon" />
          <h3>No suppliers found</h3>
          <p>Add suppliers to manage your vendor relationships</p>
        </div>
      ) : (
        <div className="suppliers-grid">
          {filteredSuppliers.map(supplier => (
            <div key={supplier._id} className="supplier-card">
              <div className="supplier-header">
                <h3>{supplier.name}</h3>
                <div className="supplier-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleEdit(supplier)}
                    title="Edit Supplier"
                    disabled={submitting}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDelete(supplier._id)}
                    title="Delete Supplier"
                    disabled={submitting}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="supplier-details">
                {supplier.phone && (
                  <div className="contact-row">
                    <FaPhone className="contact-icon" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                
                {supplier.email && (
                  <div className="contact-row">
                    <FaEnvelope className="contact-icon" />
                    <span>{supplier.email}</span>
                  </div>
                )}
                
                {supplier.address && (
                  <div className="contact-row">
                    <FaMapMarkerAlt className="contact-icon" />
                    <span>{supplier.address}</span>
                  </div>
                )}
                
                {supplier.gstNumber && (
                  <div className="contact-row">
                    <span className="label">GST:</span>
                    <span>{supplier.gstNumber}</span>
                  </div>
                )}
                
                <div className="supplier-meta">
                  <span 
                    className={`status-badge ${supplier.isActive ? 'active' : 'inactive'} clickable`}
                    onClick={() => handleToggleStatus(supplier)}
                    title={`Click to ${supplier.isActive ? 'deactivate' : 'activate'}`}
                  >
                    {supplier.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="created-date">
                    Since {new Date(supplier.createdAt).toLocaleDateString()}
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
              <h3>{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Supplier Name*</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="supplier@example.com"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows="3"
                  placeholder="123 Main Street, City, State"
                />
              </div>

              <div className="form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                  placeholder="GSTIN1234567890AB"
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
                  Active Supplier
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
                  {submitting ? 'Saving...' : (editingSupplier ? 'Update' : 'Add') + ' Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
