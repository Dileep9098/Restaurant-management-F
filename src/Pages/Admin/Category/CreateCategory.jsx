// import React from 'react'

// export default function CreateCategory() {
//   return (
//     <>

//     </>
//   )
// }





import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


export default function CreateCategory() {
    const { user, permissions } = useSelector(state => state.auth)
    console.log(user)
    const canCreateCategory = permissions.includes("categories.create");
    const canEdit = permissions.includes("categories.update");
    const canDelete = permissions.includes("categories.delete");


    const [moduleData, setModuleData] = useState({
        restaurant: user?.restaurant?._id || "",
        name: "",
        slug: "",
        description: "",
        sortOrder: 0,
        isVeg: false,
        isNonVeg: false,
        isActive: true
    });

    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const [getId, setGetId] = useState(null);

    const [allCategory, setAllCategory] = useState([]);
    const [openModules, setOpenModules] = useState({});



    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                // const res = await axiosInstance.get(
                //     Config.END_POINT_LIST["GET_ALL_PERMISSION"],
                //     { withCredentials: true }
                // );
                const [resRole, res] = await Promise.all([
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_CATEGORIES"],
                        { withCredentials: true }
                    ),
                    // axiosInstance.get(
                    //     Config.END_POINT_LIST["GET_ALL_PERMISSION"],
                    //     { withCredentials: true }
                    // )
                ]);
                if (resRole.data.success) {
                    // console.log("Existing Permissions:", res.data.data);
                    setAllCategory(resRole.data.data);
                }

            } catch (err) {

                showErrorMsg(err.response?.data?.message || "Something went wrong");
            }
        };
        fetchPermissions();

    }, [])

    const handleModuleChange = (e) => {
        setModuleData({ ...moduleData, [e.target.name]: e.target.value });
    };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setFilePreview(previewUrl);
        }
    };



    // ===== SUBMIT =====
    const handleSubmit = async () => {
        try {
            if (!moduleData.name.trim()) {
                return showErrorMsg("Category name is required");
            }
            const myForm = new FormData();
            myForm.append("restaurant", moduleData.restaurant);
            myForm.append("name", moduleData.name);
            myForm.append("slug", moduleData.slug);
            myForm.append("description", moduleData.description);
            myForm.append("sortOrder", moduleData.sortOrder);
            myForm.append("isVeg", moduleData.isVeg);
            myForm.append("isNonVeg", moduleData.isNonVeg);
            myForm.append("isActive", moduleData.isActive);
            if (file) {
                myForm.append("file", file);
            }


            const res = await axiosInstance.post(
                Config.END_POINT_LIST["CREATE_CATEGORY"],
                myForm,
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                showSuccessMsg("Category Created Successfully");

                setAllCategory([...allCategory, res.data.data]);

                setModuleData({
                    restaurant: user?.restaurant?._id || "",
                    name: "",
                    slug: "",
                    description: "",
                    image: "",
                    sortOrder: 0,
                    isVeg: false,
                    isNonVeg: false,
                    isActive: true

                });
                setFile(null);
                setFilePreview(null);

                document.querySelector('#categoryModal .btn-close')?.click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };


    const handleEdit = (id) => {
        const category = allCategory.find(item => item._id === id);
        if (!category) return;
        document.body.classList.remove("modal-open");

        setGetId(id);

        setModuleData({
            restaurant: category.restaurant,
            name: category.name,
            slug: category.slug || "",
            description: category.description || "",
            image: category.image || "",
            sortOrder: category.sortOrder || 0,
            isVeg: category.isVeg,
            isNonVeg: category.isNonVeg,
            isActive: category.isActive
        });
        setFilePreview(category.image ? `assets/images/categories/${category.image}` : null);
    };


    const handleEditSubmit = async () => {
        try {
            if (!getId) return;
            if (!moduleData.name.trim()) {
                return showErrorMsg("Category name is required");
            }
            const myForm = new FormData();
            myForm.append("restaurant", moduleData.restaurant);
            myForm.append("name", moduleData.name);
            myForm.append("slug", moduleData.slug);
            myForm.append("description", moduleData.description);
            myForm.append("sortOrder", moduleData.sortOrder);
            myForm.append("isVeg", moduleData.isVeg);
            myForm.append("isNonVeg", moduleData.isNonVeg);
            myForm.append("isActive", moduleData.isActive);
            if (file) {
                myForm.append("file", file);
            }



            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST["UPDATE_CATEGORY"]}/${getId}`,
                myForm,
                { withCredentials: true , headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                showSuccessMsg("Category Updated Successfully");

                setAllCategory(
                    allCategory.map(item =>
                        item._id === getId ? res.data.data : item
                    )
                );

                setGetId(null);
                setModuleData({
                    restaurant: user?.restaurant?._id || "",
                    name: "",
                    slug: "",
                    description: "",
                    image: "",
                    sortOrder: 0,
                    isVeg: false,
                    isNonVeg: false,
                    isActive: true
                });

                document.querySelector('#categoryModalEdit .btn-close')?.click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleDeletePermission = async () => {
        try {

            const res = await axiosInstance.delete(
                `${Config.END_POINT_LIST["DELETE_CATEGORY"]}/${getId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Permission Module Deleted Successfully");
                setAllCategory(allCategory.filter(item => item._id !== getId));
                // close modal
                document.querySelector('#deleteRecordModal .btn-close').click();
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
                                <h5 className="m-b-10">Category</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="index.html">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item">category Management</li>
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

                                    {canCreateCategory && (
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
                                            <span>Create Category</span>
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
                        <div className="col-lg-12">
                            <div className="card" id="leadsList">

                                <div className="card stretch stretch-full">
                                    <div className="card-body p-0">
                                        <div className="table-responsive table-card">
                                            <table className="table align-middle table-hover" id="categoryTable">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Images</th>
                                                        <th>Category</th>
                                                        <th>Food Type</th>
                                                        <th>Order</th>
                                                        <th>Status</th>
                                                        <th>Created At</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {allCategory.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="7" className="text-center text-muted">
                                                                No categories found
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        allCategory.map((cat, index) => (
                                                            <tr key={cat._id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    {cat.image ? (
                                                                        <img
                                                                            src={`assets/images/categories/${cat.image}`}
                                                                            alt={cat.name}
                                                                            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
                                                                        />

                                                                    ) : (
                                                                        <span className="text-muted">No Image</span>
                                                                    )}
                                                                </td>

                                                                {/* Category Name */}
                                                                <td>
                                                                    <strong>{cat.name}</strong>
                                                                    {cat.slug && (
                                                                        <div className="text-muted small">/{cat.slug}</div>
                                                                    )}
                                                                </td>

                                                                {/* Food Type */}
                                                                <td>
                                                                    {cat.isVeg && cat.isNonVeg && (
                                                                        <span className="badge bg-info-subtle text-info">Veg & Non-Veg</span>
                                                                    )}
                                                                    {cat.isVeg && !cat.isNonVeg && (
                                                                        <span className="badge bg-success-subtle text-success">Veg</span>
                                                                    )}
                                                                    {!cat.isVeg && cat.isNonVeg && (
                                                                        <span className="badge bg-danger-subtle text-danger">Non-Veg</span>
                                                                    )}
                                                                </td>

                                                                {/* Sort Order */}
                                                                <td>{cat.sortOrder ?? 0}</td>

                                                                {/* Status */}
                                                                <td>
                                                                    {cat.isActive ? (
                                                                        <span className="badge bg-success-subtle text-success">
                                                                            Active
                                                                        </span>
                                                                    ) : (
                                                                        <span className="badge bg-danger-subtle text-danger">
                                                                            Inactive
                                                                        </span>
                                                                    )}
                                                                </td>

                                                                {/* Created At */}
                                                                <td>
                                                                    {new Date(cat.createdAt).toLocaleDateString()}
                                                                </td>

                                                                {/* Actions */}
                                                                <td>
                                                                    <ul className="list-inline hstack gap-2 mb-0">
                                                                        {canEdit || canDelete ? (
                                                                            <>
                                                                                <li className="list-inline-item" title="Edit">
                                                                                    {canEdit && (
                                                                                        <Link
                                                                                            to="#categoryModalEdit"
                                                                                            data-bs-toggle="modal"
                                                                                            className="text-success"
                                                                                            onClick={() => {
                                                                                                handleEdit(cat._id);
                                                                                                document.body.classList.remove("modal-open");
                                                                                            }}
                                                                                        >
                                                                                            <i className="ri-pencil-fill" />
                                                                                        </Link>
                                                                                    )}
                                                                                </li>

                                                                                <li className="list-inline-item" title="Delete">
                                                                                    {canDelete && (
                                                                                        <Link
                                                                                            to="#deleteRecordModal"
                                                                                            data-bs-toggle="modal"
                                                                                            className="text-danger"
                                                                                            onClick={() => { setGetId(cat._id), document.body.classList.remove("modal-open"); }}
                                                                                        >
                                                                                            <i className="ri-delete-bin-fill" />
                                                                                        </Link>
                                                                                    )}
                                                                                </li>
                                                                            </>
                                                                        ) : (
                                                                            <li className="list-inline-item text-muted">
                                                                                No permission to edit or delete
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                </td>

                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>


                                            <div className="noresult" style={{ display: "none" }}>
                                                <div className="text-center">
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/msoeawqm.json"
                                                        trigger="loop"
                                                        colors="primary:#121331,secondary:#08a88a"
                                                        style={{ width: 75, height: 75 }}
                                                    />
                                                    <h5 className="mt-2">Sorry! No Result Found</h5>
                                                    <p className="text-muted mb-0">
                                                        We've searched more than 150+ leads We did not find any
                                                        leads for you search.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end mt-3">
                                            <div className="pagination-wrap hstack gap-2">
                                                <Link className="page-item pagination-prev disabled" to="#">
                                                    Previous
                                                </Link>
                                                <ul className="pagination listjs-pagination mb-0" />
                                                <Link className="page-item pagination-next" to="#">
                                                    Next
                                                </Link>
                                            </div>
                                        </div>

                                    </div>




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

                                        {/* Category Name */}
                                        <div className="col-md-6">
                                            <label className="form-label">Category Name *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="Starters, Main Course"
                                                name="name"
                                                value={moduleData.name}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Slug */}
                                        <div className="col-md-6">
                                            <label className="form-label">Slug (optional)</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="starters"
                                                name="slug"
                                                value={moduleData.slug}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="col-md-12">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                rows="2"
                                                className="form-control"
                                                placeholder="Short category description"
                                                name="description"
                                                value={moduleData.description}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Image */}
                                        <div className="col-md-6">
                                            <label className="form-label">Category Image </label>
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
                                                    alt="Logo Preview"
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: "150px" }}
                                                />
                                            </div>
                                        )}

                                        {/* Sort Order */}
                                        <div className="col-md-3">
                                            <label className="form-label">Sort Order</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="sortOrder"
                                                value={moduleData.sortOrder}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Status */}
                                        <div className="col-md-3">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select"
                                                name="isActive"
                                                value={moduleData.isActive}
                                                onChange={handleModuleChange}
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        </div>

                                        {/* Veg / Non Veg */}
                                        <div className="col-md-6">
                                            <label className="form-label d-block mb-2">
                                                Food Type
                                            </label>

                                            <div className="d-flex gap-4">
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={moduleData.isVeg}
                                                        onChange={(e) =>
                                                            setModuleData({
                                                                ...moduleData,
                                                                isVeg: e.target.checked,
                                                                isNonVeg: e.target.checked ? false : moduleData.isNonVeg
                                                            })
                                                        }
                                                    />
                                                    <label className="form-check-label">Veg</label>
                                                </div>

                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={moduleData.isNonVeg}
                                                        onChange={(e) =>
                                                            setModuleData({
                                                                ...moduleData,
                                                                isNonVeg: e.target.checked,
                                                                isVeg: e.target.checked ? false : moduleData.isVeg
                                                            })
                                                        }
                                                    />
                                                    <label className="form-check-label">Non-Veg</label>
                                                </div>
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

                                        {/* Category Name */}
                                        <div className="col-md-6">
                                            <label className="form-label">Category Name *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="Starters, Main Course"
                                                name="name"
                                                value={moduleData.name}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Slug */}
                                        <div className="col-md-6">
                                            <label className="form-label">Slug (optional)</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="starters"
                                                name="slug"
                                                value={moduleData.slug}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="col-md-12">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                rows="2"
                                                className="form-control"
                                                placeholder="Short category description"
                                                name="description"
                                                value={moduleData.description}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Image */}
                                        <div className="col-md-6">
                                            <label className="form-label">Category Image </label>
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
                                                    alt="Logo Preview"
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: "100px" }}
                                                />
                                            </div>
                                        )}


                                        {/* Sort Order */}
                                        <div className="col-md-3">
                                            <label className="form-label">Sort Order</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="sortOrder"
                                                value={moduleData.sortOrder}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Status */}
                                        <div className="col-md-3">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select"
                                                name="isActive"
                                                value={moduleData.isActive}
                                                onChange={handleModuleChange}
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        </div>

                                        {/* Veg / Non Veg */}
                                        <div className="col-md-6">
                                            <label className="form-label d-block mb-2">
                                                Food Type
                                            </label>

                                            <div className="d-flex gap-4">
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={moduleData.isVeg}
                                                        onChange={(e) =>
                                                            setModuleData({
                                                                ...moduleData,
                                                                isVeg: e.target.checked,
                                                                isNonVeg: e.target.checked ? false : moduleData.isNonVeg
                                                            })
                                                        }
                                                    />
                                                    <label className="form-check-label">Veg</label>
                                                </div>

                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={moduleData.isNonVeg}
                                                        onChange={(e) =>
                                                            setModuleData({
                                                                ...moduleData,
                                                                isNonVeg: e.target.checked,
                                                                isVeg: e.target.checked ? false : moduleData.isVeg
                                                            })
                                                        }
                                                    />
                                                    <label className="form-check-label">Non-Veg</label>
                                                </div>
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
                                    <button className="btn btn-danger" id="delete-record" onClick={handleDeletePermission}>
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

