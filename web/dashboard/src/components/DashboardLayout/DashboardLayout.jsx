import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { NotificationCenter } from '../NotificationCenter/NotificationCenter';
import './DashboardLayout.css';

export const DashboardLayout = ({ children, onTabChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'نظرة عامة', icon: '📊', path: 'overview' },
    { id: 'jobs', label: 'الوظائف', icon: '💼', path: 'jobs' },
    { id: 'applicants', label: 'المتقدمون', icon: '👥', path: 'applicants' },
    { id: 'maps', label: 'الخريطة', icon: '🗺️', path: 'maps' },
    { id: 'company', label: 'الشركة', icon: '🏢', path: 'company' },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="app-title">JobMap</h2>
          <button
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.firstName?.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="user-info">
                <p className="user-name">{user?.firstName} {user?.lastName}</p>
                <p className="user-email">{user?.email}</p>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="تسجيل الخروج">
            {sidebarOpen ? '🚪 الخروج' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>لوحة التحكم - {user?.firstName}</h1>
          </div>
          <div className="header-right">
            <NotificationCenter />
            <div className="header-info">
              <span className="user-type">صاحب شركة</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
};
