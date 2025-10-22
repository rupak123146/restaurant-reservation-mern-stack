import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChartLine, FaDownload, FaUtensils, FaUsers, FaDollarSign } from 'react-icons/fa';
import './ReportsManagement.css';

export default function ReportsManagement() {
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    try {
      // Load data
      const savedRestaurants = localStorage.getItem('admin_restaurants');
      const savedBookings = localStorage.getItem('admin_bookings');
      
      if (savedRestaurants) {
        setRestaurants(JSON.parse(savedRestaurants));
      }
      
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      }
    } catch (error) {
      console.error('Error loading reports data:', error);
      setRestaurants([]);
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    generateReport();
  }, [reportType, selectedDate, restaurants, bookings]);

  const generateReport = () => {
    try {
      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      
      let filteredBookings = [];
      let dateRange = '';

      if (reportType === 'daily') {
        filteredBookings = bookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate.toDateString() === selectedDateObj.toDateString();
        });
        dateRange = selectedDateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } else if (reportType === 'weekly') {
        const startOfWeek = new Date(selectedDateObj);
        startOfWeek.setDate(selectedDateObj.getDate() - selectedDateObj.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      filteredBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
      });
      
      dateRange = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    } else if (reportType === 'monthly') {
      filteredBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate.getMonth() === selectedDateObj.getMonth() && 
               bookingDate.getFullYear() === selectedDateObj.getFullYear();
      });
      
      dateRange = selectedDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    }

    // Calculate metrics
    const totalBookings = filteredBookings.length;
    const approvedBookings = filteredBookings.filter(b => b.status === 'approved').length;
    const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length;
    const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled').length;
    const totalGuests = filteredBookings.reduce((sum, booking) => sum + booking.guests, 0);
    
    // Revenue calculation (assuming average price per guest)
    const avgPricePerGuest = 500; // ₹500 average per guest
    const estimatedRevenue = approvedBookings * avgPricePerGuest;

    // Restaurant-wise breakdown
    const restaurantStats = restaurants.map(restaurant => {
      const restaurantBookings = filteredBookings.filter(b => b.restaurantId === restaurant.id);
      return {
        name: restaurant.name,
        bookings: restaurantBookings.length,
        approved: restaurantBookings.filter(b => b.status === 'approved').length,
        guests: restaurantBookings.reduce((sum, booking) => sum + booking.guests, 0),
        revenue: restaurantBookings.filter(b => b.status === 'approved').length * avgPricePerGuest
      };
    }).filter(stat => stat.bookings > 0);

    // Daily breakdown for weekly/monthly reports
    const dailyBreakdown = [];
    if (reportType === 'weekly') {
      for (let i = 0; i < 7; i++) {
        const date = new Date(selectedDateObj);
        date.setDate(selectedDateObj.getDate() - selectedDateObj.getDay() + i);
        const dayBookings = filteredBookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate.toDateString() === date.toDateString();
        });
        dailyBreakdown.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          bookings: dayBookings.length,
          guests: dayBookings.reduce((sum, booking) => sum + booking.guests, 0)
        });
      }
    } else if (reportType === 'monthly') {
      const daysInMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth() + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), day);
        const dayBookings = filteredBookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate.toDateString() === date.toDateString();
        });
        if (dayBookings.length > 0) {
          dailyBreakdown.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            bookings: dayBookings.length,
            guests: dayBookings.reduce((sum, booking) => sum + booking.guests, 0)
          });
        }
      }
    }

    setReportData({
      dateRange,
      totalBookings,
      approvedBookings,
      pendingBookings,
      cancelledBookings,
      totalGuests,
      estimatedRevenue,
      restaurantStats,
      dailyBreakdown,
      approvalRate: totalBookings > 0 ? ((approvedBookings / totalBookings) * 100).toFixed(1) : 0
    });
    } catch (error) {
      console.error('Error generating report:', error);
      setReportData(null);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;

    const reportContent = `
RESTAURANT BOOKING REPORT
${reportType.toUpperCase()} REPORT
Period: ${reportData.dateRange}
Generated on: ${new Date().toLocaleString()}

SUMMARY
=======
Total Bookings: ${reportData.totalBookings}
Approved Bookings: ${reportData.approvedBookings}
Pending Bookings: ${reportData.pendingBookings}
Cancelled Bookings: ${reportData.cancelledBookings}
Total Guests: ${reportData.totalGuests}
Estimated Revenue: ₹${reportData.estimatedRevenue.toLocaleString()}
Approval Rate: ${reportData.approvalRate}%

RESTAURANT BREAKDOWN
===================
${reportData.restaurantStats.map(stat => 
  `${stat.name}: ${stat.bookings} bookings, ${stat.guests} guests, ₹${stat.revenue.toLocaleString()} revenue`
).join('\n')}

${reportData.dailyBreakdown.length > 0 ? `
DAILY BREAKDOWN
===============
${reportData.dailyBreakdown.map(day => 
  `${day.date}: ${day.bookings} bookings, ${day.guests} guests`
).join('\n')}
` : ''}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report-${selectedDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-management">
      <div className="report-controls">
        <div className="control-group">
          <label>Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="report-select"
          >
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
          </select>
        </div>

        <div className="control-group">
          <label>Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>

        <button className="btn-download" onClick={downloadReport}>
          <FaDownload /> Download Report
        </button>
      </div>

      {reportData && (
        <div className="report-content">
          <div className="report-header">
            <h2>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
            <p className="report-period">{reportData.dateRange}</p>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <FaCalendarAlt />
              </div>
              <div className="metric-content">
                <div className="metric-number">{reportData.totalBookings}</div>
                <div className="metric-label">Total Bookings</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon approved">
                <FaUsers />
              </div>
              <div className="metric-content">
                <div className="metric-number">{reportData.approvedBookings}</div>
                <div className="metric-label">Approved</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <FaUsers />
              </div>
              <div className="metric-content">
                <div className="metric-number">{reportData.totalGuests}</div>
                <div className="metric-label">Total Guests</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon revenue">
                <FaDollarSign />
              </div>
              <div className="metric-content">
                <div className="metric-number">₹{reportData.estimatedRevenue.toLocaleString()}</div>
                <div className="metric-label">Est. Revenue</div>
              </div>
            </div>
          </div>

          <div className="report-sections">
            <div className="section">
              <h3>Booking Status Breakdown</h3>
              <div className="status-breakdown">
                <div className="status-item approved">
                  <span className="status-label">Approved</span>
                  <span className="status-value">{reportData.approvedBookings}</span>
                  <span className="status-percentage">
                    {reportData.totalBookings > 0 ? ((reportData.approvedBookings / reportData.totalBookings) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="status-item pending">
                  <span className="status-label">Pending</span>
                  <span className="status-value">{reportData.pendingBookings}</span>
                  <span className="status-percentage">
                    {reportData.totalBookings > 0 ? ((reportData.pendingBookings / reportData.totalBookings) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="status-item cancelled">
                  <span className="status-label">Cancelled</span>
                  <span className="status-value">{reportData.cancelledBookings}</span>
                  <span className="status-percentage">
                    {reportData.totalBookings > 0 ? ((reportData.cancelledBookings / reportData.totalBookings) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {reportData.restaurantStats.length > 0 && (
              <div className="section">
                <h3>Restaurant Performance</h3>
                <div className="restaurant-stats">
                  {reportData.restaurantStats.map((stat, index) => (
                    <div key={index} className="restaurant-stat-card">
                      <div className="restaurant-name">{stat.name}</div>
                      <div className="restaurant-metrics">
                        <div className="restaurant-metric">
                          <span className="metric-label">Bookings</span>
                          <span className="metric-value">{stat.bookings}</span>
                        </div>
                        <div className="restaurant-metric">
                          <span className="metric-label">Guests</span>
                          <span className="metric-value">{stat.guests}</span>
                        </div>
                        <div className="restaurant-metric">
                          <span className="metric-label">Revenue</span>
                          <span className="metric-value">₹{stat.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportData.dailyBreakdown.length > 0 && (
              <div className="section">
                <h3>Daily Breakdown</h3>
                <div className="daily-breakdown">
                  {reportData.dailyBreakdown.map((day, index) => (
                    <div key={index} className="day-stat">
                      <div className="day-date">{day.date}</div>
                      <div className="day-metrics">
                        <span>{day.bookings} bookings</span>
                        <span>{day.guests} guests</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
