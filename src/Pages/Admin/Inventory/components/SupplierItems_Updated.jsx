import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBox, FaSearch, FaTruck, FaClock } from 'react-icons/fa';
import Config from '../../../../Config/Config';
import axiosInstance from '../../../../apiHandler/axiosInstance';
import './SupplierItems.css';

const SupplierItems = ({ onStatsUpdate }) => {
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
    preferredUnit: 'purchase',
    leadTime: 0,
    minOrderQuantity: 1,
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
        ? await axiosInstance.put(url, formData)
        : await axiosInstance.post(url, formData);

      if (response?.data?.success) {
        const savedData = response.data.data;

        setSupplierItems((prev) => {
          if (isEdit) {
            return prev.map((item) =>
              item._id === editingItem._id
                ? savedData
                : item
            );
          } else {
            return [...prev, savedData];
          }
        });

        resetForm();

        onStatsUpdate?.();
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
      supplier: item.supplier?._id || item.supplier,
      rawMaterial: item.rawMaterial?._id || item.rawMaterial,
      lastPurchasePrice: item.lastPurchasePrice || 0,
      preferredUnit: item.preferredUnit || 'purchase',
      leadTime: item.leadTime || 0,
      minOrderQuantity: item.minOrderQuantity || 1,
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    document.body.classList.remove('pace-done', 'modal-open');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier item?')) {
      try {
        const response = await axiosInstance.delete(`${Config.END_POINT_LIST['DELETE_SUPPLIER_ITEM']}/${id}`);

        if (response.data.success) {
          setSupplierItems(prev => prev.filter(item => item._id !== id));
          onStatsUpdate?.();
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
        { 
          supplier: item.supplier?._id || item.supplier,
          rawMaterial: item.rawMaterial?._id || item.rawMaterial,
          lastPurchasePrice: item.lastPurchasePrice || 0,
          preferredUnit: item.preferredUnit || 'purchase',
          leadTime: item.leadTime || 0,
          minOrderQuantity: item.minOrderQuantity || 1,
          isActive: !item.isActive
        }
      );

      if (response.data.success) {
        setSupplierItems(prev => prev.map(si =>
          si._id === item._id
            ? { ...si, isActive: !si.isActive }
            : si
        ));
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error toggling supplier item status:', error);
      alert(error?.response?.data?.message || "Failed to update status");
    }
  };

  const filteredSupplierItems = supplierItems.filter(item =>
    item.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rawMaterial?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      supplier: "",
      rawMaterial: "",
      lastPurchasePrice: 0,
      preferredUnit: 'purchase',
      leadTime: 0,
      minOrderQuantity: 1,
      isActive: true,
    });
  };

  const handleAddClick = () => {
    resetForm();
    document.body.classList.remove('pace-done', 'modal-open');
  };

  return (
    <div className="supplier-items">
      <div className="section-header">
        <h2>Supplier Items</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#supplierItemModal"
          onClick={handleAddClick}
        >
          <FaPlus className="me-2" />
          Link Supplier Item
        </button>
      </div>

      <div className="search-bar">
        {/* <FaSearch className="search-icon" /> */}
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
      ) : filteredSupplierItems.length === 0 ? (
        <div className="empty-state">
          <FaBox className="empty-state-icon" />
          <h3>No supplier items found</h3>
          <p>Link raw materials to suppliers to manage procurement</p>
        </div>
      ) : (
        <div className="supplier-items-grid">
          {filteredSupplierItems.map(item => (
            <div key={item._id} className="supplier-item-card">
              <div className="item-header">
                <h3>{item.rawMaterial?.name}</h3>
                <div className="item-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleEdit(item)}
                    title="Edit Item"
                    disabled={submitting}
                    data-bs-toggle="modal"
                    data-bs-target="#supplierItemModal"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(item._id)}
                    title="Delete Item"
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
                  <span className="label">Last Price:</span>
                  <span className="value">₹{item.lastPurchasePrice?.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Preferred Unit:</span>
                  <span className="value">{item.preferredUnit === 'purchase' ? item.rawMaterial?.purchaseUnit : item.rawMaterial?.consumptionUnit}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Lead Time:</span>
                  <span className="value">{item.leadTime} days</span>
                </div>
                <div className="detail-row">
                  <span className="label">Min Order Qty:</span>
                  <span className="value">{item.minOrderQuantity}</span>
                </div>
                <div className="item-meta">
                  <span
                    className={`status-badge ${item.isActive ? 'active' : 'inactive'} clickable`}
                    onClick={() => handleToggleStatus(item)}
                    title={`Click to ${item.isActive ? 'deactivate' : 'activate'}`}
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="created-date">
                    Since {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="modal fade" id="supplierItemModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header px-4 py-3 bg-dark text-white">
              <div>
                <h4 className="mb-0 fw-semibold text-white">
                  {editingItem ? 'Edit Supplier Item' : 'Link Supplier Item'}
                </h4>
                <small className="text-white-50">
                  Link raw materials to suppliers for procurement management
                </small>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              />
            </div>

            <div className="modal-body p-4 bg-body-tertiary">
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                  <h6 className="fw-semibold mb-3 text-primary">
                    Basic Information
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Supplier*</label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
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

                    <div className="col-md-6">
                      <label className="form-label">Raw Material*</label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.rawMaterial}
                        onChange={(e) => setFormData({ ...formData, rawMaterial: e.target.value })}
                        required
                      >
                        <option value="">Select Raw Material</option>
                        {rawMaterials.map(material => (
                          <option key={material._id} value={material._id}>
                            {material.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <label className="form-label">Last Purchase Price</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="0.00"
                        value={formData.lastPurchasePrice}
                        onChange={(e) => setFormData({ ...formData, lastPurchasePrice: Number(e.target.value) })}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Preferred Unit</label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.preferredUnit}
                        onChange={(e) => setFormData({ ...formData, preferredUnit: e.target.value })}
                      >
                        <option value="purchase">Purchase Unit</option>
                        <option value="consumption">Consumption Unit</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                  <h6 className="fw-semibold mb-3 text-primary">
                    Procurement Settings
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Lead Time (days)</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="0"
                        value={formData.leadTime}
                        onChange={(e) => setFormData({ ...formData, leadTime: Number(e.target.value) })}
                        min="0"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Min Order Quantity</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="1"
                        value={formData.minOrderQuantity}
                        onChange={(e) => setFormData({ ...formData, minOrderQuantity: Number(e.target.value) })}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                  <h6 className="fw-semibold mb-3 text-primary">
                    Status
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-white px-4 py-3">
              <button className="btn btn-light rounded-3"
                data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-dark rounded-3 px-4" onClick={handleSubmit}>
                {submitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Link Item')}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SupplierItems;
