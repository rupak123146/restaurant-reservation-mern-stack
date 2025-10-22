import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaSignOutAlt, FaCog, FaBell } from "react-icons/fa";
import NotificationPreferences from "./NotificationPreferences";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showNotificationPreferences, setShowNotificationPreferences] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍴</span>
          <span className="brand-text">ReserveMyTable</span>
        </Link>

        <div className="navbar-menu">
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            {user && (
              <li><Link to="/my-reservations">My Reservations</Link></li>
            )}
            <li><Link to="/admin" className="admin-link">
              <FaCog className="admin-icon" /> Admin
            </Link></li>
          </ul>

          <div className="navbar-auth">
            {user ? (
              <div className="user-menu">
                <button 
                  onClick={() => setShowNotificationPreferences(true)} 
                  className="notification-btn" 
                  title="Notification Preferences"
                >
                  <FaBell />
                </button>
                <div className="user-info">
                  <FaUser className="user-icon" />
                  <span className="user-name">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn login-btn">Sign In</Link>
                <Link to="/register" className="auth-btn register-btn">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showNotificationPreferences && (
        <NotificationPreferences 
          onClose={() => setShowNotificationPreferences(false)} 
        />
      )}
    </nav>
  );
}
