import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsController } from './notifications.controller';
import { NotificationsServiceImpl } from './services/notifications.service';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsServiceImpl, NotificationsGateway],
  exports: [NotificationsServiceImpl, NotificationsGateway],
})
export class NotificationsModule {}
