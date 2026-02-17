
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
import { Link } from "react-router-dom";
import "./roleModule.css"

const DEFAULT_ACTIONS = ["view", "create", "update", "delete"];

export default function PermissionManage() {

    const [moduleData, setModuleData] = useState({
        module: "",
        moduleLabel: "",
        submenus: [],
        icon: ""
    });
    const [permissionList, setPermissionList] = useState([])
    const [getId, setGetId] = useState('');



    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const res = await axiosInstance.get(
                    Config.END_POINT_LIST["GET_ALL_PERMISSION"],
                    { withCredentials: true }
                );
                if (res.data.success) {
                    console.log("Existing Permissions:", res.data.data);
                    setPermissionList(res.data.data);
                }

            } catch (err) {

                showErrorMsg(err.response?.data?.message || "Something went wrong");
            }
        };
        fetchPermissions();

    }, [])

    // ===== MODULE =====
    const handleModuleChange = (e) => {
        setModuleData({ ...moduleData, [e.target.name]: e.target.value });
    };

    // ===== ADD SUBMENU (AUTO CRUD) =====
    const addSubmenu = () => {
        setModuleData({
            ...moduleData,
            submenus: [
                ...moduleData.submenus,
                {
                    name: "",
                    label: "",
                    actions: []
                }
            ]
        });
    };

    const handleSubmenuChange = (index, field, value) => {
        const updated = [...moduleData.submenus];
        updated[index][field] = value;

        // 🔥 Auto generate CRUD actions when submenu name entered
        if (field === "name") {
            updated[index].actions = DEFAULT_ACTIONS.map(action => ({
                key: `${value}.${action}`,
                label: action.toUpperCase()
            }));
        }

        setModuleData({ ...moduleData, submenus: updated });
    };

    // ===== REMOVE ACTION =====
    const removeAction = (submenuIndex, actionIndex) => {
        const updated = [...moduleData.submenus];
        updated[submenuIndex].actions.splice(actionIndex, 1);
        setModuleData({ ...moduleData, submenus: updated });
    };

    // ===== REMOVE SUBMENU =====
    const removeSubmenu = (index) => {
        setModuleData({
            ...moduleData,
            submenus: moduleData.submenus.filter((_, i) => i !== index)
        });
    }
    // ===== SUBMIT =====
    const handleSubmit = async () => {
        try {
            debugger

            const res = await axiosInstance.post(
                Config.END_POINT_LIST["CREATE_PERMISSION"],
                moduleData,
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Permission Module Created Successfully");
                setModuleData({ module: "", moduleLabel: "", submenus: [] });
                setPermissionList([...permissionList, res.data.data]);
                // module close 
                document.querySelector('#permissionModal .btn-close').click();

            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };


    const handleEdit = async (id) => {
        console.log(id)
        setGetId(id)
        document.body.classList.remove('modal-open')


        try {
            const permission = permissionList.find(item => item._id === id);
            if (permission) {
                setModuleData({
                    module: permission.module,
                    moduleLabel: permission.moduleLabel,
                    submenus: permission.submenus,
                    icon: permission.icon || "",
                });
            }


        } catch (error) {
            console.log(error);
        }
    };

    const handleEditSubmit = async () => {
        try {
            debugger
            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST["UPDATE_PERMISSION"]}/${getId}`,
                moduleData,
                { withCredentials: true }
            );
            if (res.data.success) {
                showSuccessMsg("Permission Module Updated Successfully");
                setModuleData({ module: "", moduleLabel: "", submenus: [], icon: "" });
                setPermissionList(permissionList.map(item => item._id === getId ? res.data.data : item));
                //  data-bs-dismiss="modal"
                // close modal

                document.querySelector('#permissionModalEdit .btn-close').click();
            }

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleDeletePermission = async () => {
        try {
            const res = await axiosInstance.delete(
                `${Config.END_POINT_LIST["DELETE_PERMISSION"]}/${getId}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                showSuccessMsg("Permission Module Deleted Successfully");
                setPermissionList(permissionList.filter(item => item._id !== getId));
                // close modal
                document.querySelector('#deleteRecordModal .btn-close').click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };



    const isValidIcon = (icon) => {
        const remixRegex = /^ri-[a-z0-9-]+-(line|fill)$/;
        const faRegex = /^fa-(solid|regular|brands)\sfa-[a-z0-9-]+$/;

        return remixRegex.test(icon) || faRegex.test(icon);
    };

    // Export functions
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
                {/* [ page-header ] start */}
                <>
                    <div className="page-header">
                        <div className="page-header-left d-flex align-items-center">
                            <div className="page-header-title">
                                <h5 className="m-b-10">Permission Manage</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="index.html">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item">Permission Management</li>
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
               
                                    <a href="#" className="btn btn-primary" data-bs-toggle="modal"
                                        id="create-btn"
                                        data-bs-target="#permissionModal"
                                        onClick={() => document.body.classList.remove('pace-done', 'modal-open')}>
                                        <i className="feather-plus me-2" />
                                        <span> Create Permission</span>
                                    </a>
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
                                            <table className="table align-middle table-hover" id="customerTable">
                                            <thead className="table-light">
                                                <tr>

                                                    <th className="sort" data-sort="#">#</th>
                                                    <th className="sort" data-sort="module">Module</th>
                                                    <th className="sort" data-sort="submenu">Submenu</th>
                                                    <th className="sort" data-sort="action">Actions</th>
                                                    <th className="sort" data-sort="status">Status</th>
                                                    <th className="sort" data-sort="createAt">Created At</th>
                                                    <th></th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {permissionList.map((permission, pIndex) => {
                                                    const hasSubmenus = permission.submenus && permission.submenus.length > 0;

                                                    const submenus = hasSubmenus
                                                        ? permission.submenus
                                                        : [{ label: "No Submenu", name: "-", actions: [] }];

                                                    return submenus.map((submenu, sIndex) => (
                                                        <tr key={`${permission._id}-${sIndex}`}>

                                                            {sIndex === 0 && (
                                                                <td rowSpan={submenus.length}>
                                                                    {pIndex + 1}
                                                                </td>
                                                            )}

                                                            {sIndex === 0 && (
                                                                <td rowSpan={submenus.length}>
                                                                    <div>
                                                                        <strong>{permission.moduleLabel}</strong>
                                                                        <div className="text-muted fs-12">
                                                                            {permission.module}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            )}

                                                            <td>
                                                                <span className="fw-semibold">{submenu.label}</span>
                                                                <div className="text-muted fs-12">
                                                                    {submenu.name}
                                                                </div>
                                                            </td>

                                                            <td>
                                                                {submenu.actions.length > 0 ? (
                                                                    submenu.actions.map((action, aIndex) => (
                                                                        <span
                                                                            key={aIndex}
                                                                            className="badge bg-primary-subtle text-primary me-1 mb-1"
                                                                        >
                                                                            {action.label}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-muted fs-12">No Actions</span>
                                                                )}
                                                            </td>

                                                            {sIndex === 0 && (
                                                                <td rowSpan={submenus.length}>
                                                                    {permission.isActive ? (
                                                                        <span className="badge bg-success-subtle text-success">
                                                                            Active
                                                                        </span>
                                                                    ) : (
                                                                        <span className="badge bg-danger-subtle text-danger">
                                                                            Inactive
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            )}

                                                            {sIndex === 0 && (
                                                                <td rowSpan={submenus.length}>
                                                                    {new Date(permission.createdAt).toLocaleDateString()}
                                                                </td>
                                                            )}

                                                            {sIndex === 0 && (
                                                                <td rowSpan={submenus.length}>
                                                                    <ul className="list-inline hstack gap-2 mb-0">
                                                                        <li className="list-inline-item">
                                                                            <Link to="javascript:void(0);" style={{ color: "blue", fontSize: "16px" }}>
                                                                                <i className="ri-eye-fill" />
                                                                            </Link>
                                                                        </li>
                                                                        <li className="list-inline-item">
                                                                            <Link
                                                                                to="#permissionModalEdit"
                                                                                data-bs-toggle="modal"
                                                                                onClick={() => handleEdit(permission._id)}
                                                                                style={{ color: "green", fontSize: "16px" }}
                                                                            >
                                                                                <i className="ri-pencil-fill" />
                                                                            </Link>
                                                                        </li>
                                                                        <li className="list-inline-item">
                                                                            <Link
                                                                                to="#deleteRecordModal"
                                                                                data-bs-toggle="modal"
                                                                                onClick={() => setGetId(permission._id)}
                                                                                style={{ color: "red", fontSize: "16px" }}
                                                                            >
                                                                                <i className="ri-delete-bin-fill" />
                                                                            </Link>
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            )}

                                                        </tr>
                                                    ));
                                                })}

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





            <div className="modal fade" id="permissionModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">

                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">
                                    Permission Architecture
                                </h4>
                                <small className="text-white-50">
                                    Manage modules, submenus & access actions
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
                                        Main Module
                                    </h6>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Module Key</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="basic-data"
                                                name="module"
                                                value={moduleData.module}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Module Label</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="Basic Data"
                                                name="moduleLabel"
                                                value={moduleData.moduleLabel}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Module Icon</label>

                                            <input
                                                className="form-control"
                                                placeholder="ri-dashboard-2-line or fa-solid fa-user"
                                                name="icon"
                                                value={moduleData.icon || ""}
                                                onChange={handleModuleChange}
                                            />

                                            {moduleData.icon && (
                                                <div className="mt-2">
                                                    <span className="text-muted d-block mb-1">Preview:</span>

                                                    {isValidIcon(moduleData.icon) ? (
                                                        <span
                                                            key={moduleData.icon}   // 🔥 VERY IMPORTANT
                                                            className="d-inline-flex align-items-center justify-content-center"
                                                            style={{ fontSize: "24px" }}
                                                        >
                                                            <i className={moduleData.icon}></i>
                                                        </span>
                                                    ) : (
                                                        <span className="text-danger fw-semibold">
                                                            ❌ Invalid icon class
                                                        </span>
                                                    )}
                                                </div>
                                            )}


                                            <small className="text-muted d-block mt-1">
                                                Browse icons here:{" "}
                                                <a
                                                    href="https://remixicon.com/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary"
                                                >
                                                    Remix Icons
                                                </a>{" "}
                                                or{" "}
                                                <a
                                                    href="https://fontawesome.com/icons"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary"
                                                >
                                                    Font Awesome
                                                </a>
                                            </small>
                                        </div>



                                    </div>
                                </div>
                            </div>

                            {moduleData.submenus.map((submenu, sIndex) => (
                                <div
                                    key={sIndex}
                                    className="card border-0 shadow-sm rounded-4 mb-3"
                                >
                                    <div className="card-body">

                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-semibold mb-0">
                                                Submenu #{sIndex + 1}
                                            </h6>

                                            <button
                                                className="btn btn-sm btn-outline-danger rounded-pill"
                                                onClick={() => removeSubmenu(sIndex)}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Submenu Key</label>
                                                <input
                                                    className="form-control"
                                                    placeholder="discount"
                                                    value={submenu.name}
                                                    onChange={(e) =>
                                                        handleSubmenuChange(sIndex, "name", e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Submenu Label</label>
                                                <input
                                                    className="form-control"
                                                    placeholder="Discount"
                                                    value={submenu.label}
                                                    onChange={(e) =>
                                                        handleSubmenuChange(sIndex, "label", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="form-label fw-semibold mb-2">
                                                Access Actions
                                            </label>

                                            <div className="d-flex flex-wrap gap-2">
                                                {submenu.actions.map((action, aIndex) => (
                                                    <span
                                                        key={aIndex}
                                                        className="badge rounded-pill bg-white border text-dark px-3 py-2 d-flex align-items-center gap-2"
                                                    >
                                                        <span className="fw-medium">
                                                            {action.label}
                                                        </span>
                                                        <small className="text-muted">
                                                            {action.key}
                                                        </small>

                                                        <button
                                                            className="btn btn-sm p-0 text-danger"
                                                            onClick={() => removeAction(sIndex, aIndex)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}

                            <button
                                className="btn btn-outline-dark w-100 rounded-3 py-2"
                                onClick={addSubmenu}
                            >
                                + Add Submenu
                            </button>

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
                                onClick={handleSubmit}
                                data-bs-dismiss="modal"
                            >
                                Save Permission
                            </button>
                        </div>

                    </div>
                </div>
            </div>


            <div className="modal fade" id="permissionModalEdit" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">

                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">
                                    Permission Architecture Edit
                                </h4>
                                <small className="text-white-50">
                                    Manage modules, submenus & access actions
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
                                        Main Module
                                    </h6>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Module Key</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="basic-data"
                                                name="module"
                                                value={moduleData.module}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Module Label</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="Basic Data"
                                                name="moduleLabel"
                                                value={moduleData.moduleLabel}
                                                onChange={handleModuleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Module Icon</label>

                                            <input
                                                className="form-control"
                                                placeholder="ri-dashboard-2-line or fa-solid fa-user"
                                                name="icon"
                                                value={moduleData.icon || ""}
                                                onChange={handleModuleChange}
                                            />

                                            {moduleData.icon && (
                                                <div className="mt-2">
                                                    <span className="text-muted d-block mb-1">Preview:</span>

                                                    {isValidIcon(moduleData.icon) ? (
                                                        <span
                                                            key={moduleData.icon}   // 🔥 VERY IMPORTANT
                                                            className="d-inline-flex align-items-center justify-content-center"
                                                            style={{ fontSize: "24px" }}
                                                        >
                                                            <i className={moduleData.icon}></i>
                                                        </span>
                                                    ) : (
                                                        <span className="text-danger fw-semibold">
                                                            ❌ Invalid icon class
                                                        </span>
                                                    )}
                                                </div>
                                            )}


                                            <small className="text-muted d-block mt-1">
                                                Browse icons here:{" "}
                                                <a
                                                    href="https://remixicon.com/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary"
                                                >
                                                    Remix Icons
                                                </a>{" "}
                                                or{" "}
                                                <a
                                                    href="https://fontawesome.com/icons"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary"
                                                >
                                                    Font Awesome
                                                </a>
                                            </small>
                                        </div>


                                    </div>
                                </div>
                            </div>

                            {moduleData.submenus.map((submenu, sIndex) => (
                                <div
                                    key={sIndex}
                                    className="card border-0 shadow-sm rounded-4 mb-3"
                                >
                                    <div className="card-body">

                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-semibold mb-0">
                                                Submenu #{sIndex + 1}
                                            </h6>

                                            <button
                                                className="btn btn-sm btn-outline-danger rounded-pill"
                                                onClick={() => removeSubmenu(sIndex)}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Submenu Key</label>
                                                <input
                                                    className="form-control"
                                                    placeholder="discount"
                                                    value={submenu.name}
                                                    onChange={(e) =>
                                                        handleSubmenuChange(sIndex, "name", e.target.value)
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Submenu Label</label>
                                                <input
                                                    className="form-control"
                                                    placeholder="Discount"
                                                    value={submenu.label}
                                                    onChange={(e) =>
                                                        handleSubmenuChange(sIndex, "label", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="form-label fw-semibold mb-2">
                                                Access Actions
                                            </label>

                                            <div className="d-flex flex-wrap gap-2">
                                                {submenu.actions.map((action, aIndex) => (
                                                    <span
                                                        key={aIndex}
                                                        className="badge rounded-pill bg-white border text-dark px-3 py-2 d-flex align-items-center gap-2"
                                                    >
                                                        <span className="fw-medium">
                                                            {action.label}
                                                        </span>
                                                        <small className="text-muted">
                                                            {action.key}
                                                        </small>

                                                        <button
                                                            className="btn btn-sm p-0 text-danger"
                                                            onClick={() => removeAction(sIndex, aIndex)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}

                            <button
                                className="btn btn-outline-dark w-100 rounded-3 py-2"
                                onClick={addSubmenu}
                            >
                                + Add Submenu
                            </button>

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






//  <table className="table align-middle" id="customerTable">
//                                             <thead className="table-light">
//                                                 <tr>
//                                                     <th scope="col" style={{ width: 50 }}>
//                                                         <div className="form-check">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="checkbox"
//                                                                 id="checkAll"
//                                                                 defaultValue="option"
//                                                             />
//                                                         </div>
//                                                     </th>
//                                                     <th className="sort" data-sort="name">
//                                                         Name
//                                                     </th>
//                                                     <th className="sort" data-sort="company_name">
//                                                         Company
//                                                     </th>
//                                                     <th className="sort" data-sort="leads_score">
//                                                         Leads Score
//                                                     </th>
//                                                     <th className="sort" data-sort="phone">
//                                                         Phone
//                                                     </th>
//                                                     <th className="sort" data-sort="location">
//                                                         Location
//                                                     </th>
//                                                     <th className="sort" data-sort="tags">
//                                                         Tags
//                                                     </th>
//                                                     <th className="sort" data-sort="date">
//                                                         Create Date
//                                                     </th>
//                                                     <th className="sort" data-sort="action">
//                                                         Action
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className="list form-check-all">
//                                                 <tr>
//                                                     <th scope="row">
//                                                         <div className="form-check">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="checkbox"
//                                                                 name="chk_child"
//                                                                 defaultValue="option1"
//                                                             />
//                                                         </div>
//                                                     </th>
//                                                     <td className="id" style={{ display: "none" }}>
//                                                         <Link
//                                                             to="javascript:void(0);"
//                                                             className="fw-medium link-primary"
//                                                         >
//                                                             #VZ2101
//                                                         </Link>
//                                                     </td>
//                                                     <td>
//                                                         <div className="d-flex align-items-center">
//                                                             <div className="flex-shrink-0">
//                                                                 <img
//                                                                     src="assets/images/users/avatar-10.jpg"
//                                                                     alt=""
//                                                                     className="avatar-xxs rounded-circle image_src object-fit-cover"
//                                                                 />
//                                                             </div>
//                                                             <div className="flex-grow-1 ms-2 name">Tonya Noble</div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="company_name">Force Medicines</td>
//                                                     <td className="leads_score">147</td>
//                                                     <td className="phone">580-464-4694</td>
//                                                     <td className="location">Los Angeles, USA</td>
//                                                     <td className="tags">
//                                                         <span className="badge bg-primary-subtle text-primary">
//                                                             Lead
//                                                         </span>
//                                                         <span className="badge bg-primary-subtle text-primary">
//                                                             Partner
//                                                         </span>
//                                                     </td>
//                                                     <td className="date">07 Apr, 2021</td>
//                                                     <td>
//                                                         <ul className="list-inline hstack gap-2 mb-0">

//                                                             <li
//                                                                 className="list-inline-item"
//                                                                 data-bs-toggle="tooltip"
//                                                                 data-bs-trigger="hover"
//                                                                 data-bs-placement="top"
//                                                                 title="View"

//                                                             >
//                                                                 <Link to="javascript:void(0);" style={{ color: "blue", fontSize: "16px" }}>
//                                                                     <i className="ri-eye-fill align-bottom " />
//                                                                 </Link>
//                                                             </li>
//                                                             <li
//                                                                 className="list-inline-item"
//                                                                 data-bs-toggle="tooltip"
//                                                                 data-bs-trigger="hover"
//                                                                 data-bs-placement="top"
//                                                                 title="Edit"
//                                                             >
//                                                                 <Link
//                                                                     className="edit-item-btn"
//                                                                     to="#showModal"
//                                                                     data-bs-toggle="modal"
//                                                                     style={{ color: "green", fontSize: "16px" }}
//                                                                 >
//                                                                     <i className="ri-pencil-fill align-bottom " />
//                                                                 </Link>
//                                                             </li>
//                                                             <li
//                                                                 className="list-inline-item"
//                                                                 data-bs-toggle="tooltip"
//                                                                 data-bs-trigger="hover"
//                                                                 data-bs-placement="top"
//                                                                 title="Delete"
//                                                             >
//                                                                 <Link
//                                                                     className="remove-item-btn"
//                                                                     data-bs-toggle="modal"
//                                                                     to="#deleteRecordModal"
//                                                                     style={{ color: "red", fontSize: "16px" }}
//                                                                 >
//                                                                     <i className="ri-delete-bin-fill align-bottom " />
//                                                                 </Link>
//                                                             </li>
//                                                         </ul>
//                                                     </td>
//                                                 </tr>
//                                             </tbody>
//                                         </table> 

