import React, { useState, useEffect } from 'react';
import { FaPlus, FaEye, FaShoppingCart, FaCalendarAlt, FaRupeeSign, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaTrash, FaEdit } from 'react-icons/fa';
import Config from '../../../../Config/Config';
import axiosInstance from '../../../../apiHandler/axiosInstance';
import './Purchases.css';
import './PurchaseDetails.css';
import './Pagination.css';

const Purchases = ({ onStatsUpdate }) => {
  const [purchases, setPurchases] = useState([]);
  const [supplierItems, setSupplierItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [formData, setFormData] = useState({
    supplier: '',
    items: [],
    totalAmount: 0,
    isActive: true,
    status: 'draft',
    paymentStatus: 'pending',
    purchaseDate: '',
    supplierInvoiceNumber: '',
    dueDate: '',
    orderedAt: '',
    receivedAt: '',
    paidAmount: 0,
    balanceAmount: 0,
    subTotal: 0,
    totalTax: 0,
    totalDiscount: 0,
    notes: ''
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
      // suplier items get karne hai
      const supplierItemsRes = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_SUPPLIER_ITEMS']);
      setSupplierItems(supplierItemsRes.data.data || []);


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

    // Recalculate per-line total when relevant fields change (qty/price/tax/discount)
    if (["quantity", "pricePerUnit", "taxPercent", "discount"].includes(field)) {
      const qty = Number(newItems[index].quantity) || 0;
      const price = Number(newItems[index].pricePerUnit) || 0;
      const taxP = Number(newItems[index].taxPercent) || 0;
      const discP = Number(newItems[index].discount) || 0;
      const line = qty * price;
      const tax = line * (taxP / 100);
      const disc = line * (discP / 100);
      newItems[index].total = line + tax - disc;
    }

    // compute breakdown totals
    let subTotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    newItems.forEach(item => {
      const line = (Number(item.quantity) || 0) * (Number(item.pricePerUnit) || 0);
      const tax = line * ((Number(item.taxPercent) || 0) / 100);
      const disc = line * ((Number(item.discount) || 0) / 100);
      subTotal += line;
      totalTax += tax;
      totalDiscount += disc;
    });

    const totalAmount = subTotal + totalTax - totalDiscount;

    setFormData({
      ...formData,
      items: newItems,
      totalAmount,
      subTotal,
      totalTax,
      totalDiscount
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation first (do not set submitting flag until ready to call API)
    if (!formData.supplier) {
      alert('Please select a supplier');
      return;
    }

    if (!formData.items || formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

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

    // recalc totals one last time
    const itemsCopy = formData.items.map(it => ({ ...it }));
    let calcSub = 0, calcTax = 0, calcDisc = 0, calcTotal = 0;
    itemsCopy.forEach(item => {
      const line = item.quantity * item.pricePerUnit;
      const tax = line * ((item.taxPercent || 0) / 100);
      const disc = line * ((item.discount || 0) / 100);
      const tot = line + tax - disc;
      item.total = tot;
      calcSub += line;
      calcTax += tax;
      calcDisc += disc;
      calcTotal += tot;
    });
    const payload = {
      ...formData,
      items: itemsCopy,
      subTotal: calcSub,
      totalTax: calcTax,
      totalDiscount: calcDisc,
      totalAmount: calcTotal,
      balanceAmount: calcTotal - (formData.paidAmount || 0)
    };
    // only send purchaseDate if we have one (status received)
    if (!payload.purchaseDate) {
      delete payload.purchaseDate;
    }

    setSubmitting(true);
    try {
      let response;
      // decide whether we are receiving stock via dedicated route
      if (editMode && editingId && payload.status === 'received') {
        response = await axiosInstance.patch(
          `${Config.END_POINT_LIST['RECEIVE_PURCHASE']}/${editingId}`,
          { items: payload.items }
        );
        if (response?.data?.success) {
          const updated = response.data.data;
          if (updated) {
            setPurchases(prev => prev.map(p => p._id === updated._id ? updated : p));
          } else {
            await fetchPurchases();
          }
        }
      } else if (editMode && editingId) {
        // update existing purchase normally
        response = await axiosInstance.put(`${Config.END_POINT_LIST['UPDATE_PURCHASE']}/${editingId}`, payload);
        if (response?.data?.success) {
          const updated = response.data.data;
          if (updated) {
            setPurchases(prev => prev.map(p => p._id === updated._id ? updated : p));
          } else {
            await fetchPurchases();
          }
        }
      } else {
        // create new purchase
        response = await axiosInstance.post(Config.END_POINT_LIST['CREATE_PURCHASE'], payload);
        if (response?.data?.success) {
          const created = response.data.data;
          if (created) setPurchases(prev => [created, ...prev]);
          else await fetchPurchases();
        }
      }

      if (response?.data?.success) {
        setShowModal(false);
        setEditMode(false);
        setEditingId(null);
        setFormData({
          supplier: '',
          items: [],
          totalAmount: 0,
          isActive: true,
          status: 'draft',
          paymentStatus: 'pending',
          purchaseDate: '',
          supplierInvoiceNumber: '',
          dueDate: '',
          orderedAt: '',
          receivedAt: '',
          paidAmount: 0,
          balanceAmount: 0,
          subTotal: 0,
          totalTax: 0,
          totalDiscount: 0,
          notes: ''
        });
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
    setShowDetailsModal(true);
  };

  // lightweight view handler (keeps existing name from user snippet)
  const handleView = (purchase) => {
    handleViewDetails(purchase);
  };

  const handleEdit = (purchase) => {
    // populate form for edit
    const items = (purchase.items || []).map(it => ({
      rawMaterial: typeof it.rawMaterial === 'object' ? it.rawMaterial._id : it.rawMaterial,
      quantity: it.quantity,
      pricePerUnit: it.pricePerUnit,
      taxPercent: it.taxPercent,
      discount: it.discount,
      total: it.total
    }));

    setFormData({
      supplier: purchase.supplier?._id || purchase.supplier,
      items,
      totalAmount: purchase.totalAmount || 0,
      isActive: purchase.isActive !== undefined ? purchase.isActive : true,
      status: purchase.status || 'draft',
      paymentStatus: purchase.paymentStatus || 'pending',
      purchaseDate: purchase.purchaseDate ? new Date(purchase.purchaseDate).toISOString().slice(0, 10) : '',
      supplierInvoiceNumber: purchase.supplierInvoiceNumber || '',
      dueDate: purchase.dueDate ? new Date(purchase.dueDate).toISOString().slice(0, 10) : '',
      orderedAt: purchase.orderedAt ? new Date(purchase.orderedAt).toISOString().slice(0, 10) : '',
      receivedAt: purchase.receivedAt ? new Date(purchase.receivedAt).toISOString().slice(0, 10) : '',
      paidAmount: purchase.paidAmount || 0,
      balanceAmount: purchase.balanceAmount || 0,
      subTotal: purchase.subTotal || 0,
      totalTax: purchase.totalTax || 0,
      totalDiscount: purchase.totalDiscount || 0,
      notes: purchase.notes || ''
    });
    setEditMode(true);
    setEditingId(purchase._id);
    // show advanced fields if any were previously filled
    setShowAdvanced(!!(purchase.supplierInvoiceNumber || purchase.paidAmount || purchase.notes || purchase.dueDate));
    setShowModal(true);
  };

  const markAsOrdered = (id) => {
    setConfirmMessage('Are you sure you want to mark this purchase as Ordered? This action will be recorded in the system.');
    setConfirmAction('order');
    setConfirmId(id);
    setShowConfirmDialog(true);
  };

  const executeMarkAsOrdered = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.patch(`${Config.END_POINT_LIST['MARK_PURCHASE_ORDERED']}/${id}`);
      if (res.data.success) {
        // update one purchase's status
        setPurchases(prev => prev.map(p => p._id === id ? { ...p, status: 'ordered', orderedAt: new Date() } : p));
      }
    } catch (err) {
      console.error('Error marking ordered', err);
      alert(err?.response?.data?.message || 'Failed to mark as ordered');
    } finally {
      setLoading(false);
    }
  };

  const confirmReceiveAction = (purchase) => {
    setConfirmMessage(`Confirm receiving purchase from ${purchase.supplier?.name || 'this supplier'}? You will be able to update quantities and invoice details.`);
    setConfirmAction('receive');
    setConfirmId(purchase._id);
    setShowConfirmDialog(true);
  };

  const executeOpenReceiveModal = (purchase) => {
    // open edit modal prefilled to receive items
    handleEdit({ ...purchase, status: 'received' });
    // set receivedAt to today if empty
    setFormData(prev => ({ ...prev, receivedAt: prev.receivedAt || new Date().toISOString().slice(0, 10), status: 'received' }));
    setShowAdvanced(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPurchase(null);
  };

  const handleConfirmAction = async () => {
    if (confirmAction === 'order') {
      await executeMarkAsOrdered(confirmId);
    } else if (confirmAction === 'receive') {
      const purchase = purchases.find(p => p._id === confirmId);
      if (purchase) {
        executeOpenReceiveModal(purchase);
      }
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setConfirmMessage('');
    setConfirmId(null);
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setConfirmMessage('');
    setConfirmId(null);
  };

  const resetForm = () => {
    setFormData({
      supplier: '',
      items: [],
      totalAmount: 0,
      isActive: true,
      status: 'draft',
      paymentStatus: 'pending',
      purchaseDate: '',
      supplierInvoiceNumber: '',
      dueDate: '',
      orderedAt: '',
      receivedAt: '',
      paidAmount: 0,
      balanceAmount: 0,
      subTotal: 0,
      totalTax: 0,
      totalDiscount: 0,
      notes: ''
    });
    setShowAdvanced(false);
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

          <div className="table-card shadow-sm">
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th className="col-id">#</th>
                    <th className="col-date d-none d-md-table-cell">Date</th>
                    <th className="col-purchase">Purchase No</th>
                    <th className="col-supplier">Supplier</th>
                    <th className="col-items d-none d-lg-table-cell">Items</th>
                    <th className="col-total d-none d-md-table-cell">Total</th>
                    <th className="col-status">Status</th>
                    <th className="col-payment d-none d-lg-table-cell">Payment</th>
                    <th className="col-actions">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((purchase, index) => (
                    <tr key={purchase._id} className="table-row-hover">
                      <td className="col-id fw-bold text-muted small">{index + 1}</td>
                      <td className="col-date d-none d-md-table-cell small">{new Date(purchase.createdAt).toLocaleDateString("en-IN")}</td>
                      <td className="col-purchase">
                        <span className="fw-500 text-dark">{purchase.purchaseNumber}</span>
                      </td>
                      <td className="col-supplier">
                        <span className="supplier-name">{purchase.supplier?.name}</span>
                      </td>
                      <td className="col-items d-none d-lg-table-cell text-center">
                        <span className="badge bg-light text-dark">{purchase.items?.length}</span>
                      </td>
                      <td className="col-total d-none d-md-table-cell fw-bold">₹{purchase.totalAmount?.toFixed(2)}</td>
                      <td className="col-status">
                        <span className={`status-pill ${purchase.status}`}>
                          {purchase.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="col-payment d-none d-lg-table-cell">
                        <span className={`status-pill ${purchase.paymentStatus}`}>
                          {purchase.paymentStatus}
                        </span>
                      </td>
                      <td className="col-actions">
                        <div className="action-buttons">
                          <button
                            className="btn-icon view-btn"
                            onClick={() => handleView(purchase)}
                            title="View"
                          >
                            <FaEye />
                          </button>

                          {purchase.status === 'draft' && (
                            <button
                              className="btn-icon edit-btn"
                              onClick={() => handleEdit(purchase)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                          )}

                          {purchase.status === 'draft' && (
                            <button
                              className="btn-icon order-btn"
                              onClick={() => markAsOrdered(purchase._id)}
                              title="Mark as Ordered"
                            >
                              📦
                            </button>
                          )}

                          {purchase.status === 'ordered' && (
                            <button
                              className="btn-icon receive-btn"
                              onClick={() => confirmReceiveAction(purchase)}
                              title="Receive"
                            >
                              ✓
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRMATION DIALOG ================= */}
      {showConfirmDialog && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCancelConfirm}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">⚠️ Confirm Action</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancelConfirm}
                />
              </div>
              <div className="modal-body">
                <p className="m-0" style={{ fontSize: '15px', lineHeight: '1.5' }}>{confirmMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleCancelConfirm}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-warning"
                  onClick={handleConfirmAction}
                >
                  {confirmAction === 'order' ? '✓ Confirm Order' : '✓ Confirm Receive'}
                </button>
              </div>
            </div>
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
              <div className="modal-header bg-dark text-white d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <h4 className="mb-0 text-white me-3">{editMode ? 'Edit Purchase' : 'New Purchase'}</h4>
                  <span className="badge bg-light text-dark text-capitalize">{formData.status?.replace(/_/g, ' ')}</span>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body p-4">

                {/* Purchase Info Section */}
                <div className="row mb-4">
                  {formData.status === 'received' && (
                    <div className="col-md-6 col-12">
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
                  )}

                  {(formData.status === 'received' || showAdvanced) && (
                    <>
                      <div className="col-md-6 col-12">
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

                      <div className="col-md-6 col-12">
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
                    </>
                  )}

                  <div className="col-md-6 col-12">
                    <label>Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="draft">Draft</option>
                      <option value="ordered">Ordered</option>
                      <option value="partially_received">Partially Received</option>
                      <option value="received">Received</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="col-md-6 col-12 d-flex align-items-center">
                    <button
                      type="button"
                      className={`btn btn-sm ${showAdvanced ? 'btn-outline-secondary active' : 'btn-outline-secondary'}`}
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      aria-pressed={showAdvanced}
                    >
                      {showAdvanced ? 'Advanced On' : 'Advanced'}
                    </button>
                  </div>

                  {(formData.status === 'ordered' || formData.status === 'partially_received' || formData.status === 'received') && (
                    <div className="col-md-2">
                      <label>Ordered At</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.orderedAt}
                        onChange={(e) =>
                          setFormData({ ...formData, orderedAt: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {(formData.status === 'partially_received' || formData.status === 'received') && (
                    <div className="col-md-2">
                      <label>Received At</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.receivedAt}
                        onChange={(e) =>
                          setFormData({ ...formData, receivedAt: e.target.value })
                        }
                      />
                    </div>
                  )}
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
                            {(
                              (formData.supplier && supplierItems && supplierItems.length)
                                ? rawMaterials.filter(material => {
                                    return supplierItems.some(si => {
                                      const siRM = si.rawMaterial && si.rawMaterial._id ? si.rawMaterial._id : si.rawMaterial;
                                      const siSupplier = si.supplier && si.supplier._id ? si.supplier._id : si.supplier;
                                      return siSupplier === formData.supplier && siRM === material._id;
                                    });
                                  })
                                : rawMaterials
                            ).map((material) => (
                              <option key={material._id} value={material._id}>
                                {material.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-2 col-6">
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

                        <div className="col-md-2 col-6">
                          <label>Price</label>
                          <div className="input-group">
                            <span className="input-group-text"><FaRupeeSign /></span>
                            <input
                              type="number"
                              className="form-control"
                              value={item.pricePerUnit}
                              onChange={(e) =>
                                handleItemChange(index, "pricePerUnit", Number(e.target.value))
                              }
                            />
                          </div>
                        </div>

                        <div className="col-md-2 col-6">
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

                        <div className="col-md-1 col-6">
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
                          <div className="input-group">
                            <span className="input-group-text"><FaRupeeSign /></span>
                            <input
                              className="form-control fw-bold"
                              value={`₹${Number(item.total || 0).toFixed(2)}`}
                              readOnly
                            />
                          </div>
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
                <div className="card mt-4 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-end gap-4 align-items-center">
                      <div className="text-muted small">Sub Total<br /><strong>₹{formData.subTotal?.toFixed(2)}</strong></div>
                      <div className="text-muted small">Total Tax<br /><strong>₹{formData.totalTax?.toFixed(2)}</strong></div>
                      <div className="text-muted small">Total Discount<br /><strong>₹{formData.totalDiscount?.toFixed(2)}</strong></div>
                      <div className="text-end">
                        <div className="small text-muted">Grand Total</div>
                        <div className="fs-4 fw-bold">₹{formData.totalAmount?.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Section (only visible when received or Advanced) */}
                {(formData.status === 'received' || showAdvanced) && (
                  <>
                    <div className="row mt-3">
                      <div className="col-md-4">
                        <label>Paid Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.paidAmount}
                          onChange={(e) => {
                            const paid = Number(e.target.value);
                            setFormData({
                              ...formData,
                              paidAmount: paid,
                              balanceAmount: formData.totalAmount - paid
                            });
                          }}
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
                  </>
                )}

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (editMode ? "Updating..." : "Creating...") : (editMode ? "Update Purchase" : "Create Purchase")}
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
                <h5 className="modal-title text-white" >Purchase Details</h5>
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
                <p><strong>Status:</strong> {selectedPurchase.status?.replace(/_/g, ' ')}</p>
                <p><strong>Payment:</strong> {selectedPurchase.paymentStatus}</p>
                {selectedPurchase.dueDate && (
                  <p><strong>Due:</strong> {new Date(selectedPurchase.dueDate).toLocaleDateString('en-IN')}</p>
                )}
                {selectedPurchase.orderedAt && (
                  <p><strong>Ordered At:</strong> {new Date(selectedPurchase.orderedAt).toLocaleDateString('en-IN')}</p>
                )}
                {selectedPurchase.receivedAt && (
                  <p><strong>Received At:</strong> {new Date(selectedPurchase.receivedAt).toLocaleDateString('en-IN')}</p>
                )}

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
                          <td>{item.quantity} {material?.unit}</td>
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
