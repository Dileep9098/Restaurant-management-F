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
//     unit: '',
//     minStockLevel: 0,
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
//           unit: "",
//           minStockLevel: 0,
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
//       unit: material.unit,
//       minStockLevel: material.minStockLevel,
//       storageType: material.storageType || '',
//       averageCost: material.averageCost,
//       isActive: material.isActive !== undefined ? material.isActive : true
//     });
//     setShowModal(true);
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

//   return (
//     <div className="raw-materials">
//       <div className="section-header">
//         <h2>Raw Materials</h2>
//         {/* <a href="#" className="btn btn-primary" data-bs-toggle="modal"
//            id="create-btn"
//            data-bs-target="#permissionModal"
//            onClick={() => document.body.classList.remove('pace-done', 'modal-open')}>
//           <i className="feather-plus me-2" />
//           <span>Add Material</span>
//         </a> */}
//           <button
//                   className="btn btn-primary"
//                   data-bs-toggle="modal"
//                   data-bs-target="#rowmaterialModal"
//                   onClick={() => { document.body.classList.remove('pace-done', 'modal-open'), resetForm }}
//                 >
//                   <FaPlus className="me-2" />
//                   Add Material
//                 </button>
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
//                   <span className="label">Unit:</span>
//                   <span className="value">{material.unit}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="label">Current Stock:</span>
//                   <span className={`value ${material.currentStock <= material.minStockLevel ? 'low-stock' : ''}`}>
//                     {material.currentStock || 0} {material.unit}
//                   </span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="label">Min Stock Level:</span>
//                   <span className="value">{material.minStockLevel} {material.unit}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="label">Avg Cost:</span>
//                   <span className="value">₹{material.averageCost}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="label">Status:</span>
//                   <span
//                     className={`status-badge ${material.isActive ? 'active' : 'inactive'} clickable`}
//                     onClick={() => handleToggleStatus(material)}
//                     title={`Click to ${material.isActive ? 'deactivate' : 'activate'}`}
//                   >
//                     {material.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                 </div>
//                 {material.currentStock <= material.minStockLevel && (
//                   <div className="stock-warning">
//                     <FaExclamationTriangle /> Low Stock
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showModal && (
//         <div className="modal fade" id="rowmaterialModal" tabIndex="-1" aria-hidden="true">
//         <div className="modal-dialog modal-md modal-dialog-centered">
//           <div className="modal-content">
//               <div className="modal-header px-4 py-3 bg-dark text-white">
//                 <div>
//                   <h4 className="mb-0 fw-semibold text-white">
//                     {editingMaterial ? 'Edit Raw Material' : 'Add Raw Material'}
//                   </h4>
//                   <small className="text-white-50">
//                     Manage raw material details and inventory settings
//                   </small>
//                 </div>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white"
//                   onClick={() => setShowModal(false)}
//                 />
//               </div>
              
//               <div className="modal-body p-4 bg-body-tertiary">
//                 <div className="card border-0 shadow-sm rounded-4 mb-4">
//                   <div className="card-body">
//                     <h6 className="fw-semibold mb-3 text-primary">
//                       Material Details
//                     </h6>
                    
//                     <div className="row g-3">
//                       <div className="col-md-6">
//                         <label className="form-label">Material Name</label>
//                         <input
//                           className="form-control form-control-lg"
//                           placeholder="Enter material name"
//                           value={formData.name}
//                           onChange={(e) => setFormData({...formData, name: e.target.value})}
//                           required
//                         />
//                       </div>
                      
//                       <div className="col-md-6">
//                         <label className="form-label">Category</label>
//                         <select
//                           className="form-select form-select-lg"
//                           value={formData.category}
//                           onChange={(e) => setFormData({...formData, category: e.target.value})}
//                           required
//                         >
//                           <option value="">Select Category</option>
//                           {categories.map(cat => (
//                             <option key={cat._id} value={cat._id}>{cat.name}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
                    
//                     <div className="row g-3 mt-2">
//                       <div className="col-md-4">
//                         <label className="form-label">Unit</label>
//                         <input
//                           className="form-control form-control-lg"
//                           placeholder="kg, pcs, liters"
//                           value={formData.unit}
//                           onChange={(e) => setFormData({...formData, unit: e.target.value})}
//                           required
//                         />
//                       </div>
                      
//                       <div className="col-md-4">
//                         <label className="form-label">Min Stock Level</label>
//                         <input
//                           type="number"
//                           className="form-control form-control-lg"
//                           placeholder="10"
//                           value={formData.minStockLevel}
//                           onChange={(e) => setFormData({...formData, minStockLevel: Number(e.target.value)})}
//                           min="0"
//                         />
//                       </div>
                      
//                       <div className="col-md-4">
//                         <label className="form-label">Status</label>
//                         <select
//                           className="form-select form-select-lg"
//                           value={formData.isActive}
//                           onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
//                         >
//                           <option value="true">Active</option>
//                           <option value="false">Inactive</option>
//                         </select>
//                       </div>
//                     </div>
                    
//                     <div className="row g-3 mt-2">
//                       <div className="col-12">
//                         <label className="form-label">Description</label>
//                         <textarea
//                           className="form-control form-control-lg"
//                           placeholder="Optional description for this material"
//                           value={formData.description}
//                           onChange={(e) => setFormData({...formData, description: e.target.value})}
//                           rows="3"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="modal-footer bg-white px-4 py-3">
//                 <button className="btn btn-light rounded-3" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </button>
//                 <button className="btn btn-dark rounded-3 px-4" onClick={handleSubmit}>
//                   {editingMaterial ? 'Update Material' : 'Save Material'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RawMaterials;


import React, { useState, useEffect } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaSearch,
  FaExclamationTriangle
} from 'react-icons/fa';
import Config from '../../../../Config/Config';
import axiosInstance from '../../../../apiHandler/axiosInstance';
import './RawMaterials.css';

const RawMaterials = ({ onStatsUpdate }) => {

  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
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
      const response = await axiosInstance.get(
        Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL']
      );
      setMaterials(response.data.data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(
        Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL_CATEGORY']
      );
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const resetForm = () => {
    setEditingMaterial(null);
    setFormData({
      name: '',
      category: '',
      unit: '',
      minStockLevel: 0,
      storageType: '',
      averageCost: 0,
      isActive: true
    });
  };

  const handleSubmit = async () => {

    if (!formData.name.trim()) {
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
        ? await axiosInstance.put(url, formData)
        : await axiosInstance.post(url, formData);

      if (response?.data?.success) {
        await fetchMaterials();
        resetForm();

        const modalElement = document.getElementById('rowmaterialModal');
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        onStatsUpdate?.();
      }

    } catch (error) {
      console.error(error);
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
      isActive: material.isActive ?? true
    });

    const modal = new window.bootstrap.Modal(
      document.getElementById('rowmaterialModal')
    );
    modal.show();
    document.body.classList.remove('pace-done', 'modal-open')
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      const response = await axiosInstance.delete(
        `${Config.END_POINT_LIST['DELETE_ROW_MATERIAL']}/${id}`
      );

      if (response.data.success) {
        setMaterials(prev => prev.filter(mat => mat._id !== id));
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const handleToggleStatus = async (material) => {
    try {
      const response = await axiosInstance.put(
        `${Config.END_POINT_LIST['UPDATE_ROW_MATERIAL']}/${material._id}`,
        { ...material, isActive: !material.isActive }
      );

      if (response.data.success) {
        setMaterials(prev =>
          prev.map(mat =>
            mat._id === material._id
              ? { ...mat, isActive: !mat.isActive }
              : mat
          )
        );
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

        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#rowmaterialModal"
          onClick={() => { document.body.classList.remove('pace-done', 'modal-open'), resetForm }}
        >
          <FaPlus className="me-2" />
          Add Material
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
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(material._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="material-details">
                <p><strong>Category:</strong> {material.category?.name}</p>
                <p><strong>Unit:</strong> {material.unit}</p>
                <p>
                  <strong>Stock:</strong>{" "}
                  <span className={material.currentStock <= material.minStockLevel ? "low-stock" : ""}>
                    {material.currentStock || 0} {material.unit}
                  </span>
                </p>
                <p><strong>Min Level:</strong> {material.minStockLevel}</p>
                <p><strong>Avg Cost:</strong> ₹{material.averageCost}</p>

                <span
                  className={`status-badge ${material.isActive ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleStatus(material)}
                >
                  {material.isActive ? 'Active' : 'Inactive'}
                </span>

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

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="rowmaterialModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title text-white">
                {editingMaterial ? 'Edit Raw Material' : 'Add Raw Material'}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              />
            </div>

            <div className="modal-body">

              <input
                className="form-control mb-3"
                placeholder="Material Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <select
                className="form-select mb-3"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                className="form-control mb-3"
                placeholder="Unit"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              />

              <input
                type="number"
                className="form-control mb-3"
                placeholder="Min Stock Level"
                value={formData.minStockLevel}
                onChange={(e) =>
                  setFormData({ ...formData, minStockLevel: Number(e.target.value) })
                }
              />

            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {editingMaterial ? 'Update' : 'Save'}
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default RawMaterials;