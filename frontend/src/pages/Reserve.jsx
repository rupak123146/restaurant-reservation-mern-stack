import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";
import notificationService from "../services/NotificationService";
import "./Form.css";

export default function Reserve() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    date: "",
    time: "",
    specialRequests: ""
  });
  const [restaurant, setRestaurant] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Get restaurant data from navigation state
    if (location.state?.restaurant) {
      const selectedRestaurant = location.state.restaurant;
      
      // Check if restaurant is available
      if (!selectedRestaurant.isAvailable) {
        // Redirect to home with error message if restaurant is not available
        navigate("/", { 
          state: { 
            error: `Sorry, ${selectedRestaurant.name} is currently fully booked. Please select another restaurant.` 
          } 
        });
        return;
      }
      
      setRestaurant(selectedRestaurant);
      setAvailableTimes(selectedRestaurant.availableSlots);
    } else {
      // If no restaurant selected, redirect to home
      navigate("/");
    }

    // Pre-fill user data if logged in
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [location.state, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
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
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const reservationData = {
        ...formData,
        restaurant: restaurant,
        reservationId: `RES-${Date.now()}`,
        status: "confirmed",
        createdAt: new Date().toISOString()
      };

      // Store reservation in localStorage (in a real app, this would be sent to backend)
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      existingReservations.push(reservationData);
      localStorage.setItem('reservations', JSON.stringify(existingReservations));

      // Also store in admin bookings format
      const adminBooking = {
        id: Date.now(),
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        restaurantId: restaurant.id,
        tableNumber: 'TBD', // Table to be assigned by admin
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        status: 'pending',
        specialRequests: formData.specialRequests || '',
        createdAt: new Date().toISOString()
      };

      const existingAdminBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
      existingAdminBookings.push(adminBooking);
      localStorage.setItem('admin_bookings', JSON.stringify(existingAdminBookings));

      // Send booking confirmation notifications
      try {
        await notificationService.sendBookingConfirmation(reservationData);
        await notificationService.sendAdminNotification(reservationData, 'new_booking');
      } catch (error) {
        console.error('Error sending notifications:', error);
        // Continue with navigation even if notifications fail
      }

      navigate("/confirmation", {
        state: { reservation: reservationData }
      });
    }
  };

  if (!restaurant) {
    return (
      <PageLayout className="form-page">
        <div className="form-container">
          <h2>Loading...</h2>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="form-page">
      <div className="form-container">
      <div className="reservation-header">
        <h2>Reserve a Table at {restaurant.name}</h2>
        <div className="restaurant-info">
          <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
          <p><strong>Location:</strong> {restaurant.location}</p>
          <p><strong>Price Range:</strong> {restaurant.priceRange}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "error" : ""}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? "error" : ""}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="guests">Number of Guests *</label>
            <select
              id="guests"
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
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={errors.date ? "error" : ""}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="time">Time *</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className={errors.time ? "error" : ""}
            >
              <option value="">Select a time</option>
              {availableTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.time && <span className="error-message">{errors.time}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="specialRequests">Special Requests</label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            placeholder="Any special dietary requirements, celebrations, or requests..."
            rows="3"
          />
        </div>

        <button type="submit" className="submit-btn">
          Confirm Reservation
        </button>
      </form>
    </div>
    </PageLayout>
  );
}
