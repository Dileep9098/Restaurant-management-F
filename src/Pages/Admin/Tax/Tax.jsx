
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


export default function Tax() {
    const { user, permissions } = useSelector(state => state.auth)
    console.log(user)
    const canCreateCategory = permissions.includes("categories.create");
    const canEdit = permissions.includes("categories.update");
    const canDelete = permissions.includes("categories.delete");

    const [taxData, setTaxData] = useState({
        restaurant: user?.restaurant?._id || "",
        name: "",          // e.g. GST 5%
        percent: 0,        // e.g. 5
        appliesTo: "ALL",  // VEG | NON_VEG | ALL
        isActive: true
    });


    const [getId, setGetId] = useState(null);

    const [allTax, setAllTax] = useState([]);
    const [openModules, setOpenModules] = useState({});



    useEffect(() => {
        const fetchAllTax = async () => {
            try {

                const [resTax, res] = await Promise.all([
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_TAXES"],
                        { withCredentials: true }
                    ),

                ]);
                if (resTax.data.success) {
                    // console.log("Existing Permissions:", res.data.data);
                    setAllTax(resTax.data.data);
                }

            } catch (err) {

                showErrorMsg(err.response?.data?.message || "Something went wrong");
            }
        };
        fetchAllTax();

    }, [])

    const handleModuleChange = (e) => {
        setTaxData({ ...taxData, [e.target.name]: e.target.value });
    };




    // ===== SUBMIT =====
    const handleSubmit = async () => {
        try {
            if (!taxData.name.trim()) {
                return showErrorMsg("Category name is required");
            }

            const res = await axiosInstance.post(
                Config.END_POINT_LIST["CREATE_TAX"],
                taxData,
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Category Created Successfully");

                setAllTax([...allTax, res.data.data]);

                setTaxData({
                    restaurant: user?.restaurant?._id || "",
                    name: "",
                    percent: null,
                    appliesTo: "",
                    isActive: true

                });


                document.querySelector('#categoryModal .btn-close')?.click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };


    const handleEdit = (id) => {
        const taxes = allTax.find(item => item._id === id);
        if (!taxes) return;
        document.body.classList.remove("modal-open");

        setGetId(id);

        setTaxData({
            restaurant: taxes.restaurant,
            name: taxes.name,
            percent: taxes.percent,
            appliesTo: taxes.appliesTo,
            isActive: taxes.isActive

        });
    };


    const handleEditSubmit = async () => {
        try {
            if (!getId) return;
            if (!taxData.name.trim()) {
                return showErrorMsg("Tax name is required");
            }
            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST["UPDATE_TAX"]}/${getId}`,
                taxData,
                { withCredentials: true, }
            );

            if (res.data.success) {
                showSuccessMsg("Tax Details Updated Successfully");

                setAllTax(
                    allTax.map(item =>
                        item._id === getId ? res.data.data : item
                    )
                );

                setGetId(null);
                setTaxData({
                    restaurant: user?.restaurant?._id || "",
                    name: "",
                    percent: null,
                    appliesTo: "",
                    isActive: true

                });

                document.querySelector('#taxModalEdit .btn-close')?.click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleDeletePermission = async () => {
        try {

            const res = await axiosInstance.delete(
                `${Config.END_POINT_LIST["DELETE_TAX"]}/${getId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Tax Detail Deleted Successfully");
                setAllTax(allTax.filter(item => item._id !== getId));
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
                                <h5 className="m-b-10">Tax</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="index.html">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item">Tax Management</li>
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
                                            <span>Add Tax</span>
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
                                            <table className="table align-middle table-hover" id="taxTable">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Tax Name</th>
                                                        <th>Percent (%)</th>
                                                        <th>Applies To</th>
                                                        <th>Status</th>
                                                        <th>Created At</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {allTax.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="7" className="text-center text-muted">
                                                                No taxes found
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        allTax.map((tax, index) => (
                                                            <tr key={tax._id}>
                                                                <td>{index + 1}</td>

                                                                {/* Tax Name */}
                                                                <td>
                                                                    <strong>{tax.name}</strong>
                                                                </td>

                                                                {/* Percentage */}
                                                                <td>{tax.percent}%</td>

                                                                {/* Applies To */}
                                                                <td>
                                                                    {tax.appliesTo === "ALL" && (
                                                                        <span className="badge bg-info-subtle text-info">
                                                                            All
                                                                        </span>
                                                                    )}
                                                                    {tax.appliesTo === "VEG" && (
                                                                        <span className="badge bg-success-subtle text-success">
                                                                            Veg
                                                                        </span>
                                                                    )}
                                                                    {tax.appliesTo === "NON_VEG" && (
                                                                        <span className="badge bg-danger-subtle text-danger">
                                                                            Non-Veg
                                                                        </span>
                                                                    )}
                                                                </td>

                                                                {/* Status */}
                                                                <td>
                                                                    {tax.isActive ? (
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
                                                                    {new Date(tax.createdAt).toLocaleDateString()}
                                                                </td>

                                                                {/* Actions */}
                                                                <td>
                                                                    <ul className="list-inline hstack gap-2 mb-0">
                                                                        {canEdit || canDelete ? (
                                                                            <>
                                                                                {canEdit && (
                                                                                    <li className="list-inline-item" title="Edit">
                                                                                        <Link
                                                                                            to="#taxModalEdit"
                                                                                            data-bs-toggle="modal"
                                                                                            className="text-success"
                                                                                            onClick={() => {
                                                                                                handleEdit(tax._id);
                                                                                                document.body.classList.remove("modal-open");
                                                                                            }}
                                                                                        >
                                                                                            <i className="ri-pencil-fill" />
                                                                                        </Link>
                                                                                    </li>
                                                                                )}

                                                                                {canDelete && (
                                                                                    <li className="list-inline-item" title="Delete">
                                                                                        <Link
                                                                                            to="#deleteRecordModal"
                                                                                            data-bs-toggle="modal"
                                                                                            className="text-danger"
                                                                                            onClick={() => {
                                                                                                setGetId(tax._id);
                                                                                                document.body.classList.remove("modal-open");
                                                                                            }}
                                                                                        >
                                                                                            <i className="ri-delete-bin-fill" />
                                                                                        </Link>
                                                                                    </li>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <li className="list-inline-item text-muted">
                                                                                No permission
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
                                    Add Texes Details
                                </h4>
                                <small className="text-white-50">
                                    Manage All Taxes Details
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
                                        Tax Details
                                    </h6>

                                    <div className="row g-3">

                                        {/* Tax Name */}
                                        <div className="col-md-6">
                                            <label className="form-label">Tax Name *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="GST 5%"
                                                name="name"
                                                value={taxData.name}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Tax Percentage */}
                                        <div className="col-md-6">
                                            <label className="form-label">Tax Percentage *</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-lg"
                                                placeholder="5"
                                                name="percent"
                                                value={taxData.percent}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Applies To */}
                                        <div className="col-md-6">
                                            <label className="form-label">Applies To</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="appliesTo"
                                                value={taxData.appliesTo}
                                                onChange={handleModuleChange}
                                            >
                                                <option value="ALL">All</option>
                                                <option value="VEG">Veg Only</option>
                                                <option value="NON_VEG">Non-Veg Only</option>
                                            </select>
                                        </div>

                                        {/* Status */}
                                        <div className="col-md-6">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="isActive"
                                                value={taxData.isActive}
                                                onChange={(e) =>
                                                    setTaxData({
                                                        ...taxData,
                                                        isActive: e.target.value === "true"
                                                    })
                                                }
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
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
                                Save Tax Details
                            </button>
                        </div>

                    </div>
                </div>
            </div>


            <div className="modal fade" id="taxModalEdit" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">


                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">
                                    Update Taxes Details
                                </h4>
                                <small className="text-white-50">
                                    Manage All Taxes Details
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
                                        Tax Details
                                    </h6>

                                    <div className="row g-3">

                                        {/* Tax Name */}
                                        <div className="col-md-6">
                                            <label className="form-label">Tax Name *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="GST 5%"
                                                name="name"
                                                value={taxData.name}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Tax Percentage */}
                                        <div className="col-md-6">
                                            <label className="form-label">Tax Percentage *</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-lg"
                                                placeholder="5"
                                                name="percent"
                                                value={taxData.percent}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Applies To */}
                                        <div className="col-md-6">
                                            <label className="form-label">Applies To</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="appliesTo"
                                                value={taxData.appliesTo}
                                                onChange={handleModuleChange}
                                            >
                                                <option value="ALL">All</option>
                                                <option value="VEG">Veg Only</option>
                                                <option value="NON_VEG">Non-Veg Only</option>
                                            </select>
                                        </div>

                                        {/* Status */}
                                        <div className="col-md-6">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="isActive"
                                                value={taxData.isActive}
                                                onChange={(e) =>
                                                    setTaxData({
                                                        ...taxData,
                                                        isActive: e.target.value === "true"
                                                    })
                                                }
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
                                Save Details
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

