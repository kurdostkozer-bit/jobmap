import { useEffect, useCallback } from 'react';
import socketService from './socketService';

/**
 * Hook for using Socket.IO in React components
 * Connects with JWT token from localStorage
 */
export const useSocket = () => {
  useEffect(() => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      console.warn('⚠️ No auth token found, skipping WebSocket connection');
      return;
    }

    // Get API URL from environment
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    const socketUrl = apiUrl.replace('/api', ''); // Remove /api suffix

    console.log('🔌 Connecting to socket server:', socketUrl);
    socketService.connect(socketUrl, token);

    return () => {
      // Optional: disconnect on unmount
      // socketService.disconnect();
    };
  }, []);

  const subscribe = useCallback((event, callback) => {
    return socketService.subscribe(event, callback);
  }, []);

  const isConnected = useCallback(() => {
    return socketService.isConnected();
  }, []);

  return {
    subscribe,
    isConnected,
    socketService,
  };
};
