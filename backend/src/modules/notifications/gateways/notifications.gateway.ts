import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('NotificationsGateway');

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract JWT from query params or headers
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`⚠️ Connection rejected: No token provided`);
        client.disconnect();
        return;
      }

      // Verify JWT
      const payload = this.jwtService.verify(token);
      const userId = payload.userId;

      // Join user-specific room
      client.join(`user:${userId}`);
      client.data.userId = userId;

      this.logger.log(`✅ User ${userId} connected: ${client.id}`);
    } catch (error) {
      this.logger.error(`❌ Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      this.logger.log(`User ${client.data.userId} disconnected: ${client.id}`);
    } else {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  }

  /**
   * Send notification to a specific user (via room)
   */
  sendNotificationToUser(
    userId: string,
    notification: {
      type: string;
      title: string;
      message: string;
      data?: any;
      timestamp?: Date;
    },
  ) {
    this.server.to(`user:${userId}`).emit('notification', {
      ...notification,
      timestamp: notification.timestamp || new Date(),
    });
    this.logger.log(`📬 Notification sent to user: ${userId}`);
  }

  /**
   * Send notification to multiple users
   */
  sendNotificationToUsers(
    userIds: string[],
    notification: {
      type: string;
      title: string;
      message: string;
      data?: any;
    },
  ) {
    userIds.forEach((userId) => {
      this.sendNotificationToUser(userId, notification);
    });
  }

  /**
   * Broadcast to all connected users
   */
  broadcastNotification(notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    this.server.emit('notification', {
      ...notification,
      timestamp: new Date(),
    });
    this.logger.log(`📢 Broadcast notification sent`);
  }
}
