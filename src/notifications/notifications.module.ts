import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { NotificationPreferences, NotificationPreferencesSchema } from './schemas/notification-preferences.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationPreferences.name, schema: NotificationPreferencesSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService], // So other modules can trigger notifications
})
export class NotificationsModule {}
