import React, { useEffect } from 'react'
import { useState } from 'react';
import axiosInstance from '../../../apiHandler/axiosInstance';
import Config from '../../../Config/Config';
import { showErrorMsg, showSuccessMsg } from '../../../utils/ShowMessages';
import { useRef } from 'react';
const BASEURL = "http://localhost:4000";

export default function Restaurent() {
  const [restaurentList, setRestaurentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [getId, setGetId] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const fileRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    outletCode: "",
    phone: "",
    email: "",
    address: {
      line1: "",
      city: "",
      state: "",
      pincode: ""
    },
    gstNumber: "",
    isActive: true
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    }
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axiosInstance.get(
          Config.END_POINT_LIST["RESTAURENT_GET_ALL"],
          { withCredentials: true }
        );

        if (res.data.success) {
          setRestaurentList(res.data.data); // ✅ FIX
        }
      } catch (err) {
        showErrorMsg(err.response?.data?.message || "Something went wrong");
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurentList.filter(item => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.outletCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesName =
      !nameFilter || item.name?.toLowerCase().includes(nameFilter.toLowerCase());

    const matchesEmail =
      !emailFilter || item.email?.toLowerCase().includes(emailFilter.toLowerCase());

    const createdDate = new Date(item.createdAt);
    const matchesDateFrom = !dateFrom || createdDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || createdDate <= new Date(dateTo);

    let statusCondition = true;
    if (selectedFilter === true) statusCondition = item.isActive === true;
    if (selectedFilter === false) statusCondition = item.isActive === false;

    return (
      matchesSearch &&
      matchesName &&
      matchesEmail &&
      matchesDateFrom &&
      matchesDateTo &&
      statusCondition
    );
  });

  const totalRestaurants = filteredRestaurants.length;
  const activeRestaurants = filteredRestaurants.filter(r => r.isActive).length;
  const inactiveRestaurants = totalRestaurants - activeRestaurants;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [key]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      // debugger
      const myForm = new FormData();

      myForm.append("name", formData.name);
      myForm.append("outletCode", formData.outletCode);
      myForm.append("phone", formData.phone);
      myForm.append("email", formData.email);

      myForm.append("address[line1]", formData.address.line1);
      myForm.append("address[city]", formData.address.city);
      myForm.append("address[state]", formData.address.state);
      myForm.append("address[pincode]", formData.address.pincode);

      myForm.append("gstNumber", formData.gstNumber);
      myForm.append("isActive", formData.isActive ? "true" : "false");

      if (fileRef.current?.files[0]) {
        myForm.append("file", fileRef.current.files[0]);
      }
      for (let pair of myForm.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await axiosInstance.post(
        Config.END_POINT_LIST["RESTAURENT_CREATE"],
        myForm,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        showSuccessMsg("Add Restaurant Successfully");
        setFilePreview(null);
        fileRef.current.value = null;
      }

    } catch (err) {
      showErrorMsg(err.response?.data?.message || "Something went wrong");
    }
  };


  // Export functions
  const downloadCSV = () => {
    const headers = ['#', 'Name', 'Role', 'Email', 'Is Verified', 'Status', 'Created At'];
    const rows = filteredRestaurants.map((user, index) => [
      index + 1,
      user.name,
      user.role?.name || 'N/A',
      user.email,
      user.isVerified ? 'Verified' : 'Not Verified',
      user.isActive === true ? 'Active' : 'Inactive',
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

  const handleEdit = async (id) => {
    console.log(id)
    // debugger
    setGetId(id)
    document.body.classList.remove('modal-open')

    try {
      const restaurent = restaurentList.find(item => item._id === id);
      if (restaurent) {
        setFormData({
          name: restaurent.name || "",
          outletCode: restaurent.outletCode || "",
          phone: restaurent.phone || "",
          email: restaurent.email || "",
          address: {
            line1: restaurent.address?.line1 || "",
            city: restaurent.address?.city || "",
            state: restaurent.address?.state || "",
            pincode: restaurent.address?.pincode || ""
          },
          gstNumber: restaurent.gstNumber || "",
          isActive: restaurent.isActive || false

        });
      }


    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async () => {
    // debugger
     const myForm = new FormData();

      myForm.append("name", formData.name);
      myForm.append("outletCode", formData.outletCode);
      myForm.append("phone", formData.phone);
      myForm.append("email", formData.email);

      myForm.append("address[line1]", formData.address.line1);
      myForm.append("address[city]", formData.address.city);
      myForm.append("address[state]", formData.address.state);
      myForm.append("address[pincode]", formData.address.pincode);

      myForm.append("gstNumber", formData.gstNumber);
      myForm.append("isActive", formData.isActive ? "true" : "false");

      if (fileRef.current?.files[0]) {
        debugger
        myForm.append("file", fileRef.current.files[0]);
      }
      for (let pair of myForm.entries()) {
        console.log(pair[0], pair[1]);
      }
    try {
      const res = await axiosInstance.put(
        `${Config.END_POINT_LIST["RESTAURENT_UPDATE"]}/${getId}`,
        myForm,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.success) {
        showSuccessMsg("Restaurent Updated Successfully");
        setFormData({ name: "", outletCode: "", phone: "", email: "", address: { line1: "", city: "", state: "", pincode: "" }, gstNumber: "", isActive: true });
        setRestaurentList(restaurentList.map(item => item._id === getId ? res.data.data : item));
        // Update local state

        document.querySelector('#restaurentModal .btn-close').click();
      }

    } catch (err) {
      showErrorMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeletePermission = async () => {
    try {
      const res = await axiosInstance.delete(
        `${Config.END_POINT_LIST["RESTAURENT_DELETE"]}/${getId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        showSuccessMsg("Restaurent Deleted Successfully");
        setRestaurentList(restaurentList.filter(item => item._id !== getId));
        // close modal
        document.querySelector('#deleteRestaurent .btn-close').click();
      }
    } catch (err) {
      showErrorMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="nxl-content">
        {/* [ page-header ] start */}
        <>
          <div className="page-header">
            <div className="page-header-left d-flex align-items-center">
              <div className="page-header-title">
                <h5 className="m-b-10">Restaurant Management</h5>
              </div>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Dashboard</a>
                </li>
                <li className="breadcrumb-item">Restaurant Management</li>
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


                      <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter(true)}>
                        <span className="wd-7 ht-7 bg-success rounded-circle d-inline-block me-3" />
                        <span>Active</span>
                      </a>
                      <a href="javascript:void(0);" className="dropdown-item" onClick={() => setSelectedFilter(false)}>
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
                    data-bs-target="#showModal"
                    onClick={() => document.body.classList.remove('pace-done', 'modal-open')}>
                    <i className="feather-plus me-2" />
                    <span>Add Restaurant</span>
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
                        <span className="d-block">In Active</span>
                        <span className="fs-24 fw-bolder d-block">{inactiveRestaurants}</span>
                      </a>
                      <div className="pt-4">
                        <div className="d-flex align-items-center justify-content-between">
                          <a
                            href="javascript:void(0);"
                            className="fs-12 fw-medium text-muted"
                          >
                            <span>Restaurent Pending Active</span>
                            <i className="feather-link-2 fs-10 ms-1" />
                          </a>
                          <div>
                            <span className="fs-12 text-muted">{totalRestaurants > 0 ? Math.round((inactiveRestaurants / totalRestaurants) * 100) : 0}%</span>
                          </div>
                        </div>
                        <div className="progress mt-2 ht-3">
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: `${totalRestaurants > 0 ? (inactiveRestaurants / totalRestaurants) * 100 : 0}%` }}
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
                        <span className="fs-24 fw-bolder d-block">{activeRestaurants}</span>
                      </a>
                      <div className="pt-4">
                        <div className="d-flex align-items-center justify-content-between">
                          <a
                            href="javascript:void(0);"
                            className="fs-12 fw-medium text-muted"
                          >
                            <span>Active Restaurent</span>
                            <i className="feather-link-2 fs-10 ms-1" />
                          </a>
                          <div>
                            <span className="fs-12 text-muted">{totalRestaurants > 0 ? Math.round((activeRestaurants / totalRestaurants) * 100) : 0}%</span>
                          </div>
                        </div>
                        <div className="progress mt-2 ht-3">
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${totalRestaurants > 0 ? (activeRestaurants / totalRestaurants) * 100 : 0}%` }}
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
                        <span className="fs-24 fw-bolder d-block">{inactiveRestaurants}</span>
                      </a>
                      <div className="pt-4">
                        <div className="d-flex align-items-center justify-content-between">
                          <a
                            href="javascript:void(0);"
                            className="fs-12 fw-medium text-muted"
                          >
                            <span>Inactive Restaurent</span>
                            <i className="feather-link-2 fs-10 ms-1" />
                          </a>
                          <div>
                            <span className="fs-12 text-muted">{totalRestaurants > 0 ? Math.round((inactiveRestaurants / totalRestaurants) * 100) : 0}%</span>
                          </div>
                        </div>
                        <div className="progress mt-2 ht-3">
                          <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style={{ width: `${totalRestaurants > 0 ? (inactiveRestaurants / totalRestaurants) * 100 : 0}%` }}
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
                        <span className="d-block">Total Restaurent</span>
                        <span className="fs-24 fw-bolder d-block">{totalRestaurants}</span>
                      </a>
                      <div className="pt-4">
                        <div className="d-flex align-items-center justify-content-between">
                          <a
                            href="javascript:void(0);"
                            className="fs-12 fw-medium text-muted"
                          >
                            <span>Total Restaurent</span>
                            <i className="feather-link-2 fs-10 ms-1" />
                          </a>
                          <div>
                            <span className="fs-12 text-muted">{totalRestaurants}%</span>
                          </div>
                        </div>
                        <div className="progress mt-2 ht-3">
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: `${totalRestaurants > 0 ? (totalRestaurants) * 100 : 0}%` }}
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

                    <div className="table-responsive">

                      <table className="table table-hover">
                        <thead >
                          <tr>

                            <th className="sort" data-sort="#">#</th>
                            <th className='sort' data-sort="file">Logo</th>
                            <th className="sort" data-sort="name">Name</th>
                            <th className="sort" data-sort="module">Outlet Code</th>
                            <th className="sort" data-sort="gstNumber">gstNumber</th>
                            <th className="sort" data-sort="email">Email</th>
                            <th className="sort" data-sort="phone">Phone</th>
                            <th className='sort' data-sort="address">Address</th>
                            <th className="sort" data-sort="status">Status</th>
                            <th className="sort" data-sort="createAt">Created At</th>
                            <th>Action</th>

                          </tr>
                        </thead>

                        <tbody>
                          {filteredRestaurants.length > 0 ? (
                            filteredRestaurants.map((restaurent, index) => (
                              <tr key={restaurent._id}>
                                <td>{index + 1}</td>
                                <td>
                                  {restaurent?.logo ? (
                                    <img
                                     src={`assets/images/categories/${restaurent.logo}`}
                                    //  src={`${BASEURL}/uploads/restaurants/${restaurent.logo}`}
                                      alt="Restaurent Logo"
                                      className="rounded-circle"
                                      width={40}
                                      height={40}

                                    />
                                  ) : (
                                    <span className="text-muted">No Logo</span>
                                  )}
                                </td>

                                <td>
                                  <span className="fw-semibold">{restaurent?.name}</span>
                                </td>
                                <td>
                                  <span className="badge bg-primary-subtle text-primary">
                                    {restaurent?.outletCode || "N/A"}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge bg-primary-subtle text-primary">
                                    {restaurent?.gstNumber || "N/A"}
                                  </span>
                                </td>
                                <td>{restaurent?.email}</td>
                                <td>{restaurent?.phone}</td>
                                <td>
                                  <div className="p-2 border rounded ">
                                    <div className="fw-semibold">  <i className="ri-map-pin-line me-1 text-primary"></i>{restaurent?.address?.line1 || "N/A"}</div>
                                    <small className="text-muted">
                                      {restaurent?.address?.city}, {restaurent?.address?.state} - {restaurent?.address?.pincode}
                                    </small>
                                  </div>
                                </td>


                                <td>
                                  {restaurent?.isActive === true ? (
                                    <span className="badge bg-success">Active</span>
                                  ) : (
                                    <span className="badge bg-danger">Inactive</span>
                                  )}
                                </td>
                                <td>
                                  {new Date(restaurent?.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                  <ul className="list-inline hstack gap-2 mb-0">
                                    <li className="list-inline-item" title="View">
                                      <button
                                        className="btn btn-sm btn-link text-primary"
                                        onClick={() => handleView(restaurent._id)}
                                      >
                                        <i className="ri-eye-fill" />
                                      </button>
                                    </li>

                                    <li className="list-inline-item" title="Edit">
                                      <button
                                        className="btn btn-sm btn-link text-success"
                                        onClick={() => handleEdit(restaurent._id)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#restaurentModal"
                                      >
                                        <i className="ri-pencil-fill" />
                                      </button>
                                    </li>

                                    <li className="list-inline-item" title="Delete">
                                      <button
                                        className="btn btn-sm btn-link text-danger"
                                        onClick={() => { setGetId(restaurent._id); document.body.classList.remove('modal-open') }}
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteRestaurent"
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

      <div className="modal fade" id="showModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 rounded-4 overflow-hidden">

            <div className="modal-header px-4 py-3 bg-dark text-white">
              <div>
                <h4 className="mb-0 fw-semibold text-white">
                  Restaurent Architecture
                </h4>
                <small className="text-white-50">
                  Manage Restaurent, Created & Updated Restaurent Details
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
                    Fill Restaurant Details
                  </h6>

                  <div className="row g-3">
                    <div className="modal-body p-4">

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Restaurant Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          placeholder="Enter restaurant name"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Outlet Code</label>
                        <input
                          type="text"
                          name="outletCode"
                          value={formData.outletCode}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Optional"
                        />
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Phone</label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="9876543210"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="example@mail.com"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <h6 className="fw-semibold text-muted mb-2">  <i className="ri-map-pin-line me-1 text-primary"></i>Address</h6>

                        <div className="mb-3">
                          <input
                            type="text"
                            name="address.line1"
                            value={formData.address.line1}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Address line"
                          />
                        </div>

                        <div className="row g-3">
                          <div className="col-md-4">
                            <input
                              type="text"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="City"
                            />
                          </div>

                          <div className="col-md-4">
                            <input
                              type="text"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="State"
                            />
                          </div>

                          <div className="col-md-4">
                            <input
                              type="text"
                              name="address.pincode"
                              value={formData.address.pincode}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Pincode"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="form-label fw-semibold">GST Number</label>
                        <input
                          type="text"
                          name="gstNumber"
                          value={formData.gstNumber}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Optional"
                        />
                      </div>

                      <div className="mt-3">
                        <label className="form-label fw-semibold">Status</label>
                        <select
                          name="isActive"
                          value={formData.isActive}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value={true}>Active</option>
                          <option value={false}>Inactive</option>
                        </select>
                      </div>
                      <div className="mt-3">
                        <label className="form-label fw-semibold">Logo(optional)</label>
                        <input
                          type="file"
                          name="file"
                          ref={fileRef}
                          accept="image/*"
                          onChange={handleFileChange}
                          className="form-control"
                        />

                      </div>
                      {filePreview && (
                        <div className="mt-3 text-center">
                          <img
                            src={filePreview}
                            alt="Logo Preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: "150px" }}
                          />
                        </div>
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

      <div className="modal fade" id="restaurentModal" tabIndex={-1} aria-hidden="true">
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
                    Fill Restaurant Details
                  </h6>

                  <div className="row g-3">
                    <div className="modal-body p-4">

                      {/* Restaurant Name */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Restaurant Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          placeholder="Enter restaurant name"
                          required
                        />
                      </div>

                      {/* Outlet Code */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Outlet Code</label>
                        <input
                          type="text"
                          name="outletCode"
                          value={formData.outletCode}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Optional"
                        />
                      </div>

                      {/* Phone + Email */}
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Phone</label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="9876543210"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="example@mail.com"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="mt-4">
                        <h6 className="fw-semibold text-muted mb-2">📍 Address</h6>

                        <div className="mb-3">
                          <input
                            type="text"
                            name="address.line1"
                            value={formData.address.line1}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Address line"
                          />
                        </div>

                        <div className="row g-3">
                          <div className="col-md-4">
                            <input
                              type="text"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="City"
                            />
                          </div>

                          <div className="col-md-4">
                            <input
                              type="text"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="State"
                            />
                          </div>

                          <div className="col-md-4">
                            <input
                              type="text"
                              name="address.pincode"
                              value={formData.address.pincode}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Pincode"
                            />
                          </div>
                        </div>
                      </div>

                      {/* GST */}
                      <div className="mt-3">
                        <label className="form-label fw-semibold">GST Number</label>
                        <input
                          type="text"
                          name="gstNumber"
                          value={formData.gstNumber}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Optional"
                        />
                      </div>

                      {/* Status */}
                      <div className="mt-3">
                        <label className="form-label fw-semibold">Status</label>
                        <select
                          name="isActive"
                          value={formData.isActive}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value={true}>Active</option>
                          <option value={false}>Inactive</option>
                        </select>
                      </div>

                       <div className="mt-3">
                        <label className="form-label fw-semibold">Logo(optional)</label>
                        <input
                          type="file"
                          name="file"
                          ref={fileRef}
                          accept="image/*"
                          onChange={handleFileChange}
                          className="form-control"
                        />

                      </div>
                      {filePreview && (
                        <div className="mt-3 text-center">
                          <img
                            src={filePreview}
                            alt="Logo Preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: "150px" }}
                          />
                        </div>
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
                data-bs-dismiss="modal"
              >
                Update               </button>
            </div>

          </div>
        </div>
      </div>

      {/* Modal */}

      <div className="modal fade zoomIn" id="deleteRestaurent" tabIndex={-1} aria-labelledby="deleteRecordLabel" aria-hidden="true" >
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
  )
}
