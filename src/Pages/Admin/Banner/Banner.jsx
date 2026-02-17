import React, { useEffect, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";

export default function Banner() {
    const [moduleData, setModuleData] = useState({
        mainHead: "",
        subHead: "",
        status: "Active"
    });

    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [getId, setGetId] = useState(null);
    const [allBanners, setAllBanners] = useState([]);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await axiosInstance.get(
                Config.END_POINT_LIST["GET_ALL_BANNERS"] || "/api/v1/banners",
                { withCredentials: true }
            );
            if (res.data.success) {
                
                setAllBanners(res.data.banners);
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleModuleChange = (e) => {
        setModuleData({ ...moduleData, [e.target.name]: e.target.value });
    };

  const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    setFile(selectedFile); // store File object for upload
    setFilePreview(URL.createObjectURL(selectedFile)); // show preview
  }
};


    // ===== SUBMIT =====
    const handleSubmit = async () => {
        try {
            if (!moduleData.mainHead.trim()) {
                return showErrorMsg("Main heading is required");
            }
            if (!moduleData.subHead.trim()) {
                return showErrorMsg("Sub heading is required");
            }
            if (!file) {
                return showErrorMsg("Banner image is required");
            }

            const myForm = new FormData();
            myForm.append("mainHead", moduleData.mainHead);
            myForm.append("subHead", moduleData.subHead);
            myForm.append("status", moduleData.status);
            myForm.append("file", file);

            const res = await axiosInstance.post(
                Config.END_POINT_LIST["ADD_BANNER"],
                myForm,
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                showSuccessMsg("Banner Created Successfully");
                setAllBanners([...allBanners, res.data.banner]);

                // Reset form
                setModuleData({
                    mainHead: "",
                    subHead: "",
                    status: "Active"
                });
                setFile(null);
                setFilePreview(null);

                document.querySelector('#bannerModal .btn-close')?.click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleEdit = (id) => {
        const banner = allBanners.find(item => item._id === id);
        if (!banner) return;

        setGetId(id);
        setModuleData({
            mainHead: banner.mainHead,
            subHead: banner.subHead,
            status: banner.status
        });
        setFile(banner.file ? banner.file : null);
        setFilePreview(banner.file ? `assets/images/banner/${banner.file}` : null);
    };

    const handleEditSubmit = async () => {
        try {
            if (!getId) return;
            if (!moduleData.mainHead.trim()) {
                return showErrorMsg("Main heading is required");
            }
            if (!moduleData.subHead.trim()) {
                return showErrorMsg("Sub heading is required");
            }

            const myForm = new FormData();
            myForm.append("mainHead", moduleData.mainHead);
            myForm.append("subHead", moduleData.subHead);
            myForm.append("status", moduleData.status);
            if (file) {
                myForm.append("file", file);
            }

            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST["UPDATE_BANNER"] || "/api/v1/banner"}/${getId}`,
                myForm,
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                showSuccessMsg("Banner Updated Successfully");
                setAllBanners(
                    allBanners.map(item =>
                        item._id === getId ? res.data.banner : item
                    )
                );

                // Reset form
                setGetId(null);
                setModuleData({
                    mainHead: "",
                    subHead: "",
                    status: "Active"
                });
                setFile(null);
                setFilePreview(null);

                document.querySelector('#bannerModalEdit .btn-close')?.click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleDeleteBanner = async () => {
        try {
            const res = await axiosInstance.delete(
                `${Config.END_POINT_LIST["DELETE_BANNER"] || "/api/v1/banner"}/${getId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Banner Deleted Successfully");
                setAllBanners(allBanners.filter(item => item._id !== getId));
                document.querySelector('#deleteRecordModal .btn-close')?.click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <>
            <div className="nxl-content">
                <div className="page-header">
                    <div className="page-header-left d-flex align-items-center">
                        <div className="page-header-title">
                            <h5 className="m-b-10">Banner Management</h5>
                        </div>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">Dashboard</a>
                            </li>
                            <li className="breadcrumb-item">Banner Management</li>
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

                                <a
                                    href="#"
                                    className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    id="create-btn"
                                    data-bs-target="#bannerModal"
                                    onClick={() =>
                                        document.body.classList.remove("pace-done", "modal-open")
                                    }
                                >
                                    <i className="feather-plus me-2" />
                                    <span>Create Banner</span>
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

                <div className="main-content">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card" id="bannersList">
                                <div className="card stretch stretch-full">
                                    <div className="card-body p-0">
                                        <div className="table-responsive table-card">
                                            <table className="table align-middle table-hover" id="bannerTable">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Banner Image</th>
                                                        <th>Main Heading</th>
                                                        <th>Sub Heading</th>
                                                        <th>Status</th>
                                                        <th>Created At</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {!allBanners || allBanners.length === 0 ? (

                                                        <tr>
                                                            <td colSpan="7" className="text-center text-muted">
                                                                No banners found
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        allBanners.map((banner, index) => (
                                                            <tr key={banner?._id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    {banner?.file ? (
                                                                        <img
                                                                            src={`assets/images/banner/${banner?.file}`}
                                                                            alt={banner?.mainHead}
                                                                            style={{
                                                                                width: "120px",
                                                                                height: "80px",
                                                                                objectFit: "cover",
                                                                                borderRadius: "8px"
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <span className="text-muted">No Image</span>
                                                                    )}
                                                                </td>

                                                                <td>
                                                                    <strong>{banner?.mainHead}</strong>
                                                                </td>

                                                                <td>
                                                                    <span className="text-muted">{banner?.subHead.slice(0,70)} {banner?.subHead.length > 70 ? '...' : ''}</span>
                                                                </td>

                                                                <td>
                                                                    {banner?.status === "Active" ? (
                                                                        <span className="badge bg-success-subtle text-success">
                                                                            Active
                                                                        </span>
                                                                    ) : (
                                                                        <span className="badge bg-danger-subtle text-danger">
                                                                            Inactive
                                                                        </span>
                                                                    )}
                                                                </td>

                                                                <td>
                                                                    {new Date(banner?.createdAt).toLocaleDateString()}
                                                                </td>

                                                                <td>
                                                                    <ul className="list-inline hstack gap-2 mb-0">
                                                                        <li className="list-inline-item" title="Edit">
                                                                            <a
                                                                                href="#bannerModalEdit"
                                                                                data-bs-toggle="modal"
                                                                                className="text-success"
                                                                                onClick={() => {
                                                                                    handleEdit(banner?._id);
                                                                                    document.body.classList.remove("modal-open");
                                                                                }}
                                                                            >
                                                                                <i className="ri-pencil-fill" />
                                                                            </a>
                                                                        </li>

                                                                        <li className="list-inline-item" title="Delete">
                                                                            <a
                                                                                href="#deleteRecordModal"
                                                                                data-bs-toggle="modal"
                                                                                className="text-danger"
                                                                                onClick={() => {
                                                                                    setGetId(banner?._id);
                                                                                    document.body.classList.remove("modal-open");
                                                                                }}
                                                                            >
                                                                                <i className="ri-delete-bin-fill" />
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Banner Modal */}
            <div className="modal fade" id="bannerModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">
                        {/* Header */}
                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">
                                    Create Banner
                                </h4>
                                <small className="text-white-50">
                                    Add new banner for your restaurant
                                </small>
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        {/* Body */}
                        <div className="modal-body p-4 bg-body-tertiary">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body">
                                    <h6 className="fw-semibold mb-3 text-primary">
                                        Banner Details
                                    </h6>

                                    <div className="row g-3">
                                        {/* Main Heading */}
                                        <div className="col-md-12">
                                            <label className="form-label">Main Heading *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="50% OFF on First Order"
                                                name="mainHead"
                                                value={moduleData.mainHead}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Sub Heading */}
                                        <div className="col-md-12">
                                            <label className="form-label">Sub Heading *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="Limited time offer"
                                                name="subHead"
                                                value={moduleData.subHead}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Banner Image */}
                                        <div className="col-md-12">
                                            <label className="form-label">Banner Image *</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                name="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </div>

                                        {/* Image Preview */}
                                        {filePreview && (
                                            <div className="col-md-12">
                                                <label className="form-label">Image Preview</label>
                                                <div className="text-center">
                                                    <img
                                                        src={filePreview}
                                                        alt="Banner Preview"
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: "200px" }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Status */}
                                        <div className="col-md-6">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select"
                                                name="status"
                                                value={moduleData.status}
                                                onChange={handleModuleChange}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
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
                                Save Banner
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Banner Modal */}
            <div className="modal fade" id="bannerModalEdit" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">
                        {/* Header */}
                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">
                                    Update Banner
                                </h4>
                                <small className="text-white-50">
                                    Edit banner details
                                </small>
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        {/* Body */}
                        <div className="modal-body p-4 bg-body-tertiary">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body">
                                    <h6 className="fw-semibold mb-3 text-primary">
                                        Banner Details
                                    </h6>

                                    <div className="row g-3">
                                        {/* Main Heading */}
                                        <div className="col-md-12">
                                            <label className="form-label">Main Heading *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="50% OFF on First Order"
                                                name="mainHead"
                                                value={moduleData.mainHead}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Sub Heading */}
                                        <div className="col-md-12">
                                            <label className="form-label">Sub Heading *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="Limited time offer"
                                                name="subHead"
                                                value={moduleData.subHead}
                                                onChange={handleModuleChange}
                                            />
                                        </div>

                                        {/* Banner Image */}
                                        <div className="col-md-12">
                                            <label className="form-label">Banner Image (Leave empty to keep current)</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                name="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </div>

                                        {/* Image Preview */}
                                        {filePreview && (
                                            <div className="col-md-12">
                                                <label className="form-label">Image Preview</label>
                                                <div className="text-center">
                                                    <img
                                                        src={filePreview}
                                                        alt="Banner Preview"
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: "200px" }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Status */}
                                        <div className="col-md-6">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select"
                                                name="status"
                                                value={moduleData.status}
                                                onChange={handleModuleChange}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
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
                                Update Banner
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className="modal fade zoomIn" id="deleteRecordModal" tabIndex={-1} aria-labelledby="deleteRecordLabel" aria-hidden="true">
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
                                    You are about to delete this banner?
                                </h4>
                                <p className="text-muted fs-14 mb-4 pt-1">
                                    Deleting this banner will remove it permanently from the system.
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
                                    <button className="btn btn-danger" id="delete-record" onClick={handleDeleteBanner}>
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
