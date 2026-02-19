import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaArrowUp, FaArrowDown, FaMinus, FaCalendarAlt, FaBox } from 'react-icons/fa';
import Config from '../../../../Config/Config';
import axiosInstance from '../../../../apiHandler/axiosInstance';
import './InventoryTransactions.css';
import './Pagination.css';

const InventoryTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    rawMaterial: '',
    type: 'IN',
    quantity: 1,
    referenceId: '',
    referenceModel: '',
    notes: ''
  });

  useEffect(() => {
    fetchTransactions();
    fetchRawMaterials();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_INVENTORY_TRANSACTIONS']);
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRawMaterials = async () => {
    try {
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL']);
      setRawMaterials(response.data.data || []);
    } catch (error) {
      console.error('Error fetching raw materials:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axiosInstance.post(Config.END_POINT_LIST['CREATE_INVENTORY_TRANSACTION'], formData);
      
      if (response.data.success) {
        setShowModal(false);
        setFormData({
          rawMaterial: '',
          type: 'IN',
          quantity: 1,
          referenceId: '',
          referenceModel: '',
          notes: ''
        });
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'IN': return <FaArrowUp className="icon-in" />;
      case 'OUT': return <FaArrowDown className="icon-out" />;
      case 'WASTAGE': return <FaMinus className="icon-wastage" />;
      case 'ADJUSTMENT': return <FaBox className="icon-adjustment" />;
      default: return null;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'IN': return '#10b981';
      case 'OUT': return '#ef4444';
      case 'WASTAGE': return '#f59e0b';
      case 'ADJUSTMENT': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.rawMaterial?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && transaction.type === filterType;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

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

  return (
    <div className="inventory-transactions">
      <div className="section-header">
        <h2>Inventory Transactions</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Transaction
        </button>
      </div>

      <div className="transaction-filters">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
              <option value="WASTAGE">Wastage</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading transactions...</div>
      ) : filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <FaBox className="empty-state-icon" />
          <h3>No transactions found</h3>
          <p>Inventory transactions will appear here</p>
        </div>
      ) : (
        <div className="transactions-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Material</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Reference</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(transaction => (
                <tr key={transaction._id}>
                  <td>
                    <div className="date-display">
                      <FaCalendarAlt />
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>{transaction.rawMaterial?.name}</td>
                  <td>
                    <div className="type-display" style={{ color: getTypeColor(transaction.type) }}>
                      {getTypeIcon(transaction.type)}
                      {transaction.type}
                    </div>
                  </td>
                  <td>
                    <span className={`quantity ${transaction.type === 'IN' ? 'positive' : 'negative'}`}>
                      {transaction.type === 'IN' ? '+' : '-'}{transaction.quantity} {transaction.rawMaterial?.unit}
                    </span>
                  </td>
                  <td>
                    {transaction.referenceId ? (
                      <span className="reference">
                        {transaction.referenceModel} #{transaction.referenceId.slice(-6)}
                      </span>
                    ) : (
                      <span className="no-reference">Manual</span>
                    )}
                  </td>
                  <td>{transaction.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredTransactions.length > itemsPerPage && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaArrowUp />
          </button>
          
          <div className="pagination-info">
            Page {currentPage} of {totalPages} ({filteredTransactions.length} items)
          </div>
          
          <button 
            className="pagination-btn" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <FaArrowDown />
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Inventory Transaction</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Raw Material*</label>
                <select
                  value={formData.rawMaterial}
                  onChange={(e) => setFormData({...formData, rawMaterial: e.target.value})}
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
                <label>Transaction Type*</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="IN">Stock In</option>
                  <option value="OUT">Stock Out</option>
                  <option value="WASTAGE">Wastage</option>
                  <option value="ADJUSTMENT">Adjustment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity*</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Reference ID</label>
                <input
                  type="text"
                  value={formData.referenceId}
                  onChange={(e) => setFormData({...formData, referenceId: e.target.value})}
                  placeholder="Optional reference (e.g., Order ID)"
                />
              </div>

              <div className="form-group">
                <label>Reference Model</label>
                <select
                  value={formData.referenceModel}
                  onChange={(e) => setFormData({...formData, referenceModel: e.target.value})}
                >
                  <option value="">Select Reference Type</option>
                  <option value="Order">Order</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                  placeholder="Optional notes for this transaction"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTransactions;
