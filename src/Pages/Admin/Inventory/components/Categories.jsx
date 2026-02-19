import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTags, FaSearch } from 'react-icons/fa';
import Config from '../../../../Config/Config';
import axiosInstance from '../../../../apiHandler/axiosInstance';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL_CATEGORY']);
      const data = await response.data;
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingCategory 
        ? `${Config.END_POINT_LIST['UPDATE_ROW_MATERIAL_CATEGORY']}/${editingCategory._id}`
        : Config.END_POINT_LIST['CREATE_ROW_MATERIAL_CATEGORY'];
      
      const response = await axiosInstance.post(url, formData);

      if (response.data.success) {
        // Direct state update without API call
        if (editingCategory) {
          // Update existing category in state
          setCategories(prev => prev.map(cat => 
            cat._id === editingCategory._id 
              ? { ...cat, ...formData }
              : cat
          ));
        } else {
          // Add new category to state
          setCategories(prev => [...prev, { 
            ...formData, 
            _id: response.data.data._id,
            createdAt: new Date().toISOString()
          }]);
        }
        
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ 
          name: '', 
          description: '',
          isActive: true 
        });
      }
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive !== undefined ? category.isActive : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await axiosInstance.post(`${Config.END_POINT_LIST['DELETE_ROW_MATERIAL_CATEGORY']}/${id}`);
        
        if (response.data.success) {
          // Direct state update - remove category from list
          setCategories(prev => prev.filter(cat => cat._id !== id));
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      const response = await axiosInstance.put(
        `${Config.END_POINT_LIST['UPDATE_ROW_MATERIAL_CATEGORY']}/${category._id}`,
        { ...category, isActive: !category.isActive }
      );
      
      if (response.data.success) {
        // Direct state update - toggle status
        setCategories(prev => prev.map(cat => 
          cat._id === category._id 
            ? { ...cat, isActive: !cat.isActive }
            : cat
        ));
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="categories">
      <div className="section-header">
        <h2>Categories</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search categories..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading categories...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="empty-state">
          <FaTags className="empty-state-icon" />
          <h3>No categories found</h3>
          <p>Create categories to organize your raw materials</p>
        </div>
      ) : (
        <div className="categories-grid">
          {filteredCategories.map(category => (
            <div key={category._id} className="category-card">
              <div className="category-header">
                <h3>{category.name}</h3>
                <div className="category-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleEdit(category)}
                    title="Edit Category"
                    disabled={submitting}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDelete(category._id)}
                    title="Delete Category"
                    disabled={submitting}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="category-details">
                {category.description && (
                  <p className="category-description">{category.description}</p>
                )}
                <div className="category-meta">
                  <span 
                    className={`status-badge ${category.isActive ? 'active' : 'inactive'} clickable`}
                    onClick={() => handleToggleStatus(category)}
                    title={`Click to ${category.isActive ? 'deactivate' : 'activate'}`}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="created-date">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
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
              <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name*</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  placeholder="Optional description for this category"
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
                  Active Category
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Update' : 'Add'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
