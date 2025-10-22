import React, { useState, useEffect } from 'react';
import { restaurants, cuisines, locations, priceRanges } from '../data/restaurants';
import RestaurantCard from './RestaurantCard';
import './RestaurantSearch.css';

export default function RestaurantSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);

  // Helper: parse a price range string like "₹100-300" or "₹1000+" into numeric min/max
  const parsePriceRange = (rangeStr) => {
    if (!rangeStr || rangeStr === 'All') return { min: -Infinity, max: Infinity };
    const cleaned = rangeStr.replace(/[^0-9+\-]/g, '');
    if (cleaned.endsWith('+')) {
      const min = parseInt(cleaned.replace('+', ''), 10);
      return { min: isNaN(min) ? -Infinity : min, max: Infinity };
    }
    const [minStr, maxStr] = cleaned.split('-');
    const min = parseInt(minStr, 10);
    const max = parseInt(maxStr, 10);
    return {
      min: isNaN(min) ? -Infinity : min,
      max: isNaN(max) ? Infinity : max,
    };
  };

  // Helper: check if two ranges overlap
  const rangesOverlap = (a, b) => !(a.max < b.min || b.max < a.min);

  useEffect(() => {
    let filtered = restaurants;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by cuisine
    if (selectedCuisine !== 'All') {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }

    // Filter by location
    if (selectedLocation !== 'All') {
      filtered = filtered.filter(restaurant => restaurant.location === selectedLocation);
    }

    // Filter by price range
    if (selectedPriceRange !== 'All') {
      const desired = parsePriceRange(selectedPriceRange);
      filtered = filtered.filter(restaurant => {
        const rRange = parsePriceRange(restaurant.priceRange);
        return rangesOverlap(desired, rRange);
      });
    }

    setFilteredRestaurants(filtered);
  }, [searchTerm, selectedCuisine, selectedLocation, selectedPriceRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCuisine('All');
    setSelectedLocation('All');
    setSelectedPriceRange('All');
  };

  return (
    <div className="restaurant-search">
      <div className="search-header">
        <h2>Find Your Perfect Restaurant</h2>
        <p>Discover amazing dining experiences near you</p>
      </div>

      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search restaurants or cuisines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Cuisine:</label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
            >
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Location:</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range:</label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
            >
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      </div>

      <div className="results-info">
        <p>Found {filteredRestaurants.length} restaurant(s)</p>
      </div>

      <div className="restaurants-grid">
        {filteredRestaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="no-results">
          <p>No restaurants found matching your criteria.</p>
          <button onClick={clearFilters}>Clear all filters</button>
        </div>
      )}
    </div>
  );
}
