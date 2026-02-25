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
    panNumber: '',
    paymentTerms: 'cash',
    bankDetails: {
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      accountHolderName: ''
    },
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

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const url = editingSupplier
        ? `${Config.END_POINT_LIST['UPDATE_SUPPLIER']}/${editingSupplier._id}`
        : Config.END_POINT_LIST['CREATE_SUPPLIER'];

      const method = editingSupplier ? 'put' : 'post';

      const response = await axiosInstance[method](url, formData);

      if (response.data.success) {
        fetchSuppliers();
        resetForm();

        const modalElement = document.getElementById('supplierModal');
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        onStatsUpdate?.();
      }
    } catch (error) {
      console.error(error);
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
      panNumber: supplier.panNumber || '',
      paymentTerms: supplier.paymentTerms || 'cash',
      bankDetails: {
        accountNumber: supplier.bankDetails?.accountNumber || '',
        bankName: supplier.bankDetails?.bankName || '',
        ifscCode: supplier.bankDetails?.ifscCode || '',
        accountHolderName: supplier.bankDetails?.accountHolderName || ''
      },
      isActive: supplier.isActive !== undefined ? supplier.isActive : true
    });
    setShowModal(true);
    const modal = new window.bootstrap.Modal(
      document.getElementById('supplierModal')
    );
    modal.show();
    document.body.classList.remove('pace-done', 'modal-open')
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
  const resetForm = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      gstNumber: '',
      panNumber: '',
      paymentTerms: 'cash',
      bankDetails: {
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        accountHolderName: ''
      },
      isActive: true
    });
  };

  return (
    <div className="suppliers">
      <div className="supx-wrapper">

        {/* HEADER */}
        <div className="supx-header">
          <div>
            <h2 className="supx-title">Suppliers</h2>
            <p className="supx-subtitle">
              Manage your vendors & purchase partners
            </p>
          </div>

          <button
            className="supx-add-btn"
            data-bs-toggle="modal"
            data-bs-target="#supplierModal"
            onClick={() => {
              resetForm()
              document.body.classList.remove('pace-done', 'modal-open')
            }}
          >
            <FaPlus className="me-2" />
            Add Supplier
          </button>
        </div>

        {/* SEARCH */}
        <div className="supx-search-box">
          <FaSearch className="supx-search-icon" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="supx-loading">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="supx-empty">
            <FaUsers size={40} />
            <h5>No Suppliers Found</h5>
            <p>Add your first supplier to start managing purchases</p>
          </div>
        ) : (
          <div className="supx-grid">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier._id} className="supx-card">

                {/* TOP */}
                <div className="supx-card-top">
                  <h5 className="supx-name">{supplier.name}</h5>

                  <div className="supx-actions">
                    <button
                      className="supx-icon edit"
                      onClick={() => handleEdit(supplier)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="supx-icon delete"
                      onClick={() => handleDelete(supplier._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="supx-details">

                  {supplier.phone && (
                    <div className="supx-row">
                      <FaPhone />
                      <span>{supplier.phone}</span>
                    </div>
                  )}

                  {supplier.email && (
                    <div className="supx-row">
                      <FaEnvelope />
                      <span>{supplier.email}</span>
                    </div>
                  )}

                  {supplier.address && (
                    <div className="supx-row">
                      <FaMapMarkerAlt />
                      <span>{supplier.address}</span>
                    </div>
                  )}

                  {supplier.gstNumber && (
                    <div className="supx-row">
                      <span className="label">GST:</span>
                      <span>{supplier.gstNumber}</span>
                    </div>
                  )}

                  {supplier.paymentTerms && (
                    <div className="supx-row">
                      <span className="label">Payment:</span>
                      <span>{supplier.paymentTerms}</span>
                    </div>
                  )}

                </div>

                {/* FOOTER */}
                <div className="supx-footer">
                  <span
                    className={`supx-status ${supplier.isActive ? "active" : "inactive"}`}
                    onClick={() => handleToggleStatus(supplier)}
                  >
                    {supplier.isActive ? "Active" : "Inactive"}
                  </span>

                  <span className="supx-date">
                    Since {new Date(supplier.createdAt).toLocaleDateString()}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <div className="modal fade" id="supplierModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header px-4 py-3 bg-dark text-white">
              <div>
                <h4 className="mb-0 fw-semibold text-white">
                  {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
                </h4>
                <small className="text-white-50">
                  Manage supplier details and contact information
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
                    Supplier Details
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Supplier Name</label>
                      <input
                        className="form-control form-control-lg"
                        placeholder="Enter supplier name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-control form-control-lg"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="supplier@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">GST Number</label>
                      <input
                        className="form-control form-control-lg"
                        placeholder="GSTIN1234567890AB"
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mt-2">
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control form-control-lg"
                        placeholder="123 Main Street, City, State"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <label className="form-label">PAN Number</label>
                      <input
                        className="form-control form-control-lg"
                        placeholder="ABCDE1234F"
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Payment Terms</label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.paymentTerms}
                        onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                      >
                        <option value="cash">Cash</option>
                        <option value="credit_7_days">Credit 7 Days</option>
                        <option value="credit_15_days">Credit 15 Days</option>
                        <option value="credit_30_days">Credit 30 Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body">
                      <h6 className="fw-semibold mb-3 text-primary">
                        Bank Details
                      </h6>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Account Holder Name</label>
                          <input
                            className="form-control form-control-lg"
                            placeholder="Account Holder Name"
                            value={formData.bankDetails.accountHolderName}
                            onChange={(e) => setFormData({
                              ...formData,
                              bankDetails: { ...formData.bankDetails, accountHolderName: e.target.value }
                            })}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Bank Name</label>
                          <input
                            className="form-control form-control-lg"
                            placeholder="Bank Name"
                            value={formData.bankDetails.bankName}
                            onChange={(e) => setFormData({
                              ...formData,
                              bankDetails: { ...formData.bankDetails, bankName: e.target.value }
                            })}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mt-2">
                        <div className="col-md-6">
                          <label className="form-label">Account Number</label>
                          <input
                            className="form-control form-control-lg"
                            placeholder="Account Number"
                            value={formData.bankDetails.accountNumber}
                            onChange={(e) => setFormData({
                              ...formData,
                              bankDetails: { ...formData.bankDetails, accountNumber: e.target.value }
                            })}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">IFSC Code</label>
                          <input
                            className="form-control form-control-lg"
                            placeholder="IFSC Code"
                            value={formData.bankDetails.ifscCode}
                            onChange={(e) => setFormData({
                              ...formData,
                              bankDetails: { ...formData.bankDetails, ifscCode: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mt-2">
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
              <button className="btn btn-light rounded-3c  "
                data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-dark rounded-3 px-4" onClick={handleSubmit}>
                {editingSupplier ? 'Update Supplier' : 'Save Supplier'}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Suppliers;
