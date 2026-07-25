import React, { useState, useEffect } from 'react';
import { useSocket } from '../../core/socket/useSocket';
import './NotificationCenter.css';

export const NotificationCenter = () => {
  const { subscribe } = useSocket(); // No userId parameter - gets from token
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = subscribe('notification', (notification) => {
      console.log('📬 New notification in UI:', notification);
      setNotifications((prev) => [notification, ...prev]);
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.timestamp !== notification.timestamp)
        );
      }, 5000);
    });

    return unsubscribe;
  }, [subscribe]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application.submitted':
        return '📝';
      case 'application.accepted':
        return '✅';
      case 'application.rejected':
        return '❌';
      default:
        return '🔔';
    }
  };

  return (
    <div className="notification-center">
      {/* Bell Icon */}
      <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
        🔔
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>الإشعارات</h3>
            <button
              className="close-btn"
              onClick={() => setShowNotifications(false)}
            >
              ✕
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="notification-empty">لا توجد إشعارات جديدة</div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`notification-item ${notification.type}`}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <small>
                      {new Date(notification.timestamp).toLocaleTimeString('ar-EG')}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toast Notifications (auto-appear for new notifications) */}
      <div className="notification-toasts">
        {notifications.slice(0, 3).map((notification, index) => (
          <div
            key={index}
            className={`notification-toast ${notification.type}`}
          >
            <span className="toast-icon">{getNotificationIcon(notification.type)}</span>
            <div className="toast-content">
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
