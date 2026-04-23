import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';
import { logout } from '../store/authSlice';
import './Navbar.css';

const Navbar = ({ onMenuToggle, sidebarCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header
      className={`navbar ${sidebarCollapsed ? 'navbar-expanded' : ''}`}
      id="navbar"
    >
      <div className="navbar-left">
        <button
          className="navbar-menu-btn btn-icon btn-ghost"
          onClick={onMenuToggle}
          id="navbar-menu-btn"
        >
          <HiOutlineMenu size={20} />
        </button>
      </div>

      <div className="navbar-right">
        <div className="navbar-user" id="navbar-user-info">
          <div className="navbar-user-info">
            <span className="navbar-user-name">{user?.name}</span>
            <span className={`navbar-user-role role-${user?.role}`}>
              {user?.role}
            </span>
          </div>
          <div className="navbar-avatar">
            <HiOutlineUser size={18} />
          </div>
        </div>
        <button
          className="btn btn-ghost navbar-logout-btn"
          onClick={handleLogout}
          id="navbar-logout-btn"
          title="Logout"
        >
          <HiOutlineLogout size={18} />
          <span className="navbar-logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
