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
    type: 'PURCHASE',
    quantity: 1,
    unit: 'consumption',
    referenceId: '',
    referenceModel: '',
    reason: '',
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
          type: 'PURCHASE',
          quantity: 1,
          unit: 'consumption',
          referenceId: '',
          referenceModel: '',
          reason: '',
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
      case 'PURCHASE': return <FaArrowUp className="icon-in" />;
      case 'SALE_DEDUCTION': return <FaArrowDown className="icon-out" />;
      case 'WASTAGE': return <FaMinus className="icon-wastage" />;
      case 'ADJUSTMENT': return <FaBox className="icon-adjustment" />;
      case 'TRANSFER_IN': return <FaArrowUp className="icon-in" />;
      case 'TRANSFER_OUT': return <FaArrowDown className="icon-out" />;
      case 'PURCHASE_RETURN': return <FaArrowDown className="icon-out" />;
      default: return null;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'PURCHASE': return '#10b981';
      case 'SALE_DEDUCTION': return '#ef4444';
      case 'WASTAGE': return '#f59e0b';
      case 'ADJUSTMENT': return '#3b82f6';
      case 'TRANSFER_IN': return '#10b981';
      case 'TRANSFER_OUT': return '#ef4444';
      case 'PURCHASE_RETURN': return '#ef4444';
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
    <>
      <div className="inventory-transactions">
        <div className="section-header">
          <h2>Inventory Transactions</h2>
          <a href="#" className="btn btn-primary" data-bs-toggle="modal"
            id="create-btn"
            data-bs-target="#InventoryTransectionModal"
            onClick={() => document.body.classList.remove('pace-done', 'modal-open')}>
            <i className="feather-plus me-2" />
            <span>Add Transaction</span>
          </a>
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
                <option value="PURCHASE">Purchase</option>
                <option value="SALE_DEDUCTION">Sale Deduction</option>
                <option value="WASTAGE">Wastage</option>
                <option value="ADJUSTMENT">Adjustment</option>
                <option value="TRANSFER_IN">Transfer In</option>
                <option value="TRANSFER_OUT">Transfer Out</option>
                <option value="PURCHASE_RETURN">Purchase Return</option>
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
                      <span className={`quantity ${transaction.type === 'PURCHASE' || transaction.type === 'TRANSFER_IN' ? 'positive' : 'negative'}`}>
                        {transaction.type === 'PURCHASE' || transaction.type === 'TRANSFER_IN' ? '+' : '-'}{transaction.quantity} {transaction.unit === 'purchase' ? transaction.rawMaterial?.purchaseUnit : transaction.rawMaterial?.consumptionUnit}
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
                    <td>{transaction.notes || transaction.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredTransactions.length > itemsPerPage && (
          <div className="pagination d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* Add Transaction Modal */}
          <div className="modal fade" id="InventoryTransectionModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-secondary text-white">
                  <h5 className="modal-title text-white">Add Inventory Transaction</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body p-4 bg-body-tertiary">
                  <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body">
                      <h6 className="fw-semibold mb-3 text-primary">
                        Transaction Details
                      </h6>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Raw Material*</label>
                          <select
                            className="form-select form-select-lg"
                            value={formData.rawMaterial}
                            onChange={(e) => setFormData({ ...formData, rawMaterial: e.target.value })}
                            required
                          >
                            <option value="">Select Material</option>
                            {rawMaterials.map(material => (
                              <option key={material._id} value={material._id}>
                                {material.name} ({material.purchaseUnit}/{material.consumptionUnit})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Transaction Type*</label>
                          <select
                            className="form-select form-select-lg"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                          >
                            <option value="PURCHASE">Purchase</option>
                            <option value="SALE_DEDUCTION">Sale Deduction</option>
                            <option value="WASTAGE">Wastage</option>
                            <option value="ADJUSTMENT">Adjustment</option>
                            <option value="TRANSFER_IN">Transfer In</option>
                            <option value="TRANSFER_OUT">Transfer Out</option>
                            <option value="PURCHASE_RETURN">Purchase Return</option>
                          </select>
                        </div>
                      </div>

                      <div className="row g-3 mt-2">
                        <div className="col-md-4">
                          <label className="form-label">Quantity*</label>
                          <input
                            type="number"
                            className="form-control form-control-lg"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Unit*</label>
                          <select
                            className="form-select form-select-lg"
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            required
                          >
                            <option value="purchase">Purchase Unit</option>
                            <option value="consumption">Consumption Unit</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Reason</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder="Optional reason"
                          />
                        </div>
                      </div>

                      <div className="row g-3 mt-2">
                        <div className="col-md-6">
                          <label className="form-label">Reference ID</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Optional reference (e.g., Order ID)"
                            value={formData.referenceId}
                            onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mt-2">
                        <div className="col-md-6">
                          <label className="form-label">Reference Model</label>
                          <select
                            className="form-select form-select-lg"
                            value={formData.referenceModel}
                            onChange={(e) => setFormData({ ...formData, referenceModel: e.target.value })}
                          >
                            <option value="">Select Reference Type</option>
                            <option value="Order">Order</option>
                            <option value="Purchase">Purchase</option>
                            <option value="Manual">Manual</option>
                          </select>
                        </div>
                      </div>

                      <div className="row g-3 mt-2">
                        <div className="col-12">
                          <label className="form-label">Notes</label>
                          <textarea
                            className="form-control form-control-lg"
                            placeholder="Optional notes for this transaction"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows="3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-white px-4 py-3">
                  <button className="btn btn-light rounded-3" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-dark rounded-3 px-4" onClick={handleSubmit}>
                    {submitting ? 'Adding...' : 'Add Transaction'}
                  </button>
                </div>
              </div>
            </div>
          </div>
      
      </div>
    </>
  );
};

export default InventoryTransactions;
