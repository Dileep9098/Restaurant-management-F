



import React, { useEffect, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
import { useMemo } from "react";

const DEFAULT_ACTIONS = ["view", "create", "update", "delete"];
const ACTION_COLUMNS = ["VIEW", "CREATE", "UPDATE", "DELETE", "SHOW"];

export default function CreateRestaurentUser() {

    const [moduleData, setModuleData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        restaurantId: "",
        role: "",
        status: "active",
        isVerified: false,
    });

    const [userList, setUserList] = useState([])
    const [getId, setGetId] = useState('');
    const [roleList, setRoleList] = useState([]);
    const [permissionList, setPermissionList] = useState([]);
    const [rolePermissionList, setRolePermissionList] = useState([]);
    const [restaurantList, setRestaurantList] = useState([])


    const [searchTerm, setSearchTerm] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [restaurantNameFilter, setRestaurantNameFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [activeModule, setActiveModule] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const [resRole, res, resRestaurant, permissionList, rolePermission] = await Promise.all([
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_ROLES"],
                        { withCredentials: true }
                    ),
                    axiosInstance.get(
                        Config.END_POINT_LIST["RESTAURENT_USER_GET_ALL"],
                        { withCredentials: true }
                    ),
                    axiosInstance.get(
                        Config.END_POINT_LIST["RESTAURENT_GET_ALL"],
                        { withCredentials: true }
                    ),
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_PERMISSION"],
                        { withCredentials: true }
                    ),
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_ROLE_PERMISSION"],
                        { withCredentials: true }
                    ),
                ]);
                if (res.data.success) {
                    console.log("Existing Permissions:", res.data.data);
                    setUserList(res.data.data);
                    setRoleList(resRole.data.data);
                    setRestaurantList(resRestaurant.data.data || []);
                    setPermissionList(permissionList.data.data)
                    setRolePermissionList(rolePermission.data.data)
                }

            } catch (err) {

                showErrorMsg(err.response?.data?.message || "Something went wrong");
            }
        };
        fetchUsers();

    }, [])
    useEffect(() => {
        if (permissionList && permissionList.length > 0) {
            setActiveModule(permissionList[0].module);
        }
    }, [permissionList]);

    const filteredUsers = userList.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesName = !nameFilter || user.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesRestaurant = !restaurantNameFilter || (user.restaurantId?.name || '').toLowerCase().includes(restaurantNameFilter.toLowerCase());
        const userDate = new Date(user.createdAt);
        const matchesDateFrom = !dateFrom || userDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || userDate <= new Date(dateTo);
        let filterCondition = true;
        if (selectedFilter === 'verified') filterCondition = user.isVerified;
        else if (selectedFilter === 'not-verified') filterCondition = !user.isVerified;
        else if (selectedFilter === 'active') filterCondition = user.status === 'active';
        else if (selectedFilter === 'inactive') filterCondition = user.status === 'inactive';
        return matchesSearch && matchesName && matchesRestaurant && matchesDateFrom && matchesDateTo && filterCondition;
    });

    const totalUsers = filteredUsers.length;
    const verifiedUsers = filteredUsers.filter(u => u.isVerified).length;
    const notVerifiedUsers = totalUsers - verifiedUsers;
    const activeUsers = filteredUsers.filter(u => u.status === 'active').length;
    const inactiveUsers = totalUsers - activeUsers;

    const handleView = (id) => {
        console.log('View user:', id);
    };
    const handleModuleChange = (e) => {
        setModuleData({ ...moduleData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async () => {
        try {
            debugger
            const res = await axiosInstance.post(
                Config.END_POINT_LIST["RESTAURENT_USER_CREATE"],
                { moduleData, permissions: selectedPermissions, },
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("User Created Successfully");
                setModuleData({
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    restaurantId: "",
                    role: "",
                    status: "active",
                    isVerified: false,
                });
                setUserList([...userList, res.data.data]);
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
                    phone: user.phone || "",
                    restaurantId: user.restaurant?._id || "",
                    role: user.role?.name || "",
                    status: user.status,
                    isVerified: user.isVerified,

                });

            }
            const assignRolePermission = rolePermissionList.find(item => item.role._id === user.role._id && item.restaurant._id === user.restaurant._id)
            console.log("Kya huaa bhai ", assignRolePermission)
            setSelectedPermissions(assignRolePermission ? assignRolePermission.permissions : []);



        } catch (error) {
            console.log(error);
        }
    };

    const handleEditSubmit = async () => {
        // debugger
        try {
            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST["RESTAURENT_ADMIN_USER_UPDATE"]}/${getId}`,
                { moduleData, permissions: selectedPermissions },
                { withCredentials: true }
            );
            if (res.data.success) {
                showSuccessMsg("User Updated Successfully");
                setModuleData({
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    restaurantId: "",
                    role: "",
                    status: "active",
                    isVerified: false,
                });
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
                `${Config.END_POINT_LIST["RESTAURENT_USER_DELETE"]}/${getId}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                showSuccessMsg("User Deleted Successfully");
                setUserList(userList.filter(item => item._id !== getId));
                // close modal
                document.querySelector('#deleteRecordModal .btn-close').click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };





    /* ================= CURRENT MODULE ================= */
    const currentModule = useMemo(
        () => permissionList?.find(m => m.module === activeModule),
        [permissionList, activeModule]
    );

    /* ================= HELPERS ================= */

    const togglePermission = (key) => {
        setSelectedPermissions(prev =>
            prev.includes(key)
                ? prev.filter(p => p !== key)
                : [...prev, key]
        );
    };

    const isAllChecked = (keys) =>
        keys.length > 0 && keys.every(k => selectedPermissions.includes(k));


    const toggleModulePermissions = (module) => {
        const allKeys =
            module.submenus.length > 0
                ? module.submenus.flatMap(sub => sub.actions.map(a => a.key))
                : [module._id];

        setSelectedPermissions(prev =>
            isAllChecked(allKeys)
                ? prev.filter(p => !allKeys.includes(p))
                : [...new Set([...prev, ...allKeys])]
        );
    };

    const toggleSubmenuPermissions = (submenu) => {
        const keys = submenu.actions.length > 0
            ? submenu.actions.map(a => a.key)
            : [submenu._id];

        setSelectedPermissions(prev =>
            isAllChecked(keys)
                ? prev.filter(p => !keys.includes(p))
                : [...new Set([...prev, ...keys])]
        );
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
                                        placeholder="Filter by Restaurant Name"
                                        value={restaurantNameFilter}
                                        onChange={(e) => setRestaurantNameFilter(e.target.value)}
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
                                                <span className="d-block">Verified Users</span>
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
                                <div className="col-xxl-3 col-md-6">
                                    <div className="card stretch stretch-full">
                                        <div className="card-body">
                                            <a href="javascript:void(0);" className="fw-bold d-block">
                                                <span className="d-block">Unverified Users</span>
                                                <span className="fs-24 fw-bolder d-block">{notVerifiedUsers}</span>
                                            </a>
                                            <div className="pt-4">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <a
                                                        href="javascript:void(0);"
                                                        className="fs-12 fw-medium text-muted"
                                                    >
                                                        <span>Unverified Users</span>
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
                                                <span className="d-block">Active Users</span>
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
                                                <span className="d-block">Inactive Users</span>
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
                                                        <th className="sort" data-sort="restaurent">Restaurent Name</th>
                                                        <th className="sort" data-sort="permission">Permission</th>

                                                        <th className="sort" data-sort="isverified">Is Verified</th>
                                                        <th className="sort" data-sort="status">Status</th>
                                                        <th className="sort" data-sort="createAt">Created At</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {filteredUsers.length > 0 ? (
                                                        filteredUsers.map((user, index) => {
                                                            const userPermissions = rolePermissionList.find(item => item.role._id === user.role._id && item.restaurant._id === user.restaurant._id)?.permissions || [];
                                                            // debugger
                                                            return (
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
                                                                    <td>{user.restaurant?.name || "N/A"}</td>
                                                                    {/* <td>
                                                                    {userPermissions.length > 0 ? (
                                                                        <span className="text-muted small">
                                                                            {userPermissions.slice(0, 3).join(", ")}
                                                                            {userPermissions.length > 3 ? "..." : ""}
                                                                        </span>
                                                                    ) : (
                                                                        "No permissions"
                                                                    )}
                                                                </td> */}
                                                                    <td>
                                                                        {userPermissions.length>0?<div className="d-flex flex-wrap gap-1" style={{height:"200px",overflow:"auto"}}>
                                                                            {userPermissions.map((perm, pIndex) => (
                                                                                <span
                                                                                    key={pIndex}
                                                                                    className="badge badge-label bg-dark"
                                                                                >
                                                                                    <i className="mdi mdi-circle-medium"></i>
                                                                                    {perm}
                                                                                </span>
                                                                            ))}

                                                                            {userPermissions.length > 5 && (
                                                                                <span className="badge bg-secondary">
                                                                                    +{userPermissions.length - 5} more
                                                                                </span>
                                                                            )}
                                                                        </div>:"No Permission"}
                                                                        
                                                                    </td>
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
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="9" className="text-center py-5">
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
                            <form>

                                <div className="card border-0 shadow-sm rounded-4 mb-4">
                                    <div className="card-body">

                                        <h6 className="fw-semibold mb-3 text-primary">
                                            Restaurant User Details
                                        </h6>

                                        <div className="row g-3">

                                            {/* Full Name */}
                                            <div className="col-md-6">
                                                <label className="form-label">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    placeholder="Enter full name"
                                                    name="name"
                                                    value={moduleData.name}
                                                    onChange={handleModuleChange}
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="col-md-6">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control form-control-lg"
                                                    placeholder="Enter email"
                                                    name="email"
                                                    value={moduleData.email}
                                                    onChange={handleModuleChange}
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="col-md-6">
                                                <label className="form-label">Phone</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    placeholder="Enter phone number"
                                                    name="phone"
                                                    value={moduleData.phone}
                                                    onChange={handleModuleChange}
                                                />
                                            </div>

                                            {/* Password */}
                                            <div className="col-md-6">
                                                <label className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control form-control-lg"
                                                    placeholder="Create password"
                                                    name="password"
                                                    value={moduleData.password}
                                                    onChange={handleModuleChange}
                                                />
                                            </div>

                                            {/* Restaurant */}
                                            <div className="col-md-6">
                                                <label className="form-label">Restaurant</label>
                                                <select
                                                    className="form-select form-select-lg"
                                                    name="restaurantId"
                                                    value={moduleData.restaurantId}
                                                    onChange={handleModuleChange}
                                                >
                                                    <option value="">Select Restaurant</option>
                                                    {restaurantList.map((res) => (
                                                        <option key={res._id} value={res._id}>
                                                            {res.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Role */}
                                            {/* <div className="col-md-6">
                                                <label className="form-label">Role</label>
                                                <select
                                                    className="form-select form-select-lg"
                                                    name="role"
                                                    value={moduleData.role}
                                                    onChange={handleModuleChange}
                                                >
                                                    <option value="">Select Role</option>
                                                    {roleList.map((role) => (
                                                        <option key={role._id} value={role._id}>
                                                            {role.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div> */}
                                            <div className="col-md-6">
                                                <label className="form-label">Role</label>
                                                <input type="text" name="role" onChange={handleModuleChange} className="form-control form-control-lg"
                                                    placeholder="Ex. admin" />
                                            </div>

                                            {/* Status */}
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

                                            {/* Is Verified */}
                                            <div className="col-md-6">
                                                <label className="form-label d-block mb-2">Is Verified</label>

                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={moduleData.isVerified}
                                                        onChange={(e) =>
                                                            setModuleData({
                                                                ...moduleData,
                                                                isVerified: e.target.checked,
                                                            })
                                                        }
                                                    />
                                                    <label className="form-check-label">
                                                        {moduleData.isVerified ? "Verified" : "Not Verified"}
                                                    </label>
                                                </div>

                                                {moduleData.isVerified && (
                                                    <span className="badge bg-success-subtle text-success mt-2">
                                                        <i className="ri-verified-badge-fill me-1"></i>
                                                        Verified User
                                                    </span>
                                                )}
                                            </div>

                                            {/* ================= TOP MODULE TABS ================= */}
                                            <div className="d-flex gap-2 mb-3 flex-wrap module-tabs">
                                                {permissionList?.map((mod) => (
                                                    <button
                                                        type="button"
                                                        key={mod.module}
                                                        className={`btn btn-sm module-btn ${activeModule === mod.module ? "active" : ""}`}
                                                        onClick={() => setActiveModule(mod.module)}
                                                    >
                                                        {mod.moduleLabel}
                                                    </button>
                                                ))}
                                            </div>


                                            {/* ================= PERMISSION TABLE ================= */}

                                            {currentModule && (
                                                <div className="table-responsive border rounded">
                                                    <table className="table align-middle mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th style={{ width: "35%" }}>
                                                                    <label className="d-flex align-items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            checked={
                                                                                currentModule.submenus.length > 0
                                                                                    ? isAllChecked(currentModule.submenus.flatMap((sub) => sub.actions.map((a) => a.key)))
                                                                                    : selectedPermissions.includes(currentModule._id)
                                                                            }
                                                                            onChange={() => toggleModulePermissions(currentModule)}
                                                                        />
                                                                        {currentModule.moduleLabel}
                                                                    </label>
                                                                </th>
                                                                <th>PERMISSIONS</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {currentModule.submenus.length > 0 ? (
                                                                currentModule.submenus.map((sub) => {
                                                                    const submenuKeys = sub.actions.map((a) => a.key);
                                                                    return (
                                                                        <tr key={sub._id}>
                                                                            <td className="fw-medium">
                                                                                <label className="d-flex align-items-center gap-2">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-check-input"
                                                                                        checked={isAllChecked(submenuKeys)}
                                                                                        onChange={() => toggleSubmenuPermissions(sub)}
                                                                                    />
                                                                                    {sub.label}
                                                                                </label>
                                                                            </td>

                                                                            <td>
                                                                                <div className="d-flex gap-4 flex-wrap">
                                                                                    {ACTION_COLUMNS.map((action) => {
                                                                                        const actionObj = sub.actions.find((a) => a.label === action);
                                                                                        if (!actionObj) return null;

                                                                                        return (
                                                                                            <label
                                                                                                key={action}
                                                                                                className="d-flex align-items-center gap-2"
                                                                                                style={{ minWidth: "120px" }}
                                                                                            >
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="form-check-input"
                                                                                                    checked={selectedPermissions.includes(actionObj.key)}
                                                                                                    onChange={() => togglePermission(actionObj.key)}
                                                                                                />
                                                                                                <span className="small fw-semibold">{action}</span>
                                                                                            </label>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                                // ===== CASE: Empty submenus =====
                                                                <tr key={currentModule._id}>
                                                                    <td className="fw-medium">
                                                                        <label className="d-flex align-items-center gap-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-check-input"
                                                                                checked={selectedPermissions.includes(currentModule._id)}
                                                                                onChange={() => toggleModulePermissions(currentModule)}
                                                                            />
                                                                            {currentModule.moduleLabel}
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <span className="text-muted small">No actions available</span>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}


                                            <pre className="mt-3 bg-light p-2 small">
                                                {JSON.stringify(selectedPermissions, null, 2)}
                                            </pre>

                                        </div>
                                    </div>
                                </div>
                            </form>
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
                            <form>

                                <div className="card border-0 shadow-sm rounded-4 mb-4">
                                    <div className="card-body">

                                        <h6 className="fw-semibold mb-3 text-primary">
                                            Restaurant User Details
                                        </h6>

                                        <div className="row g-3">

                                            {/* Full Name */}
                                            <div className="col-md-6">
                                                <label className="form-label">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    placeholder="Enter full name"
                                                    name="name"
                                                    value={moduleData.name}
                                                    onChange={handleModuleChange}
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="col-md-6">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control form-control-lg"
                                                    placeholder="Enter email"
                                                    name="email"
                                                    value={moduleData.email}
                                                    onChange={handleModuleChange}
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="col-md-6">
                                                <label className="form-label">Phone</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    placeholder="Enter phone number"
                                                    name="phone"
                                                    value={moduleData.phone}
                                                    onChange={handleModuleChange}
                                                />
                                            </div>

                                            {/* Password */}
                                            <div className="col-md-6">
                                                <label className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control form-control-lg"
                                                    placeholder="Create password"
                                                    name="password"
                                                    value={moduleData.password}
                                                    onChange={handleModuleChange}
                                                />
                                            </div>

                                            {/* Restaurant */}
                                            <div className="col-md-6">
                                                <label className="form-label">Restaurant</label>
                                                <select
                                                    className="form-select form-select-lg"
                                                    name="restaurantId"
                                                    value={moduleData.restaurantId}
                                                    onChange={handleModuleChange}
                                                >
                                                    <option value="">Select Restaurant</option>
                                                    {restaurantList.map((res) => (
                                                        <option key={res._id} value={res._id}>
                                                            {res.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Role */}
                                            {/* <div className="col-md-6">
                                                <label className="form-label">Role</label>
                                                <select
                                                    className="form-select form-select-lg"
                                                    name="role"
                                                    value={moduleData.role}
                                                    onChange={handleModuleChange}
                                                >
                                                    <option value="">Select Role</option>
                                                    {roleList.map((role) => (
                                                        <option key={role._id} value={role._id}>
                                                            {role.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div> */}
                                            <div className="col-md-6">
                                                <label className="form-label">Role</label>
                                                <input type="text" name="role" onChange={handleModuleChange} className="form-control form-control-lg"
                                                    placeholder="Ex. admin" value={moduleData.role} />
                                            </div>

                                            {/* Status */}
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

                                            {/* Is Verified */}
                                            <div className="col-md-6">
                                                <label className="form-label d-block mb-2">Is Verified</label>

                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={moduleData.isVerified}
                                                        onChange={(e) =>
                                                            setModuleData({
                                                                ...moduleData,
                                                                isVerified: e.target.checked,
                                                            })
                                                        }
                                                    />
                                                    <label className="form-check-label">
                                                        {moduleData.isVerified ? "Verified" : "Not Verified"}
                                                    </label>
                                                </div>

                                                {moduleData.isVerified && (
                                                    <span className="badge bg-success-subtle text-success mt-2">
                                                        <i className="ri-verified-badge-fill me-1"></i>
                                                        Verified User
                                                    </span>
                                                )}
                                            </div>

                                            {/* ================= TOP MODULE TABS ================= */}
                                            <div className="d-flex gap-2 mb-3 flex-wrap module-tabs">
                                                {permissionList?.map((mod) => (
                                                    <button
                                                        type="button"
                                                        key={mod.module}
                                                        className={`btn btn-sm module-btn ${activeModule === mod.module ? "active" : ""}`}
                                                        onClick={() => setActiveModule(mod.module)}
                                                    >
                                                        {mod.moduleLabel}
                                                    </button>
                                                ))}
                                            </div>


                                            {/* ================= PERMISSION TABLE ================= */}

                                            {currentModule && (
                                                <div className="table-responsive border rounded">
                                                    <table className="table align-middle mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th style={{ width: "35%" }}>
                                                                    <label className="d-flex align-items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            checked={
                                                                                currentModule.submenus.length > 0
                                                                                    ? isAllChecked(currentModule.submenus.flatMap((sub) => sub.actions.map((a) => a.key)))
                                                                                    : selectedPermissions.includes(currentModule._id)
                                                                            }
                                                                            onChange={() => toggleModulePermissions(currentModule)}
                                                                        />
                                                                        {currentModule.moduleLabel}
                                                                    </label>
                                                                </th>
                                                                <th>PERMISSIONS</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {currentModule.submenus.length > 0 ? (
                                                                currentModule.submenus.map((sub) => {
                                                                    const submenuKeys = sub.actions.map((a) => a.key);
                                                                    return (
                                                                        <tr key={sub._id}>
                                                                            <td className="fw-medium">
                                                                                <label className="d-flex align-items-center gap-2">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-check-input"
                                                                                        checked={isAllChecked(submenuKeys)}
                                                                                        onChange={() => toggleSubmenuPermissions(sub)}
                                                                                    />
                                                                                    {sub.label}
                                                                                </label>
                                                                            </td>

                                                                            <td>
                                                                                <div className="d-flex gap-4 flex-wrap">
                                                                                    {ACTION_COLUMNS.map((action) => {
                                                                                        const actionObj = sub.actions.find((a) => a.label === action);
                                                                                        if (!actionObj) return null;

                                                                                        return (
                                                                                            <label
                                                                                                key={action}
                                                                                                className="d-flex align-items-center gap-2"
                                                                                                style={{ minWidth: "120px" }}
                                                                                            >
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="form-check-input"
                                                                                                    checked={selectedPermissions.includes(actionObj.key)}
                                                                                                    onChange={() => togglePermission(actionObj.key)}
                                                                                                />
                                                                                                <span className="small fw-semibold">{action}</span>
                                                                                            </label>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                                // ===== CASE: Empty submenus =====
                                                                <tr key={currentModule._id}>
                                                                    <td className="fw-medium">
                                                                        <label className="d-flex align-items-center gap-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-check-input"
                                                                                checked={selectedPermissions.includes(currentModule._id)}
                                                                                onChange={() => toggleModulePermissions(currentModule)}
                                                                            />
                                                                            {currentModule.moduleLabel}
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <span className="text-muted small">No actions available</span>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}


                                            <pre className="mt-3 bg-light p-2 small">
                                                {JSON.stringify(selectedPermissions, null, 2)}
                                            </pre>

                                        </div>
                                    </div>
                                </div>
                            </form>
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
                                data-bs-dismiss="modal"
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
                                    You are about to delete a user?
                                </h4>
                                <p className="text-muted fs-14 mb-4 pt-1">
                                    Deleting your user will remove all of your information
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




