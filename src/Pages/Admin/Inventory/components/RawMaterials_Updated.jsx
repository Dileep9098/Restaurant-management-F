// import React, { useState, useEffect } from 'react';
// import { FaPlus, FaEdit, FaTrash, FaBox, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
// import Config from '../../../../Config/Config';
// import axiosInstance from '../../../../apiHandler/axiosInstance';
// import './RawMaterials.css';

// const RawMaterials = ({ onStatsUpdate }) => {
//   const [materials, setMaterials] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingMaterial, setEditingMaterial] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     category: '',
//     purchaseUnit: '',
//     consumptionUnit: '',
//     conversionRate: 1,
//     minStockLevel: 0,
//     reorderQuantity: 0,
//     storageType: '',
//     averageCost: 0,
//     isActive: true
//   });

//   useEffect(() => {
//     fetchMaterials();
//     fetchCategories();
//   }, []);

//   const fetchMaterials = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL']);
//       const data = await response.data;
//       setMaterials(data.data || []);
//     } catch (error) {
//       console.error('Error fetching materials:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL_CATEGORY']);
//       const data = await response.data;
//       setCategories(data.data || []);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name?.trim()) {
//       return alert("Material name is required");
//     }

//     if (!formData.category) {
//       return alert("Category is required");
//     }

//     if (!formData.purchaseUnit || !formData.consumptionUnit || !formData.conversionRate) {
//       return alert("Purchase Unit, Consumption Unit and Conversion Rate are required");
//     }

//     setSubmitting(true);

//     try {
//       const isEdit = Boolean(editingMaterial);

//       const url = isEdit
//         ? `${Config.END_POINT_LIST['UPDATE_ROW_MATERIAL']}/${editingMaterial._id}`
//         : Config.END_POINT_LIST['CREATE_ROW_MATERIAL'];

//       const response = isEdit
//         ? await axiosInstance.put(url, formData)   // ✅ PUT for update
//         : await axiosInstance.post(url, formData);

//       if (response?.data?.success) {
//         const savedData = response.data.data;

//         setMaterials((prev) => {
//           if (isEdit) {
//             return prev.map((mat) =>
//               mat._id === editingMaterial._id
//                 ? savedData   // ✅ backend ka updated object use karo
//                 : mat
//             );
//           } else {
//             return [...prev, savedData]; // ✅ directly backend response add karo
//           }
//         });

//         setShowModal(false);
//         setEditingMaterial(null);

//         setFormData({
//           name: "",
//           category: "",
//           purchaseUnit: "",
//           consumptionUnit: "",
//           conversionRate: 1,
//           minStockLevel: 0,
//           reorderQuantity: 0,
//           storageType: "",
//           averageCost: 0,
//           isActive: true,
//         });

//         onStatsUpdate?.();
//       }
//     } catch (error) {
//       console.error(
//         "Error saving material:",
//         error?.response?.data || error.message
//       );
//       alert(error?.response?.data?.message || "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEdit = (material) => {
//     setEditingMaterial(material);
//     setFormData({
//       name: material.name,
//       category: material.category?._id || material.category,
//       purchaseUnit: material.purchaseUnit,
//       consumptionUnit: material.consumptionUnit,
//       conversionRate: material.conversionRate,
//       minStockLevel: material.minStockLevel,
//       reorderQuantity: material.reorderQuantity,
//       storageType: material.storageType || '',
//       averageCost: material.averageCost,
//       isActive: material.isActive !== undefined ? material.isActive : true
//     });
//     setShowModal(true);
//     document.body.classList.remove('pace-done', 'modal-open')
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this material?')) {
//       try {
//         const response = await axiosInstance.delete(`${Config.END_POINT_LIST['DELETE_ROW_MATERIAL']}/${id}`);

//         if (response.data.success) {
//           // Direct state update - remove material from list
//           setMaterials(prev => prev.filter(mat => mat._id !== id));
//           onStatsUpdate?.();
//         }
//       } catch (error) {
//         console.error('Error deleting material:', error);
//       }
//     }
//   };

//   const handleToggleStatus = async (material) => {
//     try {
//       const response = await axiosInstance.put(
//         `${Config.END_POINT_LIST['UPDATE_ROW_MATERIAL']}/${material._id}`,
//         { ...material, isActive: !material.isActive }
//       );

//       if (response.data.success) {
//         // Direct state update - toggle status
//         setMaterials(prev => prev.map(mat =>
//           mat._id === material._id
//             ? { ...mat, isActive: !mat.isActive }
//             : mat
//         ));
//         onStatsUpdate?.();
//       }
//     } catch (error) {
//       console.error('Error toggling material status:', error);
//     }
//   };

//   const filteredMaterials = materials.filter(material =>
//     material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     material.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const resetForm = () => {
//     setEditingMaterial(null);
//     setFormData({
//       name: "",
//       category: "",
//       purchaseUnit: "",
//       consumptionUnit: "",
//       conversionRate: 1,
//       minStockLevel: 0,
//       reorderQuantity: 0,
//       storageType: "",
//       averageCost: 0,
//       isActive: true,
//     });
//   };

//   return (
//     <div className="raw-materials">
//       <div className="section-header">
//         <h2>Raw Materials</h2>
//         <button
//           className="btn btn-primary"
//           data-bs-toggle="modal"
//           data-bs-target="#rowmaterialModal"
//           onClick={() => { document.body.classList.remove('pace-done', 'modal-open'), resetForm }}
//         >
//           <FaPlus className="me-2" />
//           Add Material
//         </button>
//       </div>

//       <div className="search-bar">
//         <FaSearch className="search-icon" />
//         <input
//           type="text"
//           placeholder="Search materials..."
//           className="search-input"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {loading ? (
//         <div className="loading-state">Loading materials...</div>
//       ) : filteredMaterials.length === 0 ? (
//         <div className="empty-state">
//           <FaBox className="empty-state-icon" />
//           <h3>No materials found</h3>
//           <p>Start by adding your first raw material</p>
//         </div>
//       ) : (
//         <div className="materials-grid">
//           {filteredMaterials.map(material => (
//             <div key={material._id} className="material-card">
//               <div className="material-header">
//                 <h3>{material.name}</h3>
//                 <div className="material-actions">
//                   <button
//                     className="btn-secondary"
//                     onClick={() => handleEdit(material)}
//                     title="Edit Material"
//                     data-bs-toggle="modal"
//                     data-bs-target="#rowmaterialModal"
//                     disabled={submitting}
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     className="btn-danger"
//                     onClick={() => handleDelete(material._id)}
//                     title="Delete Material"
//                     disabled={submitting}
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </div>

//               <div className="material-details">
//                 <div className="detail-row">
//                   <span className="label">Category:</span>
//                   <span className="value">{material.category?.name}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="label">Purchase Unit:</span>
//                   <span className="value">{material.purchaseUnit}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="label">Consumption Unit:</span>
//                   <span className="value">{material.consumptionUnit}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="label">Conversion:</span>
//                   <span className="value">1 {material.purchaseUnit} = {material.conversionRate} {material.consumptionUnit}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="label">Min Stock:</span>
//                   <span className="value">{material.minStockLevel}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="label">Reorder Qty:</span>
//                   <span className="value">{material.reorderQuantity}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="label">Storage:</span>
//                   <span className="value">{material.storageType || 'Normal'}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="label">Avg Cost:</span>
//                   <span className="value">₹{material.averageCost?.toFixed(2)}</span>
//                 </div>
//                 <div className="material-meta">
//                   <span
//                     className={`status-badge ${material.isActive ? 'active' : 'inactive'} clickable`}
//                     onClick={() => handleToggleStatus(material)}
//                     title={`Click to ${material.isActive ? 'deactivate' : 'activate'}`}
//                   >
//                     {material.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                   <span className="created-date">
//                     Since {new Date(material.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

// <div className="modal fade" id="rowmaterialModal" tabIndex="-1" aria-hidden="true">
//   <div className="modal-dialog modal-lg modal-dialog-centered">
//     <div className="modal-content">
//       <div className="modal-header px-4 py-3 bg-dark text-white">
//         <div>
//           <h4 className="mb-0 fw-semibold text-white">
//             {editingMaterial ? 'Edit Raw Material' : 'Add Raw Material'}
//           </h4>
//           <small className="text-white-50">
//             Manage raw material details and inventory settings
//           </small>
//         </div>
//         <button
//           type="button"
//           className="btn-close btn-close-white"
//           data-bs-dismiss="modal"
//         />
//       </div>

//       <div className="modal-body p-4 bg-body-tertiary">
//         <div className="card border-0 shadow-sm rounded-4 mb-4">
//           <div className="card-body">
//             <h6 className="fw-semibold mb-3 text-primary">
//               Basic Information
//             </h6>

//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label className="form-label">Material Name*</label>
//                 <input
//                   className="form-control form-control-lg"
//                   placeholder="Enter material name"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label">Category*</label>
//                 <select
//                   className="form-select form-select-lg"
//                   value={formData.category}
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                   required
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map(category => (
//                     <option key={category._id} value={category._id}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="row g-3 mt-2">
//               <div className="col-md-4">
//                 <label className="form-label">Purchase Unit*</label>
//                 <input
//                   className="form-control form-control-lg"
//                   placeholder="kg, liter, piece"
//                   value={formData.purchaseUnit}
//                   onChange={(e) => setFormData({ ...formData, purchaseUnit: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Consumption Unit*</label>
//                 <input
//                   className="form-control form-control-lg"
//                   placeholder="gram, ml, unit"
//                   value={formData.consumptionUnit}
//                   onChange={(e) => setFormData({ ...formData, consumptionUnit: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Conversion Rate*</label>
//                 <input
//                   type="number"
//                   className="form-control form-control-lg"
//                   placeholder="1000"
//                   value={formData.conversionRate}
//                   onChange={(e) => setFormData({ ...formData, conversionRate: Number(e.target.value) })}
//                   min="1"
//                   required
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="card border-0 shadow-sm rounded-4 mb-4">
//           <div className="card-body">
//             <h6 className="fw-semibold mb-3 text-primary">
//               Inventory Settings
//             </h6>

//             <div className="row g-3">
//               <div className="col-md-4">
//                 <label className="form-label">Min Stock Level</label>
//                 <input
//                   type="number"
//                   className="form-control form-control-lg"
//                   placeholder="10"
//                   value={formData.minStockLevel}
//                   onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
//                   min="0"
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Reorder Quantity</label>
//                 <input
//                   type="number"
//                   className="form-control form-control-lg"
//                   placeholder="50"
//                   value={formData.reorderQuantity}
//                   onChange={(e) => setFormData({ ...formData, reorderQuantity: Number(e.target.value) })}
//                   min="0"
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Storage Type</label>
//                 <select
//                   className="form-select form-select-lg"
//                   value={formData.storageType}
//                   onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
//                 >
//                   <option value="">Normal</option>
//                   <option value="Freezer">Freezer</option>
//                   <option value="Cold Storage">Cold Storage</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="card border-0 shadow-sm rounded-4 mb-4">
//           <div className="card-body">
//             <h6 className="fw-semibold mb-3 text-primary">
//               Financial Information
//             </h6>

//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label className="form-label">Average Cost</label>
//                 <input
//                   type="number"
//                   className="form-control form-control-lg"
//                   placeholder="0.00"
//                   value={formData.averageCost}
//                   onChange={(e) => setFormData({ ...formData, averageCost: Number(e.target.value) })}
//                   min="0"
//                   step="0.01"
//                 />
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label">Status</label>
//                 <select
//                   className="form-select form-select-lg"
//                   value={formData.isActive}
//                   onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
//                 >
//                   <option value="true">Active</option>
//                   <option value="false">Inactive</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="modal-footer bg-white px-4 py-3">
//         <button className="btn btn-light rounded-3"
//           data-bs-dismiss="modal">
//           Cancel
//         </button>
//         <button className="btn btn-dark rounded-3 px-4" onClick={handleSubmit}>
//           {submitting ? 'Saving...' : (editingMaterial ? 'Update Material' : 'Save Material')}
//         </button>
//       </div>
//     </div>
//   </div>
// </div>

//     </div>
//   );
// };

// export default RawMaterials;



import React, { useState, useEffect, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash, FaBox, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import Config from "../../../../Config/Config";
import axiosInstance from "../../../../apiHandler/axiosInstance";
import "./RawMaterials.css";

const initialFormState = {
  name: "",
  category: "",
  purchaseUnit: "",
  consumptionUnit: "",
  conversionRate: 1,
  minStockLevel: 0,
  reorderQuantity: 0,
  storageType: "",
  averageCost: 0,
  isActive: true,
};

const RawMaterials = ({ onStatsUpdate }) => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchMaterials();
    fetchCategories();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        Config.END_POINT_LIST["GET_ALL_ROW_MATERIAL"]
      );
      setMaterials(data?.data || []);
    } catch (error) {
      console.error("Fetch Materials Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get(
        Config.END_POINT_LIST["GET_ALL_ROW_MATERIAL_CATEGORY"]
      );
      setCategories(data?.data || []);
    } catch (error) {
      console.error("Fetch Categories Error:", error);
    }
  };

  /* ================= FORM HANDLING ================= */

  const resetForm = () => {
    setEditingMaterial(null);
    setFormData(initialFormState);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Material name is required";
    if (!formData.category) return "Category is required";
    if (!formData.purchaseUnit) return "Purchase unit required";
    if (!formData.consumptionUnit) return "Consumption unit required";
    if (formData.conversionRate <= 0)
      return "Conversion rate must be greater than 0";
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) return alert(errorMsg);

    try {
      setSubmitting(true);

      const isEdit = Boolean(editingMaterial);

      const url = isEdit
        ? `${Config.END_POINT_LIST["UPDATE_ROW_MATERIAL"]}/${editingMaterial._id}`
        : Config.END_POINT_LIST["CREATE_ROW_MATERIAL"];

      const method = isEdit ? "put" : "post";

      const { data } = await axiosInstance[method](url, formData);

      if (!data.success) return alert(data.message);

      const savedMaterial = data.data;

      setMaterials((prev) =>
        isEdit
          ? prev.map((m) => (m._id === savedMaterial._id ? savedMaterial : m))
          : [...prev, savedMaterial]
      );

      resetForm();
      onStatsUpdate?.();

      const modal = document.getElementById("rowmaterialModal");
      window.bootstrap?.Modal.getInstance(modal)?.hide();
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (material) => {
    setEditingMaterial(material);

    setFormData({
      name: material.name || "",
      category: material.category?._id || material.category,
      purchaseUnit: material.purchaseUnit || "",
      consumptionUnit: material.consumptionUnit || "",
      conversionRate: material.conversionRate || 1,
      minStockLevel: material.minStockLevel || 0,
      reorderQuantity: material.reorderQuantity || 0,
      storageType: material.storageType || "",
      averageCost: material.averageCost || 0,
      isActive: material.isActive ?? true,
    });
    document.body.classList.remove('pace-done', 'modal-open')
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this material?")) return;

    try {
      const { data } = await axiosInstance.delete(
        `${Config.END_POINT_LIST["DELETE_ROW_MATERIAL"]}/${id}`
      );

      if (data.success) {
        setMaterials((prev) => prev.filter((m) => m._id !== id));
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  /* ================= TOGGLE STATUS ================= */

  const handleToggleStatus = async (material) => {
    try {
      const { data } = await axiosInstance.put(
        `${Config.END_POINT_LIST["UPDATE_ROW_MATERIAL"]}/${material._id}`,
        { isActive: !material.isActive }
      );

      if (data.success) {
        setMaterials((prev) =>
          prev.map((m) => (m._id === material._id ? data.data : m))
        );
      }
    } catch (error) {
      console.error("Toggle Error:", error);
    }
  };

  /* ================= SEARCH ================= */

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [materials, searchTerm]);

  /* ================= UI ================= */

  return (
    <>
      <div className="raw-materials container-fluid py-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Raw Materials</h3>
            <p className="text-muted mb-0">
              Manage and monitor kitchen inventory
            </p>
          </div>

          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#rowmaterialModal"
            onClick={() => {
              resetForm()
              document.body.classList.remove('pace-done', 'modal-open')
            }}
          >
            <FaPlus className="me-2" />
            Add Material
          </button>
        </div>

        {/* SEARCH */}
        <div className="search-wrapper mb-4">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by material or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* LIST */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="empty-state-card">
            <FaBox size={40} />
            <h5>No Raw Materials Found</h5>
            <p>Add your first inventory item</p>
          </div>
        ) : (
          <div className="materials-grid">
            {filteredMaterials.map((material) => {

              const isLowStock =
                material.currentStock <= material.minStockLevel;

              return (
                <div
                  key={material._id}
                  className={`material-card ${isLowStock ? "low-stock-card" : ""}`}
                >
                  {/* TOP SECTION */}
                  <div className="material-top">
                    <div>
                      <h5 className="material-title">
                        {material.name}
                      </h5>
                      <small className="text-muted">
                        {material.category?.name}
                      </small>
                    </div>

                    <span
                      className={`status-pill ${material.isActive ? "active" : "inactive"
                        }`}
                    >
                      {material.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* BODY */}
                  <div className="material-body">

                    <div className="info-row">
                      <span>Conversion</span>
                      <strong>
                        1 {material.purchaseUnit} = {material.conversionRate} {material.consumptionUnit}
                      </strong>
                    </div>

                    <div className="info-row">
                      <span>Min Stock</span>
                      <strong>{material.minStockLevel}</strong>
                    </div>

                    <div className="info-row">
                      <span>Reorder Qty</span>
                      <strong>{material.reorderQuantity}</strong>
                    </div>

                    <div className="info-row highlight">
                      <span>Avg Cost</span>
                      <strong>
                        ₹{Number(material.averageCost || 0).toFixed(2)}
                      </strong>
                    </div>

                    {isLowStock && (
                      <div className="low-stock-warning">
                        <FaExclamationTriangle />
                        Low Stock Alert
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="material-actions">
                    <button
                      className="icon-btn edit"
                      data-bs-toggle="modal"
                      data-bs-target="#rowmaterialModal"
                      onClick={() => handleEdit(material)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(material._id)}
                    >
                      <FaTrash />
                    </button>

                    <button
                      className={`icon-btn ${material.isActive ? "deactivate" : "activate"
                        }`}
                      onClick={() => handleToggleStatus(material)}
                    >
                      {material.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>


      <div className="modal fade" id="rowmaterialModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header px-4 py-3 bg-dark text-white">
              <div>
                <h4 className="mb-0 fw-semibold text-white">
                  {editingMaterial ? 'Edit Raw Material' : 'Add Raw Material'}
                </h4>
                <small className="text-white-50">
                  Manage raw material details and inventory settings
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
                      <label className="form-label">Material Name*</label>
                      <input
                        className="form-control form-control-lg"
                        placeholder="Enter material name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Category*</label>
                      <select
                        className="form-select form-select-lg"
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
                  </div>

                  <div className="row g-3 mt-2">
                    <div className="col-md-4">
                      <label className="form-label">Purchase Unit*</label>
                      <input
                        className="form-control form-control-lg"
                        placeholder="kg, liter, piece"
                        value={formData.purchaseUnit}
                        onChange={(e) => setFormData({ ...formData, purchaseUnit: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Consumption Unit*</label>
                      <input
                        className="form-control form-control-lg"
                        placeholder="gram, ml, unit"
                        value={formData.consumptionUnit}
                        onChange={(e) => setFormData({ ...formData, consumptionUnit: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Conversion Rate*</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="1000"
                        value={formData.conversionRate}
                        onChange={(e) => setFormData({ ...formData, conversionRate: Number(e.target.value) })}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                  <h6 className="fw-semibold mb-3 text-primary">
                    Inventory Settings
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Min Stock Level</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="10"
                        value={formData.minStockLevel}
                        onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                        min="0"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Reorder Quantity</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="50"
                        value={formData.reorderQuantity}
                        onChange={(e) => setFormData({ ...formData, reorderQuantity: Number(e.target.value) })}
                        min="0"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Storage Type</label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.storageType}
                        onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                      >
                        <option value="">Normal</option>
                        <option value="Freezer">Freezer</option>
                        <option value="Cold Storage">Cold Storage</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                  <h6 className="fw-semibold mb-3 text-primary">
                    Financial Information
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Average Cost</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="0.00"
                        value={formData.averageCost}
                        onChange={(e) => setFormData({ ...formData, averageCost: Number(e.target.value) })}
                        min="0"
                        step="0.01"
                      />
                    </div>

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
                {submitting ? 'Saving...' : (editingMaterial ? 'Update Material' : 'Save Material')}
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default RawMaterials;