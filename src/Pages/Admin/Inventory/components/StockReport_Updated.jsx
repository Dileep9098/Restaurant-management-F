import React, { useState, useEffect } from 'react';
import { FaDownload, FaFilter, FaBox, FaExclamationTriangle, FaChartLine, FaSearch, FaDollarSign, FaWarehouse } from 'react-icons/fa';
import Config from '../../../../Config/Config';
import axiosInstance from '../../../../apiHandler/axiosInstance';
import './StockReport.css';

const StockReport = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchStockReport();
    fetchCategories();
  }, []);

  const fetchStockReport = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL']);
      const materials = response.data.data || [];
      
      const stockReport = await Promise.all(materials.map(async (material) => {
        try {
      const stockResponse = await axiosInstance.get(
        `${Config.END_POINT_LIST['GET_CURRENT_STOCK']}/${material._id}`
      );
      const currentStock = stockResponse.data.data?.stock || 0;
          
          // Determine stock status
          let stockStatus = 'Normal';
          if (currentStock === 0) {
            stockStatus = 'Out of Stock';
          } else if (currentStock <= material.minStockLevel) {
            stockStatus = 'Low Stock';
          }
          
          // Calculate total value
          const totalValue = currentStock * material.averageCost;
          
          return {
            _id: material._id,
            materialName: material.name,
            category: material.category?.name || 'Uncategorized',
            categoryId: material.category?._id,
            currentStock,
            minStockLevel: material.minStockLevel || 0,
            reorderQuantity: material.reorderQuantity || 0,
            purchaseUnit: material.purchaseUnit,
            consumptionUnit: material.consumptionUnit,
            conversionRate: material.conversionRate || 1,
            averageCost: material.averageCost || 0,
            totalValue,
            stockStatus,
            storageType: material.storageType || 'Normal',
            isActive: material.isActive
          };
        } catch (error) {
          console.error(`Error calculating stock for ${material.name}:`, error);
          return {
            _id: material._id,
            materialName: material.name,
            category: material.category?.name || 'Uncategorized',
            categoryId: material.category?._id,
            currentStock: 0,
            minStockLevel: material.minStockLevel || 0,
            reorderQuantity: material.reorderQuantity || 0,
            purchaseUnit: material.purchaseUnit,
            consumptionUnit: material.consumptionUnit,
            conversionRate: material.conversionRate || 1,
            averageCost: material.averageCost || 0,
            totalValue: 0,
            stockStatus: 'Error',
            storageType: material.storageType || 'Normal',
            isActive: material.isActive
          };
        }
      }));
      
      setStockData(stockReport);
    } catch (error) {
      console.error('Error fetching stock report:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(Config.END_POINT_LIST['GET_ALL_ROW_MATERIAL_CATEGORY']);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Material Name', 'Category', 'Current Stock', 'Min Stock Level', 'Reorder Qty', 'Purchase Unit', 'Consumption Unit', 'Avg Cost', 'Total Value', 'Status', 'Storage Type'],
      ...stockData.map(item => [
        item.materialName,
        item.category,
        item.currentStock,
        item.minStockLevel,
        item.reorderQuantity,
        item.purchaseUnit,
        item.consumptionUnit,
        item.averageCost,
        item.totalValue.toFixed(2),
        item.stockStatus,
        item.storageType
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
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'low-stock' && item.stockStatus === 'Low Stock') ||
                         (filterStatus === 'out-of-stock' && item.stockStatus === 'Out of Stock') ||
                         (filterStatus === 'normal' && item.stockStatus === 'Normal') ||
                         (filterStatus === 'inactive' && !item.isActive);
    
    const matchesCategory = filterCategory === 'all' || item.categoryId === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Low Stock': return '#f59e0b';
      case 'Out of Stock': return '#ef4444';
      case 'Normal': return '#10b981';
      case 'Error': return '#64748b';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Low Stock': return <FaExclamationTriangle />;
      case 'Out of Stock': return <FaBox />;
      case 'Normal': return <FaChartLine />;
      case 'Error': return <FaExclamationTriangle />;
      default: return null;
    }
  };

  const totalItems = filteredData.length;
  const lowStockItems = filteredData.filter(item => item.stockStatus === 'Low Stock').length;
  const outOfStockItems = filteredData.filter(item => item.stockStatus === 'Out of Stock').length;
  const totalValue = filteredData.reduce((sum, item) => sum + item.totalValue, 0);

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
              <option value="normal">Normal Stock ({totalItems - lowStockItems - outOfStockItems})</option>
              <option value="low-stock">Low Stock ({lowStockItems})</option>
              <option value="out-of-stock">Out of Stock ({outOfStockItems})</option>
              <option value="inactive">Inactive ({stockData.filter(item => !item.isActive).length})</option>
            </select>
          </div>

          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
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
            <div className="summary-card value">
              <h3>₹{totalValue.toFixed(2)}</h3>
              <p>Total Value</p>
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
                <th>Min Stock</th>
                <th>Reorder Qty</th>
                <th>Units</th>
                <th>Avg Cost</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Storage</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item._id} className={item.stockStatus !== 'Normal' ? 'warning-row' : ''}>
                  <td className="material-name">
                    <div className="material-info">
                      <span className="name">{item.materialName}</span>
                      {!item.isActive && <span className="inactive-badge">Inactive</span>}
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <span className={`stock-value ${item.stockStatus !== 'Normal' ? 'low-stock' : ''}`}>
                      {item.currentStock} {item.purchaseUnit}
                    </span>
                  </td>
                  <td>{item.minStockLevel} {item.consumptionUnit}</td>
                  <td>{item.reorderQuantity} {item.purchaseUnit}</td>
                  <td>
                    <div className="unit-info">
                      <div>P: {item.purchaseUnit}</div>
                      <div>C: {item.consumptionUnit}</div>
                    </div>
                  </td>
                  <td>₹{item.averageCost.toFixed(2)}</td>
                  <td>
                    <span className="value-display">
                      {/* <FaDollarSign /> */}
                      ₹{item.totalValue.toFixed(2)}
                    </span>
                  </td>
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
                  <td>
                    <span className={`storage-badge ${item.storageType.toLowerCase()}`}>
                      <FaWarehouse />
                      {item.storageType}
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
