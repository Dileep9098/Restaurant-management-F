import React, { useState } from "react";

export default function CreateRestaurantUserModal({
  moduleData,
  setModuleData,
  handleModuleChange,
  handleSubmit,
  restaurantList = [],
  roleList = [],
  isSaving = false,
  isEdit = false, // edit mode me password optional
}) {
  const [showPass, setShowPass] = useState(false);

  // ✅ Restaurant wise roles filter (Role model me restaurant field hai)
  const filteredRoles = roleList;

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(); // yaha API call hoga
  };

  return (
    <div className="modal fade" id="permissionModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 rounded-4 overflow-hidden">

          <div className="modal-header px-4 py-3 bg-dark text-white">
            <div>
              <h4 className="mb-0 fw-semibold text-white">Create Restaurant User</h4>
              <small className="text-white-50">Create user, assign restaurant & role</small>
            </div>

            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
          </div>

          <div className="modal-body p-4 bg-white">
            {/* ✅ Form submit controlled */}
            <form onSubmit={onSubmit}>

              <div className="card border-0 shadow-sm rounded-4 mb-0">
                <div className="card-body">
                  <h6 className="fw-semibold mb-3 text-primary">
                    <i className="ri-user-add-line me-2" />
                    Restaurant User Details
                  </h6>

                  <div className="row g-3">

                    {/* Full Name */}
                    <div className="col-md-6">
                      <label className="form-label">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter full name"
                        name="name"
                        value={moduleData.name || ""}
                        onChange={handleModuleChange}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <label className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="Enter email"
                        name="email"
                        value={moduleData.email || ""}
                        onChange={handleModuleChange}
                        required
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
                        value={moduleData.phone || ""}
                        onChange={handleModuleChange}
                      />
                    </div>

                    {/* Password */}
                    <div className="col-md-6">
                      <label className="form-label">
                        Password {!isEdit && <span className="text-danger">*</span>}
                      </label>

                      <div className="input-group input-group-lg">
                        <input
                          type={showPass ? "text" : "password"}
                          className="form-control"
                          placeholder={isEdit ? "Leave blank to keep same" : "Create password"}
                          name="password"
                          value={moduleData.password || ""}
                          onChange={handleModuleChange}
                          required={!isEdit}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPass(!showPass)}
                          tabIndex={-1}
                        >
                          <i className={showPass ? "ri-eye-off-line" : "ri-eye-line"} />
                        </button>
                      </div>
                      {isEdit && (
                        <small className="text-muted">If you don’t want to change password, keep it empty.</small>
                      )}
                    </div>

                    {/* Restaurant */}
                    <div className="col-md-6">
                      <label className="form-label">
                        Restaurant <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select form-select-lg"
                        name="restaurant" // ✅ backend match
                        value={moduleData.restaurant || ""}
                        onChange={(e) => {
                          // restaurant change -> role reset
                          setModuleData(prev => ({
                            ...prev,
                            restaurant: e.target.value,
                            role: ""
                          }));
                        }}
                        required
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
                    <div className="col-md-6">
                      <label className="form-label">
                        Role <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select form-select-lg"
                        name="role"
                        value={moduleData.role || ""}
                        onChange={handleModuleChange}
                        required
                      >
                        <option value="">
                          Select Role
                        </option>

                        {filteredRoles.map((role) => (
                          <option key={role._id} value={role._id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select form-select-lg"
                        name="status"
                        value={moduleData.status || "active"}
                        onChange={handleModuleChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Verified */}
                    <div className="col-md-6">
                      <label className="form-label d-block mb-2">Is Verified</label>

                      <div className="d-flex align-items-center gap-3">
                        <div className="form-check form-switch m-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="isVerified"
                            checked={!!moduleData.isVerified}
                            onChange={(e) =>
                              setModuleData(prev => ({ ...prev, isVerified: e.target.checked }))
                            }
                          />
                          <label className="form-check-label" htmlFor="isVerified">
                            {moduleData.isVerified ? "Verified" : "Not Verified"}
                          </label>
                        </div>

                        {moduleData.isVerified && (
                          <span className="badge bg-success-subtle text-success">
                            <i className="ri-verified-badge-fill me-1"></i>
                            Verified User
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* ✅ footer inside form, submit button works */}
              <div className="modal-footer bg-white px-4 py-3 mt-3">
                <button
                  type="button"
                  className="btn btn-light rounded-3"
                  data-bs-dismiss="modal"
                  disabled={isSaving}
                >
                  Cancel
                </button>

                {/* ❌ remove data-bs-dismiss, close only on success */}
                <button
                  type="submit"
                  className="btn btn-dark rounded-3 px-4"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line me-1" />
                      Save User
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
