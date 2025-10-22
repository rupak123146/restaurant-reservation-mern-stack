import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrash, FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';
import './MyReservations.css';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [editingReservation, setEditingReservation] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    const storedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    // Filter reservations by user email if logged in
    if (user?.email) {
      const userReservations = storedReservations.filter(res => res.email === user.email);
      setReservations(userReservations);
    } else {
      setReservations(storedReservations);
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setShowEditForm(true);
  };

  const handleDelete = (reservationId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      const updatedReservations = reservations.filter(res => res.reservationId !== reservationId);
      setReservations(updatedReservations);
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    }
  };

  const handleUpdateReservation = (updatedData) => {
    const updatedReservations = reservations.map(res => 
      res.reservationId === editingReservation.reservationId 
        ? { ...res, ...updatedData }
        : res
    );
    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    setShowEditForm(false);
    setEditingReservation(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (!user) {
    return (
      <PageLayout className="content-page">
        <div className="my-reservations">
          <div className="login-prompt">
            <h2>Please Login to View Your Reservations</h2>
            <p>You need to be logged in to view and manage your reservations.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="content-page">
      <div className="my-reservations">
      <div className="reservations-header">
        <h2>My Reservations</h2>
        <p>Manage your restaurant reservations</p>
      </div>

      {reservations.length === 0 ? (
        <div className="no-reservations">
          <div className="no-reservations-icon">🍽️</div>
          <h3>No Reservations Found</h3>
          <p>You haven't made any reservations yet.</p>
          <button 
            className="browse-restaurants-btn"
            onClick={() => window.location.href = '/'}
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div key={reservation.reservationId} className="reservation-card">
              <div className="reservation-header">
                <div className="restaurant-info">
                  <h3>{reservation.restaurant?.name || 'Restaurant'}</h3>
                  <div className="reservation-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(reservation.status) }}
                    >
                      {reservation.status}
                    </span>
                  </div>
                </div>
                <div className="reservation-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(reservation)}
                    title="Edit Reservation"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(reservation.reservationId)}
                    title="Cancel Reservation"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="reservation-details">
                <div className="detail-row">
                  <FaCalendarAlt className="detail-icon" />
                  <span>{formatDate(reservation.date)}</span>
                </div>
                <div className="detail-row">
                  <FaClock className="detail-icon" />
                  <span>{reservation.time}</span>
                </div>
                <div className="detail-row">
                  <FaUsers className="detail-icon" />
                  <span>{reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <div className="detail-row">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span>{reservation.restaurant?.location || 'Location not available'}</span>
                </div>
              </div>

              <div className="reservation-info">
                <div className="info-item">
                  <strong>Name:</strong> {reservation.name}
                </div>
                <div className="info-item">
                  <strong>Email:</strong> {reservation.email}
                </div>
                <div className="info-item">
                  <strong>Phone:</strong> {reservation.phone}
                </div>
                {reservation.specialRequests && (
                  <div className="info-item">
                    <strong>Special Requests:</strong> {reservation.specialRequests}
                  </div>
                )}
                <div className="info-item">
                  <strong>Reservation ID:</strong> {reservation.reservationId}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditForm && editingReservation && (
        <EditReservationForm
          reservation={editingReservation}
          onUpdate={handleUpdateReservation}
          onCancel={() => {
            setShowEditForm(false);
            setEditingReservation(null);
          }}
        />
      )}
      </div>
    </PageLayout>
  );
}

// Edit Reservation Form Component
function EditReservationForm({ reservation, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    name: reservation.name,
    email: reservation.email,
    phone: reservation.phone,
    guests: reservation.guests,
    date: reservation.date,
    time: reservation.time,
    specialRequests: reservation.specialRequests || ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (formData.guests < 1 || formData.guests > 20) {
      newErrors.guests = "Number of guests must be between 1 and 20";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate(formData);
    }
  };

  return (
    <div className="edit-form-overlay">
      <div className="edit-form-container">
        <h3>Edit Reservation</h3>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Guests *</label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                className={errors.guests ? "error" : ""}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
              {errors.guests && <span className="error-message">{errors.guests}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={errors.date ? "error" : ""}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label>Time *</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={errors.time ? "error" : ""}
              >
                <option value="">Select a time</option>
                {reservation.restaurant?.availableSlots?.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="update-btn">
              Update Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
