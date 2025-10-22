import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaComments } from 'react-icons/fa';
import './RestaurantCard.css';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const FALLBACK_IMG = 'https://via.placeholder.com/400x200/e9ecef/6c757d?text=Restaurant+Image';

  const handleReserveClick = () => {
    if (restaurant.isAvailable) {
      navigate('/reserve', { state: { restaurant } });
    }
  };

  const handleFeedbackClick = () => {
    navigate('/feedback', { state: { restaurant } });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  return (
    <div className="restaurant-card">
      <div className="restaurant-image">
        <img 
          src={restaurant.image || FALLBACK_IMG} 
          alt={restaurant.name}
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_IMG) {
              e.currentTarget.src = FALLBACK_IMG;
            }
          }}
        />
        <div className="price-badge">{restaurant.priceRange}</div>
      </div>

      <div className="restaurant-info">
        <div className="restaurant-header">
          <h3>{restaurant.name}</h3>
          <div className="rating">
            {renderStars(restaurant.rating)}
            <span className="rating-number">{restaurant.rating}</span>
          </div>
        </div>

        <div className="cuisine-badge">{restaurant.cuisine}</div>

        <p className="description">{restaurant.description}</p>

        <div className="restaurant-details">
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <span>{restaurant.location}</span>
          </div>
          <div className="detail-item">
            <FaClock className="detail-icon" />
            <span>{restaurant.hours}</span>
          </div>
          <div className="detail-item">
            <FaPhone className="detail-icon" />
            <span>{restaurant.phone}</span>
          </div>
        </div>

        <div className="availability-section">
          <div className="availability-status">
            <span className={`availability-badge ${restaurant.isAvailable ? 'available' : 'unavailable'}`}>
              {restaurant.isAvailable ? `${restaurant.availableSeats} seats available` : 'No seats available'}
            </span>
          </div>
          
          {restaurant.isAvailable ? (
            <div className="available-slots">
              <p className="slots-label">Available Times:</p>
              <div className="slots">
                {restaurant.availableSlots.map((slot, index) => (
                  <span key={index} className="time-slot">{slot}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="unavailable-message">
              <p className="unavailable-text">This restaurant is currently fully booked. Please try again later or check other restaurants.</p>
            </div>
          )}
        </div>

        <div className="card-actions">
          <button 
            className={`reserve-btn ${!restaurant.isAvailable ? 'disabled' : ''}`}
            onClick={handleReserveClick}
            disabled={!restaurant.isAvailable}
          >
            {restaurant.isAvailable ? 'Reserve Table' : 'Fully Booked'}
          </button>
          <button 
            className="feedback-btn"
            onClick={handleFeedbackClick}
          >
            <FaComments />
            Reviews
          </button>
        </div>
      </div>
    </div>
  );
}
