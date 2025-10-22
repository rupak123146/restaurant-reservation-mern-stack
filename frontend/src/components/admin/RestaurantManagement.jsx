import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch } from 'react-icons/fa';
import { restaurants as initialRestaurants } from '../../data/restaurants';
import './RestaurantManagement.css';

export default function RestaurantManagement() {
  const FALLBACK_IMG = 'https://placehold.co/40x40?text=No+Img';
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    rating: 0,
    priceRange: '',
    location: '',
    image: '',
    description: '',
    phone: '',
    address: '',
    hours: '',
    availableSlots: []
  });

  useEffect(() => {
    try {
      const savedRestaurants = localStorage.getItem('admin_restaurants');
      if (savedRestaurants) {
        setRestaurants(JSON.parse(savedRestaurants));
      } else {
        setRestaurants(initialRestaurants);
        localStorage.setItem('admin_restaurants', JSON.stringify(initialRestaurants));
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setRestaurants(initialRestaurants);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = (updatedRestaurants) => {
    localStorage.setItem('admin_restaurants', JSON.stringify(updatedRestaurants));
    localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'availableSlots') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(slot => slot.trim()).filter(slot => slot)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cuisine: '',
      rating: 0,
      priceRange: '',
      location: '',
      image: '',
      description: '',
      phone: '',
      address: '',
      hours: '',
      availableSlots: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing restaurant
      const updatedRestaurants = restaurants.map(restaurant =>
        restaurant.id === editingId
          ? { ...formData, id: editingId, rating: parseFloat(formData.rating) }
          : restaurant
      );
      setRestaurants(updatedRestaurants);
      saveToStorage(updatedRestaurants);
    } else {
      // Add new restaurant
      const newRestaurant = {
        ...formData,
        id: Math.max(...restaurants.map(r => r.id), 0) + 1,
        rating: parseFloat(formData.rating)
      };
      const updatedRestaurants = [...restaurants, newRestaurant];
      setRestaurants(updatedRestaurants);
      saveToStorage(updatedRestaurants);
    }
    
    resetForm();
  };

  const handleEdit = (restaurant) => {
    setFormData({
      ...restaurant,
      availableSlots: restaurant.availableSlots || []
    });
    setEditingId(restaurant.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      const updatedRestaurants = restaurants.filter(restaurant => restaurant.id !== id);
      setRestaurants(updatedRestaurants);
      saveToStorage(updatedRestaurants);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="restaurant-management">
        <div className="loading-state">
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-management">
      <div className="management-header">
        <div className="header-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            <FaPlus /> Add Restaurant
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingId ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
              <button className="close-btn" onClick={resetForm}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="restaurant-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Restaurant Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cuisine Type *</label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Cuisine</option>
                    <option value="South Indian">South Indian</option>
                    <option value="North Indian">North Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Continental">Continental</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price Range *</label>
                  <select
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Price Range</option>
                    <option value="₹100-300">₹100-300</option>
                    <option value="₹300-600">₹300-600</option>
                    <option value="₹600-1000">₹600-1000</option>
                    <option value="₹1000+">₹1000+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Operating Hours *</label>
                  <input
                    type="text"
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                    placeholder="e.g., 6:00 AM - 10:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group full-width">
                <label>Available Time Slots</label>
                <input
                  type="text"
                  name="availableSlots"
                  value={formData.availableSlots.join(', ')}
                  onChange={handleInputChange}
                  placeholder="e.g., 6:00 PM, 7:30 PM, 9:00 PM"
                />
                <small>Separate multiple slots with commas</small>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <FaSave /> {editingId ? 'Update' : 'Save'} Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="restaurants-table">
        <div className="table-header">
          <h3>Restaurants ({filteredRestaurants.length})</h3>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Cuisine</th>
                <th>Location</th>
                <th>Price Range</th>
                <th>Rating</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.map(restaurant => (
                <tr key={restaurant.id}>
                  <td>
                    <div className="restaurant-info">
                      <img
                        src={restaurant.image || FALLBACK_IMG}
                        alt={restaurant.name}
                        className="restaurant-thumb"
                        loading="lazy"
                        onError={(e) => {
                          if (e.currentTarget.src !== FALLBACK_IMG) {
                            e.currentTarget.src = FALLBACK_IMG;
                          }
                        }}
                      />
                      <span>{restaurant.name}</span>
                    </div>
                  </td>
                  <td>{restaurant.cuisine}</td>
                  <td>{restaurant.location}</td>
                  <td>{restaurant.priceRange}</td>
                  <td>
                    <span className="rating-badge">{restaurant.rating}</span>
                  </td>
                  <td>{restaurant.phone}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(restaurant)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(restaurant.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
