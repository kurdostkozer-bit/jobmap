/**
 * Shared Events Package
 * Used by both Backend and Frontend
 * Ensures event names are consistent across the entire application
 */

export const NotificationEventTypes = {
  // Application events
  APPLICATION_SUBMITTED: 'application.submitted',
  APPLICATION_ACCEPTED: 'application.accepted',
  APPLICATION_REJECTED: 'application.rejected',

  // User registration
  USER_REGISTERED: 'user.registered',

  // Job events
  JOB_CREATED: 'job.created',
  JOB_UPDATED: 'job.updated',
  JOB_DELETED: 'job.deleted',

  // System events
  SYSTEM_NOTIFICATION: 'system.notification',
};

/**
 * WebSocket event names (for Socket.IO emit/on)
 */
export const WebSocketEvents = {
  // Server → Client
  NOTIFICATION: 'notification',
  NOTIFICATION_RECEIVED: 'notification:received',
  NOTIFICATION_ACK: 'notification:ack',

  // Client → Server
  NOTIFICATION_ACK_SEND: 'notification:ack:send',
  PING: 'ping',
  PONG: 'pong',
};

/**
 * Shared config for reconnection
 */
export const WebSocketConfig = {
  RECONNECTION: true,
  RECONNECTION_DELAY: 1000,
  RECONNECTION_DELAY_MAX: 5000,
  RECONNECTION_ATTEMPTS: 10,
  HEARTBEAT_INTERVAL: 25000, // 25 seconds (Socket.IO default is 25s)
};
