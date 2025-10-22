import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaSearch, FaFilter, FaCalendarAlt, FaUser, FaPhone, FaUtensils } from 'react-icons/fa';
import notificationService from '../../services/NotificationService';
import './BookingManagement.css';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    try {
      // Load restaurants
      const savedRestaurants = localStorage.getItem('admin_restaurants');
      if (savedRestaurants) {
        setRestaurants(JSON.parse(savedRestaurants));
      }

      // Load bookings
      const savedBookings = localStorage.getItem('admin_bookings');
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      } else {
      // Initialize with sample bookings
      const sampleBookings = [
        {
          id: 1,
          customerName: 'Rajesh Kumar',
          customerEmail: 'rajesh@email.com',
          customerPhone: '+91 98765 43210',
          restaurantId: 1,
          tableNumber: 'T001',
          date: '2025-09-15',
          time: '7:30 PM',
          guests: 4,
          status: 'pending',
          specialRequests: 'Window seat preferred',
          createdAt: '2025-09-14T10:30:00Z'
        },
        {
          id: 2,
          customerName: 'Priya Sharma',
          customerEmail: 'priya@email.com',
          customerPhone: '+91 87654 32109',
          restaurantId: 2,
          tableNumber: 'T003',
          date: '2025-09-16',
          time: '8:00 PM',
          guests: 6,
          status: 'approved',
          specialRequests: 'Birthday celebration',
          createdAt: '2025-09-13T15:45:00Z'
        },
        {
          id: 3,
          customerName: 'Amit Patel',
          customerEmail: 'amit@email.com',
          customerPhone: '+91 76543 21098',
          restaurantId: 1,
          tableNumber: 'T002',
          date: '2025-09-14',
          time: '6:00 PM',
          guests: 2,
          status: 'cancelled',
          specialRequests: '',
          createdAt: '2025-09-12T09:20:00Z'
        },
        {
          id: 4,
          customerName: 'Meera Nair',
          customerEmail: 'meera@email.com',
          customerPhone: '+91 65432 10987',
          restaurantId: 3,
          tableNumber: 'T005',
          date: '2025-09-17',
          time: '9:00 PM',
          guests: 8,
          status: 'pending',
          specialRequests: 'Corporate dinner',
          createdAt: '2025-09-14T11:15:00Z'
        },
        {
          id: 5,
          customerName: 'Suresh Reddy',
          customerEmail: 'suresh@email.com',
          customerPhone: '+91 54321 09876',
          restaurantId: 2,
          tableNumber: 'T004',
          date: '2025-09-15',
          time: '7:00 PM',
          guests: 4,
          status: 'approved',
          specialRequests: 'Vegetarian menu only',
          createdAt: '2025-09-13T14:30:00Z'
        }
      ];
      setBookings(sampleBookings);
      localStorage.setItem('admin_bookings', JSON.stringify(sampleBookings));
    }
    } catch (error) {
      console.error('Error loading booking data:', error);
      setBookings([]);
      setRestaurants([]);
    }
  }, []);

  const saveToStorage = (updatedBookings) => {
    localStorage.setItem('admin_bookings', JSON.stringify(updatedBookings));
  };

  const handleApprove = async (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    const restaurant = restaurants.find(r => r.id === booking.restaurantId);
    
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: 'approved' }
        : booking
    );
    setBookings(updatedBookings);
    saveToStorage(updatedBookings);

    // Send approval notification
    try {
      const bookingData = {
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        restaurant: restaurant || { name: 'Restaurant', location: 'Location' },
        date: booking.date,
        time: booking.time,
        guests: booking.guests,
        reservationId: `RES-${booking.id}`
      };
      
      await notificationService.sendBookingConfirmation(bookingData);
    } catch (error) {
      console.error('Error sending approval notification:', error);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const booking = bookings.find(b => b.id === bookingId);
      const restaurant = restaurants.find(r => r.id === booking.restaurantId);
      
      const updatedBookings = bookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' }
          : booking
      );
      setBookings(updatedBookings);
      saveToStorage(updatedBookings);

      // Send cancellation notification
      try {
        const bookingData = {
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          restaurant: restaurant || { name: 'Restaurant', location: 'Location' },
          date: booking.date,
          time: booking.time,
          guests: booking.guests,
          reservationId: `RES-${booking.id}`
        };
        
        await notificationService.sendBookingCancellation(bookingData, 'Booking cancelled by restaurant');
      } catch (error) {
        console.error('Error sending cancellation notification:', error);
      }
    }
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Unknown Restaurant';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerPhone.includes(searchTerm) ||
                         getRestaurantName(booking.restaurantId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    const today = new Date();
    const bookingDate = new Date(booking.date);
    let matchesDate = true;
    
    if (dateFilter === 'today') {
      matchesDate = bookingDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'upcoming') {
      matchesDate = bookingDate >= today;
    } else if (dateFilter === 'past') {
      matchesDate = bookingDate < today;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getBookingStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const approved = bookings.filter(b => b.status === 'approved').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    
    return { total, pending, approved, cancelled };
  };

  const stats = getBookingStats();

  return (
    <div className="booking-management">
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card approved">
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card cancelled">
          <div className="stat-number">{stats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      <div className="management-header">
        <div className="header-actions">
          <div className="search-filters">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bookings-container">
        <div className="bookings-header">
          <h3>Bookings ({filteredBookings.length})</h3>
        </div>
        
        <div className="bookings-grid">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="customer-info">
                  <h4>{booking.customerName}</h4>
                  <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-id">#{booking.id}</div>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <FaUtensils className="detail-icon" />
                  <span>{getRestaurantName(booking.restaurantId)}</span>
                </div>
                <div className="detail-row">
                  <FaCalendarAlt className="detail-icon" />
                  <span>{formatDate(booking.date)} at {booking.time}</span>
                </div>
                <div className="detail-row">
                  <FaUser className="detail-icon" />
                  <span>{booking.guests} guests • Table {booking.tableNumber}</span>
                </div>
                <div className="detail-row">
                  <FaPhone className="detail-icon" />
                  <span>{booking.customerPhone}</span>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="special-requests">
                  <strong>Special Requests:</strong>
                  <p>{booking.specialRequests}</p>
                </div>
              )}

              <div className="booking-meta">
                <small>Booked on {formatDateTime(booking.createdAt)}</small>
              </div>

              {booking.status === 'pending' && (
                <div className="booking-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => handleApprove(booking.id)}
                  >
                    <FaCheck /> Approve
                  </button>
                  <button 
                    className="btn-cancel"
                    onClick={() => handleCancel(booking.id)}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}

              {booking.status === 'approved' && (
                <div className="booking-actions">
                  <button 
                    className="btn-cancel"
                    onClick={() => handleCancel(booking.id)}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="no-bookings">
            <p>No bookings found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
