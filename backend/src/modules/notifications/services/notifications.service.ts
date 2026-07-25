import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationsGateway } from '../gateways/notifications.gateway';
import {
  NotificationEventTypes,
  INotificationPayload,
} from '../../../shared/events/index';

@Injectable()
export class NotificationsServiceImpl {
  private readonly logger = new Logger('NotificationsService');

  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Save notification to database and emit to user
   * Database-first approach: Save → Commit → Emit
   */
  async notifyUser(
    userId: string,
    notification: INotificationPayload,
  ): Promise<Notification> {
    try {
      // 1. Save to database first (most important step)
      const dbNotification = this.notificationsRepository.create({
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: false,
      });

      const savedNotification = await this.notificationsRepository.save(
        dbNotification,
      );
      this.logger.log(
        `✅ Notification saved to DB for user ${userId}: ${notification.type}`,
      );

      // 2. Emit to user via WebSocket (with ACK support)
      const notificationId = this.notificationsGateway.sendNotificationToUser(
        userId,
        {
          ...notification,
          timestamp: savedNotification.createdAt,
        },
      );

      this.logger.log(`📤 Notification emitted with ID: ${notificationId}`);

      return savedNotification;
    } catch (error) {
      this.logger.error(
        `❌ Failed to notify user ${userId}:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Notify multiple users
   */
  async notifyUsers(
    userIds: string[],
    notification: INotificationPayload,
  ): Promise<Notification[]> {
    const notifications = await Promise.all(
      userIds.map((userId) => this.notifyUser(userId, notification)),
    );
    return notifications;
  }

  /**
   * Broadcast to all users
   */
  async broadcastNotification(
    notification: INotificationPayload,
  ): Promise<void> {
    this.notificationsGateway.broadcastNotification(notification);
    this.logger.log(`📢 Broadcast notification: ${notification.type}`);
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(userId: string, limit = 20): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId },
    });

    if (notification) {
      notification.isRead = true;
      return this.notificationsRepository.save(notification);
    }

    return null;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await this.notificationsRepository.delete(notificationId);
  }
}
