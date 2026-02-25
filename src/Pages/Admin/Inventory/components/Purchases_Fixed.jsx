import React, { useState, useEffect } from 'react';
import { FaPlus, FaEye, FaShoppingCart, FaCalendarAlt, FaRupeeSign, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
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
    subTotal: 0,
    totalTax: 0,
    totalDiscount: 0,
    paidAmount: 0,
    balanceAmount: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    supplierInvoiceNumber: '',
    dueDate: '',
    status: 'draft',
    paymentStatus: 'pending',
    notes: '',
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
        taxPercent: 0,
        discount: 0,
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
    calculateTotals(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Calculate item total
    const item = newItems[index];
    const itemTotal = item.quantity * item.pricePerUnit;
    const taxAmount = itemTotal * (item.taxPercent || 0) / 100;
    const discountAmount = itemTotal * (item.discount || 0) / 100;
    item.total = itemTotal + taxAmount - discountAmount;

    calculateTotals(newItems);
  };

  const calculateTotals = (items) => {
    const subTotal = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.pricePerUnit;
      return sum + itemTotal;
    }, 0);

    const totalTax = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.pricePerUnit;
      return sum + (itemTotal * (item.taxPercent || 0) / 100);
    }, 0);

    const totalDiscount = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.pricePerUnit;
      return sum + (itemTotal * (item.discount || 0) / 100);
    }, 0);

    const totalAmount = subTotal + totalTax - totalDiscount;
    const balanceAmount = totalAmount - (formData.paidAmount || 0);

    setFormData(prev => ({
      ...prev,
      items,
      subTotal,
      totalTax,
      totalDiscount,
      totalAmount,
      balanceAmount
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate form data
      if (!formData.supplier) {
        alert('Please select a supplier');
        return;
      }

      if (!formData.items || formData.items.length === 0) {
        alert('Please add at least one item');
        return;
      }

      // Validate each item
      for (let i = 0; i < formData.items.length; i++) {
        const item = formData.items[i];
        if (!item.rawMaterial || item.rawMaterial === '') {
          alert(`Please select raw material for item ${i + 1}`);
          return;
        }
        if (!item.quantity || item.quantity <= 0) {
          alert(`Please enter valid quantity for item ${i + 1}`);
          return;
        }
        if (!item.pricePerUnit || item.pricePerUnit <= 0) {
          alert(`Please enter valid price for item ${i + 1}`);
          return;
        }
      }

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
        resetForm();
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error saving purchase:', error);
      alert(error?.response?.data?.message || 'Failed to create purchase');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPurchases = purchases.filter(purchase =>
    purchase.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.purchaseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
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
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPurchase(null);
  };

  const resetForm = () => {
    setFormData({
      supplier: '',
      items: [],
      totalAmount: 0,
      subTotal: 0,
      totalTax: 0,
      totalDiscount: 0,
      paidAmount: 0,
      balanceAmount: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      supplierInvoiceNumber: '',
      dueDate: '',
      status: 'draft',
      paymentStatus: 'pending',
      notes: '',
      isActive: true
    });
  };

  return (
    <div className="purchases">
      {loading ? (
        <div className="loading-state">Loading purchases...</div>
      ) : filteredPurchases.length === 0 ? (
        <div className="empty-state">
          <FaShoppingCart className="empty-state-icon" />
          <h3>No purchases found</h3>
          <p>Record your inventory purchases here</p>
        </div>
      ) : (
        <div className="purchases-wrapper">
          <div className="purchases-header">
            <div>
              <h2>Purchases</h2>
              <p className="subtitle">Track inventory procurement</p>
            </div>

            <button
              className="btn btn-primary add-btn"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              <FaPlus /> Add Purchase
            </button>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search by supplier or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-card">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Purchase No</th>
                  <th>Supplier</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((purchase, index) => (
                  <tr key={purchase._id}>
                    <td>{index + 1}</td>
                    <td>{new Date(purchase.createdAt).toLocaleDateString("en-IN")}</td>
                    <td>{purchase.purchaseNumber}</td>
                    <td>{purchase.supplier?.name}</td>
                    <td>{purchase.items?.length}</td>
                    <td>₹{purchase.totalAmount?.toFixed(2)}</td>
                    <td>
                      <span className={`status-pill ${purchase.paymentStatus}`}>
                        {purchase.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleViewDetails(purchase)}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* ================= CREATE MODAL ================= */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h4 className="mb-0 text-white">New Purchase</h4>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body p-4">

                {/* Purchase Info Section */}
                <div className="row mb-4">
                  <div className="col-md-3">
                    <label>Purchase Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.purchaseDate}
                      onChange={(e) =>
                        setFormData({ ...formData, purchaseDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Invoice Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.supplierInvoiceNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, supplierInvoiceNumber: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="draft">Draft</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Supplier */}
                <div className="mb-4">
                  <label>Supplier*</label>
                  <select
                    className="form-select"
                    value={formData.supplier}
                    onChange={(e) =>
                      setFormData({ ...formData, supplier: e.target.value })
                    }
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Items Section */}
                <div className="d-flex justify-content-between mb-3">
                  <h6>Purchase Items</h6>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleAddItem}
                    disabled={!formData.supplier}
                  >
                    <FaPlus className="me-1" />
                    Add Item
                  </button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <div className="row g-3">

                        <div className="col-md-3">
                          <label>Material*</label>
                          <select
                            className="form-select"
                            value={item.rawMaterial}
                            onChange={(e) =>
                              handleItemChange(index, "rawMaterial", e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            {rawMaterials.map((material) => (
                              <option key={material._id} value={material._id}>
                                {material.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-1">
                          <label>Qty</label>
                          <input
                            type="number"
                            className="form-control"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(index, "quantity", Number(e.target.value))
                            }
                          />
                        </div>

                        <div className="col-md-2">
                          <label>Price</label>
                          <input
                            type="number"
                            className="form-control"
                            value={item.pricePerUnit}
                            onChange={(e) =>
                              handleItemChange(index, "pricePerUnit", Number(e.target.value))
                            }
                          />
                        </div>

                        <div className="col-md-1">
                          <label>Tax %</label>
                          <input
                            type="number"
                            className="form-control"
                            value={item.taxPercent || 0}
                            onChange={(e) =>
                              handleItemChange(index, "taxPercent", Number(e.target.value))
                            }
                          />
                        </div>

                        <div className="col-md-1">
                          <label>Discount</label>
                          <input
                            type="number"
                            className="form-control"
                            value={item.discount || 0}
                            onChange={(e) =>
                              handleItemChange(index, "discount", Number(e.target.value))
                            }
                          />
                        </div>

                        <div className="col-md-2">
                          <label>Total</label>
                          <input
                            className="form-control"
                            value={`₹${Number(item.total || 0).toFixed(2)}`}
                            readOnly
                          />
                        </div>

                        <div className="col-md-1 d-flex align-items-end">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm w-100"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <FaTrash />
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}

                {/* Summary Section */}
                <div className="card mt-4">
                  <div className="card-body text-end">
                    <div>Sub Total: ₹{formData.subTotal?.toFixed(2)}</div>
                    <div>Total Tax: ₹{formData.totalTax?.toFixed(2)}</div>
                    <div>Total Discount: ₹{formData.totalDiscount?.toFixed(2)}</div>
                    <h5>Grand Total: ₹{formData.totalAmount?.toFixed(2)}</h5>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="row mt-3">
                  <div className="col-md-4">
                    <label>Paid Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.paidAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, paidAmount: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Balance</label>
                    <input
                      className="form-control"
                      value={`₹${formData.balanceAmount?.toFixed(2)}`}
                      readOnly
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Payment Status</label>
                    <select
                      className="form-select"
                      value={formData.paymentStatus}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentStatus: e.target.value })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-3">
                  <label>Notes</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-dark"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Purchase"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= DETAILS MODAL ================= */}
      {showDetailsModal && selectedPurchase && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseDetailsModal}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title text-white">Purchase Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseDetailsModal}
                />
              </div>

              <div className="modal-body">

                <p><strong>ID:</strong> {selectedPurchase._id}</p>
                <p><strong>Date:</strong> {new Date(selectedPurchase.createdAt).toLocaleDateString("en-IN")}</p>
                <p><strong>Supplier:</strong> {selectedPurchase.supplier?.name || "Unknown"}</p>

                <table className="table table-striped mt-3">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPurchase.items?.map((item, index) => {
                      const material =
                        typeof item.rawMaterial === "object"
                          ? item.rawMaterial
                          : rawMaterials.find(r => r._id === item.rawMaterial);

                      return (
                        <tr key={index}>
                          <td>{material?.name || "N/A"}</td>
                          <td>{item.quantity} {material?.purchaseUnit}</td>
                          <td>₹{Number(item.pricePerUnit || 0).toFixed(2)}</td>
                          <td>₹{Number(item.total || 0).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="text-end fw-bold">
                  Total: ₹{Number(selectedPurchase.totalAmount || 0).toFixed(2)}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
