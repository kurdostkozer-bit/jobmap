import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsController } from './notifications.controller';
import { NotificationsServiceImpl } from './services/notifications.service';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { WebSocketGuard } from './guards/websocket.guard';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsServiceImpl,
    NotificationsGateway,
    WebSocketGuard,
    {
      provide: 'NotificationsService',
      useClass: NotificationsServiceImpl,
    },
  ],
  exports: [NotificationsServiceImpl, NotificationsGateway, WebSocketGuard],
})
export class NotificationsModule {}
