import React, { useState, useEffect } from 'react';
import { useSocket } from '../../core/socket/useSocket';
import { NotificationEventTypes } from '../../shared/events/index';
import './NotificationCenter.css';

export const NotificationCenter = () => {
  const { subscribe } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  void setShowNotifications;

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribeNotification = subscribe('notification', (notification) => {
      console.log('📬 New notification in UI:', notification);
      setNotifications((prev) => [notification, ...prev]);
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 5000);
    });

    // Subscribe to connection events
    const unsubscribeConnect = subscribe('connect', () => {
      console.log('✅ Socket connected');
      setIsSocketConnected(true);
    });

    const unsubscribeDisconnect = subscribe('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsSocketConnected(false);
    });

    const unsubscribeReconnect = subscribe('reconnect', () => {
      console.log('✅ Socket reconnected');
      setIsSocketConnected(true);
    });

    return () => {
      unsubscribeNotification();
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeReconnect();
    };
  }, [subscribe]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case NotificationEventTypes.APPLICATION_SUBMITTED:
        return '📝';
      case NotificationEventTypes.APPLICATION_ACCEPTED:
        return '✅';
      case NotificationEventTypes.APPLICATION_REJECTED:
        return '❌';
      default:
        return '🔔';
    }
  };

  const getConnectionStatus = () => {
    if (isSocketConnected) {
      return '🟢 متصل';
    }
    return '🔴 غير متصل';
  };

  return (
    <div className="notification-center">
      {/* Bell Icon with Connection Status */}
      <div 
        className="notification-bell" 
        onClick={() => setShowNotifications(!showNotifications)}
        title={getConnectionStatus()}
      >
        🔔
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
        <span className="connection-indicator" style={{
          display: isSocketConnected ? 'inline-block' : 'none',
          width: '8px',
          height: '8px',
          backgroundColor: '#4CAF50',
          borderRadius: '50%',
          position: 'absolute',
          top: '0',
          right: '0',
        }}></span>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>الإشعارات</h3>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {getConnectionStatus()}
            </div>
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
              {notifications.map((notification) => (
                <div
                  key={notification.id}
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
        {notifications.slice(0, 3).map((notification) => (
          <div
            key={notification.id}
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
