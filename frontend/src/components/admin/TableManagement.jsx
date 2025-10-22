import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch, FaTable } from 'react-icons/fa';
import './TableManagement.css';

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [formData, setFormData] = useState({
    tableNumber: '',
    restaurantId: '',
    capacity: '',
    type: 'regular',
    status: 'available',
    location: '',
    description: ''
  });

  useEffect(() => {
    try {
      // Load restaurants
      const savedRestaurants = localStorage.getItem('admin_restaurants');
      if (savedRestaurants) {
        setRestaurants(JSON.parse(savedRestaurants));
      }

      // Load tables
      const savedTables = localStorage.getItem('admin_tables');
      if (savedTables) {
        setTables(JSON.parse(savedTables));
      } else {
        // Initialize with sample tables
        const sampleTables = [
          { id: 1, tableNumber: 'T001', restaurantId: 1, capacity: 4, type: 'regular', status: 'available', location: 'Main Hall', description: 'Window table with city view' },
          { id: 2, tableNumber: 'T002', restaurantId: 1, capacity: 2, type: 'vip', status: 'available', location: 'VIP Section', description: 'Private booth for couples' },
          { id: 3, tableNumber: 'T003', restaurantId: 2, capacity: 6, type: 'family', status: 'occupied', location: 'Family Section', description: 'Large table for families' },
          { id: 4, tableNumber: 'T004', restaurantId: 2, capacity: 8, type: 'group', status: 'available', location: 'Group Area', description: 'Perfect for large groups' },
          { id: 5, tableNumber: 'T005', restaurantId: 3, capacity: 4, type: 'regular', status: 'maintenance', location: 'Terrace', description: 'Outdoor seating with garden view' }
        ];
        setTables(sampleTables);
        localStorage.setItem('admin_tables', JSON.stringify(sampleTables));
      }
    } catch (error) {
      console.error('Error loading table data:', error);
      setTables([]);
      setRestaurants([]);
    }
  }, []);

  const saveToStorage = (updatedTables) => {
    localStorage.setItem('admin_tables', JSON.stringify(updatedTables));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      tableNumber: '',
      restaurantId: '',
      capacity: '',
      type: 'regular',
      status: 'available',
      location: '',
      description: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing table
      const updatedTables = tables.map(table =>
        table.id === editingId
          ? { ...formData, id: editingId, capacity: parseInt(formData.capacity), restaurantId: parseInt(formData.restaurantId) }
          : table
      );
      setTables(updatedTables);
      saveToStorage(updatedTables);
    } else {
      // Add new table
      const newTable = {
        ...formData,
        id: Math.max(...tables.map(t => t.id), 0) + 1,
        capacity: parseInt(formData.capacity),
        restaurantId: parseInt(formData.restaurantId)
      };
      const updatedTables = [...tables, newTable];
      setTables(updatedTables);
      saveToStorage(updatedTables);
    }
    
    resetForm();
  };

  const handleEdit = (table) => {
    setFormData({
      ...table,
      restaurantId: table.restaurantId.toString(),
      capacity: table.capacity.toString()
    });
    setEditingId(table.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      const updatedTables = tables.filter(table => table.id !== id);
      setTables(updatedTables);
      saveToStorage(updatedTables);
    }
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Unknown Restaurant';
  };

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         table.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getRestaurantName(table.restaurantId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRestaurant = selectedRestaurant === 'all' || table.restaurantId === parseInt(selectedRestaurant);
    
    return matchesSearch && matchesRestaurant;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'occupied': return 'status-occupied';
      case 'reserved': return 'status-reserved';
      case 'maintenance': return 'status-maintenance';
      default: return 'status-available';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'vip': return 'type-vip';
      case 'family': return 'type-family';
      case 'group': return 'type-group';
      default: return 'type-regular';
    }
  };

  return (
    <div className="table-management">
      <div className="management-header">
        <div className="header-actions">
          <div className="search-filters">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="restaurant-filter"
            >
              <option value="all">All Restaurants</option>
              {restaurants.map(restaurant => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            <FaPlus /> Add Table
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingId ? 'Edit Table' : 'Add New Table'}</h3>
              <button className="close-btn" onClick={resetForm}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="table-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Table Number *</label>
                  <input
                    type="text"
                    name="tableNumber"
                    value={formData.tableNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., T001"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Restaurant *</label>
                  <select
                    name="restaurantId"
                    value={formData.restaurantId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Restaurant</option>
                    {restaurants.map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Table Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="regular">Regular</option>
                    <option value="vip">VIP</option>
                    <option value="family">Family</option>
                    <option value="group">Group</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Main Hall, Terrace"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Special features or notes about this table"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <FaSave /> {editingId ? 'Update' : 'Save'} Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="tables-grid">
        <div className="grid-header">
          <h3>Tables ({filteredTables.length})</h3>
        </div>
        
        <div className="tables-container">
          {filteredTables.map(table => (
            <div key={table.id} className="table-card">
              <div className="table-header">
                <div className="table-number">
                  <FaTable className="table-icon" />
                  {table.tableNumber}
                </div>
                <div className="table-badges">
                  <span className={`status-badge ${getStatusBadgeClass(table.status)}`}>
                    {table.status}
                  </span>
                  <span className={`type-badge ${getTypeBadgeClass(table.type)}`}>
                    {table.type}
                  </span>
                </div>
              </div>

              <div className="table-info">
                <div className="info-row">
                  <strong>Restaurant:</strong>
                  <span>{getRestaurantName(table.restaurantId)}</span>
                </div>
                <div className="info-row">
                  <strong>Capacity:</strong>
                  <span>{table.capacity} people</span>
                </div>
                <div className="info-row">
                  <strong>Location:</strong>
                  <span>{table.location}</span>
                </div>
                {table.description && (
                  <div className="info-row">
                    <strong>Description:</strong>
                    <span>{table.description}</span>
                  </div>
                )}
              </div>

              <div className="table-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(table)}
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(table.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
