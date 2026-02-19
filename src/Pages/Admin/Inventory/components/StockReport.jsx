import React, { useState, useEffect } from 'react';
import { FaDownload, FaFilter, FaBox, FaExclamationTriangle, FaChartLine, FaSearch } from 'react-icons/fa';
import './StockReport.css';

const StockReport = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchStockReport();
  }, []);

  const fetchStockReport = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/inventory/stock-report');
      const data = await response.json();
      setStockData(data.data || []);
    } catch (error) {
      console.error('Error fetching stock report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Material Name', 'Category', 'Current Stock', 'Min Stock Level', 'Unit', 'Status'],
      ...stockData.map(item => [
        item.materialName,
        item.category,
        item.currentStock,
        item.minStockLevel,
        item.unit,
        item.stockStatus
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredData = stockData.filter(item => {
    const matchesSearch = item.materialName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'low-stock') return matchesSearch && item.stockStatus === 'Low Stock';
    if (filterStatus === 'out-of-stock') return matchesSearch && item.stockStatus === 'Out of Stock';
    if (filterStatus === 'normal') return matchesSearch && item.stockStatus === 'Normal';
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Low Stock': return '#f59e0b';
      case 'Out of Stock': return '#ef4444';
      case 'Normal': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Low Stock': return <FaExclamationTriangle />;
      case 'Out of Stock': return <FaBox />;
      case 'Normal': return <FaChartLine />;
      default: return null;
    }
  };

  const totalItems = filteredData.length;
  const lowStockItems = filteredData.filter(item => item.stockStatus === 'Low Stock').length;
  const outOfStockItems = filteredData.filter(item => item.stockStatus === 'Out of Stock').length;

  return (
    <div className="stock-report">
      <div className="section-header">
        <h2>Stock Report</h2>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleExport}>
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="report-filters">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search materials..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Items ({totalItems})</option>
              <option value="low-stock">Low Stock ({lowStockItems})</option>
              <option value="out-of-stock">Out of Stock ({outOfStockItems})</option>
              <option value="normal">Normal Stock ({totalItems - lowStockItems - outOfStockItems})</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading stock report...</div>
      ) : filteredData.length === 0 ? (
        <div className="empty-state">
          <FaBox className="empty-state-icon" />
          <h3>No stock data found</h3>
          <p>Stock report will show current inventory levels</p>
        </div>
      ) : (
       <>
        <div className="stock-summary">
          <div className="summary-cards">
            <div className="summary-card total">
              <h3>{totalItems}</h3>
              <p>Total Items</p>
            </div>
            <div className="summary-card warning">
              <h3>{lowStockItems}</h3>
              <p>Low Stock</p>
            </div>
            <div className="summary-card danger">
              <h3>{outOfStockItems}</h3>
              <p>Out of Stock</p>
            </div>
          </div>
        </div>

        <div className="stock-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Material Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min Stock Level</th>
                <th>Unit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className={item.stockStatus !== 'Normal' ? 'warning-row' : ''}>
                  <td className="material-name">{item.materialName}</td>
                  <td>{item.category}</td>
                  <td>
                    <span className={`stock-value ${item.stockStatus !== 'Normal' ? 'low-stock' : ''}`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td>{item.minStockLevel}</td>
                  <td>{item.unit}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getStatusColor(item.stockStatus),
                        color: 'white'
                      }}
                    >
                      {getStatusIcon(item.stockStatus)}
                      {item.stockStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       </>
      )}
    </div>
  );
};

export default StockReport;
