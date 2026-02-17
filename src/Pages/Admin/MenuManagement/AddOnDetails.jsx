


import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Link } from "react-router-dom";
import { getAllItems } from "../../../Store/feature/Items/itemSlice";


export default function AddOnDetails() {

    const { user, permissions } = useSelector(state => state.auth);
    const { items } = useSelector(state => state.items);
    const dispatch = useDispatch();

    const canCreate = permissions.includes("add-ons_modifiers.create");
    const canEdit = permissions.includes("add-ons_modifiers.update");
    const canDelete = permissions.includes("add-ons_modifiers.delete");

    const restaurantId = user?.restaurant?._id;


    // const [menuItems, setMenuItems] = useState(items || []);
    const menuItems = items || [];
    const [addonGroups, setAddonGroups] = useState([]);
    const [addons, setAddons] = useState([]);

    const [selectedMenuItem, setSelectedMenuItem] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");

    // Editing state
    const [editId, setEditId] = useState(null);
    const [groupEditId, setGroupEditId] = useState(null);

    // Form states
    const [addonData, setAddonData] = useState({
        restaurant: restaurantId,
        menuItem: "",
        addOnGroup: "",
        name: "",
        price: "",
        isDefault: false,
        isActive: true
    });

    const [groupData, setGroupData] = useState({
        restaurant: restaurantId,
        menuItem: "",
        name: "",
        isRequired: true,
        isMultiple: false,
        isActive: true
    });
    // UI state
    const [loadingMenu, setLoadingMenu] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [loadingAddons, setLoadingAddons] = useState(false);

    const [isSubmittingAddon, setIsSubmittingAddon] = useState(false);
    const [isUpdatingAddon, setIsUpdatingAddon] = useState(false);
    const [isDeletingAddon, setIsDeletingAddon] = useState(false);

    const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);
    const [isUpdatingGroup, setIsUpdatingGroup] = useState(false);
    const [isDeletingGroup, setIsDeletingGroup] = useState(false);

    // Search state for menu items (used in top filter area)
    const [menuSearch, setMenuSearch] = useState("");
    const filteredMenuItems = menuSearch.trim() ? menuItems.filter(m => (m.name || "").toLowerCase().includes(menuSearch.toLowerCase())) : menuItems;

    // ================= FETCH MENU ITEMS =================

    const fetchMenuItems = async () => {
        setLoadingMenu(true);
        try {

            await dispatch(getAllItems())

        } catch (err) {
            showErrorMsg("Failed to fetch menu items");
        } finally {
            setLoadingMenu(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);



    const loadAddonGroups = async (menuItemId) => {

        setSelectedMenuItem(menuItemId);
        setAddonGroups([]);
        setAddons([]);
        setLoadingGroups(true);

        if (!menuItemId) return;

        try {

            const res = await axiosInstance.get(
                Config.END_POINT_LIST.GET_ADDON_GROUPS + menuItemId
            );

            setAddonGroups(res.data.data || []);

        } catch (err) {
            showErrorMsg("Failed to load addon groups");
        } finally {
            setLoadingGroups(false);
        }
    };


    const loadAddons = async (groupId) => {

        setSelectedGroup(groupId);
        setAddons([]);
        setLoadingAddons(true);

        if (!groupId) return;

        try {

            const res = await axiosInstance.get(
                Config.END_POINT_LIST.GET_ADDONS_BY_GROUP + groupId
            );

            setAddons(res.data.data || []);

        } catch (err) {
            showErrorMsg("Failed to load addons");
        } finally {
            setLoadingAddons(false);
        }
    };

    // ================= HANDLE CHANGE =================
    // Generic input handler used by addon forms (text, number, checkbox)

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        setAddonData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // ================= CREATE =================
    // Create a new Add-On (modal form). Validates required fields and price.

    const handleSubmit = useCallback(async () => {
        setIsSubmittingAddon(true);
debugger
        if (!addonData.menuItem || !addonData.addOnGroup)
            return showErrorMsg("Select menu item & group");

        // if (!addonData.name || !addonData.price)
        //     return showErrorMsg("Name & price required");


        try {

            const res = await axiosInstance.post(
                Config.END_POINT_LIST.CREATE_ADDON,
                addonData
            );

            showSuccessMsg("Addon Created ✅");

            loadAddons(addonData.addOnGroup);

            setAddonData({
                restaurant: restaurantId,
                menuItem: "",
                addOnGroup: "",
                name: "",
                price: "",
                isDefault: false,
                isActive: true
            });

            const modalElement = document.getElementById("addonModal");
            if (modalElement) {
                const bsModal = new (window.bootstrap).Modal(modalElement);
                bsModal.hide();
            }
            document.querySelector('#addonModal .btn-close').click();

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Error creating addon");
        } finally {
            setIsSubmittingAddon(false);
        }
    }, [addonData, restaurantId]);

    // ================= EDIT =================
    // Prepare addon data for editing and set `editId`

    const handleEdit = (addon) => {

        setEditId(addon._id);

        setAddonData({
            restaurant: addon.restaurant,
            menuItem: addon.menuItem,
            addOnGroup: addon.addOnGroup,
            name: addon.name,
            price: addon.price,
            isDefault: addon.isDefault,
            isActive: addon.isActive
        });
    };

    const handleUpdate = useCallback(async () => {
        setIsUpdatingAddon(true);

        if (!addonData.menuItem || !addonData.addOnGroup)
            return showErrorMsg("Select menu item & group");

        if (!addonData.name || !addonData.price)
            return showErrorMsg("Name & price required");

        if (parseFloat(addonData.price) <= 0)
            return showErrorMsg("Price must be greater than 0");

        try {

            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST.UPDATE_ADDON}${editId}`,
                addonData
            );

            showSuccessMsg("Addon Updated ✅");

            loadAddons(addonData.addOnGroup);

            const modalElement = document.getElementById("addonEditModal");
            if (modalElement) {
                const bsModal = new (window.bootstrap).Modal(modalElement);
                bsModal.hide();
            }
            document.querySelector('#addonEditModal .btn-close').click();

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Error updating addon");
        } finally {
            setIsUpdatingAddon(false);
        }
    }, [addonData, editId]);

    // ================= DELETE =================
    // Delete an add-on (soft-delete via API)

    const handleDelete = useCallback(async () => {
        setIsDeletingAddon(true);

        if (!editId) {
            setIsDeletingAddon(false);
            return showErrorMsg("Please select an addon to delete");
        }

        try {

            await axiosInstance.delete(
                `${Config.END_POINT_LIST.DELETE_ADDON}${editId}`
            );

            showSuccessMsg("Addon Deleted ✅");

            loadAddons(selectedGroup);
            setEditId(null);

            const modalElement = document.getElementById("deleteModal");
            if (modalElement) {
                const bsModal = new (window.bootstrap).Modal(modalElement);
                bsModal.hide();
            }
            document.querySelector('#deleteModal .btn-close').click();

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Error deleting addon");
        } finally {
            setIsDeletingAddon(false);
        }
    }, [editId, selectedGroup]);

    // ================= ADD-ON GROUP HANDLERS =================

    const handleGroupChange = (e) => {
        const { name, value, checked, type } = e.target;

        setGroupData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleCreateGroup = useCallback(async () => {
        setIsSubmittingGroup(true);

        if (!groupData.menuItem || !groupData.name) {
            setIsSubmittingGroup(false);
            return showErrorMsg("Menu Item & Group Name required");
        }

        try {

            const res = await axiosInstance.post(
                Config.END_POINT_LIST.CREATE_ADDON_GROUP,
                groupData
            );

            showSuccessMsg("Addon Group Created ");

            loadAddonGroups(groupData.menuItem);

            setGroupData({
                restaurant: restaurantId,
                menuItem: "",
                name: "",
                isRequired: true,
                isMultiple: false,
                isActive: true
            });

            const modalElement = document.getElementById("groupModal");
            if (modalElement) {
                const bsModal = new (window.bootstrap).Modal(modalElement);
                bsModal.hide();
            }

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Error creating group");
        } finally {
            setIsSubmittingGroup(false);
        }
    }, [groupData, restaurantId]);

    const handleEditGroup = (group) => {

        setGroupEditId(group._id);

        setGroupData({
            restaurant: group.restaurant,
            menuItem: group.menuItem?._id || group.menuItem,
            name: group.name,
            isRequired: group.isRequired,
            isMultiple: group.isMultiple,
            isActive: group.isActive
        });
    };

    const handleUpdateGroup = useCallback(async () => {
        setIsUpdatingGroup(true);

        if (!groupData.menuItem || !groupData.name) {
            setIsUpdatingGroup(false);
            return showErrorMsg("Menu Item & Group Name required");
        }

        try {

            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST.UPDATE_ADDON_GROUP}${groupEditId}`,
                groupData
            );

            showSuccessMsg("Addon Group Updated ✅");

            loadAddonGroups(groupData.menuItem);

            const modalElement = document.getElementById("groupEditModal");
            if (modalElement) {
                const bsModal = new (window.bootstrap).Modal(modalElement);
                bsModal.hide();
            }
            document.querySelector('#groupEditModal .btn-close').click();

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Error updating group");
        } finally {
            setIsUpdatingGroup(false);
        }
    }, [groupData, groupEditId]);

    const handleDeleteGroup = useCallback(async () => {
        setIsDeletingGroup(true);

        if (!groupEditId) {
            setIsDeletingGroup(false);
            return showErrorMsg("Please select a group to delete");
        }

        try {

            await axiosInstance.delete(
                `${Config.END_POINT_LIST.DELETE_ADDON_GROUP}${groupEditId}`
            );

            showSuccessMsg("Addon Group Deleted");

            loadAddonGroups(selectedMenuItem);
            setGroupEditId(null);

            const modalElement = document.getElementById("deleteGroupModal");
            if (modalElement) {
                const bsModal = new (window.bootstrap).Modal(modalElement);
                bsModal.hide();
            }
            document.querySelector('#deleteGroupModal .btn-close').click();

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Error deleting group");
        } finally {
            setIsDeletingGroup(false);
        }
    }, [groupEditId, selectedMenuItem]);

    // ================= UI =================

    return (


        <div className="nxl-content">
            <>
                <div className="page-header">
                    <div className="page-header-left d-flex align-items-center">
                        <div className="page-header-title">
                            <h5 className="m-b-10">Add-On</h5>
                        </div>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">Dashboard</a>
                            </li>
                            <li className="breadcrumb-item">Add-On Management</li>
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

                                {canCreate && (
                                    <a
                                        href="#"
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        id="create-btn"
                                        data-bs-target="#addonModal"
                                        onClick={() => {
                                            document.body.classList.remove("pace-done", "modal-open"); setAddonData({
                                                restaurant: restaurantId,
                                                menuItem: "",
                                                addOnGroup: "",
                                                name: "",
                                                price: "",
                                                isDefault: false,
                                                isActive: true
                                            });
                                        }
                                        }

                                    >
                                        <i className="feather-plus me-2" />
                                        <span>Create Add-On</span>
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
                <div className="main-content">

                    <div className="card border-0 p-4 mb-4" style={{ background: '#f8fafc' }}>
                        <div className="row g-3 align-items-center">

                            <div className="col-md-4">
                                <label className="form-label fw-semibold mb-2 text-muted" style={{ fontSize: '13px' }}>Menu Item</label>
                                <Select
                                    options={menuItems.map(item => ({ value: item._id, label: item.name }))}
                                    value={selectedMenuItem ? { value: selectedMenuItem, label: menuItems.find(m => m._id === selectedMenuItem)?.name } : null}
                                    onChange={(option) => {
                                        setMenuSearch("");
                                        loadAddonGroups(option ? option.value : "");
                                    }}
                                    isClearable
                                    isSearchable
                                    placeholder="Search & select menu item..."
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            minHeight: '38px'
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#f3f4f6' : '#fff',
                                            color: state.isSelected ? '#fff' : '#000'
                                        })
                                    }}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-semibold mb-2 text-muted" style={{ fontSize: '13px' }}>Add-On Group</label>
                                <Select
                                    options={addonGroups.map(group => ({ value: group._id, label: group.name }))}
                                    value={selectedGroup ? { value: selectedGroup, label: addonGroups.find(g => g._id === selectedGroup)?.name } : null}
                                    onChange={(option) => loadAddons(option ? option.value : "")}
                                    isClearable
                                    isSearchable
                                    placeholder="Search & select add-on group..."
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            minHeight: '38px'
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#f3f4f6' : '#fff',
                                            color: state.isSelected ? '#fff' : '#000'
                                        })
                                    }}
                                />
                            </div>



                        </div>
                    </div>
                    {/* ================= ADD-ON GROUPS SECTION ================= */}
                    {selectedMenuItem && (
                        <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0 fw-bold" style={{ color: '#1f2937' }}><i className="ri-folder-2-line me-2" style={{ color: '#667eea' }}></i>Add-On Groups</h5>
                                {canCreate && (
                                    <button
                                        className="btn btn-success"
                                        data-bs-toggle="modal"
                                        id="create-btn"

                                        data-bs-target="#groupModal"
                                        onClick={() => {
                                            document.body.classList.remove("pace-done", "modal-open");
                                            setGroupData({
                                                restaurant: restaurantId,
                                                menuItem: selectedMenuItem,
                                                name: "",
                                                isRequired: true,
                                                isMultiple: false,
                                                isActive: true
                                            }); setGroupEditId(null);
                                        }}
                                    >
                                        <i className="ri-add-line"></i> Add Group
                                    </button>
                                )}
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover table-sm" style={{ borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#f3f4f6' }}>
                                        <tr>
                                            <th>Group Name</th>
                                            <th>Required</th>
                                            <th>Multiple</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {addonGroups.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted">
                                                    No add-on groups found
                                                </td>
                                            </tr>
                                        ) : (
                                            addonGroups.map(group => (
                                                <tr key={group._id}>
                                                    <td><strong>{group.name}</strong></td>
                                                    <td>{group.isRequired ? <span className="badge bg-soft-success text-success">Yes</span> : <span className="badge bg-soft-danger text-danger">No</span>}</td>
                                                    <td>{group.isMultiple ? <span className="badge bg-soft-success text-success">Yes</span> : <span className="badge bg-soft-danger text-danger">No</span>}</td>
                                                    <td>{group.isActive ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span>}</td>


                                                    <td>
                                                        <ul className="list-inline hstack gap-2 mb-0">
                                                            {canEdit || canDelete ? (
                                                                <>
                                                                    <li className="list-inline-item" title="Edit">
                                                                        {canEdit && (
                                                                            <Link
                                                                                to="#groupEditModal"
                                                                                data-bs-toggle="modal"
                                                                                className="text-success"
                                                                                onClick={() => {
                                                                                    handleEditGroup(group);
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
                                                                                to="#deleteGroupModal"
                                                                                data-bs-toggle="modal"
                                                                                className="text-danger"
                                                                                onClick={() => { setGroupEditId(group._id), document.body.classList.remove("modal-open"); }}
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
                            </div>
                        </div>
                    )}

                    {/* ADD-ONS TABLE */}
                    <div className="mb-4">
                        <h5 className="mb-3 fw-bold" style={{ color: '#1f2937' }}><i className="ri-layout-list-line me-2" style={{ color: '#667eea' }}></i>Add-Ons</h5>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0" style={{ borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f3f4f6', fontWeight: '600', color: '#374151' }}>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Default</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {addons.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center" style={{ padding: '32px', color: '#9ca3af' }}>
                                                <i className="ri-inbox-line" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>
                                                No add-ons found
                                            </td>
                                        </tr>
                                    ) : (

                                        addons.map((v, idx) => (
                                            <tr key={v._id} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                                                <td><strong style={{ color: '#1f2937' }}>{v.name}</strong></td>
                                                <td><span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>{Config.APP_SETTING.DefaultCurrencySymbol} {v.price}</span></td>
                                                <td>{v.isDefault ? <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>Default</span> : <span className="text-muted">-</span>}</td>
                                                <td>{v.isActive ? <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Active</span> : <span className="badge" style={{ background: '#f3f4f6', color: '#6b7280' }}>Inactive</span>}</td>
                                                {/* 
                                                <td>

                                                    {canEdit && (
                                                        <button
                                                            className="btn btn-outline-warning btn-sm me-2"
                                                            style={{ borderRadius: '6px', borderColor: '#fbbf24', color: '#b45309' }}
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#addonEditModal"
                                                            onClick={() => handleEdit(v)}
                                                        >
                                                            <i className="ri-edit-line me-1"></i>Edit
                                                        </button>
                                                    )}

                                                    {canDelete && (
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            style={{ borderRadius: '6px', borderColor: '#fca5a5', color: '#991b1b' }}
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteModal"
                                                            onClick={() => setEditId(v._id)}
                                                        >
                                                            <i className="ri-delete-bin-6-line me-1"></i>Delete
                                                        </button>
                                                    )}

                                                </td> */}


                                                <td>
                                                    <ul className="list-inline hstack gap-2 mb-0">
                                                        {canEdit || canDelete ? (
                                                            <>
                                                                <li className="list-inline-item" title="Edit">
                                                                    {canEdit && (
                                                                        <Link
                                                                            to="#addonEditModal"
                                                                            data-bs-toggle="modal"
                                                                            className="text-success"
                                                                            onClick={() => {
                                                                                handleEdit(v)
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
                                                                            to="#deleteModal"
                                                                            data-bs-toggle="modal"
                                                                            className="text-danger"
                                                                            onClick={() => { setEditId(v._id), document.body.classList.remove("modal-open"); }}
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
                        </div>
                    </div>



                    {/* ================= CREATE ADD-ON MODAL ================= */}
                    <div className="modal fade" id="addonModal" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 rounded-4 overflow-hidden">

                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    padding: '20px 24px',
                                    color: 'white'
                                }}>
                                    <div>
                                        <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
                                            <i className="ri-add-circle-line me-2"></i>Create Add-On
                                        </h4>
                                        <small style={{ opacity: 0.9 }}>Add a new add-on to your group</small>
                                    </div>
                                    <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
                                </div>

                                <div className="modal-body p-4 bg-white">
                                    <form>
                                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                                            <div className="card-body">

                                                <h6 className="fw-semibold mb-3 text-primary">Add-On Details</h6>

                                                <div className="row g-3">

                                                    {/* Menu Item */}
                                                    <div className="col-12">
                                                        <label className="form-label">Menu Item</label>
                                                        <Select
                                                            options={menuItems.map(item => ({ value: item._id, label: item.name }))}
                                                            value={addonData.menuItem ? { value: addonData.menuItem, label: menuItems.find(m => m._id === addonData.menuItem)?.name } : null}
                                                            onChange={(option) => {
                                                                setAddonData(prev => ({ ...prev, menuItem: option ? option.value : "" }));
                                                                loadAddonGroups(option ? option.value : "");
                                                            }}
                                                            isClearable
                                                            isSearchable
                                                            placeholder="Search & select menu item..."
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    borderRadius: '8px',
                                                                    border: '1px solid #e5e7eb',
                                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                                }),
                                                                option: (base, state) => ({
                                                                    ...base,
                                                                    backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#f3f4f6' : '#fff',
                                                                    color: state.isSelected ? '#fff' : '#000'
                                                                })
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Add-On Group */}
                                                    <div className="col-12">
                                                        <label className="form-label">Add-On Group</label>
                                                        <Select
                                                            options={addonGroups.map(group => ({ value: group._id, label: group.name }))}
                                                            value={addonData.addOnGroup ? { value: addonData.addOnGroup, label: addonGroups.find(g => g._id === addonData.addOnGroup)?.name } : null}
                                                            onChange={(option) => {
                                                                setAddonData(prev => ({ ...prev, addOnGroup: option ? option.value : "" }));
                                                                loadAddons(option ? option.value : "");
                                                            }}
                                                            isClearable
                                                            isSearchable
                                                            placeholder="Search & select add-on group..."
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    borderRadius: '8px',
                                                                    border: '1px solid #e5e7eb',
                                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                                }),
                                                                option: (base, state) => ({
                                                                    ...base,
                                                                    backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#f3f4f6' : '#fff',
                                                                    color: state.isSelected ? '#fff' : '#000'
                                                                })
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Add-On Name */}
                                                    <div className="col-12">
                                                        <label className="form-label">Add-On Name</label>
                                                        <input type="text" className="form-control form-control-lg" placeholder="Enter add-on name" name="name" value={addonData.name} onChange={handleChange} />
                                                    </div>

                                                    {/* Price */}
                                                    <div className="col-12">
                                                        <label className="form-label">Price ({Config.APP_SETTING.DefaultCurrencySymbol})</label>
                                                        <div className="input-group">
                                                            <span className="input-group-text">{Config.APP_SETTING.DefaultCurrencySymbol}</span>
                                                            <input type="number" className="form-control form-control-lg" placeholder="Enter price" name="price" value={addonData.price} onChange={handleChange} min="0" />
                                                        </div>
                                                    </div>

                                                    {/* Is Default */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Is Default?</label>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" name="isDefault" checked={addonData.isDefault} onChange={handleChange} />
                                                            <label className="form-check-label">{addonData.isDefault ? "Yes, Set as Default" : "No"}</label>
                                                        </div>
                                                    </div>

                                                    {/* Is Active */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Status</label>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" name="isActive" checked={addonData.isActive} onChange={handleChange} />
                                                            <label className="form-check-label">{addonData.isActive ? "Active" : "Inactive"}</label>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="modal-footer bg-white px-4 py-3">
                                    <button className="btn btn-light rounded-3" data-bs-dismiss="modal">Cancel</button>
                                    <button className="btn fw-semibold rounded-3 px-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }} onClick={handleSubmit} disabled={isSubmittingAddon}>
                                        {isSubmittingAddon ? (
                                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating...</>
                                        ) : (<><i className="ri-check-line me-1"></i>Create Add-On</>)}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ================= EDIT ADD-ON MODAL ================= */}
                    <div className="modal fade" id="addonEditModal" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 rounded-4 overflow-hidden">

                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    padding: '20px 24px',
                                    color: 'white'
                                }}>
                                    <div>
                                        <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
                                            <i className="ri-edit-box-line me-2"></i>Edit Add-On
                                        </h4>
                                        <small style={{ opacity: 0.9 }}>Update add-on details</small>
                                    </div>
                                    <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
                                </div>

                                <div className="modal-body p-4 bg-white">
                                    <form>
                                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                                            <div className="card-body">

                                                <h6 className="fw-semibold mb-3 text-primary">
                                                    Update Add-On Details
                                                </h6>

                                                <div className="row g-3">

                                                    {/* Menu Item */}
                                                    <div className="col-12">
                                                        <label className="form-label">Menu Item</label>
                                                        <Select
                                                            options={menuItems.map(item => ({ value: item._id, label: item.name }))}
                                                            value={addonData.menuItem ? { value: addonData.menuItem, label: menuItems.find(m => m._id === addonData.menuItem)?.name } : null}
                                                            onChange={(option) => {
                                                                setAddonData(prev => ({ ...prev, menuItem: option ? option.value : "" }));
                                                                loadAddonGroups(option ? option.value : "");
                                                            }}
                                                            isClearable
                                                            isSearchable
                                                            placeholder="Search & select menu item..."
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    borderRadius: '8px',
                                                                    border: '1px solid #e5e7eb',
                                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                                }),
                                                                option: (base, state) => ({
                                                                    ...base,
                                                                    backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#f3f4f6' : '#fff',
                                                                    color: state.isSelected ? '#fff' : '#000'
                                                                })
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Add-On Group */}
                                                    <div className="col-12">
                                                        <label className="form-label">Add-On Group</label>
                                                        <Select
                                                            options={addonGroups.map(group => ({ value: group._id, label: group.name }))}
                                                            value={addonData.addOnGroup ? { value: addonData.addOnGroup, label: addonGroups.find(g => g._id === addonData.addOnGroup)?.name } : null}
                                                            onChange={(option) => {
                                                                setAddonData(prev => ({ ...prev, addOnGroup: option ? option.value : "" }));
                                                                loadAddons(option ? option.value : "");
                                                            }}
                                                            isClearable
                                                            isSearchable
                                                            placeholder="Search & select add-on group..."
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    borderRadius: '8px',
                                                                    border: '1px solid #e5e7eb',
                                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                                }),
                                                                option: (base, state) => ({
                                                                    ...base,
                                                                    backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#f3f4f6' : '#fff',
                                                                    color: state.isSelected ? '#fff' : '#000'
                                                                })
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Add-On Name */}
                                                    <div className="col-12">
                                                        <label className="form-label">Add-On Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-lg"
                                                            placeholder="Enter add-on name"
                                                            name="name"
                                                            value={addonData.name}
                                                            onChange={handleChange}
                                                        />
                                                    </div>

                                                    {/* Price */}
                                                    <div className="col-12">
                                                        <label className="form-label">Price ({Config.APP_SETTING.DefaultCurrencySymbol})</label>
                                                        <div className="input-group">
                                                            <span className="input-group-text">{Config.APP_SETTING.DefaultCurrencySymbol}</span>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-lg"
                                                                placeholder="Enter price"
                                                                name="price"
                                                                value={addonData.price}
                                                                onChange={handleChange}
                                                                min="0"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Is Default */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Is Default?</label>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="isDefault"
                                                                checked={addonData.isDefault}
                                                                onChange={handleChange}
                                                            />
                                                            <label className="form-check-label">
                                                                {addonData.isDefault ? "Yes, Set as Default" : "No"}
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* Is Active */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Status</label>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="isActive"
                                                                checked={addonData.isActive}
                                                                onChange={handleChange}
                                                            />
                                                            <label className="form-check-label">
                                                                {addonData.isActive ? "Active" : "Inactive"}
                                                            </label>
                                                        </div>
                                                    </div>

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
                                        className="btn fw-semibold rounded-3 px-4"
                                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}
                                        onClick={handleUpdate}
                                        disabled={isUpdatingAddon}
                                    >
                                        {isUpdatingAddon ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <><i className="ri-check-line me-1"></i>Update Add-On</>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ================= DELETE CONFIRMATION MODAL ================= */}
                    <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 rounded-4 overflow-hidden">

                                <div style={{
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    padding: '20px 24px',
                                    color: 'white'
                                }}>
                                    <div>
                                        <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
                                            <i className="ri-delete-bin-6-line me-2"></i>Delete Add-On
                                        </h4>
                                        <small style={{ opacity: 0.9 }}>This action cannot be undone</small>
                                    </div>
                                    <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
                                </div>

                                <div className="modal-body p-4 bg-white">
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <i className="ri-alert-line display-5 text-danger"></i>
                                        </div>
                                        <h5 className="fw-semibold mb-2">Are you sure?</h5>
                                        <p className="text-muted mb-0">
                                            This will permanently delete the add-on. This action cannot be undone.
                                        </p>
                                    </div>
                                </div>

                                <div className="modal-footer bg-white px-4 py-3 justify-content-center">
                                    <button
                                        className="btn btn-light rounded-3"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-danger rounded-3 px-4"
                                        onClick={handleDelete}
                                        disabled={isDeletingAddon}
                                    >
                                        {isDeletingAddon ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            <><i className="ri-delete-bin-6-line me-1"></i>Delete Add-On</>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ================= CREATE ADD-ON GROUP MODAL ================= */}
                    <div className="modal fade" id="groupModal" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 rounded-4 overflow-hidden">

                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    padding: '20px 24px',
                                    color: 'white'
                                }}>
                                    <div>
                                        <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
                                            <i className="ri-folder-add-line me-2"></i>Create Add-On Group
                                        </h4>
                                        <small style={{ opacity: 0.9 }}>Add a new group for product add-ons</small>
                                    </div>
                                    <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
                                </div>

                                <div className="modal-body p-4 bg-white">
                                    <form>
                                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                                            <div className="card-body">

                                                <h6 className="fw-semibold mb-3 text-primary">
                                                    Group Details
                                                </h6>

                                                <div className="row g-3">

                                                    {/* Group Name */}
                                                    <div className="col-12">
                                                        <label className="form-label">Group Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-lg"
                                                            placeholder="e.g., Size, Color, Flavor"
                                                            name="name"
                                                            value={groupData.name}
                                                            onChange={handleGroupChange}
                                                        />
                                                    </div>

                                                    {/* Is Required */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Is Required?</label>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="isRequired"
                                                                checked={groupData.isRequired}
                                                                onChange={handleGroupChange}
                                                            />
                                                            <label className="form-check-label">
                                                                {groupData.isRequired ? "Yes, Customer must select" : "No, Optional"}
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* Is Multiple */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Allow Multiple?</label>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="isMultiple"
                                                                checked={groupData.isMultiple}
                                                                onChange={handleGroupChange}
                                                            />
                                                            <label className="form-check-label">
                                                                {groupData.isMultiple ? "Yes, Multiple selections allowed" : "No, Single selection only"}
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* Is Active */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Status</label>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="isActive"
                                                                checked={groupData.isActive}
                                                                onChange={handleGroupChange}
                                                            />
                                                            <label className="form-check-label">
                                                                {groupData.isActive ? "Active" : "Inactive"}
                                                            </label>
                                                        </div>
                                                    </div>

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
                                        className="btn fw-semibold rounded-3 px-4"
                                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}
                                        onClick={handleCreateGroup}
                                        disabled={isSubmittingGroup}
                                    >
                                        {isSubmittingGroup ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <><i className="ri-check-line me-1"></i>Create Group</>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ================= EDIT ADD-ON GROUP MODAL ================= */}
                    <div className="modal fade" id="groupEditModal" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 rounded-4 overflow-hidden">

                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    padding: '20px 24px',
                                    color: 'white'
                                }}>
                                    <div>
                                        <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
                                            <i className="ri-edit-box-line me-2"></i>Edit Add-On Group
                                        </h4>
                                        <small style={{ opacity: 0.9 }}>Update group details</small>
                                    </div>
                                    <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
                                </div>

                                <div className="modal-body p-4 bg-white">
                                    <form>
                                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                                            <div className="card-body">

                                                <h6 className="fw-semibold mb-3 text-primary">
                                                    Update Group Details
                                                </h6>

                                                <div className="row g-3">

                                                    {/* Group Name */}
                                                    <div className="col-12">
                                                        <label className="form-label">Group Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-lg"
                                                            placeholder="e.g., Size, Color, Flavor"
                                                            name="name"
                                                            value={groupData.name}
                                                            onChange={handleGroupChange}
                                                        />
                                                    </div>

                                                    {/* Is Required */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Is Required?</label>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="isRequired"
                                                                checked={groupData.isRequired}
                                                                onChange={handleGroupChange}
                                                            />
                                                            <label className="form-check-label">
                                                                {groupData.isRequired ? "Yes, Customer must select" : "No, Optional"}
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* Is Multiple */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Allow Multiple?</label>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="isMultiple"
                                                                checked={groupData.isMultiple}
                                                                onChange={handleGroupChange}
                                                            />
                                                            <label className="form-check-label">
                                                                {groupData.isMultiple ? "Yes, Multiple selections allowed" : "No, Single selection only"}
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* Is Active */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Status</label>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="isActive"
                                                                checked={groupData.isActive}
                                                                onChange={handleGroupChange}
                                                            />
                                                            <label className="form-check-label">
                                                                {groupData.isActive ? "Active" : "Inactive"}
                                                            </label>
                                                        </div>
                                                    </div>

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
                                        className="btn fw-semibold rounded-3 px-4"
                                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}
                                        onClick={handleUpdateGroup}
                                        disabled={isUpdatingGroup}
                                    >
                                        {isUpdatingGroup ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <><i className="ri-check-line me-1"></i>Update Group</>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ================= DELETE ADD-ON GROUP MODAL ================= */}
                    <div className="modal fade" id="deleteGroupModal" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 rounded-4 overflow-hidden">

                                <div style={{
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    padding: '20px 24px',
                                    color: 'white'
                                }}>
                                    <div>
                                        <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
                                            <i className="ri-delete-bin-6-line me-2"></i>Delete Add-On Group
                                        </h4>
                                        <small style={{ opacity: 0.9 }}>This action cannot be undone</small>
                                    </div>
                                    <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
                                </div>

                                <div className="modal-body p-4 bg-white">
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <i className="ri-alert-line display-5 text-danger"></i>
                                        </div>
                                        <h5 className="fw-semibold mb-2">Are you sure?</h5>
                                        <p className="text-muted mb-0">
                                            This will permanently delete the add-on group. This action cannot be undone.
                                        </p>
                                    </div>
                                </div>

                                <div className="modal-footer bg-white px-4 py-3 justify-content-center">
                                    <button
                                        className="btn btn-light rounded-3"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-danger rounded-3 px-4"
                                        onClick={handleDeleteGroup}
                                        disabled={isDeletingGroup}
                                    >
                                        {isDeletingGroup ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            <><i className="ri-delete-bin-6-line me-1"></i>Delete Group</>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>


                </div>


            </>




        </div>
    );
}

