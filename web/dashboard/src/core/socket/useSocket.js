import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import socketService from './socketService';

/**
 * Hook for using Socket.IO in React components
 * Connects with JWT token from Redux auth state (preferred over localStorage)
 * Falls back to localStorage if Redux state not available
 */
export const useSocket = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Get JWT token - preferring Redux state over localStorage
    const authToken = token || localStorage.getItem('auth_token');
    
    if (!authToken || !isAuthenticated) {
      console.warn('⚠️ No auth token or not authenticated, skipping WebSocket connection');
      return;
    }

    // Get API URL from environment
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    const socketUrl = apiUrl.replace('/api', ''); // Remove /api suffix

    console.log('🔌 Connecting to socket server:', socketUrl);
    socketService.connect(socketUrl, authToken);

    return () => {
      // Optional: disconnect on unmount
      // socketService.disconnect();
    };
  }, [isAuthenticated, token]);

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
