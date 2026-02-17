// import React from 'react'

// export default function InvoiceFormateTemplate() {
//   return (
//     <div>

//     </div>
//   )
// }

import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


export default function InvoiceFormateTemplate() {
    const { user, permissions } = useSelector(state => state.auth)
    console.log(user)
    const canCreateInvoiceTemplate = permissions.includes("bill_formate.create");
    const canEdit = permissions.includes("bill_formate.update");
    const canDelete = permissions.includes("bill_formate.delete");


    const [templateData, setTemplateData] = useState({
        restaurant: user?.restaurant?._id || "",
        name: "",
        code: "",
        description: "",
        isActive: true,
        isDefault: false
    });



    const [getId, setGetId] = useState(null);

    const [allCategory, setAllCategory] = useState([]);

    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const [editId, setEditId] = useState(null);
    const [allTemplates, setAllTemplates] = useState([]);


    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await axiosInstance.get(
                    Config.END_POINT_LIST["GET_ALL_INVOICE_TEMPLATES"],
                    { withCredentials: true }
                );

                if (res.data.success) {
                    setAllTemplates(res.data.data);
                }
            } catch (err) {
                showErrorMsg(err.response?.data?.message || "Something went wrong");
            }
        };

        fetchTemplates();
    }, []);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setTemplateData({
            ...templateData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            setFilePreview(URL.createObjectURL(selectedFile));
        }
    };



    // ===== SUBMIT =====
    const handleSubmit = async () => {
        try {
            if (!templateData.name.trim()) {
                return showErrorMsg("Template name is required");
            }

            if (!templateData.code.trim()) {
                return showErrorMsg("Template code is required");
            }

            const formData = new FormData();
            formData.append("restaurant", templateData.restaurant);
            formData.append("name", templateData.name);
            formData.append("code", templateData.code);
            formData.append("description", templateData.description);
            formData.append("isActive", templateData.isActive);
            formData.append("isDefault", templateData.isDefault);

            if (file) {
                formData.append("file", file);
            }

            const res = await axiosInstance.post(
                Config.END_POINT_LIST["CREATE_INVOICE_TEMPLATE"],
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            if (res.data.success) {
                showSuccessMsg("Invoice Template Created Successfully");

                setAllTemplates([...allTemplates, res.data.data]);

                setTemplateData({
                    restaurant: user?.restaurant?._id || "",
                    name: "",
                    code: "",
                    description: "",
                    isActive: true,
                    isDefault: false
                });

                setFile(null);
                setFilePreview(null);

                document.querySelector('#invoiceTemplateModal .btn-close')?.click();
            }

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };


    const handleEdit = (id) => {
        const template = allTemplates.find(item => item._id === id);
        if (!template) return;

        setEditId(id);

        setTemplateData({
            restaurant: template.restaurant,
            name: template.name,
            code: template.code,
            description: template.description || "",
            isActive: template.isActive,
            isDefault: template.isDefault
        });

        setFilePreview(
            template.previewImage
                ? `/uploads/invoiceTemplates/${template.previewImage}`
                : null
        );
    };


    const handleEditSubmit = async () => {
        try {
            if (!editId) return;

            const formData = new FormData();
            formData.append("restaurant", templateData.restaurant);
            formData.append("name", templateData.name);
            formData.append("code", templateData.code);
            formData.append("description", templateData.description);
            formData.append("isActive", templateData.isActive);
            formData.append("isDefault", templateData.isDefault);

            if (file) {
                formData.append("file", file);
            }

            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST["UPDATE_INVOICE_TEMPLATE"]}/${editId}`,
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            if (res.data.success) {
                showSuccessMsg("Invoice Template Updated Successfully");

                setAllTemplates(
                    allTemplates.map(item =>
                        item._id === editId ? res.data.data : item
                    )
                );

                setEditId(null);
                document.querySelector('#invoiceTemplateModalEdit .btn-close')?.click();
            }

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleDeleteTemplate = async () => {
        try {
            const res = await axiosInstance.delete(
                `${Config.END_POINT_LIST["DELETE_INVOICE_TEMPLATE"]}/${editId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Invoice Template Deleted Successfully");

                setAllTemplates(allTemplates.filter(item => item._id !== editId));

                document.querySelector('#deleteRecordModal .btn-close')?.click();
            }

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };


    const downloadCSV = () => {
        const headers = ['#', 'Name', 'Role', 'Email', 'Is Verified', 'Status', 'Created At'];
        const rows = filteredUsers.map((user, index) => [
            index + 1,
            user.name,
            user.role?.name || 'N/A',
            user.email,
            user.isVerified ? 'Verified' : 'Not Verified',
            user.status === 'active' ? 'Active' : 'Inactive',
            new Date(user.createdAt).toLocaleDateString()
        ]);
        const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div className="nxl-content">
                <>
                    <div className="page-header">
                        <div className="page-header-left d-flex align-items-center">
                            <div className="page-header-title">
                                <h5 className="m-b-10">Invoice Templates</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="index.html">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item">Invoice Templates</li>
                            </ul>
                        </div>
                        <div className="page-header-right ms-auto">
                            <div className="page-header-right-items">
                                <div className="d-flex d-md-none">
                                    <a
                                        href="javascript:void(0)"
                                        className="page-header-right-close-toggle"
                                    >
                                        <i className="feather-arrow-left me-2" />
                                        <span>Back</span>
                                    </a>
                                </div>
                                <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
                                    <a
                                        href="javascript:void(0);"
                                        className="btn btn-icon btn-light-brand"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne"
                                    >
                                        <i className="feather-bar-chart" />
                                    </a>

                                    {canCreateInvoiceTemplate && (
                                        <a
                                            href="#"
                                            className="btn btn-primary"
                                            data-bs-toggle="modal"
                                            id="create-btn"
                                            data-bs-target="#categoryModal"
                                            onClick={() =>
                                                document.body.classList.remove("pace-done", "modal-open")
                                            }
                                        >
                                            <i className="feather-plus me-2" />
                                            <span>Create Invoice template</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="d-md-none d-flex align-items-center">
                                <a href="javascript:void(0)" className="page-header-right-open-toggle">
                                    <i className="feather-align-right fs-20" />
                                </a>
                            </div>
                        </div>
                    </div>

                </>

                <div className="main-content">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="card">
                                <div className="card-body p-0">
                                   
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="card">
                                <div className="card-body p-0">
                                   
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="card">
                                <div className="card-body p-0">
                                   
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="card">
                                <div className="card-body p-0">
                                    
                           
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <div className="modal fade" id="categoryModal" tabIndex={-1} aria-hidden="true" >
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">

                        {/* ===== HEADER ===== */}
                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">
                                    Create Category
                                </h4>
                                <small className="text-white-50">
                                    Manage restaurant menu categories
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        {/* ===== BODY ===== */}
                        <div className="modal-body p-4 bg-body-tertiary">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body">

                                    <h6 className="fw-semibold mb-3 text-primary">
                                        Category Details
                                    </h6>

                                    <div className="row g-3">

                                        {/* Template Name */}
                                        <div className="col-md-6">
                                            <label className="form-label">Template Name *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="Classic Bill, Modern GST Bill"
                                                name="name"
                                                value={templateData.name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Template Code */}
                                        <div className="col-md-6">
                                            <label className="form-label">Template Code *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="CLASSIC_BILL"
                                                name="code"
                                                value={templateData.code}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="col-md-12">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                rows="2"
                                                className="form-control"
                                                placeholder="Short template description"
                                                name="description"
                                                value={templateData.description}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Preview Image */}
                                        <div className="col-md-6">
                                            <label className="form-label">Preview Image</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                name="file"
                                                onChange={handleFileChange}
                                            />
                                        </div>

                                        {filePreview && (
                                            <div className="mt-3 text-center">
                                                <img
                                                    src={filePreview}
                                                    alt="Preview"
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: "120px" }}
                                                />
                                            </div>
                                        )}

                                        {/* Status */}
                                        <div className="col-md-3">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select"
                                                name="isActive"
                                                value={templateData.isActive}
                                                onChange={handleChange}
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        </div>

                                        {/* Default Template */}
                                        <div className="col-md-3">
                                            <label className="form-label d-block">Default Template</label>
                                            <div className="form-check form-switch mt-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name="isDefault"
                                                    checked={templateData.isDefault}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Set as Default
                                                </label>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* ===== FOOTER ===== */}
                        <div className="modal-footer bg-white px-4 py-3">
                            <button
                                className="btn btn-light rounded-3"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-dark rounded-3 px-4"
                                onClick={handleSubmit}
                            >
                                Save Category
                            </button>
                        </div>

                    </div>
                </div>
            </div>


            <div className="modal fade" id="categoryModalEdit" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">


                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">
                                    Update Category
                                </h4>
                                <small className="text-white-50">
                                    Manage restaurant menu categories
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        {/* ===== BODY ===== */}
                        <div className="modal-body p-4 bg-body-tertiary">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body">

                                    <h6 className="fw-semibold mb-3 text-primary">
                                        Category Details
                                    </h6>

                                    <div className="row g-3">

                                        {/* Template Name */}
                                        <div className="col-md-6">
                                            <label className="form-label">Template Name *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="name"
                                                value={templateData.name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Template Code */}
                                        <div className="col-md-6">
                                            <label className="form-label">Template Code *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="code"
                                                value={templateData.code}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="col-md-12">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                rows="2"
                                                className="form-control"
                                                name="description"
                                                value={templateData.description}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Preview Image */}
                                        <div className="col-md-6">
                                            <label className="form-label">Preview Image</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                name="file"
                                                onChange={handleFileChange}
                                            />
                                        </div>

                                        {filePreview && (
                                            <div className="mt-3 text-center">
                                                <img
                                                    src={filePreview}
                                                    alt="Preview"
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: "100px" }}
                                                />
                                            </div>
                                        )}

                                        {/* Status */}
                                        <div className="col-md-3">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select"
                                                name="isActive"
                                                value={templateData.isActive}
                                                onChange={handleChange}
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        </div>

                                        {/* Default Template */}
                                        <div className="col-md-3">
                                            <label className="form-label d-block">Default Template</label>
                                            <div className="form-check form-switch mt-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name="isDefault"
                                                    checked={templateData.isDefault}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Set as Default
                                                </label>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className="modal-footer bg-white px-4 py-3">
                            <button
                                className="btn btn-light rounded-3"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-dark rounded-3 px-4"
                                onClick={handleEditSubmit}
                            >
                                Save Permission
                            </button>
                        </div>

                    </div>
                </div>
            </div>


            <div className="modal fade zoomIn" id="deleteRecordModal" tabIndex={-1} aria-labelledby="deleteRecordLabel" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                id="btn-close"
                            />
                        </div>
                        <div className="modal-body p-5 text-center">
                            <lord-icon
                                src="https://cdn.lordicon.com/gsqxdxog.json"
                                trigger="loop"
                                colors="primary:#405189,secondary:#f06548"
                                style={{ width: 90, height: 90 }}
                            />
                            <div className="mt-4 text-center">
                                <h4 className="fs-semibold">
                                    You are about to delete a lead ?
                                </h4>
                                <p className="text-muted fs-14 mb-4 pt-1">
                                    Deleting your lead will remove all of your information
                                    from our database.
                                </p>
                                <div className="hstack gap-2 justify-content-center remove">
                                    <button
                                        className="btn btn-link link-success fw-medium text-decoration-none"
                                        id="deleteRecord-close"
                                        data-bs-dismiss="modal"
                                    >
                                        <i className="ri-close-line me-1 align-middle" />
                                        Close
                                    </button>
                                    <button className="btn btn-danger" id="delete-record" onClick={handleDeleteTemplate}>
                                        Yes, Delete It!!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}




// {/* <table className="table align-middle table-hover">
//     <thead className="table-light">
//         <tr>
//             <th>#</th>
//             <th>Preview</th>
//             <th>Template Name</th>
//             <th>Code</th>
//             <th>Description</th>
//             <th>Default</th>
//             <th>Status</th>
//             <th>Created At</th>
//             <th>Actions</th>
//         </tr>
//     </thead>

//     <tbody>
//         {allTemplates.length === 0 ? (
//             <tr>
//                 <td colSpan="9" className="text-center text-muted">
//                     No Invoice Templates Found
//                 </td>
//             </tr>
//         ) : (
//             allTemplates.map((template, index) => (
//                 <tr key={template._id}>
//                     {/* Serial */}
//                     <td>{index + 1}</td>

//                     {/* Preview Image */}
//                     <td>
//                         {template.previewImage ? (
//                             <img
//                                 src={`/uploads/invoiceTemplates/${template.previewImage}`}
//                                 alt={template.name}
//                                 style={{
//                                     width: "80px",
//                                     height: "80px",
//                                     objectFit: "cover",
//                                     borderRadius: "6px"
//                                 }}
//                             />
//                         ) : (
//                             <span className="text-muted">No Preview</span>
//                         )}
//                     </td>

//                     {/* Name */}
//                     <td>
//                         <strong>{template.name}</strong>
//                     </td>

//                     {/* Code */}
//                     <td>
//                         <span className="badge bg-primary-subtle text-primary">
//                             {template.code}
//                         </span>
//                     </td>

//                     {/* Description */}
//                     <td>
//                         {template.description || (
//                             <span className="text-muted">N/A</span>
//                         )}
//                     </td>

//                     {/* Default */}
//                     <td>
//                         {template.isDefault ? (
//                             <span className="badge bg-warning text-dark">
//                                 Default
//                             </span>
//                         ) : (
//                             <span className="text-muted">—</span>
//                         )}
//                     </td>

//                     {/* Status */}
//                     <td>
//                         {template.isActive ? (
//                             <span className="badge bg-success-subtle text-success">
//                                 Active
//                             </span>
//                         ) : (
//                             <span className="badge bg-danger-subtle text-danger">
//                                 Inactive
//                             </span>
//                         )}
//                     </td>

//                     {/* Created */}
//                     <td>
//                         {new Date(template.createdAt).toLocaleDateString()}
//                     </td>

//                     {/* Actions */}
//                     <td>
//                         <ul className="list-inline hstack gap-2 mb-0">
//                             {(canEdit || canDelete) ? (
//                                 <>
//                                     {canEdit && (
//                                         <li className="list-inline-item" title="Edit">
//                                             <Link
//                                                 to="#invoiceTemplateModalEdit"
//                                                 data-bs-toggle="modal"
//                                                 className="text-success"
//                                                 onClick={() => {
//                                                     handleEdit(template._id);
//                                                     document.body.classList.remove("modal-open");
//                                                 }}
//                                             >
//                                                 <i className="ri-pencil-fill" />
//                                             </Link>
//                                         </li>
//                                     )}

//                                     {canDelete && (
//                                         <li className="list-inline-item" title="Delete">
//                                             <Link
//                                                 to="#deleteRecordModal"
//                                                 data-bs-toggle="modal"
//                                                 className="text-danger"
//                                                 onClick={() => {
//                                                     setEditId(template._id);
//                                                     document.body.classList.remove("modal-open");
//                                                 }}
//                                             >
//                                                 <i className="ri-delete-bin-fill" />
//                                             </Link>
//                                         </li>
//                                     )}
//                                 </>
//                             ) : (
//                                 <li className="list-inline-item text-muted">
//                                     No Permission
//                                 </li>
//                             )}
//                         </ul>
//                     </td>
//                 </tr>
//             ))
//         )}
//     </tbody>
// </table> */}