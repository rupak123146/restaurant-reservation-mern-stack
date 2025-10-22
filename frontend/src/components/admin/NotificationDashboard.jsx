import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaSms, FaBell, FaHistory, FaPlay, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import notificationService from '../../services/NotificationService';
import './NotificationDashboard.css';

export default function NotificationDashboard() {
  const [notificationHistory, setNotificationHistory] = useState({
    emails: [],
    sms: [],
    logs: []
  });
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    loadNotificationData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadNotificationData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotificationData = () => {
    const history = notificationService.getNotificationHistory();
    setNotificationHistory(history);
    
    // Load scheduled notifications from localStorage
    const scheduled = JSON.parse(localStorage.getItem('scheduled_notifications') || '[]');
    setScheduledNotifications(scheduled);
  };

  const testNotificationSystem = async () => {
    try {
      await notificationService.testNotifications();
      alert('Test notifications sent successfully! Check the notification history.');
      loadNotificationData();
    } catch (error) {
      alert('Error testing notifications: ' + error.message);
    }
  };

  const getNotificationStats = () => {
    const totalEmails = notificationHistory.emails.length;
    const totalSMS = notificationHistory.sms.length;
    const totalLogs = notificationHistory.logs.length;
    const successfulNotifications = notificationHistory.logs.filter(log => log.status === 'sent').length;
    const failedNotifications = notificationHistory.logs.filter(log => log.status === 'failed').length;
    
    return {
      totalEmails,
      totalSMS,
      totalLogs,
      successfulNotifications,
      failedNotifications,
      successRate: totalLogs > 0 ? ((successfulNotifications / totalLogs) * 100).toFixed(1) : 0
    };
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getNotificationTypeIcon = (type) => {
    switch (type) {
      case 'booking_confirmation': return <FaCheck className="type-icon confirm" />;
      case 'booking_cancellation': return <FaTimes className="type-icon cancel" />;
      case 'booking_reminder': return <FaBell className="type-icon reminder" />;
      case 'admin_notification': return <FaEnvelope className="type-icon admin" />;
      default: return <FaBell className="type-icon default" />;
    }
  };

  const stats = getNotificationStats();

  const renderOverview = () => (
    <div className="notification-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <FaEnvelope className="stat-icon email" />
          <div className="stat-content">
            <div className="stat-number">{stats.totalEmails}</div>
            <div className="stat-label">Emails Sent</div>
          </div>
        </div>
        <div className="stat-card">
          <FaSms className="stat-icon sms" />
          <div className="stat-content">
            <div className="stat-number">{stats.totalSMS}</div>
            <div className="stat-label">SMS Sent</div>
          </div>
        </div>
        <div className="stat-card">
          <FaCheck className="stat-icon success" />
          <div className="stat-content">
            <div className="stat-number">{stats.successfulNotifications}</div>
            <div className="stat-label">Successful</div>
          </div>
        </div>
        <div className="stat-card">
          <FaTimes className="stat-icon failed" />
          <div className="stat-content">
            <div className="stat-number">{stats.failedNotifications}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
      </div>

      <div className="overview-actions">
        <button className="btn-test" onClick={testNotificationSystem}>
          <FaPlay /> Test Notification System
        </button>
      </div>

      <div className="success-rate">
        <h3>Success Rate: {stats.successRate}%</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${stats.successRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderEmailHistory = () => (
    <div className="email-history">
      <h3>Email History ({notificationHistory.emails.length})</h3>
      <div className="notification-list">
        {notificationHistory.emails.map(email => (
          <div key={email.id} className="notification-item">
            <div className="notification-header">
              {getNotificationTypeIcon(email.type)}
              <div className="notification-info">
                <h4>{email.type.replace('_', ' ').toUpperCase()}</h4>
                <p>To: {email.data.to_email}</p>
              </div>
              <div className="notification-time">
                {formatTimestamp(email.timestamp)}
              </div>
            </div>
            <div className="notification-details">
              <p><strong>Name:</strong> {email.data.to_name}</p>
              {email.data.restaurant_name && (
                <p><strong>Restaurant:</strong> {email.data.restaurant_name}</p>
              )}
              {email.data.reservation_id && (
                <p><strong>Reservation ID:</strong> {email.data.reservation_id}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSMSHistory = () => (
    <div className="sms-history">
      <h3>SMS History ({notificationHistory.sms.length})</h3>
      <div className="notification-list">
        {notificationHistory.sms.map(sms => (
          <div key={sms.id} className="notification-item">
            <div className="notification-header">
              <FaSms className="type-icon sms" />
              <div className="notification-info">
                <h4>SMS NOTIFICATION</h4>
                <p>To: {sms.phoneNumber}</p>
              </div>
              <div className="notification-time">
                {formatTimestamp(sms.timestamp)}
              </div>
            </div>
            <div className="notification-message">
              <p>{sms.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScheduledNotifications = () => (
    <div className="scheduled-notifications">
      <h3>Scheduled Notifications ({scheduledNotifications.length})</h3>
      <div className="notification-list">
        {scheduledNotifications.map(notification => (
          <div key={notification.id} className="notification-item scheduled">
            <div className="notification-header">
              <FaBell className="type-icon reminder" />
              <div className="notification-info">
                <h4>REMINDER NOTIFICATION</h4>
                <p>For: {notification.bookingData?.customerName}</p>
              </div>
              <div className="notification-time">
                Scheduled: {formatTimestamp(notification.scheduledTime)}
              </div>
            </div>
            <div className="notification-details">
              <p><strong>Restaurant:</strong> {notification.bookingData?.restaurant?.name}</p>
              <p><strong>Booking Date:</strong> {notification.bookingData?.date} at {notification.bookingData?.time}</p>
              <p><strong>Reservation ID:</strong> {notification.id}</p>
            </div>
          </div>
        ))}
        {scheduledNotifications.length === 0 && (
          <div className="no-notifications">
            <p>No scheduled notifications</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="notification-logs">
      <h3>Notification Logs ({notificationHistory.logs.length})</h3>
      <div className="notification-list">
        {notificationHistory.logs.map(log => (
          <div key={log.id} className={`notification-item log ${log.status}`}>
            <div className="notification-header">
              {log.status === 'sent' ? 
                <FaCheck className="type-icon success" /> : 
                <FaTimes className="type-icon failed" />
              }
              <div className="notification-info">
                <h4>{log.type.replace('_', ' ').toUpperCase()}</h4>
                <p>Reservation: {log.reservationId}</p>
              </div>
              <div className="notification-time">
                {formatTimestamp(log.timestamp)}
              </div>
            </div>
            <div className="notification-details">
              <p><strong>Email:</strong> {log.customerEmail}</p>
              <p><strong>Phone:</strong> {log.customerPhone}</p>
              <p><strong>Status:</strong> <span className={`status ${log.status}`}>{log.status}</span></p>
              {log.error && (
                <p><strong>Error:</strong> <span className="error">{log.error}</span></p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="notification-dashboard">
      <div className="dashboard-header">
        <h2>Notification Dashboard</h2>
        <p>Monitor and manage all notification activities</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaBell /> Overview
        </button>
        <button 
          className={`tab ${activeTab === 'emails' ? 'active' : ''}`}
          onClick={() => setActiveTab('emails')}
        >
          <FaEnvelope /> Emails
        </button>
        <button 
          className={`tab ${activeTab === 'sms' ? 'active' : ''}`}
          onClick={() => setActiveTab('sms')}
        >
          <FaSms /> SMS
        </button>
        <button 
          className={`tab ${activeTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduled')}
        >
          <FaBell /> Scheduled
        </button>
        <button 
          className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <FaHistory /> Logs
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'emails' && renderEmailHistory()}
        {activeTab === 'sms' && renderSMSHistory()}
        {activeTab === 'scheduled' && renderScheduledNotifications()}
        {activeTab === 'logs' && renderLogs()}
      </div>
    </div>
  );
}
