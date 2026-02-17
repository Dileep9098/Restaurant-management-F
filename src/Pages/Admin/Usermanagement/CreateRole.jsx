
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


export default function CreateRole() {
    const{user}=useSelector(state=>state.auth)
    console.log(user)

    const [moduleData, setModuleData] = useState({
        name: "",
        isActive: true,
        restaurant: user?.restaurant._id || ""
    });
    const [roleList, setRoleList] = useState([]);
    const [getId, setGetId] = useState('');
    const [openModules, setOpenModules] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState([]);



    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                // const res = await axiosInstance.get(
                //     Config.END_POINT_LIST["GET_ALL_PERMISSION"],
                //     { withCredentials: true }
                // );
                const [resRole, res] = await Promise.all([
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_ROLES"],
                        { withCredentials: true }
                    ),
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_PERMISSION"],
                        { withCredentials: true }
                    )
                ]);
                if (res.data.success) {
                    console.log("Existing Permissions:", res.data.data);
                    setRoleList(resRole.data.data);
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


    // ===== SUBMIT =====
    const handleSubmit = async () => {
        try {

            console.log(moduleData, selectedPermissions)

            const res = await axiosInstance.post(
                Config.END_POINT_LIST["CREATE_ROLE"],
                {
                    name: moduleData.name,
                    isActive: moduleData.isActive,
                    restaurant: moduleData.restaurant,
                },
                { withCredentials: true }
            );
            if (res.data.success) {
                showSuccessMsg("Role Created Successfully");
                setModuleData({ name: "", isActive: true , restaurant: user?.restaurant._id || ""});
                setSelectedPermissions([]);
                setRoleList([...roleList, res.data.data]);
                // module close
                document.querySelector('#permissionModal .btn-close').click();
            }
            // }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };


    const handleEdit = async (id) => {
        console.log(id)
        setGetId(id)
        document.body.classList.remove('modal-open')


        try {
            const role = roleList.find(item => item._id === id);
            debugger
            if (role) {
                setModuleData({
                    name: role.name,
                    isActive: role.isActive,
                    restaurant: role.restaurant || ""
                });
                setSelectedPermissions(role.permissions);
            }


        } catch (error) {
            console.log(error);
        }
    };

    const handleEditSubmit = async () => {
        try {
            debugger
            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST["UPDATE_ROLE"]}/${getId}`,
                {

                    name: moduleData.name,
                    isActive: moduleData.isActive,
                    restaurant: moduleData.restaurant,},
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Role Updated Successfully");
                setModuleData({ name: "", isActive: true , restaurant: user?.restaurant._id || ""});
                setRoleList(roleList.map(item => item._id === getId ? res.data.data : item));
                // close modal
                document.querySelector('#permissionModalEdit .btn-close').click();
            }
            // const res = await axiosInstance.put(
            //     `${Config.END_POINT_LIST["UPDATE_PERMISSION"]}/${getId}`,
            //     moduleData,
            //     { withCredentials: true }
            // );
            // if (res.data.success) {
            //     showSuccessMsg("Permission Module Updated Successfully");
            //     setModuleData({ module: "", moduleLabel: "", submenus: [] });
            //     setPermissionList(permissionList.map(item => item._id === getId ? res.data.data : item));


            //     document.querySelector('#permissionModalEdit .btn-close').click();
            // }

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleDeletePermission = async () => {
        try {

            const res = await axiosInstance.delete(
                `${Config.END_POINT_LIST["DELETE_ROLE"]}/${getId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Permission Module Deleted Successfully");
                setRoleList(roleList.filter(item => item._id !== getId));
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
                                <h5 className="m-b-10">Role Manage</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="index.html">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item">User Management</li>
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
                                        <span> Assign Permission</span>
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
                                                        <th>#</th>
                                                        <th>Role</th>
                                                        <th>Status</th>
                                                        <th>Created At</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {roleList.map((role, index) => (
                                                        <tr key={role._id}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <strong>{role.name}</strong>
                                                            </td>

                                                           

                                                            {/* Status */}
                                                            <td>
                                                                {role.isActive ? (
                                                                    <span className="badge bg-success-subtle text-success">Active</span>
                                                                ) : (
                                                                    <span className="badge bg-danger-subtle text-danger">Inactive</span>
                                                                )}
                                                            </td>

                                                            {/* Created At */}
                                                            <td>{new Date(role.createdAt).toLocaleDateString()}</td>

                                                            {/* Actions */}
                                                            <td>
                                                                <ul className="list-inline hstack gap-2 mb-0">
                                                                    <li className="list-inline-item" title="View">
                                                                        <Link to="#" style={{ color: "blue", fontSize: "16px" }}>
                                                                            <i className="ri-eye-fill align-bottom" />
                                                                        </Link>
                                                                    </li>
                                                                    <li className="list-inline-item" title="Edit">
                                                                        <Link to="#permissionModalEdit" data-bs-toggle="modal" style={{ color: "green", fontSize: "16px" }} onClick={() => handleEdit(role._id)}>
                                                                            <i className="ri-pencil-fill align-bottom" />
                                                                        </Link>
                                                                    </li>
                                                                    <li className="list-inline-item" title="Delete">
                                                                        <Link to="#deleteRecordModal" data-bs-toggle="modal" style={{ color: "red", fontSize: "16px" }} onClick={() => { setGetId(role._id); document.body.classList.remove('modal-open') }}>
                                                                            <i className="ri-delete-bin-fill align-bottom" />
                                                                        </Link>
                                                                    </li>
                                                                </ul>
                                                            </td>
                                                        </tr>
                                                    ))}
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
                <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">

                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">

                                    Role Architecture
                                </h4>
                                <small className="text-white-50">
                                    Manage role, create & give actions permission
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
                                        Role Details
                                    </h6>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Role Name</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="Admin, Manager, User"
                                                name="name"
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="isActive"
                                                onChange={handleModuleChange}
                                            >
                                                <option value="">Select Status</option>
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        </div>
                                      
                                    </div>

                                    <div>

                                    


                                    </div>


                                </div>
                            </div>



                        </div>

                        <div className="modal-footer bg-white px-4 py-3">
                            <button className="btn btn-light rounded-3" data-bs-dismiss="modal" >
                                Cancel
                            </button>

                            <button className="btn btn-dark rounded-3 px-4" onClick={handleSubmit} data-bs-dismiss="modal" >
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

                                    Role Architecture
                                </h4>
                                <small className="text-white-50">
                                    Manage role, create & give actions permission
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
                                        Role Details
                                    </h6>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Role Name</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="Admin, Manager, User"
                                                name="name"
                                                value={moduleData.name}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="isActive"
                                                value={moduleData.isActive}
                                                onChange={handleModuleChange}
                                            >
                                                <option value="">Select Status</option>
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>

                                     


                                        {/* <pre className="mt-3 bg-light p-2 small">
                                            {JSON.stringify(selectedPermissions, null, 2)}
                                        </pre> */}

                                    </div>


                                </div>
                            </div>

                            {/* Additional form fields for permissions can be added here */}


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

