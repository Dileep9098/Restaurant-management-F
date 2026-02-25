import React, { useState, useEffect } from 'react';
import { FaBox, FaChartLine, FaShoppingCart, FaUtensils, FaUsers, FaTruck, FaLink, FaCog, FaExchangeAlt } from 'react-icons/fa';
// import RawMaterials from './components/RawMaterials';
import Categories from './components/Categories';
// import Purchases from './components/Purchases';
import Suppliers from './components/Suppliers';
import Recipes from './components/Recipes';
// import StockReport from './components/StockReport';
// import SupplierItems from './components/SupplierItems';
import InventorySettings from './components/InventorySettings';
import InventoryTransactions from './components/InventoryTransactions';
import './Inventory.css';
import RawMaterials from './components/RawMaterials_Updated';
import SupplierItems from './components/SupplierItems_Updated';
import Purchases from './components/Purchases_temp';
import StockReport from './components/StockReport_Updated';
const Inventory = () => {
  const [activeTab, setActiveTab] = useState('raw-materials');
  const [stats, setStats] = useState({
    totalRawMaterials: 0,
    lowStockItems: 0,
    totalPurchases: 0,
    totalSuppliers: 0
  });

  const tabs = [
    { id: 'raw-materials', name: 'Raw Materials', icon: FaBox },
    { id: 'categories', name: 'Categories', icon: FaChartLine },
    { id: 'suppliers', name: 'Suppliers', icon: FaUsers },
    { id: 'supplier-items', name: 'Supplier Items', icon: FaLink },
    { id: 'purchases', name: 'Purchases', icon: FaShoppingCart },
    { id: 'transactions', name: 'Transactions', icon: FaExchangeAlt },
    { id: 'recipes', name: 'Recipes', icon: FaUtensils },
    { id: 'stock-report', name: 'Stock Report', icon: FaTruck },
    { id: 'settings', name: 'Settings', icon: FaCog }
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch basic stats
      const materialsRes = await fetch('/api/v1/inventory/get-all-row-material');
      const materialsData = await materialsRes.json();
      
      const purchasesRes = await fetch('/api/v1/inventory/get-all-purchases');
      const purchasesData = await purchasesRes.json();
      
      const suppliersRes = await fetch('/api/v1/inventory/get-all-supplier');
      const suppliersData = await suppliersRes.json();

      setStats({
        totalRawMaterials: materialsData.count || materialsData.data?.length || 0,
        lowStockItems: materialsData.data?.filter(item => item.currentStock <= item.minStockLevel).length || 0,
        totalPurchases: purchasesData.count || purchasesData.data?.length || 0,
        totalSuppliers: suppliersData.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'raw-materials':
        return <RawMaterials onStatsUpdate={fetchStats} />;
      case 'categories':
        return <Categories />;
      case 'suppliers':
        return <Suppliers onStatsUpdate={fetchStats} />;
      case 'supplier-items':
        return <SupplierItems />;
      case 'purchases':
        return <Purchases onStatsUpdate={fetchStats} />;
      case 'transactions':
        return <InventoryTransactions />;
      case 'recipes':
        return <Recipes />;
      case 'stock-report':
        return <StockReport />;
      case 'settings':
        return <InventorySettings />;
      default:
        return <RawMaterials onStatsUpdate={fetchStats} />;
    }
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <div className="inventory-stats">
          <div className="stat-card">
            <FaBox className="stat-icon" />
            <div>
              <h3>{stats.totalRawMaterials}</h3>
              <p>Raw Materials</p>
            </div>
          </div>
          <div className="stat-card warning">
            <FaChartLine className="stat-icon" />
            <div>
              <h3>{stats.lowStockItems}</h3>
              <p>Low Stock Items</p>
            </div>
          </div>
          <div className="stat-card">
            <FaShoppingCart className="stat-icon" />
            <div>
              <h3>{stats.totalPurchases}</h3>
              <p>Total Purchases</p>
            </div>
          </div>
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div>
              <h3>{stats.totalSuppliers}</h3>
              <p>Suppliers</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`inventory-content ${activeTab === 'transactions' || activeTab === 'stock-report' ? 'top-sidebar' : ''}`}>
        <div className="inventory-sidebar">
          <div className="tab-navigation">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="tab-icon" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="inventory-main">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
