import io from 'socket.io-client';
import {
  WebSocketEvents,
  WebSocketConfig,
} from '../../shared/events/index';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
    this.pendingAcks = new Map(); // Track pending ACKs
  }

  /**
   * Connect to WebSocket server with JWT auth
   * @param {string} serverUrl - Backend URL (e.g., https://jobmap-backend-57v5.onrender.com)
   * @param {string} token - JWT token from localStorage
   */
  connect(serverUrl, token) {
    if (this.socket?.connected) {
      console.log('🔌 Socket already connected');
      return;
    }

    if (!token) {
      console.error('❌ No JWT token provided for WebSocket connection');
      return;
    }

    // Connect to /notifications namespace with JWT auth
    this.socket = io(`${serverUrl}/notifications`, {
      auth: {
        token: token,
      },
      // Reconnection config from shared package
      reconnection: WebSocketConfig.RECONNECTION,
      reconnectionDelay: WebSocketConfig.RECONNECTION_DELAY,
      reconnectionDelayMax: WebSocketConfig.RECONNECTION_DELAY_MAX,
      reconnectionAttempts: WebSocketConfig.RECONNECTION_ATTEMPTS,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket notifications namespace');
      this._triggerListeners('connect', { timestamp: new Date() });
      // Start heartbeat
      this._startHeartbeat();
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket');
      this._triggerListeners('disconnect', { timestamp: new Date() });
      this._stopHeartbeat();
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this._triggerListeners('error', { error });
    });

    this.socket.on('reconnect_attempt', () => {
      console.log('🔄 Attempting to reconnect...');
      this._triggerListeners('reconnect_attempt', { timestamp: new Date() });
    });

    this.socket.on('reconnect', () => {
      console.log('✅ Reconnected successfully');
      this._triggerListeners('reconnect', { timestamp: new Date() });
    });

    // Listen to notifications from server
    this.socket.on(WebSocketEvents.NOTIFICATION, (notification) => {
      console.log('📬 Notification received:', notification);
      
      // Send ACK back to server
      this._sendAck(notification.id);
      
      // Trigger listeners
      this._triggerListeners('notification', notification);
    });

    // Listen to PONG responses
    this.socket.on(WebSocketEvents.PONG, (data) => {
      console.log('💓 Heartbeat pong:', data.timestamp);
    });
  }

  /**
   * Send ACK to server for received notification
   * @private
   */
  _sendAck(notificationId) {
    if (!this.socket || !this.socket.connected) {
      console.warn('⚠️ Cannot send ACK: Socket not connected');
      return;
    }

    this.socket.emit(WebSocketEvents.NOTIFICATION_ACK_SEND, {
      notificationId: notificationId,
      timestamp: new Date(),
    });

    console.log(`✅ ACK sent for notification: ${notificationId}`);
  }

  /**
   * Start heartbeat (PING/PONG)
   * @private
   */
  _startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit(WebSocketEvents.PING, { timestamp: new Date() });
      }
    }, WebSocketConfig.HEARTBEAT_INTERVAL);

    console.log('💓 Heartbeat started');
  }

  /**
   * Stop heartbeat
   * @private
   */
  _stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      console.log('💓 Heartbeat stopped');
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    this._stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 WebSocket disconnected');
    }
  }

  /**
   * Subscribe to notifications or connection events
   */
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    };
  }

  /**
   * Trigger all listeners for an event
   * @private
   */
  _triggerListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for event ${event}:`, error);
        }
      });
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Get socket instance (for advanced usage)
   */
  getSocket() {
    return this.socket;
  }
}

const socketService = new SocketService();
export { socketService };
export default socketService;
