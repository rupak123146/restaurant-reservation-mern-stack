import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import { restaurants } from '../data/restaurants';
import './Feedback.css';

export default function Feedback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    // Get restaurant from navigation state or URL params
    const restaurantData = location.state?.restaurant;
    const restaurantId = location.state?.restaurantId || new URLSearchParams(location.search).get('id');
    
    if (restaurantData) {
      setRestaurant(restaurantData);
    } else if (restaurantId) {
      const foundRestaurant = restaurants.find(r => r.id === parseInt(restaurantId));
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
      } else {
        navigate('/');
        return;
      }
    } else {
      navigate('/');
      return;
    }

    // Load existing feedbacks from localStorage
    loadFeedbacks(restaurantData?.id || parseInt(restaurantId));
  }, [location, navigate]);

  const loadFeedbacks = (restaurantId) => {
    const savedFeedbacks = localStorage.getItem(`feedbacks_${restaurantId}`);
    if (savedFeedbacks) {
      setFeedbacks(JSON.parse(savedFeedbacks));
    } else {
      // Initialize with some sample feedback for demonstration
      const sampleFeedbacks = [
        {
          id: 1,
          restaurantId: restaurantId,
          customerName: "Priya Sharma",
          rating: 5,
          comment: "Absolutely amazing food! The dosas were crispy and the sambar was perfectly spiced. The service was excellent and the ambiance was very traditional. Highly recommend this place for authentic South Indian cuisine.",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 12
        },
        {
          id: 2,
          restaurantId: restaurantId,
          customerName: "Rajesh Kumar",
          rating: 4,
          comment: "Great food quality and reasonable prices. The idlis were soft and fluffy. Only minor issue was the waiting time during peak hours, but overall a very good experience.",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 8
        },
        {
          id: 3,
          restaurantId: restaurantId,
          customerName: "Meera Nair",
          rating: 5,
          comment: "This place brings back memories of home-cooked meals. The chutneys are exceptional and the filter coffee is the best I've had in the city. Staff is very courteous and helpful.",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 15
        }
      ];
      setFeedbacks(sampleFeedbacks);
      localStorage.setItem(`feedbacks_${restaurantId}`, JSON.stringify(sampleFeedbacks));
    }
  };

  const handleSubmitFeedback = async (feedback) => {
    const updatedFeedbacks = [...feedbacks, feedback];
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem(`feedbacks_${restaurant.id}`, JSON.stringify(updatedFeedbacks));
    
    // Update restaurant rating
    updateRestaurantRating(restaurant.id, updatedFeedbacks);
  };

  const updateRestaurantRating = (restaurantId, feedbacks) => {
    if (feedbacks.length === 0) return;
    
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const newAverageRating = (totalRating / feedbacks.length).toFixed(1);
    
    // Update the restaurant data in localStorage for persistence
    const savedRestaurants = localStorage.getItem('restaurants');
    let restaurantList = savedRestaurants ? JSON.parse(savedRestaurants) : restaurants;
    
    const restaurantIndex = restaurantList.findIndex(r => r.id === restaurantId);
    if (restaurantIndex !== -1) {
      restaurantList[restaurantIndex].rating = parseFloat(newAverageRating);
      localStorage.setItem('restaurants', JSON.stringify(restaurantList));
      
      // Update current restaurant state
      setRestaurant(prev => ({ ...prev, rating: parseFloat(newAverageRating) }));
    }
  };

  const handleHelpfulClick = (feedbackId) => {
    const updatedFeedbacks = feedbacks.map(feedback => 
      feedback.id === feedbackId 
        ? { ...feedback, helpful: feedback.helpful + 1 }
        : feedback
    );
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem(`feedbacks_${restaurant.id}`, JSON.stringify(updatedFeedbacks));
  };

  if (!restaurant) {
    return (
      <PageLayout>
        <div className="loading">Loading...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="feedback-page">
        <div className="feedback-page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
            Back
          </button>
          
          <div className="restaurant-info">
            <div className="restaurant-image">
              <img src={restaurant.image} alt={restaurant.name} />
            </div>
            <div className="restaurant-details">
              <h1>{restaurant.name}</h1>
              <p className="cuisine">{restaurant.cuisine}</p>
              <p className="location">{restaurant.location}</p>
              <div className="current-rating">
                <span className="rating-number">{restaurant.rating}</span>
                <span className="rating-label">Current Rating</span>
              </div>
            </div>
          </div>
          
          <button 
            className="add-feedback-btn"
            onClick={() => setShowFeedbackForm(true)}
          >
            <FaPlus />
            Write Review
          </button>
        </div>

        <FeedbackList 
          feedbacks={feedbacks}
          onHelpfulClick={handleHelpfulClick}
        />

        {showFeedbackForm && (
          <FeedbackForm
            restaurant={restaurant}
            onSubmitFeedback={handleSubmitFeedback}
            onClose={() => setShowFeedbackForm(false)}
          />
        )}
      </div>
    </PageLayout>
  );
}
