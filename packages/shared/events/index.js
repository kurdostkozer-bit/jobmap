"use strict";
/**
 * Shared Events Package
 * Used by both Backend and Frontend
 * Ensures event names are consistent across the entire application
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketConfig = exports.WebSocketEvents = exports.NotificationEventTypes = void 0;
var NotificationEventTypes;
(function (NotificationEventTypes) {
    // Application events
    NotificationEventTypes["APPLICATION_SUBMITTED"] = "application.submitted";
    NotificationEventTypes["APPLICATION_ACCEPTED"] = "application.accepted";
    NotificationEventTypes["APPLICATION_REJECTED"] = "application.rejected";
    // User registration
    NotificationEventTypes["USER_REGISTERED"] = "user.registered";
    // Job events
    NotificationEventTypes["JOB_CREATED"] = "job.created";
    NotificationEventTypes["JOB_UPDATED"] = "job.updated";
    NotificationEventTypes["JOB_DELETED"] = "job.deleted";
    // System events
    NotificationEventTypes["SYSTEM_NOTIFICATION"] = "system.notification";
})(NotificationEventTypes || (exports.NotificationEventTypes = NotificationEventTypes = {}));
/**
 * WebSocket event names (for Socket.IO emit/on)
 */
exports.WebSocketEvents = {
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
exports.WebSocketConfig = {
    RECONNECTION: true,
    RECONNECTION_DELAY: 1000,
    RECONNECTION_DELAY_MAX: 5000,
    RECONNECTION_ATTEMPTS: 10,
    HEARTBEAT_INTERVAL: 25000, // 25 seconds (Socket.IO default is 25s)
};
