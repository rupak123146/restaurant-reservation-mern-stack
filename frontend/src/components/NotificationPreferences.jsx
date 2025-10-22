import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaSms, FaBell, FaSave, FaCheck } from 'react-icons/fa';
import './NotificationPreferences.css';

export default function NotificationPreferences({ onClose }) {
  const [preferences, setPreferences] = useState({
    email: {
      bookingConfirmation: true,
      bookingCancellation: true,
      bookingReminder: true,
      promotions: false
    },
    sms: {
      bookingConfirmation: true,
      bookingCancellation: true,
      bookingReminder: true,
      promotions: false
    },
    reminderTiming: 24, // hours before booking
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load existing preferences
    const savedPreferences = localStorage.getItem('notification_preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handlePreferenceChange = (category, type, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value
      }
    }));
  };

  const handleReminderTimingChange = (value) => {
    setPreferences(prev => ({
      ...prev,
      reminderTiming: parseInt(value)
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value
      }
    }));
  };

  const savePreferences = () => {
    localStorage.setItem('notification_preferences', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetToDefaults = () => {
    const defaultPreferences = {
      email: {
        bookingConfirmation: true,
        bookingCancellation: true,
        bookingReminder: true,
        promotions: false
      },
      sms: {
        bookingConfirmation: true,
        bookingCancellation: true,
        bookingReminder: true,
        promotions: false
      },
      reminderTiming: 24,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    };
    setPreferences(defaultPreferences);
  };

  return (
    <div className="notification-preferences-overlay">
      <div className="notification-preferences-container">
        <div className="preferences-header">
          <h2>Notification Preferences</h2>
          <p>Customize how and when you receive notifications</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="preferences-content">
          {/* Email Preferences */}
          <div className="preference-section">
            <div className="section-header">
              <FaEnvelope className="section-icon email" />
              <h3>Email Notifications</h3>
            </div>
            <div className="preference-options">
              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={preferences.email.bookingConfirmation}
                    onChange={(e) => handlePreferenceChange('email', 'bookingConfirmation', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Booking Confirmations
                </label>
                <p className="preference-description">Receive email when your booking is confirmed</p>
              </div>
              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={preferences.email.bookingCancellation}
                    onChange={(e) => handlePreferenceChange('email', 'bookingCancellation', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Booking Cancellations
                </label>
                <p className="preference-description">Receive email when your booking is cancelled</p>
              </div>
              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={preferences.email.bookingReminder}
                    onChange={(e) => handlePreferenceChange('email', 'bookingReminder', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Booking Reminders
                </label>
                <p className="preference-description">Receive email reminders before your booking</p>
              </div>
              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={preferences.email.promotions}
                    onChange={(e) => handlePreferenceChange('email', 'promotions', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Promotions & Offers
                </label>
                <p className="preference-description">Receive promotional emails and special offers</p>
              </div>
            </div>
          </div>

          {/* SMS Preferences */}
          <div className="preference-section">
            <div className="section-header">
              <FaSms className="section-icon sms" />
              <h3>SMS Notifications</h3>
            </div>
            <div className="preference-options">
              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={preferences.sms.bookingConfirmation}
                    onChange={(e) => handlePreferenceChange('sms', 'bookingConfirmation', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Booking Confirmations
                </label>
                <p className="preference-description">Receive SMS when your booking is confirmed</p>
              </div>
              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={preferences.sms.bookingCancellation}
                    onChange={(e) => handlePreferenceChange('sms', 'bookingCancellation', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Booking Cancellations
                </label>
                <p className="preference-description">Receive SMS when your booking is cancelled</p>
              </div>
              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={preferences.sms.bookingReminder}
                    onChange={(e) => handlePreferenceChange('sms', 'bookingReminder', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Booking Reminders
                </label>
                <p className="preference-description">Receive SMS reminders before your booking</p>
              </div>
              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={preferences.sms.promotions}
                    onChange={(e) => handlePreferenceChange('sms', 'promotions', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Promotions & Offers
                </label>
                <p className="preference-description">Receive promotional SMS and special offers</p>
              </div>
            </div>
          </div>

          {/* Reminder Timing */}
          <div className="preference-section">
            <div className="section-header">
              <FaBell className="section-icon reminder" />
              <h3>Reminder Settings</h3>
            </div>
            <div className="preference-options">
              <div className="preference-item">
                <label className="preference-label">
                  Reminder Timing
                </label>
                <select
                  value={preferences.reminderTiming}
                  onChange={(e) => handleReminderTimingChange(e.target.value)}
                  className="timing-select"
                >
                  <option value={1}>1 hour before</option>
                  <option value={2}>2 hours before</option>
                  <option value={4}>4 hours before</option>
                  <option value={12}>12 hours before</option>
                  <option value={24}>24 hours before</option>
                  <option value={48}>48 hours before</option>
                </select>
                <p className="preference-description">When to send booking reminders</p>
              </div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="preference-section">
            <div className="section-header">
              <FaBell className="section-icon quiet" />
              <h3>Quiet Hours</h3>
            </div>
            <div className="preference-options">
              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={preferences.quietHours.enabled}
                    onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Enable Quiet Hours
                </label>
                <p className="preference-description">Pause notifications during specified hours</p>
              </div>
              {preferences.quietHours.enabled && (
                <div className="quiet-hours-settings">
                  <div className="time-inputs">
                    <div className="time-input">
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={preferences.quietHours.start}
                        onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                      />
                    </div>
                    <div className="time-input">
                      <label>End Time</label>
                      <input
                        type="time"
                        value={preferences.quietHours.end}
                        onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="preferences-actions">
          <button className="btn-reset" onClick={resetToDefaults}>
            Reset to Defaults
          </button>
          <button className="btn-save" onClick={savePreferences}>
            {saved ? <FaCheck /> : <FaSave />}
            {saved ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
