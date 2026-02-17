


import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { showSuccessMsg, showErrorMsg } from "../../../utils/ShowMessages";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { downloadCSV, downloadExcel } from "../../../utils/Downloads";


export default function TableManagement() {
    const { user, permissions } = useSelector(state => state.auth)
    console.log(user)
    const canCreateTable = permissions.includes("tables.create");
    const canEdit = permissions.includes("tables.update");
    const canDelete = permissions.includes("tables.delete");


    const [tableData, setTableData] = useState({
        restaurant: user?.restaurant?._id || "",
        tableNumber: "",
        capacity: 2,
        status: "free",
        qrColorPreset: "premium_dark"
    });

    const [getId, setGetId] = useState(null);
    const [allTables, setAllTables] = useState([]);
    const [openModules, setOpenModules] = useState({});



    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await axiosInstance.get(
                    `${Config.END_POINT_LIST["GET_TABLES_BY_RESTAURANT"]}/${user?.restaurant?._id}`,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    setAllTables(res.data.data);
                }
            } catch (err) {
                showErrorMsg(err.response?.data?.message || "Something went wrong");
            }
        };
        if (user?.restaurant?._id) {
            fetchTables();
        }
    }, [user?.restaurant?._id])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTableData({
            ...tableData,
            [name]: type === 'checkbox' ? checked : value
        });
    };


    const handleSubmit = async () => {
        try {
            if (!tableData.tableNumber.trim()) {
                return showErrorMsg("Table number is required");
            }
            debugger

            const res = await axiosInstance.post(
                Config.END_POINT_LIST["CREATE_TABLE"],
                tableData,
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Table Created Successfully with Premium QR Code");

                setAllTables([...allTables, res.data.data]);

                setTableData({
                    restaurant: user?.restaurant?._id || "",
                    tableNumber: "",
                    capacity: 2,
                    status: "free",
                    qrColorPreset: "premium_dark"
                });

                document.querySelector('#tableModal .btn-close')?.click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleEdit = (id) => {
        const table = allTables.find(t => t._id === id);
        if (!table) return;

        document.body.classList.remove("modal-open");
        setGetId(id);

        setTableData({
            restaurant: table.restaurant,
            tableNumber: table.tableNumber,
            capacity: table.capacity,
            status: table.status
        });
    };


    const handleEditSubmit = async () => {
        try {
            if (!getId) return;

            if (!tableData.tableNumber.trim()) {
                return showErrorMsg("Table number is required");
            }
            debugger

            const res = await axiosInstance.put(
                `${Config.END_POINT_LIST["UPDATE_TABLE"]}/${getId}`,
                tableData,
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Table Updated Successfully");

                setAllTables(
                    allTables.map(table =>
                        table._id === getId ? res.data.data : table
                    )
                );

                setGetId(null);
                document.querySelector('#tableModalEdit .btn-close')?.click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleDeletePermission = async () => {
        try {
            const res = await axiosInstance.delete(
                `${Config.END_POINT_LIST["DELETE_TABLE"]}/${getId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Table Deleted Successfully");
                setAllTables(allTables.filter(table => table._id !== getId));
                document.querySelector('#deleteRecordModal .btn-close').click();
            }
        } catch (err) {
            showErrorMsg(err.response?.data?.message || "Something went wrong");
        }
    };


    // const downloadCSV = () => {
    //     const headers = ['#', 'Table Number', 'Capacity', 'Status', 'QR Code', 'Created At'];
    //     const rows = filteredTables.map((table, index) => [
    //         index + 1,
    //         table.tableNumber,
    //         table.capacity,
    //         table.status,
    //         table.qrCodeUrl ? 'Yes' : 'No',
    //         new Date(table.createdAt).toLocaleDateString()
    //     ]);
    //     const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    //     const blob = new Blob([csvContent], { type: 'text/csv' });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'tables.csv';
    //     a.click();
    //     URL.revokeObjectURL(url);
    // };

    // const handlePrint = () => {
    //     window.print();
    // };

    // const handlePrint = () => {
    //     window.print();
    // };

    const [searchTerm, setSearchTerm] = useState('');
    const [tableNumberFilter, setTableNumberFilter] = useState("");
    const [capacityFilter, setCapacityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const filteredTables = allTables.filter(table => {
        const matchesSearch =
            !searchTerm || table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTableNumber =
            !tableNumberFilter ||
            table.tableNumber.toLowerCase().includes(tableNumberFilter.toLowerCase());

        const matchesCapacity =
            !capacityFilter || table.capacity.toString() === capacityFilter;

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === table.status);

        const tableDate = new Date(table.createdAt);
        const matchesDateFrom = !dateFrom || tableDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || tableDate <= new Date(dateTo);

        return (
            matchesSearch &&
            matchesTableNumber &&
            matchesCapacity &&
            matchesStatus &&
            matchesDateFrom &&
            matchesDateTo
        );
    });

    const freeCount = filteredTables.filter(t => t.status === "free").length;
    const occupiedCount = filteredTables.filter(t => t.status === "occupied").length;
    const reservedCount = filteredTables.filter(t => t.status === "reserved").length;
    const totalCount = filteredTables.length;


    const downloadText = () => {
        const text = filteredTables
            .map(item => Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(" | "))
            .join("\n");

        const blob = new Blob([text], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "data.txt";
        a.click();
    };


// const downloadExcel = () => {
//   const worksheet = XLSX.utils.json_to_sheet(filteredTables);
//   const workbook = XLSX.utils.book_new();

//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//   XLSX.writeFile(workbook, "data.xlsx");
// };

const handlePrint = () => {
  if (!filteredTables || filteredTables.length === 0) {
    alert("No filteredTables to print");
    return;
  }

  const printWindow = window.open("", "_blank", "width=900,height=650");

  if (!printWindow) {
    alert("Popup blocked! Please allow popups.");
    return;
  }

  const tableHeader = Object.keys(filteredTables[0])
    .map(key => `<th style="padding:8px;border:1px solid #000">${key}</th>`)
    .join("");

  const tableBody = filteredTables
    .map(row => {
      const tds = Object.values(row)
        .map(val => `<td style="padding:8px;border:1px solid #000">${val}</td>`)
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("");

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th { background: #f5f5f5; }
          body { font-family: Arial; padding: 20px; }
        </style>
      </head>
      <body>
        <h3>Data Print</h3>
        <table>
          <thead><tr>${tableHeader}</tr></thead>
          <tbody>${tableBody}</tbody>
        </table>

        <script>
          window.onload = function () {
            window.print();
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};




    return (
        <>

            <div className="nxl-content">
                <>

                    <div className="page-header">

                        <div className="page-header-left d-flex align-items-center">
                            <div className="page-header-title">
                                <h5 className="m-b-10">Table Management</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="index.html">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item">Table Management</li>
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
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => setStatusFilter('all')}>
                                                <span className="wd-7 ht-7 bg-primary rounded-circle d-inline-block me-3" />
                                                <span>All</span>
                                            </a>

                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => setStatusFilter('free')}>
                                                <span className="wd-7 ht-7 bg-success rounded-circle d-inline-block me-3" />
                                                <span>Free</span>
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => setStatusFilter('occupied')}>
                                                <span className="wd-7 ht-7 bg-warning rounded-circle d-inline-block me-3" />
                                                <span>Occupied</span>
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => setStatusFilter('reserved')}>
                                                <span className="wd-7 ht-7 bg-danger rounded-circle d-inline-block me-3" />
                                                <span>Reserved</span>
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
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={downloadCSV(['#', 'Table Number', 'Capacity', 'Status', 'QR Code', 'Created At'],filteredTables)}>
                                                <i className="bi bi-filetype-csv me-3" />
                                                <span>CSV</span>
                                            </a>

                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => downloadText()}>
                                                <i className="bi bi-filetype-txt me-3" />
                                                <span>Text</span>
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item" onClick={() => downloadExcel(filteredTables)}>
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
                                    {canCreateTable && (
                                        <a
                                            href="#"
                                            className="btn btn-primary"
                                            data-bs-toggle="modal"
                                            id="create-btn"
                                            data-bs-target="#tableModal"
                                            onClick={() =>
                                                document.body.classList.remove("pace-done", "modal-open")
                                            }
                                        >
                                            <i className="feather-plus me-2" />
                                            <span>Create Table</span>
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
                    
                    <div id="collapseOne" className="accordion-collapse collapse page-header-collapse" >
                        <div className="accordion-body pb-2">
                            <div className="row mb-3">
                                {/* Table Number */}
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Filter by Table Number"
                                        value={tableNumberFilter}
                                        onChange={(e) => setTableNumberFilter(e.target.value)}
                                    />
                                </div>

                                {/* Capacity */}
                                <div className="col-md-4">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Filter by Capacity"
                                        value={capacityFilter}
                                        onChange={(e) => setCapacityFilter(e.target.value)}
                                    />
                                </div>

                                {/* Status */}
                                <div className="col-md-4">
                                    <select
                                        className="form-select"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="free">Free</option>
                                        <option value="occupied">Occupied</option>
                                        <option value="reserved">Reserved</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mb-3">
                                {/* Date From */}
                                <div className="col-md-6">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </div>

                                {/* Date To */}
                                <div className="col-md-6">
                                    <input
                                        type="date"
                                        className="form-control"
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
                                                <span className="d-block">Free Tables</span>
                                                <span className="fs-24 fw-bolder d-block">{freeCount}</span>
                                            </a>
                                            <div className="pt-4">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <a href="javascript:void(0);" className="fs-12 fw-medium text-muted">
                                                        <span>Available Tables</span>
                                                    </a>
                                                    <div>
                                                        <span className="fs-12 text-muted">{totalCount > 0 ? Math.round((freeCount / totalCount) * 100) : 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="progress mt-2 ht-3">
                                                    <div
                                                        className="progress-bar bg-success"
                                                        role="progressbar"
                                                        style={{ width: `${totalCount > 0 ? (freeCount / totalCount) * 100 : 0}%` }}
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
                                                <span className="d-block">Occupied Tables</span>
                                                <span className="fs-24 fw-bolder d-block">{occupiedCount}</span>
                                            </a>
                                            <div className="pt-4">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <a href="javascript:void(0);" className="fs-12 fw-medium text-muted">
                                                        <span>In Use</span>
                                                    </a>
                                                    <div>
                                                        <span className="fs-12 text-muted">{totalCount > 0 ? Math.round((occupiedCount / totalCount) * 100) : 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="progress mt-2 ht-3">
                                                    <div
                                                        className="progress-bar bg-warning"
                                                        role="progressbar"
                                                        style={{ width: `${totalCount > 0 ? (occupiedCount / totalCount) * 100 : 0}%` }}
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
                                                <span className="d-block">Reserved Tables</span>
                                                <span className="fs-24 fw-bolder d-block">{reservedCount}</span>
                                            </a>
                                            <div className="pt-4">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span className="fs-12 text-muted">Reserved</span>
                                                    <div>
                                                        <span className="fs-12 text-muted">{totalCount > 0 ? Math.round((reservedCount / totalCount) * 100) : 0}%</span>
                                                    </div>
                                                </div>
                                                <div className="progress mt-2 ht-3">
                                                    <div
                                                        className="progress-bar bg-danger"
                                                        role="progressbar"
                                                        style={{ width: `${totalCount > 0 ? (reservedCount / totalCount) * 100 : 0}%` }}
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
                                                <span className="d-block">Total Tables</span>
                                                <span className="fs-24 fw-bolder d-block">{totalCount}</span>
                                            </a>
                                            <div className="pt-4">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span className="fs-12 text-muted">All Tables</span>
                                                    <div>
                                                        <span className="fs-12 text-muted">100%</span>
                                                    </div>
                                                </div>
                                                <div className="progress mt-2 ht-3">
                                                    <div
                                                        className="progress-bar bg-primary"
                                                        role="progressbar"
                                                        style={{ width: "100%" }}
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
                                        <div className="table-responsive table-card">
                                            <table className="table align-middle table-hover" id="tableListTable">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Table Number</th>
                                                        <th>Capacity</th>
                                                        <th>Status</th>
                                                        <th>QR Code</th>
                                                        <th>Created At</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {filteredTables.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="7" className="text-center text-muted">
                                                                No tables found
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        filteredTables.map((table, index) => (
                                                            <tr key={table._id}>
                                                                <td>{index + 1}</td>

                                                                {/* Table Number */}
                                                                <td>
                                                                    <strong>Table {table.tableNumber}</strong>
                                                                </td>

                                                                {/* Capacity */}
                                                                <td>
                                                                    <span className="badge bg-info-subtle text-info">
                                                                        {table.capacity} Seats
                                                                    </span>
                                                                </td>

                                                                {/* Status */}
                                                                <td>
                                                                    {table.status === "free" ? (
                                                                        <span className="badge bg-success-subtle text-success">
                                                                            Free
                                                                        </span>
                                                                    ) : table.status === "occupied" ? (
                                                                        <span className="badge bg-warning-subtle text-warning">
                                                                            Occupied
                                                                        </span>
                                                                    ) : (
                                                                        <span className="badge bg-danger-subtle text-danger">
                                                                            Reserved
                                                                        </span>
                                                                    )}
                                                                </td>

                                                                {/* QR Code */}
                                                                <td>
                                                                    {table.qrCodeUrl ? (
                                                                        <div className="d-flex flex-column align-items-center gap-2">
                                                                            <img
                                                                                src={table.qrCodeUrl}
                                                                                alt="QR Code"
                                                                                style={{
                                                                                    width: "80px",
                                                                                    height: "80px",
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "4px",
                                                                                    borderRadius: "4px"
                                                                                }}
                                                                            />
                                                                            <button
                                                                                className="btn btn-sm btn-primary"
                                                                                onClick={() => {
                                                                                    const link = document.createElement('a');
                                                                                    link.href = table.qrCodeUrl;
                                                                                    link.download = `table-${table.tableNumber}-qr.png`;
                                                                                    document.body.appendChild(link);
                                                                                    link.click();
                                                                                    document.body.removeChild(link);
                                                                                }}
                                                                            >
                                                                                <i className="ri-download-2-line me-1" /> Download
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-muted">—</span>
                                                                    )}
                                                                </td>

                                                                {/* Created At */}
                                                                <td>
                                                                    {new Date(table.createdAt).toLocaleDateString()}
                                                                </td>

                                                                {/* Actions */}
                                                                <td>
                                                                    <ul className="list-inline hstack gap-2 mb-0">
                                                                        {canEdit || canDelete ? (
                                                                            <>
                                                                                {canEdit && (
                                                                                    <li className="list-inline-item" title="Edit">
                                                                                        <Link
                                                                                            to="#tableModalEdit"
                                                                                            data-bs-toggle="modal"
                                                                                            className="text-success"
                                                                                            onClick={() => {
                                                                                                handleEdit(table._id);
                                                                                                document.body.classList.remove("modal-open");
                                                                                            }}
                                                                                        >
                                                                                            <i className="ri-pencil-fill" />
                                                                                        </Link>
                                                                                    </li>
                                                                                )}

                                                                                {canDelete && (
                                                                                    <li className="list-inline-item" title="Delete">
                                                                                        <Link
                                                                                            to="#deleteRecordModal"
                                                                                            data-bs-toggle="modal"
                                                                                            className="text-danger"
                                                                                            onClick={() => {
                                                                                                setGetId(table._id);
                                                                                                document.body.classList.remove("modal-open");
                                                                                            }}
                                                                                        >
                                                                                            <i className="ri-delete-bin-fill" />
                                                                                        </Link>
                                                                                    </li>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <li className="list-inline-item text-muted">
                                                                                No permission
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
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

            <div className="modal fade" id="tableModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">

                        {/* ===== HEADER ===== */}
                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">
                                    Create Table
                                </h4>
                                <small className="text-white-50">
                                    Add new table to restaurant
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        {/* ===== BODY ===== */}
                        <div className="modal-body p-4 bg-body-tertiary">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body">

                                    <h6 className="fw-semibold mb-3 text-primary">
                                        Table Details
                                    </h6>

                                    <div className="row g-3">

                                        {/* Table Number */}
                                        <div className="col-md-6">
                                            <label className="form-label">Table Number *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="T-01, T-02, A1, etc."
                                                name="tableNumber"
                                                value={tableData.tableNumber}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Capacity */}
                                        <div className="col-md-6">
                                            <label className="form-label">Capacity *</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-lg"
                                                name="capacity"
                                                value={tableData.capacity}
                                                onChange={handleChange}
                                                min="1"
                                            />
                                        </div>

                                        {/* Status */}
                                        <div className="col-md-12">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="status"
                                                value={tableData.status}
                                                onChange={handleChange}
                                            >
                                                <option value="free">Free</option>
                                                <option value="occupied">Occupied</option>
                                                <option value="reserved">Reserved</option>
                                            </select>
                                        </div>

                                        {/* QR Color Preset */}
                                        <div className="col-md-12">
                                            <label className="form-label fw-bold">QR Code Style</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="qrColorPreset"
                                                value={tableData.qrColorPreset}
                                                onChange={handleChange}
                                            >
                                                <optgroup label="✨ Premium Professional">
                                                    <option value="premium_dark">⬛⬜ Premium Dark - Dark Gray & White</option>
                                                    <option value="premium_blue">🟦🩵 Premium Blue - Navy & Light Blue</option>
                                                    <option value="premium_purple">🟪💜 Premium Purple - Deep Purple & Lavender</option>
                                                    <option value="premium_emerald">🟢💚 Premium Emerald - Forest Green & Mint</option>
                                                </optgroup>

                                                <optgroup label="🌈 Vibrant & Bold">
                                                    <option value="vibrant_neon">⬛🟢 Neon - Black & Bright Green</option>
                                                    <option value="vibrant_pink">🟥💗 Vibrant Pink - Hot Pink & Light Pink</option>
                                                    <option value="vibrant_orange">🟧🟨 Vibrant Orange - Dark Orange & Light Yellow</option>
                                                </optgroup>

                                                <optgroup label="💎 Elegant & Sophisticated">
                                                    <option value="elegant_gold">🟫🟨 Gold - Brown & Gold Yellow</option>
                                                    <option value="elegant_rose">🩷💕 Rose - Deep Rose & Light Pink</option>
                                                    <option value="elegant_slate">⬛🩶 Slate - Dark Slate & Light Gray</option>
                                                </optgroup>

                                                <optgroup label="🎨 Colorful Fun">
                                                    <option value="rainbow">💗🩵 Rainbow - Pink & Cyan</option>
                                                    <option value="sunset">🟧🟨 Sunset - Orange & Yellow</option>
                                                    <option value="ocean">🟦🩵 Ocean - Blue & Light Blue</option>
                                                    <option value="forest">🟢💚 Forest - Dark Green & Light Green</option>
                                                    <option value="purple">🟪💜 Purple - Purple & Light Purple</option>
                                                    <option value="sunset2">🔴🟨 Sunset 2 - Red & Yellow</option>
                                                    <option value="ocean2">🟦🩵 Ocean 2 - Navy & Light Blue</option>
                                                    <option value="mint">🟢💚 Mint - Dark Teal & Mint Green</option>
                                                </optgroup>
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== FOOTER ===== */}
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
                                Create Table
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="modal fade" id="tableModalEdit" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 rounded-4 overflow-hidden">

                        {/* ===== HEADER ===== */}
                        <div className="modal-header px-4 py-3 bg-dark text-white">
                            <div>
                                <h4 className="mb-0 fw-semibold text-white">
                                    Update Table
                                </h4>
                                <small className="text-white-50">
                                    Edit table information
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        {/* ===== BODY ===== */}
                        <div className="modal-body p-4 bg-body-tertiary">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body">

                                    <h6 className="fw-semibold mb-3 text-primary">
                                        Table Details
                                    </h6>

                                    <div className="row g-3">

                                        {/* Table Number */}
                                        <div className="col-md-6">
                                            <label className="form-label">Table Number *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="tableNumber"
                                                value={tableData.tableNumber}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Capacity */}
                                        <div className="col-md-6">
                                            <label className="form-label">Capacity *</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-lg"
                                                name="capacity"
                                                value={tableData.capacity}
                                                onChange={handleChange}
                                                min="1"
                                            />
                                        </div>

                                        {/* Status */}
                                        <div className="col-md-12">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="status"
                                                value={tableData.status}
                                                onChange={handleChange}
                                            >
                                                <option value="free">Free</option>
                                                <option value="occupied">Occupied</option>
                                                <option value="reserved">Reserved</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== FOOTER ===== */}
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
                                Update Table
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
                                    You are about to delete a table ?
                                </h4>
                                <p className="text-muted fs-14 mb-4 pt-1">
                                    Deleting this table will remove all of its information
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


