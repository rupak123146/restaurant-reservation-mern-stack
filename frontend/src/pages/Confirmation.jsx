import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import PageLayout from "../components/PageLayout";
import "./Confirmation.css";

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservation = location.state?.reservation;

  if (!reservation) {
    return (
      <PageLayout className="form-page">
        <div className="confirmation-container">
          <div className="error-message">
            <h2>No Reservation Found</h2>
            <p>It seems there was an issue with your reservation.</p>
            <button onClick={() => navigate("/")} className="btn-primary">
              Go Home
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageLayout className="form-page">
      <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-header">
          <FaCheckCircle className="success-icon" />
          <h1>Reservation Confirmed! 🎉</h1>
          <p>Thank you for choosing ReserveMyTable</p>
        </div>

        <div className="reservation-details">
          <h2>Reservation Details</h2>
          
          <div className="detail-section">
            <h3>Restaurant Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <div>
                  <strong>{reservation.restaurant?.name}</strong>
                  <p>{reservation.restaurant?.location}</p>
                </div>
              </div>
              <div className="detail-item">
                <span className="cuisine-badge">{reservation.restaurant?.cuisine}</span>
                <span className="price-badge">{reservation.restaurant?.priceRange}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Reservation Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div>
                  <strong>Date</strong>
                  <p>{formatDate(reservation.date)}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaClock className="detail-icon" />
                <div>
                  <strong>Time</strong>
                  <p>{reservation.time}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaUsers className="detail-icon" />
                <div>
                  <strong>Guests</strong>
                  <p>{reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <div>
                  <strong>Name</strong>
                  <p>{reservation.name}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <div>
                  <strong>Email</strong>
                  <p>{reservation.email}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaPhone className="detail-icon" />
                <div>
                  <strong>Phone</strong>
                  <p>{reservation.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {reservation.specialRequests && (
            <div className="detail-section">
              <h3>Special Requests</h3>
              <p className="special-requests">{reservation.specialRequests}</p>
            </div>
          )}

          <div className="reservation-id">
            <strong>Reservation ID:</strong> {reservation.reservationId}
          </div>
        </div>

        <div className="confirmation-actions">
          <button 
            onClick={() => navigate("/my-reservations")} 
            className="btn-primary"
          >
            View My Reservations
          </button>
          <button 
            onClick={() => navigate("/")} 
            className="btn-secondary"
          >
            Browse More Restaurants
          </button>
        </div>

        <div className="confirmation-footer">
          <p>We'll send you a confirmation email shortly. See you soon!</p>
        </div>
      </div>
    </div>
    </PageLayout>
  );
}
