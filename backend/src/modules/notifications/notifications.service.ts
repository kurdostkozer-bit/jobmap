import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(notification: Partial<Notification>): Promise<Notification> {
    const newNotification = this.notificationsRepository.create(notification);
    return await this.notificationsRepository.save(newNotification);
  }

  async findByUserId(userId: string, unreadOnly: boolean = false) {
    const query = this.notificationsRepository.createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (unreadOnly) {
      query.andWhere('notification.isRead = false');
    }

    return await query.getMany();
  }

  async markAsRead(id: string): Promise<Notification | null> {
    await this.notificationsRepository.update(id, { isRead: true });
    return await this.notificationsRepository.findOne({ where: { id } });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async delete(id: string): Promise<void> {
    await this.notificationsRepository.delete(id);
  }
}
