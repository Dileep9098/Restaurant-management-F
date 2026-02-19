import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBox, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import Config from '../../../../Config/Config';
import axiosInstance from '../../../../apiHandler/axiosInstance';
import './RawMaterials.css';

const RawMaterials = ({ onStatsUpdate }) => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    minStockLevel: 0,
    storageType: '',
    averageCost: 0,
    isActive: true
  });

  useEffect(() => {
    fetchMaterials();
    fetchCategories();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL']);
      const data = await response.data;
      setMaterials(data.data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL_CATEGORY']);
      const data = await response.data;
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      return alert("Material name is required");
    }

    if (!formData.category) {
      return alert("Category is required");
    }

    setSubmitting(true);

    try {
      const isEdit = Boolean(editingMaterial);

      const url = isEdit
        ? `${Config.END_POINT_LIST['UPDATE_ROW_MATERIAL']}/${editingMaterial._id}`
        : Config.END_POINT_LIST['CREATE_ROW_MATERIAL'];

      const response = isEdit
        ? await axiosInstance.put(url, formData)   // ✅ PUT for update
        : await axiosInstance.post(url, formData);

      if (response?.data?.success) {
        const savedData = response.data.data;

        setMaterials((prev) => {
          if (isEdit) {
            return prev.map((mat) =>
              mat._id === editingMaterial._id
                ? savedData   // ✅ backend ka updated object use karo
                : mat
            );
          } else {
            return [...prev, savedData]; // ✅ directly backend response add karo
          }
        });

        setShowModal(false);
        setEditingMaterial(null);

        setFormData({
          name: "",
          category: "",
          unit: "",
          minStockLevel: 0,
          storageType: "",
          averageCost: 0,
          isActive: true,
        });

        onStatsUpdate?.();
      }
    } catch (error) {
      console.error(
        "Error saving material:",
        error?.response?.data || error.message
      );
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      category: material.category?._id || material.category,
      unit: material.unit,
      minStockLevel: material.minStockLevel,
      storageType: material.storageType || '',
      averageCost: material.averageCost,
      isActive: material.isActive !== undefined ? material.isActive : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        const response = await axiosInstance.delete(`${Config.END_POINT_LIST['DELETE_ROW_MATERIAL']}/${id}`);

        if (response.data.success) {
          // Direct state update - remove material from list
          setMaterials(prev => prev.filter(mat => mat._id !== id));
          onStatsUpdate?.();
        }
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const handleToggleStatus = async (material) => {
    try {
      const response = await axiosInstance.put(
        `${Config.END_POINT_LIST['UPDATE_ROW_MATERIAL']}/${material._id}`,
        { ...material, isActive: !material.isActive }
      );

      if (response.data.success) {
        // Direct state update - toggle status
        setMaterials(prev => prev.map(mat =>
          mat._id === material._id
            ? { ...mat, isActive: !mat.isActive }
            : mat
        ));
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error toggling material status:', error);
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="raw-materials">
      <div className="section-header">
        <h2>Raw Materials</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Material
        </button>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search materials..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading materials...</div>
      ) : filteredMaterials.length === 0 ? (
        <div className="empty-state">
          <FaBox className="empty-state-icon" />
          <h3>No materials found</h3>
          <p>Start by adding your first raw material</p>
        </div>
      ) : (
        <div className="materials-grid">
          {filteredMaterials.map(material => (
            <div key={material._id} className="material-card">
              <div className="material-header">
                <h3>{material.name}</h3>
                <div className="material-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleEdit(material)}
                    title="Edit Material"
                    disabled={submitting}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(material._id)}
                    title="Delete Material"
                    disabled={submitting}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="material-details">
                <div className="detail-row">
                  <span className="label">Category:</span>
                  <span className="value">{material.category?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Unit:</span>
                  <span className="value">{material.unit}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Current Stock:</span>
                  <span className={`value ${material.currentStock <= material.minStockLevel ? 'low-stock' : ''}`}>
                    {material.currentStock || 0} {material.unit}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Min Stock Level:</span>
                  <span className="value">{material.minStockLevel} {material.unit}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Avg Cost:</span>
                  <span className="value">₹{material.averageCost}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span
                    className={`status-badge ${material.isActive ? 'active' : 'inactive'} clickable`}
                    onClick={() => handleToggleStatus(material)}
                    title={`Click to ${material.isActive ? 'deactivate' : 'activate'}`}
                  >
                    {material.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {material.currentStock <= material.minStockLevel && (
                  <div className="stock-warning">
                    <FaExclamationTriangle /> Low Stock
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingMaterial ? 'Edit Raw Material' : 'Add Raw Material'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Material Name*</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category*</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Unit*</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., kg, liter, piece"
                  required
                />
              </div>

              <div className="form-group">
                <label>Min Stock Level</label>
                <input
                  type="number"
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Storage Type</label>
                <select
                  value={formData.storageType}
                  onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                >
                  <option value="">Select Storage Type</option>
                  <option value="Freezer">Freezer</option>
                  <option value="Cold Storage">Cold Storage</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Average Cost</label>
                <input
                  type="number"
                  value={formData.averageCost}
                  onChange={(e) => setFormData({ ...formData, averageCost: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                  placeholder="Average cost per unit"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="checkmark"></span>
                  Active Material
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
                  {submitting ? 'Saving...' : (editingMaterial ? 'Update' : 'Add') + ' Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RawMaterials;
