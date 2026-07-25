import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
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
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket notifications namespace');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    // Listen to notifications from server
    this.socket.on('notification', (notification) => {
      console.log('📬 Notification received:', notification);
      this._triggerListeners('notification', notification);
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 WebSocket disconnected');
    }
  }

  /**
   * Subscribe to notifications
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
   */
  _triggerListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => {
        callback(data);
      });
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
