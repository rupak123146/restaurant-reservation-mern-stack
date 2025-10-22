import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RestaurantSearch from "../components/RestaurantSearch";
import PageLayout from "../components/PageLayout";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check for error message from navigation state
    if (location.state?.error) {
      setErrorMessage(location.state.error);
      // Clear the error after 5 seconds
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <PageLayout className="content-page">
      <div className="home-container">
      {errorMessage && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{errorMessage}</span>
            <button 
              className="error-close" 
              onClick={() => setErrorMessage("")}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to ReserveMyTable 🍽️</h1>
          <p>Discover amazing restaurants and reserve your perfect table in just a few clicks!</p>
          {user ? (
            <div className="user-welcome">
              <p>Welcome back, <strong>{user.name}</strong>!</p>
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="btn-primary"
                onClick={() => window.location.href = "/login"}
              >
                Sign In
              </button>
              <button 
                className="btn-secondary"
                onClick={() => window.location.href = "/register"}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Search & Discover</h3>
            <p>Find restaurants by cuisine, location, and price range</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Booking</h3>
            <p>Reserve tables instantly with our simple booking system</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Manage Reservations</h3>
            <p>View, edit, and cancel your reservations anytime</p>
          </div>
        </div>
      </div>

      <RestaurantSearch />
      </div>
    </PageLayout>
  );
}
