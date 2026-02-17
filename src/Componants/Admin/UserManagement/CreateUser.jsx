

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
import "./roleModule.css"
import { useSelector } from "react-redux";

const DEFAULT_ACTIONS = ["view", "create", "update", "delete"];

export default function CreateUser() {
    const { user } = useSelector(state => state.auth)

    const [moduleData, setModuleData] = useState({
        name: "",
        email: "",
        status: "active",
        password: "",
        role: "",
        isVerified: false,
        restaurant: user?.restaurant._id || ""

    });
    const [userList, setUserList] = useState([])
    const [getId, setGetId] = useState('');
    const [roleList, setRoleList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');


    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const [resRole, res] = await Promise.all([
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_ROLES"],
                        { withCredentials: true }
                    ),
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_RESTAURENT_USER"],
                        { withCredentials: true }
                    )
                ]);
                if (res.data.success) {
                    console.log("Existing Permissions:", res.data.data);
                    setUserList(res.data.users);
                    setRoleList(resRole.data.data);
                }

            } catch (err) {

                showErrorMsg(err.response?.data?.message || "Something went wrong");
            }
        };
        fetchUsers();

    }, [])

    const filteredUsers = userList.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesName = !nameFilter || user.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesEmail = !emailFilter || user.email.toLowerCase().includes(emailFilter.toLowerCase());
        const userDate = new Date(user.createdAt);
        const matchesDateFrom = !dateFrom || userDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || userDate <= new Date(dateTo);
        let filterCondition = true;
        if (selectedFilter === 'verified') filterCondition = user.isVerified;
        else if (selectedFilter === 'not-verified') filterCondition = !user.isVerified;
        else if (selectedFilter === 'active') filterCondition = user.status === 'active';
        else if (selectedFilter === 'inactive') filterCondition = user.status === 'inactive';
        return matchesSearch && matchesName && matchesEmail && matchesDateFrom && matchesDateTo && filterCondition;
    });

    const totalUsers = filteredUsers.length;
    const verifiedUsers = filteredUsers.filter(u => u.isVerified).length;
    const notVerifiedUsers = totalUsers - verifiedUsers;
    const activeUsers = filteredUsers.filter(u => u.status === 'active').length;
    const inactiveUsers = totalUsers - activeUsers;

    console.log("User Role", userList)
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
                Config.END_POINT_LIST["CREATE_ADMIN_USER"],
             moduleData,

                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Permission Module Created Successfully");
                setModuleData({ name: "", email: "", password: "", isVerified: false, });
                setUserList([...userList, res.data.user]);
                // module close 
                document.querySelector('#permissionModal .btn-close').click();

            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };


    const handleEdit = async (id) => {
        console.log(id)
        debugger
        setGetId(id)
        document.body.classList.remove('modal-open')

        try {
            const user = userList.find(item => item._id === id);
            if (user) {
                setModuleData({
                    name: user.name,
                    email: user.email,
                    isVerified: user.isVerified,
                    status: user.status,
                    role: user.role._id
                });
            }


        } catch (error) {
            console.log(error);
        }
    };

    const handleEditSubmit = async () => {
        // debugger
        try {
            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST["UPDATE_ADMIN_USER"]}/${getId}`,
                moduleData,
                { withCredentials: true }
            );
            if (res.data.success) {
                showSuccessMsg("Permission Module Updated Successfully");
                setModuleData({ name: "", email: "", password: "", isVerified: false, });
                setUserList(userList.map(item => item._id === getId ? res.data.data : item));
                //  data-bs-dismiss="modal"
                // close modal

                document.querySelector('#userModal .btn-close').click();
            }

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleDeletePermission = async () => {
        try {
            const res = await axiosInstance.delete(
                `${Config.END_POINT_LIST["DELETE_USER"]}/${getId}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                showSuccessMsg("Permission Module Deleted Successfully");
                setUserList(userList.filter(item => item._id !== getId));
                // close modal
                document.querySelector('#deleteRecordModal .btn-close').click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
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
                                <h5 className="m-b-10">User Management</h5>
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
                                    <div className="dropdown">
                                        <a
                                            className="btn btn-icon btn-light-brand"
                                            data-bs-toggle="dropdown"
                                            data-bs-offset="0, 10"
                                            data-bs-auto-close="outside"
                                        >
                                            <i className="feather-filter" />
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('all')}>
                                                <span className="wd-7 ht-7 bg-primary rounded-circle d-inline-block me-3" />
                                                <span>All</span>
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('verified')}>
                                                <span className="wd-7 ht-7 bg-indigo rounded-circle d-inline-block me-3" />
                                                <span>Verified</span>
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('not-verified')}>
                                                <span className="wd-7 ht-7 bg-warning rounded-circle d-inline-block me-3" />
                                                <span>Not Verified</span>
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('active')}>
                                                <span className="wd-7 ht-7 bg-success rounded-circle d-inline-block me-3" />
                                                <span>Active</span>
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('inactive')}>
                                                <span className="wd-7 ht-7 bg-danger rounded-circle d-inline-block me-3" />
                                                <span>Inactive</span>
                                            </a>

                                        </div>
                                    </div>
                                    <div className="dropdown">
                                        <a
                                            className="btn btn-icon btn-light-brand"
                                            data-bs-toggle="dropdown"
                                            data-bs-offset="0, 10"
                                            data-bs-auto-close="outside"
                                        >
                                            <i className="feather-paperclip" />
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => alert('PDF export not implemented yet')}>
                                                <i className="bi bi-filetype-pdf me-3" />
                                                <span>PDF</span>
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={downloadCSV}>
                                                <i className="bi bi-filetype-csv me-3" />
                                                <span>CSV</span>
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => alert('XML export not implemented yet')}>
                                                <i className="bi bi-filetype-xml me-3" />
                                                <span>XML</span>
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => alert('Text export not implemented yet')}>
                                                <i className="bi bi-filetype-txt me-3" />
                                                <span>Text</span>
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => alert('Excel export not implemented yet')}>
                                                <i className="bi bi-filetype-exe me-3" />
                                                <span>Excel</span>
                                            </a>
                                            <div className="dropdown-divider" />
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={handlePrint}>
                                                <i className="bi bi-printer me-3" />
                                                <span>Print</span>
                                            </a>
                                        </div>
                                    </div>
                                    <a href="#" className="btn btn-primary" data-bs-toggle="modal"
                                        id="create-btn"
                                        data-bs-target="#permissionModal"
                                        onClick={() => document.body.classList.remove('pace-done', 'modal-open')}>
                                        <i className="feather-plus me-2" />
                                        <span>Create User</span>
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
                    <div
                        id="collapseOne"
                        className="accordion-collapse collapse page-header-collapse"
                    >
                        <div className="accordion-body pb-2">
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Filter by name"
                                        value={nameFilter}
                                        onChange={(e) => setNameFilter(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Filter by email"
                                        value={emailFilter}
                                        onChange={(e) => setEmailFilter(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        placeholder="From date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        placeholder="To date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xxl-3 col-md-6">
                                    <div className="card stretch stretch-full">
                                        <div className="card-body">
                                            <a href="javascript:void(0);" className="fw-bold d-block">
                                                <span className="d-block">Not Verified</span>
                                                <span className="fs-24 fw-bolder d-block">{notVerifiedUsers}</span>
                                            </a>
                                            <div className="pt-4">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <a
                                                        href="javascript:void(0);"
                                                        className="fs-12 fw-medium text-muted"
                                                    >
                                                        <span>Users Pending Verification</span>
                                                        <i className="feather-link-2 fs-10 ms-1" />
                                                    </a>
                                                    <div>
                                                        <span className="fs-12 text-muted">{totalUsers > 0 ? Math.round((notVerifiedUsers / totalUsers) * 100) : 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="progress mt-2 ht-3">
                                                    <div
                                                        className="progress-bar bg-primary"
                                                        role="progressbar"
                                                        style={{ width: `${totalUsers > 0 ? (notVerifiedUsers / totalUsers) * 100 : 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-md-6">
                                    <div className="card stretch stretch-full">
                                        <div className="card-body">
                                            <a href="javascript:void(0);" className="fw-bold d-block">
                                                <span className="d-block">Active</span>
                                                <span className="fs-24 fw-bolder d-block">{activeUsers}</span>
                                            </a>
                                            <div className="pt-4">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <a
                                                        href="javascript:void(0);"
                                                        className="fs-12 fw-medium text-muted"
                                                    >
                                                        <span>Active Users</span>
                                                        <i className="feather-link-2 fs-10 ms-1" />
                                                    </a>
                                                    <div>
                                                        <span className="fs-12 text-muted">{totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="progress mt-2 ht-3">
                                                    <div
                                                        className="progress-bar bg-success"
                                                        role="progressbar"
                                                        style={{ width: `${totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-md-6">
                                    <div className="card stretch stretch-full">
                                        <div className="card-body">
                                            <a href="javascript:void(0);" className="fw-bold d-block">
                                                <span className="d-block">Inactive</span>
                                                <span className="fs-24 fw-bolder d-block">{inactiveUsers}</span>
                                            </a>
                                            <div className="pt-4">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <a
                                                        href="javascript:void(0);"
                                                        className="fs-12 fw-medium text-muted"
                                                    >
                                                        <span>Inactive Users</span>
                                                        <i className="feather-link-2 fs-10 ms-1" />
                                                    </a>
                                                    <div>
                                                        <span className="fs-12 text-muted">{totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="progress mt-2 ht-3">
                                                    <div
                                                        className="progress-bar bg-warning"
                                                        role="progressbar"
                                                        style={{ width: `${totalUsers > 0 ? (inactiveUsers / totalUsers) * 100 : 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-md-6">
                                    <div className="card stretch stretch-full">
                                        <div className="card-body">
                                            <a href="javascript:void(0);" className="fw-bold d-block">
                                                <span className="d-block">Verified</span>
                                                <span className="fs-24 fw-bolder d-block">{verifiedUsers}</span>
                                            </a>
                                            <div className="pt-4">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <a
                                                        href="javascript:void(0);"
                                                        className="fs-12 fw-medium text-muted"
                                                    >
                                                        <span>Verified Users</span>
                                                        <i className="feather-link-2 fs-10 ms-1" />
                                                    </a>
                                                    <div>
                                                        <span className="fs-12 text-muted">{totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="progress mt-2 ht-3">
                                                    <div
                                                        className="progress-bar bg-danger"
                                                        role="progressbar"
                                                        style={{ width: `${totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                        {/* <div className="p-3 border-bottom">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search by name or email..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="table-responsive">

                                            <table className="table table-hover">
                                                <thead >
                                                    <tr>

                                                        <th className="sort" data-sort="#">#</th>
                                                        <th className="sort" data-sort="module">Name</th>
                                                        <th className="sort" data-sort="role">Role</th>
                                                        <th className="sort" data-sort="email">Email</th>
                                                        <th className="sort" data-sort="isverified">Is Verified</th>
                                                        <th className="sort" data-sort="status">Status</th>
                                                        <th className="sort" data-sort="createAt">Created At</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {filteredUsers.length > 0 ? (
                                                        filteredUsers.map((user, index) => (
                                                            <tr key={user._id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <span className="fw-semibold">{user.name}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="badge bg-primary-subtle text-primary">
                                                                        {user.role?.name || "N/A"}
                                                                    </span>
                                                                </td>
                                                                <td>{user.email}</td>
                                                                <td>
                                                                    {user.isVerified ? (
                                                                        <span className="badge bg-success">Verified</span>
                                                                    ) : (
                                                                        <span className="badge bg-warning">Not Verified</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {user.status === "active" ? (
                                                                        <span className="badge bg-success">Active</span>
                                                                    ) : (
                                                                        <span className="badge bg-danger">Inactive</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                                </td>
                                                                <td>
                                                                    <ul className="list-inline hstack gap-2 mb-0">
                                                                        <li className="list-inline-item" title="View">
                                                                            <button
                                                                                className="btn btn-sm btn-link text-primary"
                                                                                onClick={() => handleView(user._id)}
                                                                            >
                                                                                <i className="ri-eye-fill" />
                                                                            </button>
                                                                        </li>

                                                                        <li className="list-inline-item" title="Edit">
                                                                            <button
                                                                                className="btn btn-sm btn-link text-success"
                                                                                onClick={() => handleEdit(user._id)}
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#userModal"
                                                                            >
                                                                                <i className="ri-pencil-fill" />
                                                                            </button>
                                                                        </li>

                                                                        <li className="list-inline-item" title="Delete">
                                                                            <button
                                                                                className="btn btn-sm btn-link text-danger"
                                                                                onClick={() => { setGetId(user._id); document.body.classList.remove('modal-open') }}
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#deleteRecordModal"
                                                                            >
                                                                                <i className="ri-delete-bin-fill" />
                                                                            </button>
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="8" className="text-center py-5">
                                                                <div className="noresult">
                                                                    <lord-icon
                                                                        src="https://cdn.lordicon.com/msoeawqm.json"
                                                                        trigger="loop"
                                                                        colors="primary:#121331,secondary:#08a88a"
                                                                        style={{ width: 75, height: 75 }}
                                                                    />
                                                                    <h5 className="mt-2">Sorry! No Result Found</h5>
                                                                    <p className="text-muted mb-0">
                                                                        We've searched more than 150+ users. We did not find any users for your search.
                                                                    </p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>


                                            </table>

                                        </div>
                                        <div className="d-flex justify-content-end mt-3">
                                            <div className="pagination-wrap hstack gap-2">
                                                <a className="page-item pagination-prev disabled" href="#">
                                                    Previous
                                                </a>
                                                <ul className="pagination listjs-pagination mb-0" />
                                                <a className="page-item pagination-next" href="#">
                                                    Next
                                                </a>
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
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">

                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">
                                    User Architecture
                                </h4>
                                <small className="text-white-50">
                                    Manage User, Create & access role
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        <div className="modal-body p-4 bg-white">

                            <div className="card border-0 shadow-sm rounded-4 mb-4">
                                <div className="card-body">
                                    <h6 className="fw-semibold mb-3 text-primary">
                                        Main Module
                                    </h6>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">User Name</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="Enter User Name"
                                                name="name"
                                                value={moduleData.name}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="Enter Email Address"
                                                name="email"
                                                type="email"
                                                value={moduleData.email}
                                                onChange={handleModuleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Role</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="role"
                                                value={moduleData.role}
                                                onChange={handleModuleChange}
                                            >
                                                <option value="">Select Role</option>

                                                {roleList.map((role, index) => (
                                                    <option key={role._id || index} value={role._id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>


                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Password</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="...."
                                                name="password"
                                                type="password"
                                                value={moduleData.password}
                                                onChange={handleModuleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="status"
                                                value={moduleData.status}
                                                onChange={handleModuleChange}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>

                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label d-block mb-2">Is Verified</label>

                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="isVerified"
                                                    name="isVerified"
                                                    checked={moduleData.isVerified}
                                                    onChange={(e) =>
                                                        setModuleData({
                                                            ...moduleData,
                                                            isVerified: e.target.checked,
                                                        })
                                                    }
                                                />
                                                <label className="form-check-label fw-medium" htmlFor="isVerified">
                                                    {moduleData.isVerified ? "Verified" : "Not Verified"}
                                                </label>
                                            </div>

                                            {moduleData.isVerified && (
                                                <span className="badge bg-success-subtle text-primary ms-2 fs-6">
                                                    <i class="ri-verified-badge-fill text-success "></i>
                                                    <i> Verified User</i>
                                                </span>
                                            )}
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
                                onClick={handleSubmit}
                                data-bs-dismiss="modal"
                            >
                                Save Permission
                            </button>
                        </div>

                    </div>
                </div>
            </div>


            <div className="modal fade" id="userModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">

                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">
                                    User Architecture
                                </h4>
                                <small className="text-white-50">
                                    Manage User, Create & access role
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        <div className="modal-body p-4 bg-white">

                            <div className="card border-0 shadow-sm rounded-4 mb-4">
                                <div className="card-body">
                                    <h6 className="fw-semibold mb-3 text-primary">
                                        Main Module
                                    </h6>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">User Name</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="Enter User Name"
                                                name="name"
                                                value={moduleData.name}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="Enter Email Address"
                                                name="email"
                                                type="email"
                                                value={moduleData.email}
                                                onChange={handleModuleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Role</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="role"
                                                value={moduleData.role}
                                                onChange={handleModuleChange}
                                            >
                                                <option value="">Select Role</option>

                                                {roleList.map((role, index) => (
                                                    <option key={role._id || index} value={role._id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>


                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Password</label>
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="...."
                                                name="password"
                                                type="password"
                                                value={moduleData.password}
                                                onChange={handleModuleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="status"
                                                value={moduleData.status}
                                                onChange={handleModuleChange}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>

                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label d-block mb-2">Is Verified</label>

                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="isVerified"
                                                    name="isVerified"
                                                    checked={moduleData.isVerified}
                                                    onChange={(e) =>
                                                        setModuleData({
                                                            ...moduleData,
                                                            isVerified: e.target.checked,
                                                        })
                                                    }
                                                />
                                                <label className="form-check-label fw-medium" htmlFor="isVerified">
                                                    {moduleData.isVerified ? "Verified" : "Not Verified"}
                                                </label>
                                            </div>

                                            {moduleData.isVerified && (
                                                <span className="badge bg-success-subtle text-primary ms-2 fs-6">
                                                    <i class="ri-verified-badge-fill text-success "></i>
                                                    <i> Verified User</i>
                                                </span>
                                            )}
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


