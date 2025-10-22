import React, { useState } from 'react';
import { FaUsers, FaUtensils, FaCalendarCheck, FaChartBar, FaBars, FaTimes, FaSignOutAlt, FaBell } from 'react-icons/fa';
import AdminAuth, { AdminAuthProvider, useAdminAuth } from '../components/admin/AdminAuth';
import RestaurantManagement from '../components/admin/RestaurantManagement';
import TableManagement from '../components/admin/TableManagement';
import BookingManagement from '../components/admin/BookingManagement';
import ReportsManagement from '../components/admin/ReportsManagement';
import NotificationDashboard from '../components/admin/NotificationDashboard';
import './AdminDashboard.css';

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { adminLogout } = useAdminAuth();

  const menuItems = [
    { id: 'restaurants', label: 'Restaurants', icon: FaUtensils },
    { id: 'tables', label: 'Tables', icon: FaUsers },
    { id: 'bookings', label: 'Bookings', icon: FaCalendarCheck },
    { id: 'reports', label: 'Reports', icon: FaChartBar },
    { id: 'notifications', label: 'Notifications', icon: FaBell }
  ];

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'restaurants':
          return <RestaurantManagement />;
        case 'tables':
          return <TableManagement />;
        case 'bookings':
          return <BookingManagement />;
        case 'reports':
          return <ReportsManagement />;
        case 'notifications':
          return <NotificationDashboard />;
        default:
          return <RestaurantManagement />;
      }
    } catch (error) {
      console.error('Error rendering admin content:', error);
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Error loading admin module</h3>
          <p>Please refresh the page and try again.</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }
  };

  return (
    <div className="admin-dashboard">
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <IconComponent className="nav-icon" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`admin-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="content-header">
          <h1>{menuItems.find(item => item.id === activeTab)?.label}</h1>
          <div className="admin-user">
            <span>Welcome, Admin</span>
            <button className="logout-btn" onClick={adminLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
        
        <div className="content-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminAuthProvider>
      <AdminAuth>
        <AdminDashboardContent />
      </AdminAuth>
    </AdminAuthProvider>
  );
}
