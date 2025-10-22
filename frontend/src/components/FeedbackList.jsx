import React, { useState } from 'react';
import { FaStar, FaThumbsUp, FaUser, FaCalendarAlt } from 'react-icons/fa';
import './FeedbackList.css';

export default function FeedbackList({ feedbacks, onHelpfulClick }) {
  const [sortBy, setSortBy] = useState('newest');

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`star ${i <= rating ? 'filled' : 'empty'}`}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach(feedback => {
      distribution[feedback.rating]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const totalReviews = feedbacks.length;

  if (feedbacks.length === 0) {
    return (
      <div className="feedback-list">
        <div className="feedback-header">
          <h3>Customer Reviews</h3>
        </div>
        <div className="no-feedback">
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-list">
      <div className="feedback-header">
        <h3>Customer Reviews ({totalReviews})</h3>
        
        <div className="rating-summary">
          <div className="average-rating">
            <div className="rating-number">{getAverageRating()}</div>
            <div className="rating-stars">
              {renderStars(Math.round(getAverageRating()))}
            </div>
            <div className="rating-label">Average Rating</div>
          </div>
          
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="rating-row">
                <span className="rating-label">{rating} star</span>
                <div className="rating-bar">
                  <div 
                    className="rating-fill"
                    style={{ 
                      width: totalReviews > 0 ? `${(distribution[rating] / totalReviews) * 100}%` : '0%' 
                    }}
                  ></div>
                </div>
                <span className="rating-count">({distribution[rating]})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="feedback-controls">
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      <div className="feedback-items">
        {sortedFeedbacks.map((feedback) => (
          <div key={feedback.id} className="feedback-item">
            <div className="feedback-header-item">
              <div className="customer-info">
                <FaUser className="user-icon" />
                <span className="customer-name">{feedback.customerName}</span>
              </div>
              <div className="feedback-date">
                <FaCalendarAlt className="date-icon" />
                <span>{formatDate(feedback.date)}</span>
              </div>
            </div>

            <div className="feedback-rating">
              <div className="stars">{renderStars(feedback.rating)}</div>
              <span className="rating-text">{getRatingText(feedback.rating)}</span>
            </div>

            <div className="feedback-comment">
              <p>{feedback.comment}</p>
            </div>

            <div className="feedback-actions">
              <button 
                className="helpful-btn"
                onClick={() => onHelpfulClick(feedback.id)}
              >
                <FaThumbsUp />
                Helpful ({feedback.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
