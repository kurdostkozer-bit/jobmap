import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  /**
   * Connect to WebSocket server
   */
  connect(serverUrl, userId) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');
      // Register user for targeted notifications
      if (userId) {
        this.socket.emit('register-user', { userId });
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });

    // Listen to notifications
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
