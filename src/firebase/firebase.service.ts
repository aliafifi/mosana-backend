import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App | null = null;

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Check if Firebase is already initialized
      if (admin.apps.length > 0) {
        this.firebaseApp = admin.apps[0];
        this.logger.log('✅ Firebase already initialized');
        return;
      }

      // Get Firebase configuration from environment
      const firebaseConfig = this.configService.get<string>('FIREBASE_CONFIG');
      
      if (!firebaseConfig) {
        this.logger.warn('⚠️  Firebase not configured - push notifications disabled');
        return;
      }

      // Parse Firebase service account JSON
      const serviceAccount = JSON.parse(firebaseConfig);

      // Initialize Firebase Admin SDK
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      this.logger.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      this.logger.error('❌ Firebase initialization failed:', error.message);
      this.logger.warn('⚠️  Push notifications will be disabled');
    }
  }

  /**
   * Send push notification to a single device
   */
  async sendPushNotification(
    fcmToken: string,
    notification: {
      title: string;
      body: string;
      imageUrl?: string;
    },
    data?: { [key: string]: string },
  ): Promise<boolean> {
    try {
      if (!this.firebaseApp) {
        this.logger.warn('Firebase not initialized - skipping push notification');
        return false;
      }

      const message: admin.messaging.Message = {
        token: fcmToken,
        notification: {
          title: notification.title,
          body: notification.body,
          ...(notification.imageUrl && { imageUrl: notification.imageUrl }),
        },
        data: data || {},
        // Android-specific options
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          },
        },
        // iOS-specific options
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`✅ Push notification sent: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send push notification: ${error.message}`);
      
      // Handle invalid token error
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        this.logger.warn(`🗑️  Invalid FCM token: ${fcmToken.slice(0, 20)}...`);
        // TODO: Remove invalid token from user's device list
      }
      
      return false;
    }
  }

  /**
   * Send push notification to multiple devices
   */
  async sendMulticastPushNotification(
    fcmTokens: string[],
    notification: {
      title: string;
      body: string;
      imageUrl?: string;
    },
    data?: { [key: string]: string },
  ): Promise<{
    successCount: number;
    failureCount: number;
    invalidTokens: string[];
  }> {
    try {
      if (!this.firebaseApp || fcmTokens.length === 0) {
        return { successCount: 0, failureCount: 0, invalidTokens: [] };
      }

      const message: admin.messaging.MulticastMessage = {
        tokens: fcmTokens,
        notification: {
          title: notification.title,
          body: notification.body,
          ...(notification.imageUrl && { imageUrl: notification.imageUrl }),
        },
        data: data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      
      // Collect invalid tokens
      const invalidTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const error = resp.error;
          if (error?.code === 'messaging/invalid-registration-token' ||
              error?.code === 'messaging/registration-token-not-registered') {
            invalidTokens.push(fcmTokens[idx]);
          }
        }
      });

      this.logger.log(
        `📤 Multicast push sent: ${response.successCount} success, ${response.failureCount} failed`,
      );

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        invalidTokens,
      };
    } catch (error) {
      this.logger.error(`❌ Failed to send multicast push: ${error.message}`);
      return {
        successCount: 0,
        failureCount: fcmTokens.length,
        invalidTokens: [],
      };
    }
  }

  /**
   * Verify if Firebase is properly configured
   */
  isConfigured(): boolean {
    return this.firebaseApp !== undefined && this.firebaseApp !== null;
  }

  /**
   * Subscribe a device to a topic
   */
  async subscribeToTopic(fcmToken: string, topic: string): Promise<boolean> {
    try {
      if (!this.firebaseApp) {
        return false;
      }

      await admin.messaging().subscribeToTopic([fcmToken], topic);
      this.logger.log(`✅ Subscribed ${fcmToken.slice(0, 20)}... to topic: ${topic}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to subscribe to topic: ${error.message}`);
      return false;
    }
  }

  /**
   * Unsubscribe a device from a topic
   */
  async unsubscribeFromTopic(fcmToken: string, topic: string): Promise<boolean> {
    try {
      if (!this.firebaseApp) {
        return false;
      }

      await admin.messaging().unsubscribeFromTopic([fcmToken], topic);
      this.logger.log(`✅ Unsubscribed ${fcmToken.slice(0, 20)}... from topic: ${topic}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to unsubscribe from topic: ${error.message}`);
      return false;
    }
  }

  /**
   * Send notification to a topic
   */
  async sendTopicNotification(
    topic: string,
    notification: {
      title: string;
      body: string;
      imageUrl?: string;
    },
    data?: { [key: string]: string },
  ): Promise<boolean> {
    try {
      if (!this.firebaseApp) {
        return false;
      }

      const message: admin.messaging.Message = {
        topic,
        notification: {
          title: notification.title,
          body: notification.body,
          ...(notification.imageUrl && { imageUrl: notification.imageUrl }),
        },
        data: data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`✅ Topic notification sent: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send topic notification: ${error.message}`);
      return false;
    }
  }
}
