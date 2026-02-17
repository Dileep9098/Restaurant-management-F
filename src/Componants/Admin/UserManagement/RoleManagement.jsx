
// import React, { useEffect, useMemo, useState } from "react";
// import axiosInstance from "../../../apiHandler/axiosInstance";
// import Config from "../../../Config/Config";
// import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
// import "./roleModule.css"
// import { Link } from "react-router-dom";
// const DEFAULT_ACTIONS = ["view", "create", "update", "delete"];
// const ACTION_COLUMNS = ["VIEW", "CREATE", "UPDATE", "DELETE", "SHOW"];

// export default function RoleManagement() {

//     const [moduleData, setModuleData] = useState({
//         name: "",
//         isActive: true,
//     });
//     const [permissionList, setPermissionList] = useState([])
//     const [roleList, setRoleList] = useState([]);
//     const [getId, setGetId] = useState('');
//     const [openModules, setOpenModules] = useState({});
//     const [selectedPermissions, setSelectedPermissions] = useState([]);



//     useEffect(() => {
//         const fetchPermissions = async () => {
//             try {
//                 // const res = await axiosInstance.get(
//                 //     Config.END_POINT_LIST["GET_ALL_PERMISSION"],
//                 //     { withCredentials: true }
//                 // );
//                 const [resRole, res] = await Promise.all([
//                     axiosInstance.get(
//                         Config.END_POINT_LIST["GET_ALL_ROLES"],
//                         { withCredentials: true }
//                     ),
//                     axiosInstance.get(
//                         Config.END_POINT_LIST["GET_ALL_PERMISSION"],
//                         { withCredentials: true }
//                     )
//                 ]);
//                 if (res.data.success) {
//                     console.log("Existing Permissions:", res.data.data);
//                     setPermissionList(res.data.data);
//                     setRoleList(resRole.data.data);
//                 }

//             } catch (err) {

//                 showErrorMsg(err.response?.data?.message || "Something went wrong");
//             }
//         };
//         fetchPermissions();

//     }, [])

//     const handleModuleChange = (e) => {
//         setModuleData({ ...moduleData, [e.target.name]: e.target.value });
//     };





//     // ===== REMOVE ACTION =====
//     const removeAction = (submenuIndex, actionIndex) => {
//         const updated = [...moduleData.submenus];
//         updated[submenuIndex].actions.splice(actionIndex, 1);
//         setModuleData({ ...moduleData, submenus: updated });
//     };

//     // ===== REMOVE SUBMENU =====
//     const removeSubmenu = (index) => {
//         setModuleData({
//             ...moduleData,
//             submenus: moduleData.submenus.filter((_, i) => i !== index)
//         });
//     }

//     // ===== SUBMIT =====
//     const handleSubmit = async () => {
//         try {

//             console.log(moduleData, selectedPermissions)

//             const res = await axiosInstance.post(
//                 Config.END_POINT_LIST["CREATE_ROLE"],
//                 {
//                     name: moduleData.name,
//                     isActive: moduleData.isActive,
//                     permissions: selectedPermissions
//                 },
//                 { withCredentials: true }
//             );
//             if (res.data.success) {
//                 showSuccessMsg("Role Created Successfully");
//                 setModuleData({ name: "", isActive: true });
//                 setSelectedPermissions([]);
//                 setRoleList([...roleList, res.data.data]);
//                 // module close
//                 document.querySelector('#permissionModal .btn-close').click();
//             }
//             // }
//         } catch (err) {
//             showErrorMsg(err.response?.data?.message || "Something went wrong");
//         }
//     };


//     const handleEdit = async (id) => {
//         console.log(id)
//         setGetId(id)
//         document.body.classList.remove('modal-open')


//         try {
//             const role = roleList.find(item => item._id === id);
//             debugger
//             if (role) {
//                 setModuleData({
//                     name: role.name,
//                     isActive: role.isActive,
//                 });
//                 setSelectedPermissions(role.permissions);
//             }


//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEditSubmit = async () => {
//         try {
//             console.log(moduleData, selectedPermissions)
//             const res = await axiosInstance.put(
//                 `${Config.END_POINT_LIST["UPDATE_ROLE"]}/${getId}`,
//                 {

//                     name: moduleData.name,
//                     isActive: moduleData.isActive,
//                     permissions: selectedPermissions
//                 },
//                 { withCredentials: true }
//             );

//             if (res.data.success) {
//                 showSuccessMsg("Role Updated Successfully");
//                 setModuleData({ name: "", isActive: true });
//                 setSelectedPermissions([]);
//                 setRoleList(roleList.map(item => item._id === getId ? res.data.data : item));
//                 // close modal
//                 document.querySelector('#permissionModalEdit .btn-close').click();
//             }
//             // const res = await axiosInstance.put(
//             //     `${Config.END_POINT_LIST["UPDATE_PERMISSION"]}/${getId}`,
//             //     moduleData,
//             //     { withCredentials: true }
//             // );
//             // if (res.data.success) {
//             //     showSuccessMsg("Permission Module Updated Successfully");
//             //     setModuleData({ module: "", moduleLabel: "", submenus: [] });
//             //     setPermissionList(permissionList.map(item => item._id === getId ? res.data.data : item));


//             //     document.querySelector('#permissionModalEdit .btn-close').click();
//             // }

//         } catch (err) {
//             showErrorMsg(err.response?.data?.message || "Something went wrong");
//         }
//     };

//     const handleDeletePermission = async () => {
//         try {

//             const res = await axiosInstance.delete(
//                 `${Config.END_POINT_LIST["DELETE_ROLE"]}/${getId}`,
//                 { withCredentials: true }
//             );

//             if (res.data.success) {
//                 showSuccessMsg("Permission Module Deleted Successfully");
//                 setRoleList(roleList.filter(item => item._id !== getId));
//                 // close modal
//                 document.querySelector('#deleteRecordModal .btn-close').click();
//             }
//         } catch (err) {
//             showErrorMsg(err.response?.data?.message || "Something went wrong");
//         }
//     };

//     const [activeModule, setActiveModule] = useState("");

//     useEffect(() => {
//         if (permissionList && permissionList.length > 0) {
//             setActiveModule(permissionList[0].module);
//         }
//     }, [permissionList]);


//     /* ================= CURRENT MODULE ================= */
//     const currentModule = useMemo(
//         () => permissionList?.find(m => m.module === activeModule),
//         [permissionList, activeModule]
//     );

//     /* ================= HELPERS ================= */

//     const togglePermission = (key) => {
//         setSelectedPermissions(prev =>
//             prev.includes(key)
//                 ? prev.filter(p => p !== key)
//                 : [...prev, key]
//         );
//     };

//     const isAllChecked = (keys) =>
//         keys.length > 0 && keys.every(k => selectedPermissions.includes(k));

//     /* ================= MODULE TOGGLE ================= */

//     /* ================= MODULE TOGGLE ================= */
//     const toggleModulePermissions = (module) => {
//         const allKeys =
//             module.submenus.length > 0
//                 ? module.submenus.flatMap(sub => sub.actions.map(a => a.key))
//                 : [module._id]; // empty module ke liye

//         setSelectedPermissions(prev =>
//             isAllChecked(allKeys)
//                 ? prev.filter(p => !allKeys.includes(p))
//                 : [...new Set([...prev, ...allKeys])]
//         );
//     };

//     /* ================= SUBMENU TOGGLE ================= */
//     const toggleSubmenuPermissions = (submenu) => {
//         const keys = submenu.actions.length > 0
//             ? submenu.actions.map(a => a.key)
//             : [submenu._id]; // agar submenu me actions empty ho to fallback

//         setSelectedPermissions(prev =>
//             isAllChecked(keys)
//                 ? prev.filter(p => !keys.includes(p))
//                 : [...new Set([...prev, ...keys])]
//         );
//     };

//     // Export functions
//     const downloadCSV = () => {
//         const headers = ['#', 'Name', 'Role', 'Email', 'Is Verified', 'Status', 'Created At'];
//         const rows = filteredUsers.map((user, index) => [
//             index + 1,
//             user.name,
//             user.role?.name || 'N/A',
//             user.email,
//             user.isVerified ? 'Verified' : 'Not Verified',
//             user.status === 'active' ? 'Active' : 'Inactive',
//             new Date(user.createdAt).toLocaleDateString()
//         ]);
//         const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
//         const blob = new Blob([csvContent], { type: 'text/csv' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'users.csv';
//         a.click();
//         URL.revokeObjectURL(url);
//     };

//     const handlePrint = () => {
//         window.print();
//     };

//     return (
//         <>
//             <div className="nxl-content">
//                 {/* [ page-header ] start */}
//                 <>
//                     <div className="page-header">
//                         <div className="page-header-left d-flex align-items-center">
//                             <div className="page-header-title">
//                                 <h5 className="m-b-10">Role Manage</h5>
//                             </div>
//                             <ul className="breadcrumb">
//                                 <li className="breadcrumb-item">
//                                     <a href="index.html">Dashboard</a>
//                                 </li>
//                                 <li className="breadcrumb-item">User Management</li>
//                             </ul>
//                         </div>
//                         <div className="page-header-right ms-auto">
//                             <div className="page-header-right-items">
//                                 <div className="d-flex d-md-none">
//                                     <a
//                                         href="javascript:void(0)"
//                                         className="page-header-right-close-toggle"
//                                     >
//                                         <i className="feather-arrow-left me-2" />
//                                         <span>Back</span>
//                                     </a>
//                                 </div>
//                                 <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
//                                     <a
//                                         href="javascript:void(0);"
//                                         className="btn btn-icon btn-light-brand"
//                                         data-bs-toggle="collapse"
//                                         data-bs-target="#collapseOne"
//                                     >
//                                         <i className="feather-bar-chart" />
//                                     </a>
//                                     {/* <div className="dropdown">
//                                         <a
//                                             className="btn btn-icon btn-light-brand"
//                                             data-bs-toggle="dropdown"
//                                             data-bs-offset="0, 10"
//                                             data-bs-auto-close="outside"
//                                         >
//                                             <i className="feather-filter" />
//                                         </a>
//                                         <div className="dropdown-menu dropdown-menu-end">
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('all')}>
//                                                 <span className="wd-7 ht-7 bg-primary rounded-circle d-inline-block me-3" />
//                                                 <span>All</span>
//                                             </a>
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('verified')}>
//                                                 <span className="wd-7 ht-7 bg-indigo rounded-circle d-inline-block me-3" />
//                                                 <span>Verified</span>
//                                             </a>
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('not-verified')}>
//                                                 <span className="wd-7 ht-7 bg-warning rounded-circle d-inline-block me-3" />
//                                                 <span>Not Verified</span>
//                                             </a>
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('active')}>
//                                                 <span className="wd-7 ht-7 bg-success rounded-circle d-inline-block me-3" />
//                                                 <span>Active</span>
//                                             </a>
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('inactive')}>
//                                                 <span className="wd-7 ht-7 bg-danger rounded-circle d-inline-block me-3" />
//                                                 <span>Inactive</span>
//                                             </a>

//                                         </div>
//                                     </div> */}
//                                     {/* <div className="dropdown">
//                                         <a
//                                             className="btn btn-icon btn-light-brand"
//                                             data-bs-toggle="dropdown"
//                                             data-bs-offset="0, 10"
//                                             data-bs-auto-close="outside"
//                                         >
//                                             <i className="feather-paperclip" />
//                                         </a>
//                                         <div className="dropdown-menu dropdown-menu-end">
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={() => alert('PDF export not implemented yet')}>
//                                                 <i className="bi bi-filetype-pdf me-3" />
//                                                 <span>PDF</span>
//                                             </a>
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={downloadCSV}>
//                                                 <i className="bi bi-filetype-csv me-3" />
//                                                 <span>CSV</span>
//                                             </a>
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={() => alert('XML export not implemented yet')}>
//                                                 <i className="bi bi-filetype-xml me-3" />
//                                                 <span>XML</span>
//                                             </a>
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={() => alert('Text export not implemented yet')}>
//                                                 <i className="bi bi-filetype-txt me-3" />
//                                                 <span>Text</span>
//                                             </a>
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={() => alert('Excel export not implemented yet')}>
//                                                 <i className="bi bi-filetype-exe me-3" />
//                                                 <span>Excel</span>
//                                             </a>
//                                             <div className="dropdown-divider" />
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={handlePrint}>
//                                                 <i className="bi bi-printer me-3" />
//                                                 <span>Print</span>
//                                             </a>
//                                         </div>
//                                     </div> */}
//                                     <a href="#" className="btn btn-primary" data-bs-toggle="modal"
//                                         id="create-btn"
//                                         data-bs-target="#permissionModal"
//                                         onClick={() => document.body.classList.remove('pace-done', 'modal-open')}>
//                                         <i className="feather-plus me-2" />
//                                         <span> Assign Permission</span>
//                                     </a>
//                                 </div>
//                             </div>
//                             <div className="d-md-none d-flex align-items-center">
//                                 <a href="javascript:void(0)" className="page-header-right-open-toggle">
//                                     <i className="feather-align-right fs-20" />
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                     {/* <div
//                         id="collapseOne"
//                         className="accordion-collapse collapse page-header-collapse"
//                     >
//                         <div className="accordion-body pb-2">
//                             <div className="row mb-3">
//                                 <div className="col-md-6">
//                                     <input
//                                         type="text"
//                                         className="form-control mb-2"
//                                         placeholder="Filter by name"
//                                         value={nameFilter}
//                                         onChange={(e) => setNameFilter(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className="col-md-6">
//                                     <input
//                                         type="text"
//                                         className="form-control mb-2"
//                                         placeholder="Filter by email"
//                                         value={emailFilter}
//                                         onChange={(e) => setEmailFilter(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className="col-md-6">
//                                     <input
//                                         type="date"
//                                         className="form-control mb-2"
//                                         placeholder="From date"
//                                         value={dateFrom}
//                                         onChange={(e) => setDateFrom(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className="col-md-6">
//                                     <input
//                                         type="date"
//                                         className="form-control mb-2"
//                                         placeholder="To date"
//                                         value={dateTo}
//                                         onChange={(e) => setDateTo(e.target.value)}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="row">
//                                 <div className="col-xxl-3 col-md-6">
//                                     <div className="card stretch stretch-full">
//                                         <div className="card-body">
//                                             <a href="javascript:void(0);" className="fw-bold d-block">
//                                                 <span className="d-block">Not Verified</span>
//                                                 <span className="fs-24 fw-bolder d-block">{notVerifiedUsers}</span>
//                                             </a>
//                                             <div className="pt-4">
//                                                 <div className="d-flex align-items-center justify-content-between">
//                                                     <a
//                                                         href="javascript:void(0);"
//                                                         className="fs-12 fw-medium text-muted"
//                                                     >
//                                                         <span>Users Pending Verification</span>
//                                                         <i className="feather-link-2 fs-10 ms-1" />
//                                                     </a>
//                                                     <div>
//                                                         <span className="fs-12 text-muted">{totalUsers > 0 ? Math.round((notVerifiedUsers / totalUsers) * 100) : 0}%</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="progress mt-2 ht-3">
//                                                     <div
//                                                         className="progress-bar bg-primary"
//                                                         role="progressbar"
//                                                         style={{ width: `${totalUsers > 0 ? (notVerifiedUsers / totalUsers) * 100 : 0}%` }}
//                                                     ></div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="col-xxl-3 col-md-6">
//                                     <div className="card stretch stretch-full">
//                                         <div className="card-body">
//                                             <a href="javascript:void(0);" className="fw-bold d-block">
//                                                 <span className="d-block">Active</span>
//                                                 <span className="fs-24 fw-bolder d-block">{activeUsers}</span>
//                                             </a>
//                                             <div className="pt-4">
//                                                 <div className="d-flex align-items-center justify-content-between">
//                                                     <a
//                                                         href="javascript:void(0);"
//                                                         className="fs-12 fw-medium text-muted"
//                                                     >
//                                                         <span>Active Users</span>
//                                                         <i className="feather-link-2 fs-10 ms-1" />
//                                                     </a>
//                                                     <div>
//                                                         <span className="fs-12 text-muted">{totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="progress mt-2 ht-3">
//                                                     <div
//                                                         className="progress-bar bg-success"
//                                                         role="progressbar"
//                                                         style={{ width: `${totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0}%` }}
//                                                     ></div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="col-xxl-3 col-md-6">
//                                     <div className="card stretch stretch-full">
//                                         <div className="card-body">
//                                             <a href="javascript:void(0);" className="fw-bold d-block">
//                                                 <span className="d-block">Inactive</span>
//                                                 <span className="fs-24 fw-bolder d-block">{inactiveUsers}</span>
//                                             </a>
//                                             <div className="pt-4">
//                                                 <div className="d-flex align-items-center justify-content-between">
//                                                     <a
//                                                         href="javascript:void(0);"
//                                                         className="fs-12 fw-medium text-muted"
//                                                     >
//                                                         <span>Inactive Users</span>
//                                                         <i className="feather-link-2 fs-10 ms-1" />
//                                                     </a>
//                                                     <div>
//                                                         <span className="fs-12 text-muted">{totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0}%</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="progress mt-2 ht-3">
//                                                     <div
//                                                         className="progress-bar bg-warning"
//                                                         role="progressbar"
//                                                         style={{ width: `${totalUsers > 0 ? (inactiveUsers / totalUsers) * 100 : 0}%` }}
//                                                     ></div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="col-xxl-3 col-md-6">
//                                     <div className="card stretch stretch-full">
//                                         <div className="card-body">
//                                             <a href="javascript:void(0);" className="fw-bold d-block">
//                                                 <span className="d-block">Verified</span>
//                                                 <span className="fs-24 fw-bolder d-block">{verifiedUsers}</span>
//                                             </a>
//                                             <div className="pt-4">
//                                                 <div className="d-flex align-items-center justify-content-between">
//                                                     <a
//                                                         href="javascript:void(0);"
//                                                         className="fs-12 fw-medium text-muted"
//                                                     >
//                                                         <span>Verified Users</span>
//                                                         <i className="feather-link-2 fs-10 ms-1" />
//                                                     </a>
//                                                     <div>
//                                                         <span className="fs-12 text-muted">{totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0}%</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="progress mt-2 ht-3">
//                                                     <div
//                                                         className="progress-bar bg-danger"
//                                                         role="progressbar"
//                                                         style={{ width: `${totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0}%` }}
//                                                     ></div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div> */}
//                 </>

//                 <div className="main-content">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="card" id="leadsList">

//                                 <div className="card stretch stretch-full">
//                                     <div className="card-body p-0">
//                                         <div className="table-responsive table-card">
//                                             <table className="table align-middle table-hover" id="customerTable">
//                                                 <thead className="table-light">
//                                                     <tr>
//                                                         <th>#</th>
//                                                         <th>Role</th>
//                                                         <th>Permissions</th>
//                                                         <th>Status</th>
//                                                         <th>Created At</th>
//                                                         <th>Actions</th>
//                                                     </tr>
//                                                 </thead>

//                                                 <tbody>
//                                                     {roleList.map((role, index) => (
//                                                         <tr key={role._id}>
//                                                             <td>{index + 1}</td>
//                                                             <td>
//                                                                 <strong>{role.name}</strong>
//                                                             </td>

//                                                             {/* Permissions */}
//                                                             {/* <span class="badge badge-label bg-dark"><i class="mdi mdi-circle-medium"></i> Dark</span> */}
//                                                             <td>
//                                                                 <div className="d-flex flex-wrap gap-1">
//                                                                     {role.permissions.map((perm, pIndex) => (
//                                                                         <span key={pIndex} class="badge badge-label bg-dark "><i class="mdi mdi-circle-medium"></i>
//                                                                             {perm}
//                                                                         </span>

//                                                                     ))}
//                                                                 </div>
//                                                             </td>

//                                                             {/* Status */}
//                                                             <td>
//                                                                 {role.isActive ? (
//                                                                     <span className="badge bg-success-subtle text-success">Active</span>
//                                                                 ) : (
//                                                                     <span className="badge bg-danger-subtle text-danger">Inactive</span>
//                                                                 )}
//                                                             </td>

//                                                             {/* Created At */}
//                                                             <td>{new Date(role.createdAt).toLocaleDateString()}</td>

//                                                             {/* Actions */}
//                                                             <td>
//                                                                 <ul className="list-inline hstack gap-2 mb-0">
//                                                                     <li className="list-inline-item" title="View">
//                                                                         <Link to="#" style={{ color: "blue", fontSize: "16px" }}>
//                                                                             <i className="ri-eye-fill align-bottom" />
//                                                                         </Link>
//                                                                     </li>
//                                                                     <li className="list-inline-item" title="Edit">
//                                                                         <Link to="#permissionModalEdit" data-bs-toggle="modal" style={{ color: "green", fontSize: "16px" }} onClick={() => handleEdit(role._id)}>
//                                                                             <i className="ri-pencil-fill align-bottom" />
//                                                                         </Link>
//                                                                     </li>
//                                                                     <li className="list-inline-item" title="Delete">
//                                                                         <Link to="#deleteRecordModal" data-bs-toggle="modal" style={{ color: "red", fontSize: "16px" }} onClick={() => { setGetId(role._id); document.body.classList.remove('modal-open') }}>
//                                                                             <i className="ri-delete-bin-fill align-bottom" />
//                                                                         </Link>
//                                                                     </li>
//                                                                 </ul>
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>


//                                             <div className="noresult" style={{ display: "none" }}>
//                                                 <div className="text-center">
//                                                     <lord-icon
//                                                         src="https://cdn.lordicon.com/msoeawqm.json"
//                                                         trigger="loop"
//                                                         colors="primary:#121331,secondary:#08a88a"
//                                                         style={{ width: 75, height: 75 }}
//                                                     />
//                                                     <h5 className="mt-2">Sorry! No Result Found</h5>
//                                                     <p className="text-muted mb-0">
//                                                         We've searched more than 150+ leads We did not find any
//                                                         leads for you search.
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="d-flex justify-content-end mt-3">
//                                             <div className="pagination-wrap hstack gap-2">
//                                                 <Link className="page-item pagination-prev disabled" to="#">
//                                                     Previous
//                                                 </Link>
//                                                 <ul className="pagination listjs-pagination mb-0" />
//                                                 <Link className="page-item pagination-next" to="#">
//                                                     Next
//                                                 </Link>
//                                             </div>
//                                         </div>

//                                     </div>




//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                 </div>

//             </div>





//             <div className="modal fade" id="permissionModal" tabIndex={-1} aria-hidden="true">
//                 <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//                     <div className="modal-content border-0 rounded-4 overflow-hidden">

//                         <div className="modal-header px-4 py-3 bg-dark text-white">
//                             <div>
//                                 <h4 className="mb-0 fw-semibold text-white">

//                                     Role Architecture
//                                 </h4>
//                                 <small className="text-white-50">
//                                     Manage role, create & give actions permission
//                                 </small>
//                             </div>

//                             <button
//                                 type="button"
//                                 className="btn-close btn-close-white"
//                                 data-bs-dismiss="modal"
//                             />
//                         </div>

//                         <div className="modal-body p-4 bg-body-tertiary">

//                             <div className="card border-0 shadow-sm rounded-4 mb-4">
//                                 <div className="card-body">
//                                     <h6 className="fw-semibold mb-3 text-primary">
//                                         Role Details
//                                     </h6>

//                                     <div className="row g-3">
//                                         <div className="col-md-6">
//                                             <label className="form-label">Role Name</label>
//                                             <input
//                                                 className="form-control form-control-lg"
//                                                 placeholder="Admin, Manager, User"
//                                                 name="name"
//                                                 onChange={handleModuleChange}
//                                             />
//                                         </div>

//                                         <div className="col-md-6">
//                                             <label className="form-label">Status</label>
//                                             <select
//                                                 className="form-select form-select-lg"
//                                                 name="isActive"
//                                                 onChange={handleModuleChange}
//                                             >
//                                                 <option value="">Select Status</option>
//                                                 <option value={true}>Active</option>
//                                                 <option value={false}>Inactive</option>
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div>

//                                         {/* ================= TOP MODULE TABS ================= */}
//                                         <div className="d-flex gap-2 mb-3 flex-wrap module-tabs">
//                                             {permissionList?.map((mod) => (
//                                                 <button
//                                                     key={mod.module}
//                                                     className={`btn btn-sm module-btn ${activeModule === mod.module ? "active" : ""}`}
//                                                     onClick={() => setActiveModule(mod.module)}
//                                                 >
//                                                     {mod.moduleLabel}
//                                                 </button>
//                                             ))}
//                                         </div>


//                                         {/* ================= PERMISSION TABLE ================= */}

//                                         {currentModule && (
//                                             <div className="table-responsive border rounded">
//                                                 <table className="table align-middle mb-0">
//                                                     <thead className="table-light">
//                                                         <tr>
//                                                             <th style={{ width: "35%" }}>
//                                                                 <label className="d-flex align-items-center gap-2">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         className="form-check-input"
//                                                                         checked={
//                                                                             currentModule.submenus.length > 0
//                                                                                 ? isAllChecked(currentModule.submenus.flatMap((sub) => sub.actions.map((a) => a.key)))
//                                                                                 : selectedPermissions.includes(currentModule._id)
//                                                                         }
//                                                                         onChange={() => toggleModulePermissions(currentModule)}
//                                                                     />
//                                                                     {currentModule.moduleLabel}
//                                                                 </label>
//                                                             </th>
//                                                             <th>PERMISSIONS</th>
//                                                         </tr>
//                                                     </thead>

//                                                     <tbody>
//                                                         {currentModule.submenus.length > 0 ? (
//                                                             currentModule.submenus.map((sub) => {
//                                                                 const submenuKeys = sub.actions.map((a) => a.key);
//                                                                 return (
//                                                                     <tr key={sub._id}>
//                                                                         <td className="fw-medium">
//                                                                             <label className="d-flex align-items-center gap-2">
//                                                                                 <input
//                                                                                     type="checkbox"
//                                                                                     className="form-check-input"
//                                                                                     checked={isAllChecked(submenuKeys)}
//                                                                                     onChange={() => toggleSubmenuPermissions(sub)}
//                                                                                 />
//                                                                                 {sub.label}
//                                                                             </label>
//                                                                         </td>

//                                                                         <td>
//                                                                             <div className="d-flex gap-4 flex-wrap">
//                                                                                 {ACTION_COLUMNS.map((action) => {
//                                                                                     const actionObj = sub.actions.find((a) => a.label === action);
//                                                                                     if (!actionObj) return null;

//                                                                                     return (
//                                                                                         <label
//                                                                                             key={action}
//                                                                                             className="d-flex align-items-center gap-2"
//                                                                                             style={{ minWidth: "120px" }}
//                                                                                         >
//                                                                                             <input
//                                                                                                 type="checkbox"
//                                                                                                 className="form-check-input"
//                                                                                                 checked={selectedPermissions.includes(actionObj.key)}
//                                                                                                 onChange={() => togglePermission(actionObj.key)}
//                                                                                             />
//                                                                                             <span className="small fw-semibold">{action}</span>
//                                                                                         </label>
//                                                                                     );
//                                                                                 })}
//                                                                             </div>
//                                                                         </td>
//                                                                     </tr>
//                                                                 );
//                                                             })
//                                                         ) : (
//                                                             // ===== CASE: Empty submenus =====
//                                                             <tr key={currentModule._id}>
//                                                                 <td className="fw-medium">
//                                                                     <label className="d-flex align-items-center gap-2">
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="form-check-input"
//                                                                             checked={selectedPermissions.includes(currentModule._id)}
//                                                                             onChange={() => toggleModulePermissions(currentModule)}
//                                                                         />
//                                                                         {currentModule.moduleLabel}
//                                                                     </label>
//                                                                 </td>
//                                                                 <td>
//                                                                     <span className="text-muted small">No actions available</span>
//                                                                 </td>
//                                                             </tr>
//                                                         )}
//                                                     </tbody>
//                                                 </table>
//                                             </div>
//                                         )}


//                                         <pre className="mt-3 bg-light p-2 small">
//                                             {JSON.stringify(selectedPermissions, null, 2)}
//                                         </pre>

//                                     </div>


//                                 </div>
//                             </div>

//                             {/* Additional form fields for permissions can be added here */}


//                         </div>

//                         <div className="modal-footer bg-white px-4 py-3">
//                             <button className="btn btn-light rounded-3" data-bs-dismiss="modal" >
//                                 Cancel
//                             </button>

//                             <button className="btn btn-dark rounded-3 px-4" onClick={handleSubmit} data-bs-dismiss="modal" >
//                                 Save Permission
//                             </button>
//                         </div>

//                     </div>
//                 </div>
//             </div>


//             <div className="modal fade" id="permissionModalEdit" tabIndex={-1} aria-hidden="true">
//                 <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//                     <div className="modal-content border-0 rounded-4 overflow-hidden">


//                         <div className="modal-header px-4 py-3 bg-dark text-white">
//                             <div>
//                                 <h4 className="mb-0 fw-semibold text-white">

//                                     Role Architecture
//                                 </h4>
//                                 <small className="text-white-50">
//                                     Manage role, create & give actions permission
//                                 </small>
//                             </div>

//                             <button
//                                 type="button"
//                                 className="btn-close btn-close-white"
//                                 data-bs-dismiss="modal"
//                             />
//                         </div>

//                         <div className="modal-body p-4 bg-body-tertiary">

//                             <div className="card border-0 shadow-sm rounded-4 mb-4">
//                                 <div className="card-body">
//                                     <h6 className="fw-semibold mb-3 text-primary">
//                                         Role Details
//                                     </h6>

//                                     <div className="row g-3">
//                                         <div className="col-md-6">
//                                             <label className="form-label">Role Name</label>
//                                             <input
//                                                 className="form-control form-control-lg"
//                                                 placeholder="Admin, Manager, User"
//                                                 name="name"
//                                                 value={moduleData.name}
//                                                 onChange={handleModuleChange}
//                                             />
//                                         </div>

//                                         <div className="col-md-6">
//                                             <label className="form-label">Status</label>
//                                             <select
//                                                 className="form-select form-select-lg"
//                                                 name="isActive"
//                                                 value={moduleData.isActive}
//                                                 onChange={handleModuleChange}
//                                             >
//                                                 <option value="">Select Status</option>
//                                                 <option value={true}>Active</option>
//                                                 <option value={false}>Inactive</option>
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div>

//                                         {/* ================= TOP MODULE TABS ================= */}
//                                         <div className="d-flex gap-2 mb-3 flex-wrap module-tabs">
//                                             {permissionList?.map((mod) => (
//                                                 <button
//                                                     key={mod.module}
//                                                     className={`btn btn-sm module-btn ${activeModule === mod.module ? "active" : ""}`}
//                                                     onClick={() => setActiveModule(mod.module)}
//                                                 >
//                                                     {mod.moduleLabel}
//                                                 </button>
//                                             ))}
//                                         </div>


//                                         {/* ================= PERMISSION TABLE ================= */}
//                                         {currentModule && (
//                                             <div className="table-responsive border rounded">
//                                                 <table className="table align-middle mb-0">
//                                                     <thead className="table-light">
//                                                         <tr>
//                                                             <th style={{ width: "35%" }}>
//                                                                 <label className="d-flex align-items-center gap-2">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         className="form-check-input"
//                                                                         checked={
//                                                                             currentModule.submenus.length > 0
//                                                                                 ? isAllChecked(currentModule.submenus.flatMap((sub) => sub.actions.map((a) => a.key)))
//                                                                                 : selectedPermissions.includes(currentModule._id)
//                                                                         }
//                                                                         onChange={() => toggleModulePermissions(currentModule)}
//                                                                     />
//                                                                     {currentModule.moduleLabel}
//                                                                 </label>
//                                                             </th>
//                                                             <th>PERMISSIONS</th>
//                                                         </tr>
//                                                     </thead>

//                                                     <tbody>
//                                                         {currentModule.submenus.length > 0 ? (
//                                                             currentModule.submenus.map((sub) => {
//                                                                 const submenuKeys = sub.actions.map((a) => a.key);
//                                                                 return (
//                                                                     <tr key={sub._id}>
//                                                                         <td className="fw-medium">
//                                                                             <label className="d-flex align-items-center gap-2">
//                                                                                 <input
//                                                                                     type="checkbox"
//                                                                                     className="form-check-input"
//                                                                                     checked={isAllChecked(submenuKeys)}
//                                                                                     onChange={() => toggleSubmenuPermissions(sub)}
//                                                                                 />
//                                                                                 {sub.label}
//                                                                             </label>
//                                                                         </td>

//                                                                         <td>
//                                                                             <div className="d-flex gap-4 flex-wrap">
//                                                                                 {ACTION_COLUMNS.map((action) => {
//                                                                                     const actionObj = sub.actions.find((a) => a.label === action);
//                                                                                     if (!actionObj) return null;

//                                                                                     return (
//                                                                                         <label
//                                                                                             key={action}
//                                                                                             className="d-flex align-items-center gap-2"
//                                                                                             style={{ minWidth: "120px" }}
//                                                                                         >
//                                                                                             <input
//                                                                                                 type="checkbox"
//                                                                                                 className="form-check-input"
//                                                                                                 checked={selectedPermissions.includes(actionObj.key)}
//                                                                                                 onChange={() => togglePermission(actionObj.key)}
//                                                                                             />
//                                                                                             <span className="small fw-semibold">{action}</span>
//                                                                                         </label>
//                                                                                     );
//                                                                                 })}
//                                                                             </div>
//                                                                         </td>
//                                                                     </tr>
//                                                                 );
//                                                             })
//                                                         ) : (
//                                                             // ===== CASE: Empty submenus =====
//                                                             <tr key={currentModule._id}>
//                                                                 <td className="fw-medium">
//                                                                     <label className="d-flex align-items-center gap-2">
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             className="form-check-input"
//                                                                             checked={selectedPermissions.includes(currentModule._id)}
//                                                                             onChange={() => toggleModulePermissions(currentModule)}
//                                                                         />
//                                                                         {currentModule.moduleLabel}
//                                                                     </label>
//                                                                 </td>
//                                                                 <td>
//                                                                     <span className="text-muted small">No actions available</span>
//                                                                 </td>
//                                                             </tr>
//                                                         )}
//                                                     </tbody>
//                                                 </table>
//                                             </div>
//                                         )}


//                                         {/* <pre className="mt-3 bg-light p-2 small">
//                                             {JSON.stringify(selectedPermissions, null, 2)}
//                                         </pre> */}

//                                     </div>


//                                 </div>
//                             </div>

//                             {/* Additional form fields for permissions can be added here */}


//                         </div>


//                         <div className="modal-footer bg-white px-4 py-3">
//                             <button
//                                 className="btn btn-light rounded-3"
//                                 data-bs-dismiss="modal"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 className="btn btn-dark rounded-3 px-4"
//                                 onClick={handleEditSubmit}
//                             >
//                                 Save Permission
//                             </button>
//                         </div>

//                     </div>
//                 </div>
//             </div>


//             <div className="modal fade zoomIn" id="deleteRecordModal" tabIndex={-1} aria-labelledby="deleteRecordLabel" aria-hidden="true" >
//                 <div className="modal-dialog modal-dialog-centered">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <button
//                                 type="button"
//                                 className="btn-close"
//                                 data-bs-dismiss="modal"
//                                 aria-label="Close"
//                                 id="btn-close"
//                             />
//                         </div>
//                         <div className="modal-body p-5 text-center">
//                             <lord-icon
//                                 src="https://cdn.lordicon.com/gsqxdxog.json"
//                                 trigger="loop"
//                                 colors="primary:#405189,secondary:#f06548"
//                                 style={{ width: 90, height: 90 }}
//                             />
//                             <div className="mt-4 text-center">
//                                 <h4 className="fs-semibold">
//                                     You are about to delete a lead ?
//                                 </h4>
//                                 <p className="text-muted fs-14 mb-4 pt-1">
//                                     Deleting your lead will remove all of your information
//                                     from our database.
//                                 </p>
//                                 <div className="hstack gap-2 justify-content-center remove">
//                                     <button
//                                         className="btn btn-link link-success fw-medium text-decoration-none"
//                                         id="deleteRecord-close"
//                                         data-bs-dismiss="modal"
//                                     >
//                                         <i className="ri-close-line me-1 align-middle" />
//                                         Close
//                                     </button>
//                                     <button className="btn btn-danger" id="delete-record" onClick={handleDeletePermission}>
//                                         Yes, Delete It!!
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>


//         </>
//     );
// }





import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
import "./roleModule.css"
import { Link } from "react-router-dom";
const DEFAULT_ACTIONS = ["view", "create", "update", "delete"];
const ACTION_COLUMNS = ["VIEW", "CREATE", "UPDATE", "DELETE", "SHOW"];
import { useSelector } from "react-redux";

export default function RoleManagement() {

    const { user } = useSelector(state => state.auth)

    const [moduleData, setModuleData] = useState({
        role: "",
        isActive: true,
        restaurant: user?.restaurant._id || ""

    });
    const [permissionList, setPermissionList] = useState([])
    const [roleList, setRoleList] = useState([]);
    const [roleAssign, setRoleAssign] = useState([]);
    const [singleRoleAssignPermission, setSingleRoleAssignPermission] = useState();
    const [getId, setGetId] = useState('');
    const [openModules, setOpenModules] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState([]);


    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const [resRole, resPermission, resRoleAssign,singleRoleAssignPermissions] = await Promise.all([
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_ROLES"],
                        { withCredentials: true }
                    ),
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_PERMISSION"],
                        { withCredentials: true }
                    ),
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_ALL_ROLE_ASSIGN_PERMISSION"],
                        { withCredentials: true }
                    )
                    ,
                    axiosInstance.get(
                        Config.END_POINT_LIST["GET_SINGLE_ROLE_ASSIGN_PERMISSION"],
                        { withCredentials: true }
                    )
                ]);

                if (resRoleAssign.data.success) {
                    setPermissionList(resPermission.data.data);
                    setRoleList(resRole.data.data);

                    // ✅ YAHI MAIN FIX HAI
                    setRoleAssign(resRoleAssign.data.data);

                    console.log("Role Assign Data:", resRoleAssign.data.data);
                }
                if(singleRoleAssignPermissions.data.success){
                    setSingleRoleAssignPermission(singleRoleAssignPermissions.data.data[0].permissions);
                }

            } catch (err) {
                showErrorMsg(err.response?.data?.message || "Something went wrong");
            }
        };

        fetchPermissions();
    }, []);


    const handleModuleChange = (e) => {
        setModuleData({ ...moduleData, [e.target.name]: e.target.value });
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

            console.log(moduleData, selectedPermissions)

            const res = await axiosInstance.post(
                Config.END_POINT_LIST["ROLE_ASSIGN_PERMISSION"],
                {
                    role: moduleData.role,
                    isActive: moduleData.isActive,
                    permissions: selectedPermissions,
                    restaurant: moduleData.restaurant

                },
                { withCredentials: true }
            );
            if (res.data.success) {
                showSuccessMsg("Role Created Successfully");
                setModuleData({ role: "", isActive: true, restaurant: "" });
                setSelectedPermissions([]);
                setRoleList([...roleList, res.data.data]);
                // module close
                document.querySelector('#permissionModal .btn-close').click();
            }
            else {
                showErrorMsg(res.data.message || "Something went wrong");
            }

            // }
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
            const role = roleAssign.find(item => item._id === id);

            if (role) {
                setModuleData({
                    name: role.role.name,
                    isActive: role.isActive,
                });
                setSelectedPermissions(role.permissions);
            }


        } catch (error) {
            console.log(error);
        }
    };

    const handleEditSubmit = async () => {
        try {
            console.log(moduleData, selectedPermissions)
            debugger
            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST["UPDATE_ROLE_PERMISSION"]}/${getId}`,
                {

                    name: moduleData.name,
                    isActive: moduleData.isActive,
                    permissions: selectedPermissions
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Role Updated Successfully");
                setModuleData({ name: "", isActive: true });
                setSelectedPermissions([]);
                setRoleList(roleList.map(item => item._id === getId ? res.data.data : item));
                setRoleAssign(roleAssign.map(item => item._id === getId ? res.data.data : item))
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
                `${Config.END_POINT_LIST["DELETE_ROLE_ASSIGN_PERMISSION"]}/${getId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Role Permission Module Deleted Successfully");
                setRoleList(roleList.filter(item => item._id !== getId));
                setRoleAssign(roleAssign.map(item => item._id === getId ? res.data.data : item))

                document.querySelector('#deleteRecordModal .btn-close').click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const [activeModule, setActiveModule] = useState("");

    useEffect(() => {
        if (singleRoleAssignPermission && singleRoleAssignPermission.length > 0) {
            setActiveModule(singleRoleAssignPermission[0].module);
        }
    }, [singleRoleAssignPermission]);


    /* ================= CURRENT MODULE ================= */
    const currentModule = useMemo(
        () => singleRoleAssignPermission?.find(m => m.module === activeModule),
        [singleRoleAssignPermission, activeModule]
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


console.log("singleRoleAssignPermission",singleRoleAssignPermission)

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
                                                        <th>Permissions</th>
                                                        <th>Status</th>
                                                        <th>Created At</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {roleAssign.map((role, index) => (
                                                        <tr key={role._id}>
                                                            <td>{index + 1}</td>

                                                            {/* Role Name */}
                                                            <td>
                                                                <strong>{role?.role?.name}</strong>
                                                            </td>

                                                            {/* Permissions */}
                                                            <td>
                                                                <div className="d-flex flex-wrap gap-1">
                                                                    {role.permissions.map((perm, pIndex) => (
                                                                        <span
                                                                            key={pIndex}
                                                                            className="badge badge-label bg-dark"
                                                                        >
                                                                            <i className="mdi mdi-circle-medium"></i>
                                                                            {perm}
                                                                        </span>
                                                                    ))}

                                                                    {role.permissions.length > 5 && (
                                                                        <span className="badge bg-secondary">
                                                                            +{role.permissions.length - 5} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Status */}
                                                            <td>
                                                                {role.isActive ? (
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
                                                                {new Date(role.createdAt).toLocaleDateString("en-IN")}
                                                            </td>

                                                            {/* Actions */}
                                                            <td>
                                                                <ul className="list-inline hstack gap-2 mb-0">
                                                                    <li className="list-inline-item" title="View">
                                                                        <Link to="#" style={{ color: "blue", fontSize: "16px" }}>
                                                                            <i className="ri-eye-fill" />
                                                                        </Link>
                                                                    </li>

                                                                    <li className="list-inline-item" title="Edit">
                                                                        <Link
                                                                            to="#permissionModalEdit"
                                                                            data-bs-toggle="modal"
                                                                            style={{ color: "green", fontSize: "16px" }}
                                                                            onClick={() => handleEdit(role._id)}
                                                                        >
                                                                            <i className="ri-pencil-fill" />
                                                                        </Link>
                                                                    </li>

                                                                    <li className="list-inline-item" title="Delete">
                                                                        <Link
                                                                            to="#deleteRecordModal"
                                                                            data-bs-toggle="modal"
                                                                            style={{ color: "red", fontSize: "16px" }}
                                                                            onClick={() => { setGetId(role._id); document.body.classList.remove('modal-open') }}
                                                                        >
                                                                            <i className="ri-delete-bin-fill" />
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
                                            {/* <input
                                                className="form-control form-control-lg"
                                                placeholder="Admin, Manager, User"
                                                name="name"
                                                onChange={handleModuleChange}
                                            /> */}
                                            <select className="form-select form-select-lg" name="role" onChange={handleModuleChange} >
                                                <option value="">Select Role</option>
                                                {roleList.map((role) => (
                                                    <option key={role._id} value={role._id}>{role.name}</option>
                                                ))}
                                            </select>
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

                                        {/* ================= TOP MODULE TABS ================= */}
                                        <div className="d-flex gap-2 mb-3 flex-wrap module-tabs">
                                            {singleRoleAssignPermission?.map((mod) => (
                                                <button
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

                            {/* Additional form fields for permissions can be added here */}


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

                                        {/* ================= TOP MODULE TABS ================= */}
                                        <div className="d-flex gap-2 mb-3 flex-wrap module-tabs">
                                            {singleRoleAssignPermission?.map((mod) => (
                                                <button
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

