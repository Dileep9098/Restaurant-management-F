// import React from 'react'

// export default function KitchenDisplay() {
//   return (
//     <div>

//     </div>
//   )
// }



// import React, { useEffect, useMemo, useState } from "react";
// import axiosInstance from "../../../apiHandler/axiosInstance";
// import Config from "../../../Config/Config";
// import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";



// export default function KitchenDisplay() {
//     const { user, permissions } = useSelector(state => state.auth)
//     console.log(user)
//     const canCreateCategory = permissions.includes("categories.create");
//     const canEdit = permissions.includes("categories.update");
//     const canDelete = permissions.includes("categories.delete");


//     const [menuData, setMenuData] = useState({
//         restaurant: user?.restaurant?._id || "",
//         category: "",
//         name: "",
//         description: "",
//         image: [],
//         basePrice: 0,
//         hasVariants: false,
//         hasAddOns: false,
//         tax: "",
//         isVeg: false,
//         isAvailable: true,
//         availableFor: {
//             dineIn: true,
//             takeaway: true,
//             online: true
//         },
//         sortOrder: 0
//     });

//     const [filePreview, setFilePreview] = useState(null);

//     const [getId, setGetId] = useState(null);

//     const [allMenuItem, setAllMenuItem] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [allTax, setAllTax] = useState([]);

//     const [files, setFiles] = useState([]);
//     const [openModules, setOpenModules] = useState({});



//     useEffect(() => {
//         const fetchMenuItem = async () => {
//             try {

//                 const [resMenuItem, resCategory, resTax] = await Promise.all([
//                     axiosInstance.get(
//                         Config.END_POINT_LIST["GET_ALL_MENU_ITEMS"],
//                         { withCredentials: true }
//                     ),
//                     axiosInstance.get(
//                         Config.END_POINT_LIST["GET_ALL_CATEGORIES"],
//                         { withCredentials: true }
//                     ),
//                     axiosInstance.get(
//                         Config.END_POINT_LIST["GET_ALL_TAXES"],
//                         { withCredentials: true }
//                     )


//                 ]);
//                 if (resMenuItem.data.success) {
//                     // console.log("Existing Permissions:", res.data.data);
//                     setAllMenuItem(resMenuItem.data.data);
//                 }
//                 if (resCategory.data.success) {
//                     setAllCategory(resCategory.data.data);
//                 }
//                 if (resTax.data.success) {
//                     setAllTax(resTax.data.data);
//                 }

//             } catch (err) {

//                 showErrorMsg(err.response?.data?.message || "Something went wrong");
//             }
//         };
//         fetchMenuItem();

//     }, [])

//     const handleChange = (e) => {
//         const { name, type, checked, value } = e.target;

//         setMenuData(prev => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value
//         }));
//     };

//     const handleFileChange = (e) => {
//         const selectedFiles = Array.from(e.target.files);
//         setFiles(selectedFiles);

//         if (selectedFiles.length) {
//             const previews = selectedFiles.map(file => URL.createObjectURL(file));
//             setFilePreview(previews);
//         } else {
//             setFilePreview([]);
//         }
//     };


//     // ===== SUBMIT =====
//     const handleSubmit = async () => {
//         try {
//             if (!menuData.name.trim()) {
//                 return showErrorMsg("Item name is required");
//             }

//             if (!menuData.category) {
//                 return showErrorMsg("Category is required");
//             }

//             const myForm = new FormData();

//             myForm.append("restaurant", menuData.restaurant);
//             myForm.append("category", menuData.category);
//             myForm.append("name", menuData.name);
//             myForm.append("description", menuData.description);
//             myForm.append("basePrice", menuData.basePrice);
//             myForm.append("tax", menuData.tax || "");
//             myForm.append("isVeg", menuData.isVeg);
//             myForm.append("isAvailable", menuData.isAvailable);
//             myForm.append("hasVariants", menuData.hasVariants);
//             myForm.append("hasAddOns", menuData.hasAddOns);
//             myForm.append("sortOrder", menuData.sortOrder);

//             myForm.append("availableFor[dineIn]", menuData.availableFor.dineIn);
//             myForm.append("availableFor[takeaway]", menuData.availableFor.takeaway);
//             myForm.append("availableFor[online]", menuData.availableFor.online);

//             if (files?.length) {
//                 files.forEach(file => {
//                     myForm.append("image", file);
//                 });
//             }

//             const res = await axiosInstance.post(
//                 Config.END_POINT_LIST["CREATE_MENU_ITEM"],
//                 myForm,
//                 { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
//             );

//             if (res.data.success) {
//                 showSuccessMsg("Menu Item Created Successfully");

//                 setAllMenuItem([...allMenuItem, res.data.data]);

//                 setMenuData({
//                     restaurant: user?.restaurant?._id || "",
//                     category: "",
//                     name: "",
//                     description: "",
//                     image: [],
//                     basePrice: 0,
//                     tax: "",
//                     hasVariants: false,
//                     hasAddOns: false,
//                     isVeg: false,
//                     isAvailable: true,
//                     availableFor: {
//                         dineIn: true,
//                         takeaway: true,
//                         online: true
//                     },
//                     sortOrder: 0
//                 });

//                 setFiles([]);
//                 setFilePreview([]);
//                 document.querySelector('#menuItemModal .btn-close')?.click();
//             }
//         } catch (err) {
//             showErrorMsg(err.response?.data?.message || "Something went wrong");
//         }
//     };

//     const handleEdit = (id) => {
//         const item = allMenuItem.find(i => i._id === id);
//         if (!item) return;

//         document.body.classList.remove("modal-open");
//         setGetId(id);

//         setMenuData({
//             restaurant: item.restaurant,
//             category: item.category._id,
//             name: item.name,
//             description: item.description || "",
//             image: item.image || [],
//             basePrice: item.basePrice,
//             tax: item.tax._id || "",
//             hasVariants: item.hasVariants,
//             hasAddOns: item.hasAddOns,
//             isVeg: item.isVeg,
//             isAvailable: item.isAvailable,
//             availableFor: item.availableFor,
//             sortOrder: item.sortOrder
//         });

//         setFilePreview(
//             item.image?.map(img => `assets/images/menu/${img}`) || []
//         );
//     };


//     const handleEditSubmit = async () => {
//         try {
//             if (!getId) return;

//             if (!menuData.name.trim()) {
//                 return showErrorMsg("Item name is required");
//             }

//             const myForm = new FormData();

//             myForm.append("restaurant", menuData.restaurant);
//             myForm.append("category", menuData.category);
//             myForm.append("name", menuData.name);
//             myForm.append("description", menuData.description);
//             myForm.append("basePrice", menuData.basePrice);
//             myForm.append("tax", menuData.tax || "");
//             myForm.append("isVeg", menuData.isVeg);
//             myForm.append("isAvailable", menuData.isAvailable);
//             myForm.append("hasVariants", menuData.hasVariants);
//             myForm.append("hasAddOns", menuData.hasAddOns);
//             myForm.append("sortOrder", menuData.sortOrder);

//             myForm.append("availableFor[dineIn]", menuData.availableFor.dineIn);
//             myForm.append("availableFor[takeaway]", menuData.availableFor.takeaway);
//             myForm.append("availableFor[online]", menuData.availableFor.online);

//             if (files?.length) {
//                 files.forEach(file => {
//                     myForm.append("image", file);
//                 });
//             }

//             const res = await axiosInstance.put(
//                 `${Config.END_POINT_LIST["UPDATE_MENU_ITEM"]}/${getId}`,
//                 myForm,
//                 { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
//             );

//             if (res.data.success) {
//                 showSuccessMsg("Menu Item Updated Successfully");

//                 setAllMenuItem(
//                     allMenuItem.map(item =>
//                         item._id === getId ? res.data.data : item
//                     )
//                 );

//                 setGetId(null);
//                 document.querySelector('#menuItemModalEdit .btn-close')?.click();
//             }
//         } catch (err) {
//             showErrorMsg(err.response?.data?.message || "Something went wrong");
//         }
//     };

//     const handleDeletePermission = async () => {
//         try {

//             const res = await axiosInstance.delete(
//                 `${Config.END_POINT_LIST["DELETE_MENU_ITEM"]}/${getId}`,
//                 { withCredentials: true }
//             );

//             if (res.data.success) {
//                 showSuccessMsg("Permission Module Deleted Successfully");
//                 setAllMenuItem(allMenuItem.filter(item => item._id !== getId));
//                 // close modal
//                 document.querySelector('#deleteRecordModal .btn-close').click();
//             }
//         } catch (err) {
//             showErrorMsg(err.response?.data?.message || "Something went wrong");
//         }
//     };


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

//     const handleRemoveFile = (index) => {
//         const updatedFiles = [...files];
//         const updatedPreviews = [...filePreview];

//         updatedFiles.splice(index, 1);
//         updatedPreviews.splice(index, 1);

//         setFiles(updatedFiles);
//         setFilePreview(updatedPreviews);
//     };

//     const [searchTerm, setSearchTerm] = useState('');
//     // const [nameFilter, setNameFilter] = useState('');
//     const [restaurantNameFilter, setRestaurantNameFilter] = useState('');
//     // const [dateFrom, setDateFrom] = useState('');
//     // const [dateTo, setDateTo] = useState('');
//     const [selectedFilter, setSelectedFilter] = useState('all');

//     const [nameFilter, setNameFilter] = useState("");
//     const [categoryFilter, setCategoryFilter] = useState("");
//     const [foodTypeFilter, setFoodTypeFilter] = useState("all");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [priceFrom, setPriceFrom] = useState("");
//     const [priceTo, setPriceTo] = useState("");
//     const [dateFrom, setDateFrom] = useState("");
//     const [dateTo, setDateTo] = useState("");
//     const [vegItems, setVegItems] = useState(0);
//     const [totalItems, setTotalItems] = useState(0);


//     const filteredMenuItems = allMenuItem.filter(item => {
//         const matchesName =
//             !nameFilter ||
//             item.name.toLowerCase().includes(nameFilter.toLowerCase());

//         const matchesCategory =
//             !categoryFilter ||
//             item.category?.name?.toLowerCase().includes(categoryFilter.toLowerCase());

//         const matchesFoodType =
//             foodTypeFilter === "all" ||
//             (foodTypeFilter === "veg" && item.isVeg) ||
//             (foodTypeFilter === "non-veg" && !item.isVeg);

//         const matchesStatus =
//             statusFilter === "all" ||
//             (statusFilter === "active" && item.isAvailable) ||
//             (statusFilter === "inactive" && !item.isAvailable);

//         const matchesPriceFrom =
//             !priceFrom || item.basePrice >= Number(priceFrom);

//         const matchesPriceTo =
//             !priceTo || item.basePrice <= Number(priceTo);

//         const itemDate = new Date(item.createdAt);
//         const matchesDateFrom = !dateFrom || itemDate >= new Date(dateFrom);
//         const matchesDateTo = !dateTo || itemDate <= new Date(dateTo);

//         return (
//             matchesName &&
//             matchesCategory &&
//             matchesFoodType &&
//             matchesStatus &&
//             matchesPriceFrom &&
//             matchesPriceTo &&
//             matchesDateFrom &&
//             matchesDateTo
//         );
//     });

//     const nonVegItems = filteredMenuItems.filter(i => !i.isVeg && i.isNonVeg).length;
//     const vegNonVegItems = filteredMenuItems.filter(i => i.isVeg && i.isNonVeg).length;
//     const activeItems = filteredMenuItems.filter(i => i.isActive).length;
//     const inactiveItems = filteredMenuItems.filter(i => !i.isActive).length;

//     return (
//         <>

//             <div className="nxl-content">
//                 <>

//                     <div className="page-header">

//                         <div className="page-header-left d-flex align-items-center">
//                             <div className="page-header-title">
//                                 <h5 className="m-b-10">Menu Management</h5>
//                             </div>
//                             <ul className="breadcrumb">
//                                 <li className="breadcrumb-item">
//                                     <a href="index.html">Dashboard</a>
//                                 </li>
//                                 <li className="breadcrumb-item">Menu Management</li>
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
//                                     <div className="dropdown">
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

//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('active')}>
//                                                 <span className="wd-7 ht-7 bg-success rounded-circle d-inline-block me-3" />
//                                                 <span>Active</span>
//                                             </a>
//                                             <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter('inactive')}>
//                                                 <span className="wd-7 ht-7 bg-danger rounded-circle d-inline-block me-3" />
//                                                 <span>Inactive</span>
//                                             </a>

//                                         </div>
//                                     </div>
//                                     <div className="dropdown">
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
//                                     </div>
//                                     {canCreateCategory && (
//                                         <a
//                                             href="#"
//                                             className="btn btn-primary"
//                                             data-bs-toggle="modal"
//                                             id="create-btn"
//                                             data-bs-target="#menuItemModal"
//                                             onClick={() =>
//                                                 document.body.classList.remove("pace-done", "modal-open")
//                                             }
//                                         >
//                                             <i className="feather-plus me-2" />
//                                             <span>Create Menu Item</span>
//                                         </a>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="d-md-none d-flex align-items-center">
//                                 <a href="javascript:void(0)" className="page-header-right-open-toggle">
//                                     <i className="feather-align-right fs-20" />
//                                 </a>
//                             </div>

//                         </div>
//                     </div>
//                     <div id="collapseOne" className="accordion-collapse collapse page-header-collapse" >
//                         <div className="accordion-body pb-2">
//                             <div className="row mb-3">
//                                 {/* Item Name */}
//                                 <div className="col-md-4">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         placeholder="Filter by Item Name"
//                                         value={nameFilter}
//                                         onChange={(e) => setNameFilter(e.target.value)}
//                                     />
//                                 </div>

//                                 {/* Category */}
//                                 <div className="col-md-4">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         placeholder="Filter by Category"
//                                         value={categoryFilter}
//                                         onChange={(e) => setCategoryFilter(e.target.value)}
//                                     />
//                                 </div>

//                                 {/* Food Type */}
//                                 <div className="col-md-4">
//                                     <select
//                                         className="form-select"
//                                         value={foodTypeFilter}
//                                         onChange={(e) => setFoodTypeFilter(e.target.value)}
//                                     >
//                                         <option value="all">All Food Types</option>
//                                         <option value="veg">Veg</option>
//                                         <option value="non-veg">Non-Veg</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             <div className="row mb-3">
//                                 {/* Price Range */}
//                                 <div className="col-md-3">
//                                     <input
//                                         type="number"
//                                         className="form-control"
//                                         placeholder="Price From"
//                                         value={priceFrom}
//                                         onChange={(e) => setPriceFrom(e.target.value)}
//                                     />
//                                 </div>

//                                 <div className="col-md-3">
//                                     <input
//                                         type="number"
//                                         className="form-control"
//                                         placeholder="Price To"
//                                         value={priceTo}
//                                         onChange={(e) => setPriceTo(e.target.value)}
//                                     />
//                                 </div>

//                                 {/* Status */}
//                                 <div className="col-md-3">
//                                     <select
//                                         className="form-select"
//                                         value={statusFilter}
//                                         onChange={(e) => setStatusFilter(e.target.value)}
//                                     >
//                                         <option value="all">All Status</option>
//                                         <option value="active">Active</option>
//                                         <option value="inactive">Inactive</option>
//                                     </select>
//                                 </div>

//                                 {/* Date */}
//                                 <div className="col-md-3">
//                                     <input
//                                         type="date"
//                                         className="form-control"
//                                         value={dateFrom}
//                                         onChange={(e) => setDateFrom(e.target.value)}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="row">
//                                 <div className="col-xxl-3 col-md-6">
//                                     <div className="card stretch stretch-full">
//                                         <div className="card-body">
//                                             <a href="javascript:void(0);" className="fw-bold d-block">
//                                                 <span className="d-block">Veg Items</span>
//                                                 <span className="fs-24 fw-bolder d-block">{vegItems}</span>
//                                             </a>
//                                             <div className="pt-4">
//                                                 <div className="d-flex align-items-center justify-content-between">
//                                                     <a href="javascript:void(0);" className="fs-12 fw-medium text-muted">
//                                                         <span>Veg Items</span>
//                                                     </a>
//                                                     <div>
//                                                         <span className="fs-12 text-muted">{totalItems > 0 ? Math.round((vegItems / totalItems) * 100) : 0}%</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="progress mt-2 ht-3">
//                                                     <div
//                                                         className="progress-bar bg-success"
//                                                         role="progressbar"
//                                                         style={{ width: `${totalItems > 0 ? (vegItems / totalItems) * 100 : 0}%` }}
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
//                                                 <span className="d-block">Non-Veg Items</span>
//                                                 <span className="fs-24 fw-bolder d-block">{nonVegItems}</span>
//                                             </a>
//                                             <div className="pt-4">
//                                                 <div className="d-flex align-items-center justify-content-between">
//                                                     <a href="javascript:void(0);" className="fs-12 fw-medium text-muted">
//                                                         <span>Non-Veg Items</span>
//                                                     </a>
//                                                     <div>
//                                                         <span className="fs-12 text-muted">{totalItems > 0 ? Math.round((nonVegItems / totalItems) * 100) : 0}%</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="progress mt-2 ht-3">
//                                                     <div
//                                                         className="progress-bar bg-danger"
//                                                         role="progressbar"
//                                                         style={{ width: `${totalItems > 0 ? (nonVegItems / totalItems) * 100 : 0}%` }}
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
//                                                 <span className="d-block">Active Items</span>
//                                                 <span className="fs-24 fw-bolder d-block">{activeItems}</span>
//                                             </a>
//                                             <div className="pt-4">
//                                                 <div className="d-flex align-items-center justify-content-between">
//                                                     <span className="fs-12 text-muted">Active Items</span>
//                                                     <div>
//                                                         <span className="fs-12 text-muted">{totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0}%</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="progress mt-2 ht-3">
//                                                     <div
//                                                         className="progress-bar bg-primary"
//                                                         role="progressbar"
//                                                         style={{ width: `${totalItems > 0 ? (activeItems / totalItems) * 100 : 0}%` }}
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
//                                                 <span className="d-block">Inactive Items</span>
//                                                 <span className="fs-24 fw-bolder d-block">{inactiveItems}</span>
//                                             </a>
//                                             <div className="pt-4">
//                                                 <div className="d-flex align-items-center justify-content-between">
//                                                     <span className="fs-12 text-muted">Inactive Items</span>
//                                                     <div>
//                                                         <span className="fs-12 text-muted">{totalItems > 0 ? Math.round((inactiveItems / totalItems) * 100) : 0}%</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="progress mt-2 ht-3">
//                                                     <div
//                                                         className="progress-bar bg-warning"
//                                                         role="progressbar"
//                                                         style={{ width: `${totalItems > 0 ? (inactiveItems / totalItems) * 100 : 0}%` }}
//                                                     ></div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                         </div>
//                     </div>

//                 </>

//                 <div className="main-content">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="card" id="leadsList">

//                                 <div className="card stretch stretch-full">
//                                     <div className="card-body p-0">
//                                         <div className="table-responsive table-card">
//                                             <table className="table align-middle table-hover" id="menuItemTable">
//                                                 <thead className="table-light">
//                                                     <tr>
//                                                         <th>#</th>
//                                                         <th>Images</th>
//                                                         <th>Item Name</th>
//                                                         <th>Category</th>
//                                                         <th>Price</th>
//                                                         <th>Food Type</th>
//                                                         <th>Status</th>
//                                                         <th>Created At</th>
//                                                         <th>Actions</th>
//                                                     </tr>
//                                                 </thead>

//                                                 <tbody>
//                                                     {filteredMenuItems.length === 0 ? (
//                                                         <tr>
//                                                             <td colSpan="9" className="text-center text-muted">
//                                                                 No menu items found
//                                                             </td>
//                                                         </tr>
//                                                     ) : (
//                                                         filteredMenuItems.map((item, index) => (
//                                                             <tr key={item._id}>
//                                                                 <td>{index + 1}</td>

//                                                                 {/* Images */}
//                                                                 <td>
//                                                                     {item.image?.length ? (
//                                                                         <img
//                                                                             src={`assets/images/menu/${item.image[0]}`}
//                                                                             alt={item.name}
//                                                                             style={{
//                                                                                 width: "80px",
//                                                                                 height: "80px",
//                                                                                 objectFit: "cover",
//                                                                                 borderRadius: "6px"
//                                                                             }}
//                                                                         />
//                                                                     ) : (
//                                                                         <span className="text-muted">No Image</span>
//                                                                     )}
//                                                                 </td>

//                                                                 {/* Item Name */}
//                                                                 <td>
//                                                                     <strong>{item.name}</strong>
//                                                                     {item.description && (
//                                                                         <div className="text-muted small">
//                                                                             {item.description.slice(0, 50)}{item.description.length > 50 ? '...' : ''}
//                                                                         </div>
//                                                                     )}
//                                                                 </td>

//                                                                 {/* Category */}
//                                                                 <td>
//                                                                     {item.category?.name || (
//                                                                         <span className="text-muted">—</span>
//                                                                     )}
//                                                                 </td>

//                                                                 {/* Price */}
//                                                                 <td>
//                                                                     ₹{item.basePrice}
//                                                                 </td>

//                                                                 {/* Food Type */}
//                                                                 <td>
//                                                                     {item.isVeg ? (
//                                                                         <span className="badge bg-success-subtle text-success">
//                                                                             Veg
//                                                                         </span>
//                                                                     ) : (
//                                                                         <span className="badge bg-danger-subtle text-danger">
//                                                                             Non-Veg
//                                                                         </span>
//                                                                     )}
//                                                                 </td>

//                                                                 {/* Status */}
//                                                                 <td>
//                                                                     {item.isAvailable ? (
//                                                                         <span className="badge bg-success-subtle text-success">
//                                                                             Available
//                                                                         </span>
//                                                                     ) : (
//                                                                         <span className="badge bg-danger-subtle text-danger">
//                                                                             Unavailable
//                                                                         </span>
//                                                                     )}
//                                                                 </td>

//                                                                 {/* Created At */}
//                                                                 <td>
//                                                                     {new Date(item.createdAt).toLocaleDateString()}
//                                                                 </td>

//                                                                 {/* Actions */}
//                                                                 <td>
//                                                                     <ul className="list-inline hstack gap-2 mb-0">
//                                                                         {canEdit || canDelete ? (
//                                                                             <>
//                                                                                 {canEdit && (
//                                                                                     <li className="list-inline-item" title="Edit">
//                                                                                         <Link
//                                                                                             to="#menuItemModalEdit"
//                                                                                             data-bs-toggle="modal"
//                                                                                             className="text-success"
//                                                                                             onClick={() => {
//                                                                                                 handleEdit(item._id);
//                                                                                                 document.body.classList.remove("modal-open");
//                                                                                             }}
//                                                                                         >
//                                                                                             <i className="ri-pencil-fill" />
//                                                                                         </Link>
//                                                                                     </li>
//                                                                                 )}

//                                                                                 {canDelete && (
//                                                                                     <li className="list-inline-item" title="Delete">
//                                                                                         <Link
//                                                                                             to="#deleteRecordModal"
//                                                                                             data-bs-toggle="modal"
//                                                                                             className="text-danger"
//                                                                                             onClick={() => {
//                                                                                                 setGetId(item._id);
//                                                                                                 document.body.classList.remove("modal-open");
//                                                                                             }}
//                                                                                         >
//                                                                                             <i className="ri-delete-bin-fill" />
//                                                                                         </Link>
//                                                                                     </li>
//                                                                                 )}
//                                                                             </>
//                                                                         ) : (
//                                                                             <li className="list-inline-item text-muted">
//                                                                                 No permission
//                                                                             </li>
//                                                                         )}
//                                                                     </ul>
//                                                                 </td>
//                                                             </tr>
//                                                         ))
//                                                     )}
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

//             <div className="modal fade" id="menuItemModal" tabIndex={-1} aria-hidden="true">
//                 <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//                     <div className="modal-content border-0 rounded-4 overflow-hidden">

//                         {/* ===== HEADER ===== */}
//                         <div className="modal-header px-4 py-3 bg-dark text-white">
//                             <div>
//                                 <h4 className="mb-0 fw-semibold text-white">
//                                     Create Menu Item
//                                 </h4>
//                                 <small className="text-white-50">
//                                     Add item to restaurant menu
//                                 </small>
//                             </div>

//                             <button
//                                 type="button"
//                                 className="btn-close btn-close-white"
//                                 data-bs-dismiss="modal"
//                             />
//                         </div>

//                         {/* ===== BODY ===== */}
//                         <div className="modal-body p-4 bg-body-tertiary">
//                             <div className="card border-0 shadow-sm rounded-4">
//                                 <div className="card-body">

//                                     <h6 className="fw-semibold mb-3 text-primary">
//                                         Item Details
//                                     </h6>

//                                     <div className="row g-3">

//                                         {/* Item Name */}
//                                         <div className="col-md-6">
//                                             <label className="form-label">Item Name *</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control form-control-lg"
//                                                 placeholder="Paneer Butter Masala"
//                                                 name="name"
//                                                 value={menuData.name}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         {/* Category */}
//                                         <div className="col-md-6">
//                                             <label className="form-label">Category *</label>
//                                             <select
//                                                 className="form-select form-select-lg"
//                                                 name="category"
//                                                 value={menuData.category}
//                                                 onChange={handleChange}
//                                             >
//                                                 <option value="">Select Category</option>
//                                                 {allCategory.map(cat => (
//                                                     <option key={cat._id} value={cat._id}>
//                                                         {cat.name}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>

//                                         <div className="col-md-12">
//                                             <label className="form-label">Description</label>
//                                             <textarea
//                                                 rows="2"
//                                                 className="form-control"
//                                                 placeholder="Short item description"
//                                                 name="description"
//                                                 value={menuData.description}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         {/* Images */}
//                                         <div className="col-md-6">
//                                             <label className="form-label">Item Images</label>
//                                             <input
//                                                 type="file"
//                                                 className="form-control"
//                                                 multiple
//                                                 onChange={handleFileChange}
//                                             />
//                                         </div>
//                                         {filePreview?.length > 0 && (
//                                             <div className="mt-3 text-center d-flex gap-2 flex-wrap">
//                                                 {filePreview.map((preview, idx) => (
//                                                     <div key={idx} className="position-relative">
//                                                         <img
//                                                             src={preview}
//                                                             alt={`Preview ${idx}`}
//                                                             className="img-fluid rounded"
//                                                             style={{ maxHeight: "100px" }}
//                                                         />
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => handleRemoveFile(idx)}
//                                                             className="btn btn-sm btn-danger position-absolute top-0 end-0"
//                                                             style={{ borderRadius: "50%", padding: "0 5px", fontSize: "12px" }}
//                                                         >
//                                                             &times;
//                                                         </button>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}



//                                         {/* Base Price */}
//                                         <div className="col-md-4">
//                                             <label className="form-label">Base Price *</label>
//                                             <input
//                                                 type="number"
//                                                 className="form-control"
//                                                 name="basePrice"
//                                                 value={menuData.basePrice}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         {/* Tax */}
//                                         <div className="col-md-4">
//                                             <label className="form-label">Tax</label>
//                                             <select
//                                                 className="form-select"
//                                                 name="tax"
//                                                 value={menuData.tax}
//                                                 onChange={handleChange}
//                                             >
//                                                 <option value="">No Tax</option>
//                                                 {allTax.map(tax => (
//                                                     <option key={tax._id} value={tax._id}>
//                                                         {tax.name} ({tax.percent}%)
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>

//                                         {/* Sort Order */}
//                                         <div className="col-md-4">
//                                             <label className="form-label">Sort Order</label>
//                                             <input
//                                                 type="number"
//                                                 className="form-control"
//                                                 name="sortOrder"
//                                                 value={menuData.sortOrder}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         {/* Switches */}
//                                         <div className="col-md-12 d-flex gap-4 flex-wrap mt-2">

//                                             <div className="form-check form-switch">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     name="isVeg"
//                                                     checked={menuData.isVeg}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label">Veg Item</label>
//                                             </div>

//                                             <div className="form-check form-switch">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     name="isAvailable"
//                                                     checked={menuData.isAvailable}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label">Available</label>
//                                             </div>

//                                             <div className="form-check form-switch">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     name="hasVariants"
//                                                     checked={menuData.hasVariants}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label">Has Variants</label>
//                                             </div>

//                                             <div className="form-check form-switch">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     name="hasAddOns"
//                                                     checked={menuData.hasAddOns}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label">Has Add-ons</label>
//                                             </div>

//                                         </div>

//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* ===== FOOTER ===== */}
//                         <div className="modal-footer bg-white px-4 py-3">
//                             <button
//                                 className="btn btn-light rounded-3"
//                                 data-bs-dismiss="modal"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 className="btn btn-dark rounded-3 px-4"
//                                 onClick={handleSubmit}
//                             >
//                                 Save Item
//                             </button>
//                         </div>

//                     </div>
//                 </div>
//             </div>

//             <div className="modal fade" id="menuItemModalEdit" tabIndex={-1} aria-hidden="true">
//                 <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//                     <div className="modal-content border-0 rounded-4 overflow-hidden">

//                         {/* ===== HEADER ===== */}
//                         <div className="modal-header px-4 py-3 bg-dark text-white">
//                             <div>
//                                 <h4 className="mb-0 fw-semibold text-white">
//                                     Update Menu Item
//                                 </h4>
//                                 <small className="text-white-50">
//                                     Edit restaurant menu item
//                                 </small>
//                             </div>

//                             <button
//                                 type="button"
//                                 className="btn-close btn-close-white"
//                                 data-bs-dismiss="modal"
//                             />
//                         </div>

//                         {/* ===== BODY ===== */}
//                         <div className="modal-body p-4 bg-body-tertiary">
//                             <div className="card border-0 shadow-sm rounded-4">
//                                 <div className="card-body">

//                                     <h6 className="fw-semibold mb-3 text-primary">
//                                         Item Details
//                                     </h6>

//                                     <div className="row g-3">

//                                         {/* Item Name */}
//                                         <div className="col-md-6">
//                                             <label className="form-label">Item Name *</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control form-control-lg"
//                                                 name="name"
//                                                 value={menuData.name}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         {/* Category */}
//                                         <div className="col-md-6">
//                                             <label className="form-label">Category *</label>
//                                             <select
//                                                 className="form-select form-select-lg"
//                                                 name="category"
//                                                 value={menuData.category}
//                                                 onChange={handleChange}
//                                             >
//                                                 <option value="">Select Category</option>
//                                                 {allCategory.map(cat => (
//                                                     <option key={cat._id} value={cat._id}>
//                                                         {cat.name}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>

//                                         {/* Description */}
//                                         <div className="col-md-12">
//                                             <label className="form-label">Description</label>
//                                             <textarea
//                                                 rows="2"
//                                                 className="form-control"
//                                                 name="description"
//                                                 value={menuData.description}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         {/* Images */}
//                                         <div className="col-md-6">
//                                             <label className="form-label">Item Images</label>
//                                             <input
//                                                 type="file"
//                                                 className="form-control"
//                                                 multiple
//                                                 onChange={handleFileChange}
//                                             />
//                                         </div>

//                                         {filePreview?.length > 0 && (
//                                             <div className="col-md-6 d-flex gap-2 flex-wrap">
//                                                 {filePreview.map((img, i) => (
//                                                     <img
//                                                         key={i}
//                                                         src={img}
//                                                         alt="Preview"
//                                                         className="rounded"
//                                                         style={{
//                                                             width: "80px",
//                                                             height: "80px",
//                                                             objectFit: "cover"
//                                                         }}
//                                                     />
//                                                 ))}
//                                             </div>
//                                         )}

//                                         {/* Base Price */}
//                                         <div className="col-md-4">
//                                             <label className="form-label">Base Price *</label>
//                                             <input
//                                                 type="number"
//                                                 className="form-control"
//                                                 name="basePrice"
//                                                 value={menuData.basePrice}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         {/* Tax */}
//                                         <div className="col-md-4">
//                                             <label className="form-label">Tax</label>
//                                             <select
//                                                 className="form-select"
//                                                 name="tax"
//                                                 value={menuData.tax}
//                                                 onChange={handleChange}
//                                             >
//                                                 <option value="">No Tax</option>
//                                                 {allTax.map(tax => (
//                                                     <option key={tax._id} value={tax._id}>
//                                                         {tax.name} ({tax.percent}%)
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>

//                                         {/* Sort Order */}
//                                         <div className="col-md-4">
//                                             <label className="form-label">Sort Order</label>
//                                             <input
//                                                 type="number"
//                                                 className="form-control"
//                                                 name="sortOrder"
//                                                 value={menuData.sortOrder}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>

//                                         {/* Switches */}
//                                         <div className="col-md-12 d-flex gap-4 flex-wrap mt-2">

//                                             <div className="form-check form-switch">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     name="isVeg"
//                                                     checked={menuData.isVeg}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label">Veg Item</label>
//                                             </div>

//                                             <div className="form-check form-switch">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     name="isAvailable"
//                                                     checked={menuData.isAvailable}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label">Available</label>
//                                             </div>

//                                             <div className="form-check form-switch">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     name="hasVariants"
//                                                     checked={menuData.hasVariants}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label">Has Variants</label>
//                                             </div>

//                                             <div className="form-check form-switch">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     name="hasAddOns"
//                                                     checked={menuData.hasAddOns}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label">Has Add-ons</label>
//                                             </div>

//                                         </div>

//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* ===== FOOTER ===== */}
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
//                                 Update Item
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




import React, { useEffect, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import socket from "../../../Socket/socket";
import "./KOT.css";

export default function KitchenDisplay() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    // debugger
    const userString = localStorage.getItem("user");

    const user = userString ? JSON.parse(userString) : null;

    const restaurantId = user?.value?.restaurant?._id;

    console.log("restaurantId:", restaurantId);
    if (restaurantId) {
      const roomName = `restaurant_${restaurantId}`;
      console.log("🔥 Joining room:", roomName);
      socket.emit("joinRestaurant", restaurantId);
    }

    const handleNewOrder = (order) => {
      console.log("🔥 New order received in KitchenDisplay:", order);
      if (!order?._id) return;

      setOrders(prev => {
        const exists = prev.find(o => o._id === order._id);
        if (exists) return prev;
        console.log("✅ Adding new order to KitchenDisplay:", order.orderNumber);
        return [order, ...prev];
      });
    };

    const handleOrderUpdated = (order) => {
      console.log("🔥 Order updated in KitchenDisplay:", order);
      setOrders(prev =>
        prev.map(o => o._id === order._id ? order : o)
      );
    };

    const handlePreparationTimeUpdated = (data) => {
      console.log("🔥 Preparation time updated in KitchenDisplay:", data);
      setOrders(prev =>
        prev.map(o => o._id === data.orderId ? { ...o, preparationTime: data.preparationTime } : o)
      );
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("orderUpdated", handleOrderUpdated);
    socket.on("preparationTimeUpdated", handlePreparationTimeUpdated);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("orderUpdated", handleOrderUpdated);
      socket.off("preparationTimeUpdated", handlePreparationTimeUpdated);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get(
        Config.END_POINT_LIST["ADMIN_GET_ALL_ORDER"]
      );

      if (res.data?.success) {
        setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      // Optimistic update
      // debugger
      setOrders(prev =>
        prev.map(o =>
          o._id === id ? { ...o, orderStatus: status } : o
        )
      );

      await axiosInstance.put(
        `${Config.END_POINT_LIST["UPDATE_ORDER_STATUS"]}/${id}`,
        { status }
      );
    } catch (err) {
      console.error("Status update failed:", err);
      fetchOrders(); // rollback
    }
  };

  const updatePreparationTime = async (id, preparationTime) => {
    try {
      console.log("🔥 updatePreparationTime function called!");
      console.log("🔥 Order ID:", id);
      console.log("🔥 Preparation time:", preparationTime);
      
      // Simple test - just log axiosInstance
      console.log("🔥 axiosInstance:", axiosInstance);
      
      // Optimistic update
      setOrders(prev =>
        prev.map(o =>
          o._id === id ? { ...o, preparationTime: preparationTime } : o
        )
      );

      const response = await axiosInstance.put(
        `${Config.END_POINT_LIST["UPDATE_PREPARATION_TIME"]}/${id}`,
        { preparationTime }
      );
      console.log("🔥 API Response:", response.data);
    } catch (err) {
      console.error("❌ Preparation time update failed:", err);
      console.error("❌ Error response:", err.response?.data);
      fetchOrders(); // rollback
    }
  };

  const filterOrders = (status) =>
    orders.filter(o => o?.orderStatus === status);

  return (
    <div className="kds-container">
      <Column
        title="NEW"
        status="NEW"
        orders={filterOrders("NEW")}
        updateStatus={updateStatus}
        updatePreparationTime={updatePreparationTime}
      />

      <Column
        title="PREPARING"
        status="PREPARING"
        orders={filterOrders("PREPARING")}
        updateStatus={updateStatus}
        updatePreparationTime={updatePreparationTime}
      />

      <Column
        title="READY"
        status="READY"
        orders={filterOrders("READY")}
        updateStatus={updateStatus}
        updatePreparationTime={updatePreparationTime}
      />
    </div>
  );
}

function Column({ title, status, orders = [], updateStatus, updatePreparationTime }) {
  return (
    <div className="kds-column">
      <h2 className={`column-title ${status.toLowerCase()}`}>
        {title} ({orders.length})
      </h2>

      {orders.length === 0 && (
        <p className="empty-text">No Orders</p>
      )}

      {orders.map(order => (
        <OrderCard
          key={order._id}
          order={order}
          updateStatus={updateStatus}
          updatePreparationTime={updatePreparationTime}
        />
      ))}
    </div>
  );
}

function OrderCard({ order = {}, updateStatus, updatePreparationTime }) {
  console.log("🔥 OrderCard props:", { order: order._id, updateStatus: typeof updateStatus, updatePreparationTime: typeof updatePreparationTime });
  
  const nextStatus =
    order.orderStatus === "NEW"
      ? "PREPARING"
      : order.orderStatus === "PREPARING"
        ? "READY"
        : null;

  const [preparationTime, setPreparationTime] = useState(order.preparationTime || 0);

  const handlePreparationTimeChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setPreparationTime(value);
  };

  const handlePreparationTimeUpdate = () => {
    alert("Button clicked! Order ID: " + order._id + ", Time: " + preparationTime);
    console.log("🔥 Set Time button clicked!");
    console.log("🔥 Order ID:", order._id);
    console.log("🔥 Preparation time:", preparationTime);
    console.log("🔥 updatePreparationTime function:", typeof updatePreparationTime);
    
    if (typeof updatePreparationTime === 'function') {
      console.log("🔥 Calling updatePreparationTime...");
      updatePreparationTime(order._id, preparationTime);
    } else {
      console.error("❌ updatePreparationTime is not a function!");
    }
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <h3>{order.orderNumber || "N/A"}</h3>
        <span>{order.orderType || "N/A"}</span>
      </div>

      {/* FIXED TABLE RENDER */}
      {order.table?.tableNumber && (
        <p>Table: {order.table.tableNumber}</p>
      )}

      {/* PREPARATION TIME */}
      <div className="preparation-time-section">
        <label>Prep Time (min):</label>
        <div className="preparation-time-input">
          <input
            type="number"
            min="0"
            value={preparationTime}
            onChange={handlePreparationTimeChange}
            placeholder="Enter minutes"
          />
          <button
            className="update-time-btn"
            onClick={handlePreparationTimeUpdate}
          >
            Set Time
          </button>
        </div>
        {order.preparationTime > 0 && (
          <p className="current-prep-time">
            Current: {order.preparationTime} minutes
          </p>
        )}
      </div>

      <ul>
        {Array.isArray(order.items) &&
          order.items.map((item, i) => (
            <li key={i}>
              <strong>
                {item?.quantity || 0}x {item?.name || "Item"}
              </strong>

              {Array.isArray(item?.variants) &&
                item.variants.map((v, vi) => (
                  <div key={vi} className="variant">
                    - {v?.name}
                  </div>
                ))}
            </li>
          ))}
      </ul>

      {nextStatus && (
        <button
          className="status-btn"
          onClick={() => updateStatus(order._id, nextStatus)}
        >
          Mark as {nextStatus}
        </button>
      )}
    </div>
  );
}
