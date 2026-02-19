import React, { useState, useEffect } from 'react';
import { FaPlus, FaEye, FaShoppingCart, FaCalendarAlt, FaRupeeSign, FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Config from '../../../../Config/Config';
import axiosInstance from '../../../../apiHandler/axiosInstance';
import './Purchases.css';
import './PurchaseDetails.css';
import './Pagination.css';

const Purchases = ({ onStatsUpdate }) => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    supplier: '',
    items: [],
    totalAmount: 0,
    isActive: true
  });

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
    fetchRawMaterials();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_PURCHASES']);
      const data = await response.data;
      setPurchases(data.data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
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

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, {
        rawMaterial: '',
        quantity: 1,
        pricePerUnit: 0,
        total: 0
      }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: newItems
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'quantity' || field === 'pricePerUnit') {
      newItems[index].total = newItems[index].quantity * newItems[index].pricePerUnit;
    }

    const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
    setFormData({
      ...formData,
      items: newItems,
      totalAmount
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axiosInstance.post(Config.END_POINT_LIST['CREATE_PURCHASE'], formData);

      if (response.data.success) {
        // Direct state update - add new purchase
        setPurchases(prev => [...prev, {
          ...formData,
          _id: response.data.data._id,
          createdAt: new Date().toISOString(),
          supplier: suppliers.find(sup => sup._id === formData.supplier)
        }]);

        setShowModal(false);
        setFormData({
          supplier: '',
          items: [],
          totalAmount: 0,
          isActive: true
        });
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error saving purchase:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPurchases = purchases.filter(purchase =>
    purchase.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPurchases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    debugger
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPurchase(null);
  };

  return (
    <div className="purchases">
      <div className="section-header">
        <h2>Purchases</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> New Purchase
        </button>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search purchases..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading purchases...</div>
      ) : filteredPurchases.length === 0 ? (
        <div className="empty-state">
          <FaShoppingCart className="empty-state-icon" />
          <h3>No purchases found</h3>
          <p>Record your inventory purchases here</p>
        </div>
      ) : (
        <div className="purchases-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Supplier</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(purchase => (
                <tr key={purchase._id}>
                  <td>
                    <div className="date-display">
                      <FaCalendarAlt />
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>{purchase.supplier?.name}</td>
                  <td>{purchase.items?.length || 0} items</td>
                  <td>
                    <div className="amount-display">
                      <FaRupeeSign />
                      {purchase.totalAmount?.toFixed(2)}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => handleViewDetails(purchase)}
                      title="View Purchase Details"
                      disabled={submitting}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredPurchases.length > itemsPerPage && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>
          
          <div className="pagination-info">
            Page {currentPage} of {totalPages} ({filteredPurchases.length} items)
          </div>
          
          <button 
            className="pagination-btn" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>New Purchase</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Supplier*</label>
                <select
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

              <div className="purchase-items">
                <div className="items-header">
                  <h4>Items</h4>
                  <button type="button" className="btn-secondary" onClick={handleAddItem}>
                    <FaPlus /> Add Item
                  </button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-inputs">
                      <div className="form-group">
                        <label>Raw Material*</label>
                        <select
                          value={item.rawMaterial}
                          onChange={(e) => handleItemChange(index, 'rawMaterial', e.target.value)}
                          required
                        >
                          <option value="">Select Material</option>
                          {rawMaterials.map(material => (
                            <option key={material._id} value={material._id}>
                              {material.name} ({material.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Quantity*</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                          min="1"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Price per Unit*</label>
                        <input
                          type="number"
                          value={item.pricePerUnit}
                          onChange={(e) => handleItemChange(index, 'pricePerUnit', Number(e.target.value))}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Total</label>
                        <input
                          type="text"
                          value={`₹${item.total.toFixed(2)}`}
                          readOnly
                          className="readonly-input"
                        />
                      </div>
                    </div>

                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className="btn-danger remove-item-btn"
                        onClick={() => handleRemoveItem(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="purchase-summary">
                <div className="summary-row">
                  <span>Total Amount:</span>
                  <span className="total-amount">₹{formData.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="checkmark"></span>
                  Active Purchase
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
                  {submitting ? 'Creating...' : 'Create Purchase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailsModal && selectedPurchase && (
        <div className="modal">
          <div className="modal-content purchase-details-modal">
            <div className="modal-header">
              <h3>Purchase Details</h3>
              <button className="close-btn" onClick={handleCloseDetailsModal}>×</button>
            </div>

            <div className="purchase-details">
              <div className="detail-section">
                <h4>Purchase Information</h4>
                <div className="detail-row">
                  <span className="label">Purchase ID:</span>
                  <span className="value">{selectedPurchase._id}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(selectedPurchase.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Supplier:</span>
                  <span className="value">{selectedPurchase.supplier?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className={`status-badge ${selectedPurchase.isActive ? 'active' : 'inactive'}`}>
                    {selectedPurchase.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Items ({selectedPurchase.items?.length || 0})</h4>
                <div className="items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Price/Unit</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPurchase.items?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.rawMaterial?.name}</td>
                          <td>{item.quantity} {item.rawMaterial?.unit}</td>
                          <td>₹{item.pricePerUnit?.toFixed(2)}</td>
                          <td>₹{item.total?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="detail-section">
                <h4>Summary</h4>
                <div className="summary-row">
                  <span className="label">Total Items:</span>
                  <span className="value">{selectedPurchase.items?.length || 0}</span>
                </div>
                <div className="summary-row total">
                  <span className="label">Total Amount:</span>
                  <span className="value total-amount">₹{selectedPurchase.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseDetailsModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
