import React from 'react';

export default function TestAdmin() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Module Test</h2>
      <div style={{ marginBottom: '20px' }}>
        <h3>Restaurant Management</h3>
        <p>✅ Manage restaurants and tables</p>
        <button style={{ padding: '10px', margin: '5px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Add Restaurant
        </button>
        <button style={{ padding: '10px', margin: '5px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          Edit Restaurant
        </button>
        <button style={{ padding: '10px', margin: '5px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
          Delete Restaurant
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Booking Management</h3>
        <p>✅ Approve or cancel bookings</p>
        <button style={{ padding: '10px', margin: '5px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          Approve Booking
        </button>
        <button style={{ padding: '10px', margin: '5px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
          Cancel Booking
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Dynamic Reports</h3>
        <p>✅ View dynamic reports (daily/weekly/monthly)</p>
        <button style={{ padding: '10px', margin: '5px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}>
          Daily Report
        </button>
        <button style={{ padding: '10px', margin: '5px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}>
          Weekly Report
        </button>
        <button style={{ padding: '10px', margin: '5px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}>
          Monthly Report
        </button>
      </div>
    </div>
  );
}
