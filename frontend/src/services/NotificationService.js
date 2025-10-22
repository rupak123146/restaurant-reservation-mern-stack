/**
 * Notification Service for Restaurant Reservation System
 * Handles Email/SMS notifications for bookings, cancellations, and reminders
 */

class NotificationService {
  constructor() {
    this.apiEndpoints = {
      email: 'https://api.emailjs.com/api/v1.0/email/send', // EmailJS for demo
      sms: 'https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json' // Twilio for SMS
    };
    
    // In production, these would be environment variables
    this.config = {
      emailjs: {
        serviceId: 'YOUR_SERVICE_ID',
        templateIds: {
          booking_confirmation: 'template_booking_confirm',
          booking_cancellation: 'template_booking_cancel',
          booking_reminder: 'template_booking_reminder',
          admin_notification: 'template_admin_notify'
        },
        userId: 'YOUR_USER_ID'
      },
      twilio: {
        accountSid: 'YOUR_ACCOUNT_SID',
        authToken: 'YOUR_AUTH_TOKEN',
        fromNumber: '+1234567890'
      }
    };

    this.notificationQueue = [];
    this.scheduledNotifications = new Map();
    this.initializeScheduler();
  }

  /**
   * Initialize the notification scheduler
   */
  initializeScheduler() {
    // Check for scheduled notifications every minute
    setInterval(() => {
      this.processScheduledNotifications();
    }, 60000);
  }

  /**
   * Send booking confirmation notification
   */
  async sendBookingConfirmation(bookingData) {
    const { customerName, customerEmail, customerPhone, restaurant, date, time, guests, reservationId } = bookingData;
    
    try {
      // Email notification
      const emailData = {
        to_email: customerEmail,
        to_name: customerName,
        restaurant_name: restaurant.name,
        booking_date: this.formatDate(date),
        booking_time: time,
        guest_count: guests,
        reservation_id: reservationId,
        restaurant_address: restaurant.location,
        restaurant_phone: restaurant.phone || 'Contact restaurant directly'
      };

      await this.sendEmail('booking_confirmation', emailData);

      // SMS notification
      const smsMessage = `Hi ${customerName}! Your reservation at ${restaurant.name} is confirmed for ${this.formatDate(date)} at ${time} for ${guests} guests. Reservation ID: ${reservationId}. See you there!`;
      await this.sendSMS(customerPhone, smsMessage);

      // Schedule reminder notification (24 hours before)
      this.scheduleReminder(bookingData);

      // Log notification
      this.logNotification('booking_confirmation', bookingData, 'sent');

      return { success: true, message: 'Booking confirmation sent successfully' };
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      this.logNotification('booking_confirmation', bookingData, 'failed', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send booking cancellation notification
   */
  async sendBookingCancellation(bookingData, reason = 'Booking cancelled') {
    const { customerName, customerEmail, customerPhone, restaurant, date, time, reservationId } = bookingData;
    
    try {
      // Email notification
      const emailData = {
        to_email: customerEmail,
        to_name: customerName,
        restaurant_name: restaurant.name,
        booking_date: this.formatDate(date),
        booking_time: time,
        reservation_id: reservationId,
        cancellation_reason: reason,
        restaurant_phone: restaurant.phone || 'Contact restaurant directly'
      };

      await this.sendEmail('booking_cancellation', emailData);

      // SMS notification
      const smsMessage = `Hi ${customerName}, your reservation at ${restaurant.name} for ${this.formatDate(date)} at ${time} has been cancelled. Reservation ID: ${reservationId}. ${reason}`;
      await this.sendSMS(customerPhone, smsMessage);

      // Cancel any scheduled reminders
      this.cancelScheduledReminder(reservationId);

      // Log notification
      this.logNotification('booking_cancellation', bookingData, 'sent');

      return { success: true, message: 'Cancellation notification sent successfully' };
    } catch (error) {
      console.error('Error sending cancellation notification:', error);
      this.logNotification('booking_cancellation', bookingData, 'failed', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send booking reminder notification
   */
  async sendBookingReminder(bookingData) {
    const { customerName, customerEmail, customerPhone, restaurant, date, time, guests, reservationId } = bookingData;
    
    try {
      // Email notification
      const emailData = {
        to_email: customerEmail,
        to_name: customerName,
        restaurant_name: restaurant.name,
        booking_date: this.formatDate(date),
        booking_time: time,
        guest_count: guests,
        reservation_id: reservationId,
        restaurant_address: restaurant.location,
        restaurant_phone: restaurant.phone || 'Contact restaurant directly'
      };

      await this.sendEmail('booking_reminder', emailData);

      // SMS notification
      const smsMessage = `Reminder: Your reservation at ${restaurant.name} is tomorrow (${this.formatDate(date)}) at ${time} for ${guests} guests. Reservation ID: ${reservationId}. Looking forward to seeing you!`;
      await this.sendSMS(customerPhone, smsMessage);

      // Log notification
      this.logNotification('booking_reminder', bookingData, 'sent');

      return { success: true, message: 'Reminder notification sent successfully' };
    } catch (error) {
      console.error('Error sending reminder notification:', error);
      this.logNotification('booking_reminder', bookingData, 'failed', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send admin notification for new bookings
   */
  async sendAdminNotification(bookingData, type = 'new_booking') {
    const adminEmail = 'admin@restaurant.com'; // Configure admin email
    const { customerName, restaurant, date, time, guests, reservationId } = bookingData;
    
    try {
      const emailData = {
        to_email: adminEmail,
        to_name: 'Restaurant Admin',
        customer_name: customerName,
        restaurant_name: restaurant.name,
        booking_date: this.formatDate(date),
        booking_time: time,
        guest_count: guests,
        reservation_id: reservationId,
        notification_type: type
      };

      await this.sendEmail('admin_notification', emailData);

      // Log notification
      this.logNotification('admin_notification', bookingData, 'sent');

      return { success: true, message: 'Admin notification sent successfully' };
    } catch (error) {
      console.error('Error sending admin notification:', error);
      this.logNotification('admin_notification', bookingData, 'failed', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Schedule a reminder notification
   */
  scheduleReminder(bookingData) {
    const bookingDateTime = new Date(`${bookingData.date}T${this.convertTo24Hour(bookingData.time)}`);
    const reminderTime = new Date(bookingDateTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
    
    // Only schedule if reminder time is in the future
    if (reminderTime > new Date()) {
      this.scheduledNotifications.set(bookingData.reservationId, {
        type: 'reminder',
        scheduledTime: reminderTime,
        bookingData: bookingData
      });

      // Store in localStorage for persistence
      this.saveScheduledNotifications();
    }
  }

  /**
   * Cancel a scheduled reminder
   */
  cancelScheduledReminder(reservationId) {
    this.scheduledNotifications.delete(reservationId);
    this.saveScheduledNotifications();
  }

  /**
   * Process scheduled notifications
   */
  processScheduledNotifications() {
    const now = new Date();
    
    this.scheduledNotifications.forEach(async (notification, reservationId) => {
      if (notification.scheduledTime <= now) {
        if (notification.type === 'reminder') {
          await this.sendBookingReminder(notification.bookingData);
        }
        
        // Remove processed notification
        this.scheduledNotifications.delete(reservationId);
        this.saveScheduledNotifications();
      }
    });
  }

  /**
   * Send email using EmailJS (demo implementation)
   */
  async sendEmail(templateType, data) {
    // In a real application, you would use EmailJS or another email service
    // For demo purposes, we'll simulate the email sending
    
    console.log(`📧 Email sent - Type: ${templateType}`, data);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store email in localStorage for demo
    const emails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
    emails.push({
      id: Date.now(),
      type: templateType,
      data: data,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
    localStorage.setItem('sent_emails', JSON.stringify(emails));
    
    return { success: true };
  }

  /**
   * Send SMS using Twilio (demo implementation)
   */
  async sendSMS(phoneNumber, message) {
    // In a real application, you would use Twilio or another SMS service
    // For demo purposes, we'll simulate the SMS sending
    
    console.log(`📱 SMS sent to ${phoneNumber}: ${message}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Store SMS in localStorage for demo
    const sms = JSON.parse(localStorage.getItem('sent_sms') || '[]');
    sms.push({
      id: Date.now(),
      phoneNumber: phoneNumber,
      message: message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
    localStorage.setItem('sent_sms', JSON.stringify(sms));
    
    return { success: true };
  }

  /**
   * Log notification activity
   */
  logNotification(type, bookingData, status, error = null) {
    const logs = JSON.parse(localStorage.getItem('notification_logs') || '[]');
    logs.push({
      id: Date.now(),
      type: type,
      reservationId: bookingData.reservationId,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      status: status,
      error: error,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
    
    localStorage.setItem('notification_logs', JSON.stringify(logs));
  }

  /**
   * Save scheduled notifications to localStorage
   */
  saveScheduledNotifications() {
    const notifications = Array.from(this.scheduledNotifications.entries()).map(([id, data]) => ({
      id,
      ...data,
      scheduledTime: data.scheduledTime.toISOString()
    }));
    localStorage.setItem('scheduled_notifications', JSON.stringify(notifications));
  }

  /**
   * Load scheduled notifications from localStorage
   */
  loadScheduledNotifications() {
    try {
      const notifications = JSON.parse(localStorage.getItem('scheduled_notifications') || '[]');
      notifications.forEach(notification => {
        this.scheduledNotifications.set(notification.id, {
          ...notification,
          scheduledTime: new Date(notification.scheduledTime)
        });
      });
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    }
  }

  /**
   * Get notification history
   */
  getNotificationHistory() {
    return {
      emails: JSON.parse(localStorage.getItem('sent_emails') || '[]'),
      sms: JSON.parse(localStorage.getItem('sent_sms') || '[]'),
      logs: JSON.parse(localStorage.getItem('notification_logs') || '[]')
    };
  }

  /**
   * Utility function to format date
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Convert 12-hour time to 24-hour format
   */
  convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours}:${minutes}:00`;
  }

  /**
   * Test notification system
   */
  async testNotifications() {
    const testBooking = {
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      customerPhone: '+1234567890',
      restaurant: {
        name: 'Test Restaurant',
        location: '123 Test Street',
        phone: '+0987654321'
      },
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      time: '7:00 PM',
      guests: 2,
      reservationId: 'TEST-' + Date.now()
    };

    console.log('🧪 Testing notification system...');
    
    // Test booking confirmation
    await this.sendBookingConfirmation(testBooking);
    
    // Test admin notification
    await this.sendAdminNotification(testBooking);
    
    console.log('✅ Notification system test completed');
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// Load scheduled notifications on initialization
notificationService.loadScheduledNotifications();

export default notificationService;
