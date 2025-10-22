import React, { useState } from 'react';
import { FaStar, FaUser, FaComment } from 'react-icons/fa';
import './FeedbackForm.css';

export default function FeedbackForm({ restaurant, onSubmitFeedback, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoverRating(starValue);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!comment.trim()) {
      alert('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);

    const feedback = {
      id: Date.now(),
      restaurantId: restaurant.id,
      customerName: customerName.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
      helpful: 0
    };

    try {
      await onSubmitFeedback(feedback);
      
      // Reset form
      setRating(0);
      setComment('');
      setCustomerName('');
      
      alert('Thank you for your feedback!');
      onClose();
    } catch (error) {
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= (hoverRating || rating);
      stars.push(
        <FaStar
          key={i}
          className={`feedback-star ${isActive ? 'active' : ''}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
        />
      );
    }
    return stars;
  };

  const getRatingText = () => {
    const currentRating = hoverRating || rating;
    switch (currentRating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Rate your experience';
    }
  };

  return (
    <div className="feedback-form-overlay">
      <div className="feedback-form-container">
        <div className="feedback-form-header">
          <h2>Share Your Experience</h2>
          <p>Tell us about your visit to {restaurant.name}</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label>
              <FaUser className="form-icon" />
              Your Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <div className="star-rating">
              {renderStars()}
              <span className="rating-text">{getRatingText()}</span>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaComment className="form-icon" />
              Your Feedback
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience about the food, service, ambiance, etc."
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
