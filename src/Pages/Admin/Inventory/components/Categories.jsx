// import React, { useState, useEffect } from 'react';
// import { FaPlus, FaEdit, FaTrash, FaTags, FaSearch } from 'react-icons/fa';
// import Config from '../../../../Config/Config';
// import axiosInstance from '../../../../apiHandler/axiosInstance';
// import './Categories.css';

// const Categories = () => {
//   const [categories, setCategories] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     isActive: true
//   });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL_CATEGORY']);
//       const data = await response.data;
//       setCategories(data.data || []);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const url = editingCategory
//         ? `${Config.END_POINT_LIST['UPDATE_ROW_MATERIAL_CATEGORY']}/${editingCategory._id}`
//         : Config.END_POINT_LIST['CREATE_ROW_MATERIAL_CATEGORY'];

//       const response = await axiosInstance.post(url, formData);

//       if (response.data.success) {
//         // Direct state update without API call
//         if (editingCategory) {
//           // Update existing category in state
//           setCategories(prev => prev.map(cat =>
//             cat._id === editingCategory._id
//               ? { ...cat, ...formData }
//               : cat
//           ));
//         } else {
//           // Add new category to state
//           setCategories(prev => [...prev, {
//             ...formData,
//             _id: response.data.data._id,
//             createdAt: new Date().toISOString()
//           }]);
//         }

//         setShowModal(false);
//         setEditingCategory(null);
//         setFormData({
//           name: '',
//           description: '',
//           isActive: true
//         });
//       }
//     } catch (error) {
//       console.error('Error saving category:', error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEdit = (category) => {
//     setEditingCategory(category);
//     setFormData({
//       name: category.name,
//       description: category.description || '',
//       isActive: category.isActive !== undefined ? category.isActive : true
//     });
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this category?')) {
//       try {
//         const response = await axiosInstance.post(`${Config.END_POINT_LIST['DELETE_ROW_MATERIAL_CATEGORY']}/${id}`);

//         if (response.data.success) {
//           // Direct state update - remove category from list
//           setCategories(prev => prev.filter(cat => cat._id !== id));
//         }
//       } catch (error) {
//         console.error('Error deleting category:', error);
//       }
//     }
//   };

//   const handleToggleStatus = async (category) => {
//     try {
//       const response = await axiosInstance.put(
//         `${Config.END_POINT_LIST['UPDATE_ROW_MATERIAL_CATEGORY']}/${category._id}`,
//         { ...category, isActive: !category.isActive }
//       );

//       if (response.data.success) {
//         // Direct state update - toggle status
//         setCategories(prev => prev.map(cat =>
//           cat._id === category._id
//             ? { ...cat, isActive: !cat.isActive }
//             : cat
//         ));
//       }
//     } catch (error) {
//       console.error('Error toggling category status:', error);
//     }
//   };

//   const filteredCategories = categories.filter(category =>
//     category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     category.description?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="categories">
//       <div className="section-header">
//         <h2>Categories</h2>
//         <a href="#" className="btn btn-primary" data-bs-toggle="modal"
//           id="create-btn"
//           data-bs-target="#permissionModal"
//           onClick={() => document.body.classList.remove('pace-done', 'modal-open')}>
//           <i className="feather-plus me-2" />
//           <span>Add Category</span>
//         </a>
//       </div>

//       <div className="search-bar">
//         <FaSearch className="search-icon" />
//         <input
//           type="text"
//           placeholder="Search categories..."
//           className="search-input"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {loading ? (
//         <div className="loading-state">Loading categories...</div>
//       ) : filteredCategories.length === 0 ? (
//         <div className="empty-state">
//           <FaTags className="empty-state-icon" />
//           <h3>No categories found</h3>
//           <p>Create categories to organize your raw materials</p>
//         </div>
//       ) : (
//         <div className="categories-grid">
//           {filteredCategories.map(category => (
//             <div key={category._id} className="category-card">
//               <div className="category-header">
//                 <h3>{category.name}</h3>
//                 <div className="category-actions">
//                   <button
//                     className="btn-secondary"
//                     onClick={() => handleEdit(category)}
//                     title="Edit Category"
//                     disabled={submitting}
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     className="btn-danger"
//                     onClick={() => handleDelete(category._id)}
//                     title="Delete Category"
//                     disabled={submitting}
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </div>

//               <div className="category-details">
//                 {category.description && (
//                   <p className="category-description">{category.description}</p>
//                 )}
//                 <div className="category-meta">
//                   <span
//                     className={`status-badge ${category.isActive ? 'active' : 'inactive'} clickable`}
//                     onClick={() => handleToggleStatus(category)}
//                     title={`Click to ${category.isActive ? 'deactivate' : 'activate'}`}
//                   >
//                     {category.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                   <span className="created-date">
//                     Created: {new Date(category.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showModal && (
//         <div className="modal fade" id="permissionModal" tabIndex={-1} aria-hidden="true" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
//             <div className="modal-content border-0 rounded-4 overflow-hidden">
//               <div className="modal-header px-4 py-3 bg-dark text-white">
//                 <div>
//                   <h4 className="mb-0 fw-semibold text-white">
//                     {editingCategory ? 'Edit Category' : 'Add Category'}
//                   </h4>
//                   <small className="text-white-50">
//                     Manage category details and settings
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
//                       Category Details
//                     </h6>

//                     <div className="row g-3">
//                       <div className="col-md-6">
//                         <label className="form-label">Category Name</label>
//                         <input
//                           className="form-control form-control-lg"
//                           placeholder="Enter category name"
//                           value={formData.name}
//                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                           required
//                         />
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label">Status</label>
//                         <select
//                           className="form-select form-select-lg"
//                           value={formData.isActive}
//                           onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
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
//                           placeholder="Optional description for this category"
//                           value={formData.description}
//                           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
//                   {editingCategory ? 'Update Category' : 'Save Category'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Categories;



import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTags, FaSearch } from 'react-icons/fa';
import Config from '../../../../Config/Config';
import axiosInstance from '../../../../apiHandler/axiosInstance';
import './Categories.css';

const Categories = () => {

  const [categories, setCategories] = useState([]);
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
      const response = await axiosInstance.get(
        Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL_CATEGORY']
      );
      setCategories(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const url = editingCategory
        ? `${Config.END_POINT_LIST['UPDATE_ROW_MATERIAL_CATEGORY']}/${editingCategory._id}`
        : Config.END_POINT_LIST['CREATE_ROW_MATERIAL_CATEGORY'];

      const method = editingCategory ? 'put' : 'post';

      const response = await axiosInstance[method](url, formData);

      if (response.data.success) {
        fetchCategories();
        resetForm();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    // debugger
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive
    });

    const modal = new window.bootstrap.Modal(
      document.getElementById('categoryModal')
    );
    modal.show();
    document.body.classList.remove('pace-done', 'modal-open')
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await axiosInstance.delete(
          `${Config.END_POINT_LIST['DELETE_ROW_MATERIAL_CATEGORY']}/${id}`
        );

        if (response.data.success) {
          setCategories(prev => prev.filter(cat => cat._id !== id));
        }
      } catch (error) {
        console.error(error);
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
        setCategories(prev =>
          prev.map(cat =>
            cat._id === category._id
              ? { ...cat, isActive: !cat.isActive }
              : cat
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="categories">

      <div className="categories-wrapper">

        {/* HEADER */}
        <div className="categories-header">
          <div>
            <h2 className="title">Categories</h2>
            <p className="subtitle">Organize your raw materials efficiently</p>
          </div>

          <button
            className="btn btn-add"
            data-bs-toggle="modal"
            data-bs-target="#categoryModal"
            onClick={() =>{document.body.classList.remove('pace-done', 'modal-open'); resetForm()}}
          >
            <FaPlus className="me-2" />
            Add Category
          </button>
        </div>

        {/* SEARCH */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="empty-state-card">
            <FaTags size={40} />
            <h5>No Categories Found</h5>
            <p>Create your first category to get started</p>
          </div>
        ) : (
          <div className="categories-grid">
            {filteredCategories.map(category => (
              <div key={category._id} className="category-card">

                <div className="card-top">
                  <div>
                    <h5 className="category-name">{category.name}</h5>
                    {category.description && (
                      <p className="category-desc">{category.description}</p>
                    )}
                  </div>

                  <span
                    className={`status-pill ${category.isActive ? "active" : "inactive"
                      }`}
                    onClick={() => handleToggleStatus(category)}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="card-actions">
                  <button
                    className="icon-btn edit"
                    onClick={() => handleEdit(category)}
                    data-bs-toggle="modal"
                    data-bs-target="#categoryModal"
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(category._id)}
                  >
                    <FaTrash />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" id="categoryModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title text-white">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              />
            </div>

            <div className="modal-body">

              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  className="form-control"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.isActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === 'true'
                    })
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value
                    })
                  }
                />
              </div>

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
                data-bs-dismiss="modal"
              >
                {editingCategory ? 'Update' : 'Save'}
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Categories;