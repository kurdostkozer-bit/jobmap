import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
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
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove user from map
    this.userSockets.forEach((socketId, userId) => {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
      }
    });
  }

  @SubscribeMessage('register-user')
  handleUserRegister(
    @ConnectedSocket() client: Socket,
    data: { userId: string },
  ) {
    this.userSockets.set(data.userId, client.id);
    this.logger.log(`User registered: ${data.userId} -> ${client.id}`);
  }

  /**
   * Send notification to a specific user
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
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', {
        ...notification,
        timestamp: notification.timestamp || new Date(),
      });
      this.logger.log(`Notification sent to user: ${userId}`);
    } else {
      this.logger.warn(`User ${userId} is not connected`);
    }
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
   * Broadcast notification to all connected users
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
  }
}
