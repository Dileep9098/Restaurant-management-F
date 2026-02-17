import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Link } from "react-router-dom";
import { getAllItems } from "../../../Store/feature/Items/itemSlice";


export default function VariantsDetails() {

    const { user, permissions } = useSelector(state => state.auth);
    const { items } = useSelector(state => state.items);
    const dispatch = useDispatch();

    const canCreate = permissions.includes("variants.create");
    const canEdit = permissions.includes("variants.update");
    const canDelete = permissions.includes("variants.delete");

    const restaurantId = user?.restaurant?._id;

    // Data lists from server

    // const [menuItems, setMenuItems] = useState(items || []);
    const menuItems = items || [];
    const [variantGroups, setVariantGroups] = useState([]);
    const [variants, setVariants] = useState([]);

    const [selectedMenuItem, setSelectedMenuItem] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");

    // Editing state
    const [editId, setEditId] = useState(null);
    const [groupEditId, setGroupEditId] = useState(null);

    // Form states
    const [variantData, setVariantData] = useState({
        restaurant: restaurantId,
        menuItem: "",
        variantGroup: "",
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
    const [loadingVariants, setLoadingVariants] = useState(false);

    const [isSubmittingVariant, setIsSubmittingVariant] = useState(false);
    const [isUpdatingVariant, setIsUpdatingVariant] = useState(false);
    const [isDeletingVariant, setIsDeletingVariant] = useState(false);

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

    // ================= LOAD GROUPS =================
    // Loads variant groups for a given menu item and resets variants list

    const loadVariantGroups = async (menuItemId) => {

        setSelectedMenuItem(menuItemId);
        setVariantGroups([]);
        setVariants([]);
        setLoadingGroups(true);

        if (!menuItemId) return;

        try {

            const res = await axiosInstance.get(
                Config.END_POINT_LIST.GET_VARIANT_GROUPS_BY_ITEM + menuItemId
            );

            setVariantGroups(res.data.data || []);

        } catch (err) {
            showErrorMsg("Failed to load variant groups");
        } finally {
            setLoadingGroups(false);
        }
    };

    // ================= LOAD VARIANTS =================
    // Loads variants for a given variant group

    const loadVariants = async (groupId) => {

        setSelectedGroup(groupId);
        setVariants([]);
        setLoadingVariants(true);

        if (!groupId) return;

        try {

            const res = await axiosInstance.get(
                Config.END_POINT_LIST.GET_VARIANTS_BY_GROUP + groupId
            );

            setVariants(res.data.data || []);

        } catch (err) {
            showErrorMsg("Failed to load variants");
        } finally {
            setLoadingVariants(false);
        }
    };

    // ================= HANDLE CHANGE =================
    // Generic input handler used by variant forms (text, number, checkbox)

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        setVariantData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // ================= CREATE =================
    // Create a new Variant (modal form). Validates required fields and price.

    const handleSubmit = useCallback(async () => {
        setIsSubmittingVariant(true);

        if (!variantData.menuItem || !variantData.variantGroup)
            return showErrorMsg("Select menu item & group");

        if (!variantData.name || !variantData.price)
            return showErrorMsg("Name & price required");

        // if (parseFloat(variantData.price) <= 0)
        //     return showErrorMsg("Price must be greater than 0");

        try {

            const res = await axiosInstance.post(
                Config.END_POINT_LIST.CREATE_VARIANT,
                variantData
            );

            showSuccessMsg("Variant Created ✅");

            loadVariants(variantData.variantGroup);

            setVariantData({
                restaurant: restaurantId,
                menuItem: "",
                variantGroup: "",
                name: "",
                price: "",
                isDefault: false,
                isActive: true
            });

            const modalElement = document.getElementById("variantModal");
            if (modalElement) {
                const bsModal = new (window.bootstrap).Modal(modalElement);
                bsModal.hide();
            }
            document.querySelector('#variantModal .btn-close').click();

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Error creating variant");
        } finally {
            setIsSubmittingVariant(false);
        }
    }, [variantData, restaurantId]);

    // ================= EDIT =================
    // Prepare variant data for editing and set `editId`

    const handleEdit = (variant) => {

        setEditId(variant._id);

        setVariantData({
            restaurant: variant.restaurant,
            menuItem: variant.menuItem,
            variantGroup: variant.variantGroup,
            name: variant.name,
            price: variant.price,
            isDefault: variant.isDefault,
            isActive: variant.isActive
        });
    };

    const handleUpdate = useCallback(async () => {
        setIsUpdatingVariant(true);

        if (!variantData.menuItem || !variantData.variantGroup)
            return showErrorMsg("Select menu item & group");

        if (!variantData.name || !variantData.price)
            return showErrorMsg("Name & price required");

        if (parseFloat(variantData.price) <= 0)
            return showErrorMsg("Price must be greater than 0");

        try {

            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST.UPDATE_VARIANT}${editId}`,
                variantData
            );

            showSuccessMsg("Variant Updated ✅");

            loadVariants(variantData.variantGroup);

            const modalElement = document.getElementById("variantEditModal");
            if (modalElement) {
                const bsModal = new (window.bootstrap).Modal(modalElement);
                bsModal.hide();
            }
            document.querySelector('#variantEditModal .btn-close').click();

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Error updating variant");
        } finally {
            setIsUpdatingVariant(false);
        }
    }, [variantData, editId]);

    // ================= DELETE =================
    // Delete a variant (soft-delete via API)

    const handleDelete = useCallback(async () => {
        setIsDeletingVariant(true);

        if (!editId) {
            setIsDeletingVariant(false);
            return showErrorMsg("Please select a variant to delete");
        }

        try {

            await axiosInstance.delete(
                `${Config.END_POINT_LIST.DELETE_VARIANT}${editId}`
            );

            showSuccessMsg("Variant Deleted ✅");

            loadVariants(selectedGroup);
            setEditId(null);

            const modalElement = document.getElementById("deleteModal");
            if (modalElement) {
                const bsModal = new (window.bootstrap).Modal(modalElement);
                bsModal.hide();
            }
            document.querySelector('#deleteModal .btn-close').click();

        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Error deleting variant");
        } finally {
            setIsDeletingVariant(false);
        }
    }, [editId, selectedGroup]);

    // ================= VARIANT GROUP HANDLERS =================

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
                Config.END_POINT_LIST.CREATE_VARIANT_GROUP,
                groupData
            );

            showSuccessMsg("Variant Group Created ");

            loadVariantGroups(groupData.menuItem);

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
                `${Config.END_POINT_LIST.UPDATE_VARIANT_GROUP}${groupEditId}`,
                groupData
            );

            showSuccessMsg("Variant Group Updated ✅");

            loadVariantGroups(groupData.menuItem);

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
                `${Config.END_POINT_LIST.DELETE_VARIANT_GROUP}${groupEditId}`
            );

            showSuccessMsg("Variant Group Deleted");

            loadVariantGroups(selectedMenuItem);
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
                            <h5 className="m-b-10">Variant</h5>
                        </div>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">Dashboard</a>
                            </li>
                            <li className="breadcrumb-item">Variant Management</li>
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
                                        data-bs-target="#variantModal"
                                        onClick={() => {
                                            document.body.classList.remove("pace-done", "modal-open"); setVariantData({
                                                restaurant: restaurantId,
                                                menuItem: "",
                                                variantGroup: "",
                                                name: "",
                                                price: "",
                                                isDefault: false,
                                                isActive: true
                                            });
                                        }
                                        }

                                    >
                                        <i className="feather-plus me-2" />
                                        <span>Create Variant</span>
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
                                        loadVariantGroups(option ? option.value : "");
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
                                <label className="form-label fw-semibold mb-2 text-muted" style={{ fontSize: '13px' }}>Variant Group</label>
                                <Select
                                    options={variantGroups.map(group => ({ value: group._id, label: group.name }))}
                                    value={selectedGroup ? { value: selectedGroup, label: variantGroups.find(g => g._id === selectedGroup)?.name } : null}
                                    onChange={(option) => loadVariants(option ? option.value : "")}
                                    isClearable
                                    isSearchable
                                    placeholder="Search & select variant group..."
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
                    {/* ================= VARIANT GROUPS SECTION ================= */}
                    {selectedMenuItem && (
                        <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0 fw-bold" style={{ color: '#1f2937' }}><i className="ri-folder-2-line me-2" style={{ color: '#667eea' }}></i>Variant Groups</h5>
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
                                        {variantGroups.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted">
                                                    No variant groups found
                                                </td>
                                            </tr>
                                        ) : (
                                            variantGroups.map(group => (
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

                    {/* VARIANTS TABLE */}
                    <div className="mb-4">
                        <h5 className="mb-3 fw-bold" style={{ color: '#1f2937' }}><i className="ri-layout-list-line me-2" style={{ color: '#667eea' }}></i>Variants</h5>
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

                                    {variants.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center" style={{ padding: '32px', color: '#9ca3af' }}>
                                                <i className="ri-inbox-line" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>
                                                No variants found
                                            </td>
                                        </tr>
                                    ) : (

                                        variants.map((v, idx) => (
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
                                                            data-bs-target="#variantEditModal"
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
                                                                            to="#variantEditModal"
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



                    {/* ================= CREATE VARIANT MODAL ================= */}
                    <div className="modal fade" id="variantModal" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 rounded-4 overflow-hidden">

                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    padding: '20px 24px',
                                    color: 'white'
                                }}>
                                    <div>
                                        <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
                                            <i className="ri-add-circle-line me-2"></i>Create Variant
                                        </h4>
                                        <small style={{ opacity: 0.9 }}>Add a new variant to your group</small>
                                    </div>
                                    <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
                                </div>

                                <div className="modal-body p-4 bg-white">
                                    <form>
                                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                                            <div className="card-body">

                                                <h6 className="fw-semibold mb-3 text-primary">Variant Details</h6>

                                                <div className="row g-3">

                                                    {/* Menu Item */}
                                                    <div className="col-12">
                                                        <label className="form-label">Menu Item</label>
                                                        <Select
                                                            options={menuItems.map(item => ({ value: item._id, label: item.name }))}
                                                            value={variantData.menuItem ? { value: variantData.menuItem, label: menuItems.find(m => m._id === variantData.menuItem)?.name } : null}
                                                            onChange={(option) => {
                                                                setVariantData(prev => ({ ...prev, menuItem: option ? option.value : "" }));
                                                                loadVariantGroups(option ? option.value : "");
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

                                                    {/* Variant Group */}
                                                    <div className="col-12">
                                                        <label className="form-label">Variant Group</label>
                                                        <Select
                                                            options={variantGroups.map(group => ({ value: group._id, label: group.name }))}
                                                            value={variantData.variantGroup ? { value: variantData.variantGroup, label: variantGroups.find(g => g._id === variantData.variantGroup)?.name } : null}
                                                            onChange={(option) => {
                                                                setVariantData(prev => ({ ...prev, variantGroup: option ? option.value : "" }));
                                                                loadVariants(option ? option.value : "");
                                                            }}
                                                            isClearable
                                                            isSearchable
                                                            placeholder="Search & select variant group..."
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

                                                    {/* Variant Name */}
                                                    <div className="col-12">
                                                        <label className="form-label">Variant Name</label>
                                                        <input type="text" className="form-control form-control-lg" placeholder="Enter variant name" name="name" value={variantData.name} onChange={handleChange} />
                                                    </div>

                                                    {/* Price */}
                                                    <div className="col-12">
                                                        <label className="form-label">Price ({Config.APP_SETTING.DefaultCurrencySymbol})</label>
                                                        <div className="input-group">
                                                            <span className="input-group-text">{Config.APP_SETTING.DefaultCurrencySymbol}</span>
                                                            <input type="number" className="form-control form-control-lg" placeholder="Enter price" name="price" value={variantData.price} onChange={handleChange} min="0" />
                                                        </div>
                                                    </div>

                                                    {/* Is Default */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Is Default?</label>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" name="isDefault" checked={variantData.isDefault} onChange={handleChange} />
                                                            <label className="form-check-label">{variantData.isDefault ? "Yes, Set as Default" : "No"}</label>
                                                        </div>
                                                    </div>

                                                    {/* Is Active */}
                                                    <div className="col-12">
                                                        <label className="form-label d-block mb-2">Status</label>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" name="isActive" checked={variantData.isActive} onChange={handleChange} />
                                                            <label className="form-check-label">{variantData.isActive ? "Active" : "Inactive"}</label>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="modal-footer bg-white px-4 py-3">
                                    <button className="btn btn-light rounded-3" data-bs-dismiss="modal">Cancel</button>
                                    <button className="btn fw-semibold rounded-3 px-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }} onClick={handleSubmit} disabled={isSubmittingVariant}>
                                        {isSubmittingVariant ? (
                                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating...</>
                                        ) : (<><i className="ri-check-line me-1"></i>Create Variant</>)}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ================= EDIT VARIANT MODAL ================= */}
                    <div className="modal fade" id="variantEditModal" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 rounded-4 overflow-hidden">

                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    padding: '20px 24px',
                                    color: 'white'
                                }}>
                                    <div>
                                        <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
                                            <i className="ri-edit-box-line me-2"></i>Edit Variant
                                        </h4>
                                        <small style={{ opacity: 0.9 }}>Update variant details</small>
                                    </div>
                                    <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
                                </div>

                                <div className="modal-body p-4 bg-white">
                                    <form>
                                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                                            <div className="card-body">

                                                <h6 className="fw-semibold mb-3 text-primary">
                                                    Update Variant Details
                                                </h6>

                                                <div className="row g-3">

                                                    {/* Menu Item */}
                                                    <div className="col-12">
                                                        <label className="form-label">Menu Item</label>
                                                        <Select
                                                            options={menuItems.map(item => ({ value: item._id, label: item.name }))}
                                                            value={variantData.menuItem ? { value: variantData.menuItem, label: menuItems.find(m => m._id === variantData.menuItem)?.name } : null}
                                                            onChange={(option) => {
                                                                setVariantData(prev => ({ ...prev, menuItem: option ? option.value : "" }));
                                                                loadVariantGroups(option ? option.value : "");
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

                                                    {/* Variant Group */}
                                                    <div className="col-12">
                                                        <label className="form-label">Variant Group</label>
                                                        <Select
                                                            options={variantGroups.map(group => ({ value: group._id, label: group.name }))}
                                                            value={variantData.variantGroup ? { value: variantData.variantGroup, label: variantGroups.find(g => g._id === variantData.variantGroup)?.name } : null}
                                                            onChange={(option) => {
                                                                setVariantData(prev => ({ ...prev, variantGroup: option ? option.value : "" }));
                                                                loadVariants(option ? option.value : "");
                                                            }}
                                                            isClearable
                                                            isSearchable
                                                            placeholder="Search & select variant group..."
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

                                                    {/* Variant Name */}
                                                    <div className="col-12">
                                                        <label className="form-label">Variant Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-lg"
                                                            placeholder="Enter variant name"
                                                            name="name"
                                                            value={variantData.name}
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
                                                                value={variantData.price}
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
                                                                checked={variantData.isDefault}
                                                                onChange={handleChange}
                                                            />
                                                            <label className="form-check-label">
                                                                {variantData.isDefault ? "Yes, Set as Default" : "No"}
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
                                                                checked={variantData.isActive}
                                                                onChange={handleChange}
                                                            />
                                                            <label className="form-check-label">
                                                                {variantData.isActive ? "Active" : "Inactive"}
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
                                        disabled={isUpdatingVariant}
                                    >
                                        {isUpdatingVariant ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <><i className="ri-check-line me-1"></i>Update Variant</>
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
                                            <i className="ri-delete-bin-6-line me-2"></i>Delete Variant
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
                                            This will permanently delete the variant. This action cannot be undone.
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
                                        disabled={isDeletingVariant}
                                    >
                                        {isDeletingVariant ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            <><i className="ri-delete-bin-6-line me-1"></i>Delete Variant</>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ================= CREATE VARIANT GROUP MODAL ================= */}
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
                                            <i className="ri-folder-add-line me-2"></i>Create Variant Group
                                        </h4>
                                        <small style={{ opacity: 0.9 }}>Add a new group for product variants</small>
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

                    {/* ================= EDIT VARIANT GROUP MODAL ================= */}
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
                                            <i className="ri-edit-box-line me-2"></i>Edit Variant Group
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

                    {/* ================= DELETE VARIANT GROUP MODAL ================= */}
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
                                            <i className="ri-delete-bin-6-line me-2"></i>Delete Variant Group
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
                                            This will permanently delete the variant group. This action cannot be undone.
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









//  <div className="container-fluid" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '24px', paddingBottom: '24px' }}>
//                 <div className="card border-0 shadow-lg rounded-4" style={{ background: '#fff', overflow: 'hidden', marginBottom: '24px' }}>
//                     <div style={{
//                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                         padding: '32px 28px',
//                         color: 'white'
//                     }}>
//                         <div className="d-flex justify-content-between align-items-start">
//                             <div>
//                                 <h2 className="mb-2 fw-bold" style={{ fontSize: '28px' }}>
//                                     <i className="ri-settings-3-line me-2"></i>Variants Management
//                                 </h2>
//                                 <p className="mb-0" style={{ opacity: 0.9, fontSize: '14px' }}>Create and manage product variants and groups</p>
//                             </div>
//                             <div className="d-flex gap-2">
//                                 {canCreate && (
//                                     <button
//                                         className="btn btn-sm fw-semibold"
//                                         style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px' }}
//                                         data-bs-toggle="modal"
//                                         data-bs-target="#groupModal"
//                                         onClick={() => {
//                                             setGroupEditId(null);
//                                             setGroupData({
//                                                 restaurant: restaurantId,
//                                                 menuItem: selectedMenuItem,
//                                                 name: "",
//                                                 isRequired: true,
//                                                 isMultiple: false,
//                                                 isActive: true
//                                             });
//                                         }}
//                                     >
//                                         <i className="ri-add-line me-1"></i>Add Group
//                                     </button>
//                                 )}

//                                 {canCreate && (
//                                     <button
//                                         className="btn btn-sm fw-semibold"
//                                         style={{ background: '#fff', color: '#667eea', border: 'none', borderRadius: '8px', padding: '8px 16px' }}
//                                         data-bs-toggle="modal"
//                                         data-bs-target="#variantModal"
//                                         onClick={() => {
//                                             setVariantData({
//                                                 restaurant: restaurantId,
//                                                 menuItem: "",
//                                                 variantGroup: "",
//                                                 name: "",
//                                                 price: "",
//                                                 isDefault: false,
//                                                 isActive: true
//                                             });
//                                         }}
//                                     >
//                                         <i className="ri-add-circle-line me-1"></i>Create Variant
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                         <div style={{ padding: '32px 28px' }}>
//                             {/* FILTERS */}
//                             <div className="card border-0 p-4 mb-4" style={{ background: '#f8fafc' }}>
//                                 <div className="row g-3 align-items-center">

//                                     <div className="col-md-4">
//                                         <label className="form-label fw-semibold mb-2 text-muted" style={{ fontSize: '13px' }}>Menu Item</label>
//                                         <select
//                                             className="form-select"
//                                             style={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
//                                             onChange={(e) => loadVariantGroups(e.target.value)}
//                                         >
//                                             <option value="">Select Menu Item</option>
//                                             {menuItems.map(item => (
//                                                 <option key={item._id} value={item._id}>{item.name}</option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div className="col-md-4">
//                                         <label className="form-label fw-semibold mb-2 text-muted" style={{ fontSize: '13px' }}>Variant Group</label>
//                                         <select
//                                             className="form-select"
//                                             style={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
//                                             onChange={(e) => loadVariants(e.target.value)}
//                                         >
//                                             <option value="">Select Variant Group</option>
//                                             {variantGroups.map(group => (
//                                                 <option key={group._id} value={group._id}>{group.name}</option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     {/* Create button moved to top toolbar for cleaner layout */}

//                                 </div>
//                             </div>

//                             {/* ================= VARIANT GROUPS SECTION ================= */}
//                             {selectedMenuItem && (
//                                 <div className="mt-4">
//                                     <div className="d-flex justify-content-between align-items-center mb-3">
//                                         <h5 className="mb-0 fw-bold" style={{ color: '#1f2937' }}><i className="ri-folder-2-line me-2" style={{ color: '#667eea' }}></i>Variant Groups</h5>
//                                         {canCreate && (
//                                             <button
//                                                 className="btn btn-sm fw-semibold"
//                                                 style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px' }}
//                                                 data-bs-toggle="modal"
//                                                 data-bs-target="#groupModal"
//                                                 onClick={() => {
//                                                     setGroupEditId(null);
//                                                     setGroupData({
//                                                         restaurant: restaurantId,
//                                                         menuItem: selectedMenuItem,
//                                                         name: "",
//                                                         isRequired: true,
//                                                         isMultiple: false,
//                                                         isActive: true
//                                                     });
//                                                 }}
//                                             >
//                                                 <i className="ri-add-line"></i> Add Group
//                                             </button>
//                                         )}
//                                     </div>

//                                     <div className="table-responsive">
//                                         <table className="table table-hover table-sm" style={{ borderCollapse: 'collapse' }}>
//                                             <thead style={{ background: '#f3f4f6' }}>
//                                                 <tr>
//                                                     <th>Group Name</th>
//                                                     <th>Required</th>
//                                                     <th>Multiple</th>
//                                                     <th>Status</th>
//                                                     <th>Actions</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {variantGroups.length === 0 ? (
//                                                     <tr>
//                                                         <td colSpan="5" className="text-center text-muted">
//                                                             No variant groups found
//                                                         </td>
//                                                     </tr>
//                                                 ) : (
//                                                     variantGroups.map(group => (
//                                                         <tr key={group._id}>
//                                                             <td><strong>{group.name}</strong></td>
//                                                             <td>{group.isRequired ? "✅ Yes" : "❌ No"}</td>
//                                                             <td>{group.isMultiple ? "✅ Yes" : "❌ No"}</td>
//                                                             <td>{group.isActive ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span>}</td>
//                                                             <td>
//                                                                 {canEdit && (
//                                                                     <button
//                                                                         className="btn btn-outline-warning btn-sm me-2"
//                                                                         data-bs-toggle="modal"
//                                                                         data-bs-target="#groupEditModal"
//                                                                         onClick={() => handleEditGroup(group)}
//                                                                     >
//                                                                         Edit
//                                                                     </button>
//                                                                 )}
//                                                                 {canDelete && (
//                                                                     <button
//                                                                         className="btn btn-outline-danger btn-sm"
//                                                                         data-bs-toggle="modal"
//                                                                         data-bs-target="#deleteGroupModal"
//                                                                         onClick={() => setGroupEditId(group._id)}
//                                                                     >
//                                                                         Delete
//                                                                     </button>
//                                                                 )}
//                                                             </td>
//                                                         </tr>
//                                                     ))
//                                                 )}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* VARIANTS TABLE */}
//                             <div className="mb-4">
//                                 <h5 className="mb-3 fw-bold" style={{ color: '#1f2937' }}><i className="ri-layout-list-line me-2" style={{ color: '#667eea' }}></i>Variants</h5>
//                                 <div className="table-responsive">
//                                     <table className="table table-hover align-middle mb-0" style={{ borderCollapse: 'collapse' }}>
//                                         <thead>
//                                             <tr style={{ background: '#f3f4f6', fontWeight: '600', color: '#374151' }}>
//                                                 <th>Name</th>
//                                                 <th>Price</th>
//                                                 <th>Default</th>
//                                                 <th>Status</th>
//                                                 <th>Actions</th>
//                                             </tr>
//                                         </thead>

//                                         <tbody>

//                                             {variants.length === 0 ? (
//                                                 <tr>
//                                                     <td colSpan="5" className="text-center" style={{ padding: '32px', color: '#9ca3af' }}>
//                                                         <i className="ri-inbox-line" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>
//                                                         No variants found
//                                                     </td>
//                                                 </tr>
//                                             ) : (

//                                                 variants.map((v, idx) => (
//                                                     <tr key={v._id} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
//                                                         <td><strong style={{ color: '#1f2937' }}>{v.name}</strong></td>
//                                                         <td><span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>{Config.APP_SETTING.DefaultCurrencySymbol} {v.price}</span></td>
//                                                         <td>{v.isDefault ? <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>Default</span> : <span className="text-muted">-</span>}</td>
//                                                         <td>{v.isActive ? <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Active</span> : <span className="badge" style={{ background: '#f3f4f6', color: '#6b7280' }}>Inactive</span>}</td>

//                                                         <td>

//                                                             {canEdit && (
//                                                                 <button
//                                                                     className="btn btn-outline-warning btn-sm me-2"
//                                                                     style={{ borderRadius: '6px', borderColor: '#fbbf24', color: '#b45309' }}
//                                                                     data-bs-toggle="modal"
//                                                                     data-bs-target="#variantEditModal"
//                                                                     onClick={() => handleEdit(v)}
//                                                                 >
//                                                                     <i className="ri-edit-line me-1"></i>Edit
//                                                                 </button>
//                                                             )}

//                                                             {canDelete && (
//                                                                 <button
//                                                                     className="btn btn-outline-danger btn-sm"
//                                                                     style={{ borderRadius: '6px', borderColor: '#fca5a5', color: '#991b1b' }}
//                                                                     data-bs-toggle="modal"
//                                                                     data-bs-target="#deleteModal"
//                                                                     onClick={() => setEditId(v._id)}
//                                                                 >
//                                                                     <i className="ri-delete-bin-6-line me-1"></i>Delete
//                                                                 </button>
//                                                             )}

//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             )}

//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* ================= CREATE VARIANT MODAL ================= */}
//                         <div className="modal fade" id="variantModal" tabIndex={-1} aria-hidden="true">
//                             <div className="modal-dialog modal-dialog-centered modal-lg">
//                                 <div className="modal-content border-0 rounded-4 overflow-hidden">

//                                     <div style={{
//                                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                                         padding: '20px 24px',
//                                         color: 'white'
//                                     }}>
//                                         <div>
//                                             <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
//                                                 <i className="ri-add-circle-line me-2"></i>Create Variant
//                                             </h4>
//                                             <small style={{ opacity: 0.9 }}>Add a new variant to your group</small>
//                                         </div>
//                                         <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
//                                     </div>

//                                     <div className="modal-body p-4 bg-white">
//                                         <form>
//                                             <div className="card border-0 shadow-sm rounded-4 mb-4">
//                                                 <div className="card-body">

//                                                     <h6 className="fw-semibold mb-3 text-primary">Variant Details</h6>

//                                                     <div className="row g-3">

//                                                         {/* Menu Item */}
//                                                         <div className="col-12">
//                                                             <label className="form-label">Menu Item</label>
//                                                             <select
//                                                                 className="form-select form-select-lg"
//                                                                 name="menuItem"
//                                                                 value={variantData.menuItem}
//                                                                 onChange={(e) => {
//                                                                     setVariantData(prev => ({ ...prev, menuItem: e.target.value }));
//                                                                     loadVariantGroups(e.target.value);
//                                                                 }}
//                                                             >
//                                                                 <option value="">Select Menu Item</option>
//                                                                 {menuItems.map(item => (
//                                                                     <option key={item._id} value={item._id}>{item.name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>

//                                                         {/* Variant Group */}
//                                                         <div className="col-12">
//                                                             <label className="form-label">Variant Group</label>
//                                                             <select
//                                                                 className="form-select form-select-lg"
//                                                                 name="variantGroup"
//                                                                 value={variantData.variantGroup}
//                                                                 onChange={(e) => {
//                                                                     setVariantData(prev => ({ ...prev, variantGroup: e.target.value }));
//                                                                     loadVariants(e.target.value);
//                                                                 }}
//                                                             >
//                                                                 <option value="">Select Variant Group</option>
//                                                                 {variantGroups.map(group => (
//                                                                     <option key={group._id} value={group._id}>{group.name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>

//                                                         {/* Variant Name */}
//                                                         <div className="col-12">
//                                                             <label className="form-label">Variant Name</label>
//                                                             <input type="text" className="form-control form-control-lg" placeholder="Enter variant name" name="name" value={variantData.name} onChange={handleChange} />
//                                                         </div>

//                                                         {/* Price */}
//                                                         <div className="col-12">
//                                                             <label className="form-label">Price ({Config.APP_SETTING.DefaultCurrencySymbol})</label>
//                                                             <div className="input-group">
//                                                                 <span className="input-group-text">{Config.APP_SETTING.DefaultCurrencySymbol}</span>
//                                                                 <input type="number" className="form-control form-control-lg" placeholder="Enter price" name="price" value={variantData.price} onChange={handleChange} min="0" />
//                                                             </div>
//                                                         </div>

//                                                         {/* Is Default */}
//                                                         <div className="col-12">
//                                                             <label className="form-label d-block mb-2">Is Default?</label>
//                                                             <div className="form-check form-switch">
//                                                                 <input className="form-check-input" type="checkbox" name="isDefault" checked={variantData.isDefault} onChange={handleChange} />
//                                                                 <label className="form-check-label">{variantData.isDefault ? "Yes, Set as Default" : "No"}</label>
//                                                             </div>
//                                                         </div>

//                                                         {/* Is Active */}
//                                                         <div className="col-12">
//                                                             <label className="form-label d-block mb-2">Status</label>
//                                                             <div className="form-check form-switch">
//                                                                 <input className="form-check-input" type="checkbox" name="isActive" checked={variantData.isActive} onChange={handleChange} />
//                                                                 <label className="form-check-label">{variantData.isActive ? "Active" : "Inactive"}</label>
//                                                             </div>
//                                                         </div>

//                                                     </div>

//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>

//                                     <div className="modal-footer bg-white px-4 py-3">
//                                         <button className="btn btn-light rounded-3" data-bs-dismiss="modal">Cancel</button>
//                                         <button className="btn fw-semibold rounded-3 px-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }} onClick={handleSubmit} disabled={isSubmittingVariant}>
//                                             {isSubmittingVariant ? (
//                                                 <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating...</>
//                                             ) : (<><i className="ri-check-line me-1"></i>Create Variant</>)}
//                                         </button>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>

//                         {/* ================= EDIT VARIANT MODAL ================= */}
//                         <div className="modal fade" id="variantEditModal" tabIndex={-1} aria-hidden="true">
//                             <div className="modal-dialog modal-dialog-centered modal-lg">
//                                 <div className="modal-content border-0 rounded-4 overflow-hidden">

//                                     <div style={{
//                                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                                         padding: '20px 24px',
//                                         color: 'white'
//                                     }}>
//                                         <div>
//                                             <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
//                                                 <i className="ri-edit-box-line me-2"></i>Edit Variant
//                                             </h4>
//                                             <small style={{ opacity: 0.9 }}>Update variant details</small>
//                                         </div>
//                                         <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
//                                     </div>

//                                     <div className="modal-body p-4 bg-white">
//                                         <form>
//                                             <div className="card border-0 shadow-sm rounded-4 mb-4">
//                                                 <div className="card-body">

//                                                     <h6 className="fw-semibold mb-3 text-primary">
//                                                         Update Variant Details
//                                                     </h6>

//                                                     <div className="row g-3">

//                                                         {/* Menu Item */}
//                                                         <div className="col-12">
//                                                             <label className="form-label">Menu Item</label>
//                                                             <select
//                                                                 className="form-select form-select-lg"
//                                                                 name="menuItem"
//                                                                 value={variantData.menuItem}
//                                                                 onChange={(e) => {
//                                                                     setVariantData(prev => ({ ...prev, menuItem: e.target.value }));
//                                                                     loadVariantGroups(e.target.value);
//                                                                 }}
//                                                             >
//                                                                 <option value="">Select Menu Item</option>
//                                                                 {menuItems.map(item => (
//                                                                     <option key={item._id} value={item._id}>
//                                                                         {item.name}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>

//                                                         {/* Variant Group */}
//                                                         <div className="col-12">
//                                                             <label className="form-label">Variant Group</label>
//                                                             <select
//                                                                 className="form-select form-select-lg"
//                                                                 name="variantGroup"
//                                                                 value={variantData.variantGroup}
//                                                                 onChange={(e) => {
//                                                                     setVariantData(prev => ({ ...prev, variantGroup: e.target.value }));
//                                                                     loadVariants(e.target.value);
//                                                                 }}
//                                                             >
//                                                                 <option value="">Select Variant Group</option>
//                                                                 {variantGroups.map(group => (
//                                                                     <option key={group._id} value={group._id}>
//                                                                         {group.name}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>

//                                                         {/* Variant Name */}
//                                                         <div className="col-12">
//                                                             <label className="form-label">Variant Name</label>
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control form-control-lg"
//                                                                 placeholder="Enter variant name"
//                                                                 name="name"
//                                                                 value={variantData.name}
//                                                                 onChange={handleChange}
//                                                             />
//                                                         </div>

//                                                         {/* Price */}
//                                                         <div className="col-12">
//                                                             <label className="form-label">Price ({Config.APP_SETTING.DefaultCurrencySymbol})</label>
//                                                             <div className="input-group">
//                                                                 <span className="input-group-text">{Config.APP_SETTING.DefaultCurrencySymbol}</span>
//                                                                 <input
//                                                                     type="number"
//                                                                     className="form-control form-control-lg"
//                                                                     placeholder="Enter price"
//                                                                     name="price"
//                                                                     value={variantData.price}
//                                                                     onChange={handleChange}
//                                                                     min="0"
//                                                                 />
//                                                             </div>
//                                                         </div>

//                                                         {/* Is Default */}
//                                                         <div className="col-12">
//                                                             <label className="form-label d-block mb-2">Is Default?</label>
//                                                             <div className="form-check form-switch">
//                                                                 <input
//                                                                     className="form-check-input"
//                                                                     type="checkbox"
//                                                                     name="isDefault"
//                                                                     checked={variantData.isDefault}
//                                                                     onChange={handleChange}
//                                                                 />
//                                                                 <label className="form-check-label">
//                                                                     {variantData.isDefault ? "Yes, Set as Default" : "No"}
//                                                                 </label>
//                                                             </div>
//                                                         </div>

//                                                         {/* Is Active */}
//                                                         <div className="col-12">
//                                                             <label className="form-label d-block mb-2">Status</label>
//                                                             <div className="form-check form-switch">
//                                                                 <input
//                                                                     className="form-check-input"
//                                                                     type="checkbox"
//                                                                     name="isActive"
//                                                                     checked={variantData.isActive}
//                                                                     onChange={handleChange}
//                                                                 />
//                                                                 <label className="form-check-label">
//                                                                     {variantData.isActive ? "Active" : "Inactive"}
//                                                                 </label>
//                                                             </div>
//                                                         </div>

//                                                     </div>

//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>

//                                     <div className="modal-footer bg-white px-4 py-3">
//                                         <button
//                                             className="btn btn-light rounded-3"
//                                             data-bs-dismiss="modal"
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button
//                                             className="btn fw-semibold rounded-3 px-4"
//                                             style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}
//                                             onClick={handleUpdate}
//                                             disabled={isUpdatingVariant}
//                                         >
//                                             {isUpdatingVariant ? (
//                                                 <>
//                                                     <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                                     Updating...
//                                                 </>
//                                             ) : (
//                                                 <><i className="ri-check-line me-1"></i>Update Variant</>
//                                             )}
//                                         </button>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>

//                         {/* ================= DELETE CONFIRMATION MODAL ================= */}
//                         <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
//                             <div className="modal-dialog modal-dialog-centered">
//                                 <div className="modal-content border-0 rounded-4 overflow-hidden">

//                                     <div style={{
//                                         background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
//                                         padding: '20px 24px',
//                                         color: 'white'
//                                     }}>
//                                         <div>
//                                             <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
//                                                 <i className="ri-delete-bin-6-line me-2"></i>Delete Variant
//                                             </h4>
//                                             <small style={{ opacity: 0.9 }}>This action cannot be undone</small>
//                                         </div>
//                                         <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
//                                     </div>

//                                     <div className="modal-body p-4 bg-white">
//                                         <div className="text-center">
//                                             <div className="mb-3">
//                                                 <i className="ri-alert-line display-5 text-danger"></i>
//                                             </div>
//                                             <h5 className="fw-semibold mb-2">Are you sure?</h5>
//                                             <p className="text-muted mb-0">
//                                                 This will permanently delete the variant. This action cannot be undone.
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="modal-footer bg-white px-4 py-3 justify-content-center">
//                                         <button
//                                             className="btn btn-light rounded-3"
//                                             data-bs-dismiss="modal"
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button
//                                             className="btn btn-danger rounded-3 px-4"
//                                             onClick={handleDelete}
//                                             disabled={isDeletingVariant}
//                                         >
//                                             {isDeletingVariant ? (
//                                                 <>
//                                                     <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                                     Deleting...
//                                                 </>
//                                             ) : (
//                                                 <><i className="ri-delete-bin-6-line me-1"></i>Delete Variant</>
//                                             )}
//                                         </button>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>

//                         {/* ================= CREATE VARIANT GROUP MODAL ================= */}
//                         <div className="modal fade" id="groupModal" tabIndex={-1} aria-hidden="true">
//                             <div className="modal-dialog modal-dialog-centered modal-lg">
//                                 <div className="modal-content border-0 rounded-4 overflow-hidden">

//                                     <div style={{
//                                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                                         padding: '20px 24px',
//                                         color: 'white'
//                                     }}>
//                                         <div>
//                                             <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
//                                                 <i className="ri-folder-add-line me-2"></i>Create Variant Group
//                                             </h4>
//                                             <small style={{ opacity: 0.9 }}>Add a new group for product variants</small>
//                                         </div>
//                                         <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
//                                     </div>

//                                     <div className="modal-body p-4 bg-white">
//                                         <form>
//                                             <div className="card border-0 shadow-sm rounded-4 mb-4">
//                                                 <div className="card-body">

//                                                     <h6 className="fw-semibold mb-3 text-primary">
//                                                         Group Details
//                                                     </h6>

//                                                     <div className="row g-3">

//                                                         {/* Group Name */}
//                                                         <div className="col-12">
//                                                             <label className="form-label">Group Name</label>
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control form-control-lg"
//                                                                 placeholder="e.g., Size, Color, Flavor"
//                                                                 name="name"
//                                                                 value={groupData.name}
//                                                                 onChange={handleGroupChange}
//                                                             />
//                                                         </div>

//                                                         {/* Is Required */}
//                                                         <div className="col-12">
//                                                             <label className="form-label d-block mb-2">Is Required?</label>
//                                                             <div className="form-check form-switch">
//                                                                 <input
//                                                                     className="form-check-input"
//                                                                     type="checkbox"
//                                                                     name="isRequired"
//                                                                     checked={groupData.isRequired}
//                                                                     onChange={handleGroupChange}
//                                                                 />
//                                                                 <label className="form-check-label">
//                                                                     {groupData.isRequired ? "Yes, Customer must select" : "No, Optional"}
//                                                                 </label>
//                                                             </div>
//                                                         </div>

//                                                         {/* Is Multiple */}
//                                                         <div className="col-12">
//                                                             <label className="form-label d-block mb-2">Allow Multiple?</label>
//                                                             <div className="form-check form-switch">
//                                                                 <input
//                                                                     className="form-check-input"
//                                                                     type="checkbox"
//                                                                     name="isMultiple"
//                                                                     checked={groupData.isMultiple}
//                                                                     onChange={handleGroupChange}
//                                                                 />
//                                                                 <label className="form-check-label">
//                                                                     {groupData.isMultiple ? "Yes, Multiple selections allowed" : "No, Single selection only"}
//                                                                 </label>
//                                                             </div>
//                                                         </div>

//                                                         {/* Is Active */}
//                                                         <div className="col-12">
//                                                             <label className="form-label d-block mb-2">Status</label>
//                                                             <div className="form-check form-switch">
//                                                                 <input
//                                                                     className="form-check-input"
//                                                                     type="checkbox"
//                                                                     name="isActive"
//                                                                     checked={groupData.isActive}
//                                                                     onChange={handleGroupChange}
//                                                                 />
//                                                                 <label className="form-check-label">
//                                                                     {groupData.isActive ? "Active" : "Inactive"}
//                                                                 </label>
//                                                             </div>
//                                                         </div>

//                                                     </div>

//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>

//                                     <div className="modal-footer bg-white px-4 py-3">
//                                         <button
//                                             className="btn btn-light rounded-3"
//                                             data-bs-dismiss="modal"
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button
//                                             className="btn fw-semibold rounded-3 px-4"
//                                             style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}
//                                             onClick={handleCreateGroup}
//                                             disabled={isSubmittingGroup}
//                                         >
//                                             {isSubmittingGroup ? (
//                                                 <>
//                                                     <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                                     Creating...
//                                                 </>
//                                             ) : (
//                                                 <><i className="ri-check-line me-1"></i>Create Group</>
//                                             )}
//                                         </button>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>

//                         {/* ================= EDIT VARIANT GROUP MODAL ================= */}
//                         <div className="modal fade" id="groupEditModal" tabIndex={-1} aria-hidden="true">
//                             <div className="modal-dialog modal-dialog-centered modal-lg">
//                                 <div className="modal-content border-0 rounded-4 overflow-hidden">

//                                     <div style={{
//                                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                                         padding: '20px 24px',
//                                         color: 'white'
//                                     }}>
//                                         <div>
//                                             <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
//                                                 <i className="ri-edit-box-line me-2"></i>Edit Variant Group
//                                             </h4>
//                                             <small style={{ opacity: 0.9 }}>Update group details</small>
//                                         </div>
//                                         <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
//                                     </div>

//                                     <div className="modal-body p-4 bg-white">
//                                         <form>
//                                             <div className="card border-0 shadow-sm rounded-4 mb-4">
//                                                 <div className="card-body">

//                                                     <h6 className="fw-semibold mb-3 text-primary">
//                                                         Update Group Details
//                                                     </h6>

//                                                     <div className="row g-3">

//                                                         {/* Group Name */}
//                                                         <div className="col-12">
//                                                             <label className="form-label">Group Name</label>
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control form-control-lg"
//                                                                 placeholder="e.g., Size, Color, Flavor"
//                                                                 name="name"
//                                                                 value={groupData.name}
//                                                                 onChange={handleGroupChange}
//                                                             />
//                                                         </div>

//                                                         {/* Is Required */}
//                                                         <div className="col-12">
//                                                             <label className="form-label d-block mb-2">Is Required?</label>
//                                                             <div className="form-check form-switch">
//                                                                 <input
//                                                                     className="form-check-input"
//                                                                     type="checkbox"
//                                                                     name="isRequired"
//                                                                     checked={groupData.isRequired}
//                                                                     onChange={handleGroupChange}
//                                                                 />
//                                                                 <label className="form-check-label">
//                                                                     {groupData.isRequired ? "Yes, Customer must select" : "No, Optional"}
//                                                                 </label>
//                                                             </div>
//                                                         </div>

//                                                         {/* Is Multiple */}
//                                                         <div className="col-12">
//                                                             <label className="form-label d-block mb-2">Allow Multiple?</label>
//                                                             <div className="form-check form-switch">
//                                                                 <input
//                                                                     className="form-check-input"
//                                                                     type="checkbox"
//                                                                     name="isMultiple"
//                                                                     checked={groupData.isMultiple}
//                                                                     onChange={handleGroupChange}
//                                                                 />
//                                                                 <label className="form-check-label">
//                                                                     {groupData.isMultiple ? "Yes, Multiple selections allowed" : "No, Single selection only"}
//                                                                 </label>
//                                                             </div>
//                                                         </div>

//                                                         {/* Is Active */}
//                                                         <div className="col-12">
//                                                             <label className="form-label d-block mb-2">Status</label>
//                                                             <div className="form-check form-switch">
//                                                                 <input
//                                                                     className="form-check-input"
//                                                                     type="checkbox"
//                                                                     name="isActive"
//                                                                     checked={groupData.isActive}
//                                                                     onChange={handleGroupChange}
//                                                                 />
//                                                                 <label className="form-check-label">
//                                                                     {groupData.isActive ? "Active" : "Inactive"}
//                                                                 </label>
//                                                             </div>
//                                                         </div>

//                                                     </div>

//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>

//                                     <div className="modal-footer bg-white px-4 py-3">
//                                         <button
//                                             className="btn btn-light rounded-3"
//                                             data-bs-dismiss="modal"
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button
//                                             className="btn fw-semibold rounded-3 px-4"
//                                             style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}
//                                             onClick={handleUpdateGroup}
//                                             disabled={isUpdatingGroup}
//                                         >
//                                             {isUpdatingGroup ? (
//                                                 <>
//                                                     <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                                     Updating...
//                                                 </>
//                                             ) : (
//                                                 <><i className="ri-check-line me-1"></i>Update Group</>
//                                             )}
//                                         </button>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>

//                         {/* ================= DELETE VARIANT GROUP MODAL ================= */}
//                         <div className="modal fade" id="deleteGroupModal" tabIndex={-1} aria-hidden="true">
//                             <div className="modal-dialog modal-dialog-centered">
//                                 <div className="modal-content border-0 rounded-4 overflow-hidden">

//                                     <div style={{
//                                         background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
//                                         padding: '20px 24px',
//                                         color: 'white'
//                                     }}>
//                                         <div>
//                                             <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>
//                                                 <i className="ri-delete-bin-6-line me-2"></i>Delete Variant Group
//                                             </h4>
//                                             <small style={{ opacity: 0.9 }}>This action cannot be undone</small>
//                                         </div>
//                                         <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '16px', right: '16px' }} data-bs-dismiss="modal" />
//                                     </div>

//                                     <div className="modal-body p-4 bg-white">
//                                         <div className="text-center">
//                                             <div className="mb-3">
//                                                 <i className="ri-alert-line display-5 text-danger"></i>
//                                             </div>
//                                             <h5 className="fw-semibold mb-2">Are you sure?</h5>
//                                             <p className="text-muted mb-0">
//                                                 This will permanently delete the variant group. This action cannot be undone.
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="modal-footer bg-white px-4 py-3 justify-content-center">
//                                         <button
//                                             className="btn btn-light rounded-3"
//                                             data-bs-dismiss="modal"
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button
//                                             className="btn btn-danger rounded-3 px-4"
//                                             onClick={handleDeleteGroup}
//                                             disabled={isDeletingGroup}
//                                         >
//                                             {isDeletingGroup ? (
//                                                 <>
//                                                     <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                                     Deleting...
//                                                 </>
//                                             ) : (
//                                                 <><i className="ri-delete-bin-6-line me-1"></i>Delete Group</>
//                                             )}
//                                         </button>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>