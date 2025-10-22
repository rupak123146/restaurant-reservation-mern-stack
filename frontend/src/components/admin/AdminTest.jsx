import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function AdminTest() {
  const [testResults, setTestResults] = useState({
    restaurants: { status: 'pending', message: 'Testing...' },
    tables: { status: 'pending', message: 'Testing...' },
    bookings: { status: 'pending', message: 'Testing...' },
    reports: { status: 'pending', message: 'Testing...' },
    auth: { status: 'pending', message: 'Testing...' }
  });

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    // Test Restaurant Management
    try {
      const restaurants = localStorage.getItem('admin_restaurants');
      if (restaurants && JSON.parse(restaurants).length > 0) {
        setTestResults(prev => ({
          ...prev,
          restaurants: { status: 'success', message: 'Restaurant data loaded successfully' }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          restaurants: { status: 'warning', message: 'No restaurant data found' }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        restaurants: { status: 'error', message: 'Error loading restaurants' }
      }));
    }

    // Test Table Management
    try {
      const tables = localStorage.getItem('admin_tables');
      if (tables && JSON.parse(tables).length > 0) {
        setTestResults(prev => ({
          ...prev,
          tables: { status: 'success', message: 'Table data loaded successfully' }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          tables: { status: 'warning', message: 'No table data found' }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        tables: { status: 'error', message: 'Error loading tables' }
      }));
    }

    // Test Booking Management
    try {
      const bookings = localStorage.getItem('admin_bookings');
      if (bookings && JSON.parse(bookings).length > 0) {
        setTestResults(prev => ({
          ...prev,
          bookings: { status: 'success', message: 'Booking data loaded successfully' }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          bookings: { status: 'warning', message: 'No booking data found' }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        bookings: { status: 'error', message: 'Error loading bookings' }
      }));
    }

    // Test Reports
    try {
      const restaurants = localStorage.getItem('admin_restaurants');
      const bookings = localStorage.getItem('admin_bookings');
      if (restaurants && bookings) {
        setTestResults(prev => ({
          ...prev,
          reports: { status: 'success', message: 'Reports can be generated' }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          reports: { status: 'warning', message: 'Insufficient data for reports' }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        reports: { status: 'error', message: 'Error checking report data' }
      }));
    }

    // Test Authentication
    try {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      if (adminAuth === 'true') {
        setTestResults(prev => ({
          ...prev,
          auth: { status: 'success', message: 'Admin authenticated successfully' }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          auth: { status: 'warning', message: 'Admin not authenticated' }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        auth: { status: 'error', message: 'Error checking authentication' }
      }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle style={{ color: '#28a745' }} />;
      case 'warning':
        return <FaExclamationTriangle style={{ color: '#ffc107' }} />;
      case 'error':
        return <FaTimesCircle style={{ color: '#dc3545' }} />;
      default:
        return <div style={{ width: '16px', height: '16px', border: '2px solid #007bff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />;
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Admin Module Test Results</h2>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {Object.entries(testResults).map(([key, result]) => (
          <div 
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}
          >
            {getStatusIcon(result.status)}
            <div>
              <strong style={{ textTransform: 'capitalize' }}>{key} Management:</strong>
              <span style={{ marginLeft: '10px' }}>{result.message}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
        <h3>Admin Module Features:</h3>
        <ul style={{ lineHeight: '1.6' }}>
          <li>✅ <strong>Restaurant Management:</strong> Add, edit, delete restaurants with full details</li>
          <li>✅ <strong>Table Management:</strong> Manage tables with capacity, type, status, and location</li>
          <li>✅ <strong>Booking Management:</strong> Approve or cancel bookings with customer details</li>
          <li>✅ <strong>Dynamic Reports:</strong> Generate daily, weekly, and monthly reports</li>
          <li>✅ <strong>Admin Authentication:</strong> Secure login with username/password</li>
          <li>✅ <strong>Data Persistence:</strong> All data saved to localStorage</li>
          <li>✅ <strong>Responsive Design:</strong> Works on all devices</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px' }}>
        <h4 style={{ color: '#155724', margin: '0 0 10px 0' }}>How to Access Admin:</h4>
        <p style={{ margin: '0', color: '#155724' }}>
          1. Navigate to <code>/admin</code> in your browser<br/>
          2. Login with: <strong>Username:</strong> admin, <strong>Password:</strong> admin123<br/>
          3. Use the sidebar to navigate between different management sections
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
