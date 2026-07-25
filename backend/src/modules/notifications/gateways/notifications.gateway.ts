import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WebSocketGuard } from '../guards/websocket.guard';
import {
  NotificationEventTypes,
  WebSocketEvents,
  WebSocketConfig,
  INotificationAck,
} from '@shared/events/index';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  reconnection: WebSocketConfig.RECONNECTION,
  reconnectionDelay: WebSocketConfig.RECONNECTION_DELAY,
  reconnectionDelayMax: WebSocketConfig.RECONNECTION_DELAY_MAX,
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('NotificationsGateway');

  @UseGuards(WebSocketGuard)
  handleConnection(client: Socket) {
    const userId = client.data.userId;

    // Join user-specific room
    client.join(`user:${userId}`);

    this.logger.log(`✅ User ${userId} connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.logger.log(`❌ User ${userId} disconnected: ${client.id}`);
    }
  }

  /**
   * Listen for acknowledgment from client
   */
  @SubscribeMessage(WebSocketEvents.NOTIFICATION_ACK_SEND)
  handleNotificationAck(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: string },
  ) {
    this.logger.log(
      `✅ Notification ACK received from ${client.data.userId}: ${data.notificationId}`,
    );
    // You can store this in cache or DB if needed (e.g., mark as delivered)
  }

  /**
   * Emit heartbeat/ping to keep connection alive
   */
  @SubscribeMessage(WebSocketEvents.PING)
  handlePing(
    @ConnectedSocket() client: Socket,
  ) {
    client.emit(WebSocketEvents.PONG, { timestamp: new Date() });
  }

  /**
   * Send notification to a specific user (via room)
   * @param userId User to notify
   * @param notification Notification payload
   * @returns Notification ID for tracking
   */
  sendNotificationToUser(
    userId: string,
    notification: {
      type: NotificationEventTypes;
      title: string;
      message: string;
      data?: any;
      timestamp?: Date;
    },
  ): string {
    const notificationId = `${userId}-${Date.now()}`;

    this.server.to(`user:${userId}`).emit(WebSocketEvents.NOTIFICATION, {
      id: notificationId,
      ...notification,
      timestamp: notification.timestamp || new Date(),
    });

    this.logger.log(
      `📬 Notification sent to user: ${userId} (ID: ${notificationId})`,
    );

    return notificationId;
  }

  /**
   * Send notification to multiple users
   */
  sendNotificationToUsers(
    userIds: string[],
    notification: {
      type: NotificationEventTypes;
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
    type: NotificationEventTypes;
    title: string;
    message: string;
    data?: any;
  }) {
    this.server.emit(WebSocketEvents.NOTIFICATION, {
      id: `broadcast-${Date.now()}`,
      ...notification,
      timestamp: new Date(),
    });

    this.logger.log(`📢 Broadcast notification sent`);
  }
}
