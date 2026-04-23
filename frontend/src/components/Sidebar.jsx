import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlinePlusCircle,
  HiOutlineUsers,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: <HiOutlineViewGrid size={20} />, label: 'Dashboard' },
    { path: '/contracts', icon: <HiOutlineDocumentText size={20} />, label: 'Contracts' },
    { path: '/contracts/new', icon: <HiOutlinePlusCircle size={20} />, label: 'New Contract' },
  ];

  if (user?.role === 'admin') {
    navItems.push({
      path: '/admin/users',
      icon: <HiOutlineUsers size={20} />,
      label: 'Manage Users',
    });
  }

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">C</div>
          {!collapsed && <span className="logo-text">ContractHub</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive || (item.path === '/contracts' && location.pathname.startsWith('/contracts') && location.pathname !== '/contracts/new') ? 'active' : ''}`
            }
            id={`sidebar-link-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        className="sidebar-toggle"
        onClick={onToggle}
        id="sidebar-toggle-btn"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <HiOutlineChevronRight size={16} /> : <HiOutlineChevronLeft size={16} />}
      </button>
    </aside>
  );
};

export default Sidebar;
