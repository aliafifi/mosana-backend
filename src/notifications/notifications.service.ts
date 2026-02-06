import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';
import { NotificationPreferences, NotificationPreferencesDocument } from './schemas/notification-preferences.schema';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationPreferences.name)
    private preferencesModel: Model<NotificationPreferencesDocument>,
    @Inject(forwardRef(() => NotificationsGateway))
    private notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Create a new notification
   */
  async createNotification(data: {
    recipientWallet: string;
    actorWallet: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    actionUrl?: string;
    priority?: string;
    imageUrl?: string;
  }): Promise<NotificationDocument | null> {
    // Check if user has this notification type enabled
    const preferences = await this.getUserPreferences(data.recipientWallet);
    const typeKey = this.getPreferenceKey(data.type);
    
    if (!preferences[typeKey]) {
      console.log(`Notification blocked by user preferences: ${data.type}`);
      return null;
    }

    const notification = new this.notificationModel(data);
    await notification.save();

    // Send real-time notification via WebSocket
    try {
      this.notificationsGateway.sendNotificationToUser(data.recipientWallet, {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        actionUrl: notification.actionUrl,
        priority: notification.priority,
        createdAt: new Date(),
      });
    } catch (error) {
      console.log('WebSocket delivery failed (user offline):', error.message);
    }

    // TODO: Send push notification if enabled (Step 7)

    return notification;
  }

  /**
   * Get user's notifications (paginated)
   */
  async getNotifications(
    userWallet: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ notifications: NotificationDocument[]; total: number; unread: number }> {
    const skip = (page - 1) * limit;

    const [notifications, total, unread] = await Promise.all([
      this.notificationModel
        .find({ recipientWallet: userWallet })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.notificationModel.countDocuments({ recipientWallet: userWallet }),
      this.notificationModel.countDocuments({ recipientWallet: userWallet, read: false }),
    ]);

    return {
      notifications: notifications as NotificationDocument[],
      total,
      unread,
    };
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userWallet: string): Promise<number> {
    return this.notificationModel.countDocuments({
      recipientWallet: userWallet,
      read: false,
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userWallet: string): Promise<NotificationDocument | null> {
    return this.notificationModel.findOneAndUpdate(
      { _id: notificationId, recipientWallet: userWallet },
      { read: true, readAt: new Date() },
      { new: true },
    );
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userWallet: string): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      { recipientWallet: userWallet, read: false },
      { read: true, readAt: new Date() },
    );
    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userWallet: string): Promise<boolean> {
    const result = await this.notificationModel.deleteOne({
      _id: notificationId,
      recipientWallet: userWallet,
    });
    return result.deletedCount > 0;
  }

  /**
   * Get user preferences (create default if doesn't exist)
   */
  async getUserPreferences(userWallet: string): Promise<NotificationPreferencesDocument> {
    let preferences = await this.preferencesModel.findOne({ userWallet });
    
    if (!preferences) {
      preferences = new this.preferencesModel({ userWallet });
      await preferences.save();
    }
    
    return preferences;
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    userWallet: string,
    updates: Partial<NotificationPreferences>,
  ): Promise<NotificationPreferencesDocument> {
    return this.preferencesModel.findOneAndUpdate(
      { userWallet },
      updates,
      { new: true, upsert: true },
    );
  }

  /**
   * Helper: Map notification type to preference key
   */
  private getPreferenceKey(type: NotificationType): string {
    const map = {
      [NotificationType.POST_LIKED]: 'postLiked',
      [NotificationType.POST_COMMENTED]: 'postCommented',
      [NotificationType.TIP_RECEIVED]: 'tipReceived',
      [NotificationType.VENTURE_INVITATION]: 'ventureInvitation',
      [NotificationType.VENTURE_ACCEPTED]: 'ventureAccepted',
      [NotificationType.FOLLOW_NEW]: 'followNew',
      [NotificationType.MENTION]: 'mention',
      [NotificationType.REPUTATION_MILESTONE]: 'reputationMilestone',
      [NotificationType.DAO_PROPOSAL_CREATED]: 'daoProposalCreated',
      [NotificationType.DAO_PROPOSAL_PASSED]: 'daoProposalPassed',
    };
    return map[type] || 'postLiked';
  }
}
