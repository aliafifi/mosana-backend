import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure properly for production
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Store user wallet -> socket ID mapping
  private userSockets = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from query or auth header
      const token = client.handshake.auth.token || client.handshake.query.token;

      if (!token) {
        console.log('WebSocket: No token provided');
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      const walletAddress = payload.walletAddress;

      // Verify user exists and is active
      const user = await this.userModel.findOne({
        walletAddress,
        isActive: true,
      });

      if (!user) {
        console.log(`WebSocket: User not found: ${walletAddress}`);
        client.disconnect();
        return;
      }

      // Store socket connection
      this.userSockets.set(walletAddress, client.id);
      client.data.walletAddress = walletAddress;

      console.log(`WebSocket connected: ${walletAddress} (${client.id})`);

      // Join user-specific room
      client.join(`user:${walletAddress}`);

      // Send connection confirmation
      client.emit('connected', {
        message: 'Connected to notifications',
        walletAddress,
      });
    } catch (error) {
      console.log('WebSocket auth failed:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const walletAddress = client.data.walletAddress;
    if (walletAddress) {
      this.userSockets.delete(walletAddress);
      console.log(`WebSocket disconnected: ${walletAddress}`);
    }
  }

  /**
   * Send notification to specific user in real-time
   */
  sendNotificationToUser(walletAddress: string, notification: any) {
    this.server.to(`user:${walletAddress}`).emit('notification', notification);
    console.log(`Notification sent via WebSocket to ${walletAddress}`);
  }

  /**
   * Broadcast notification to all connected users
   */
  broadcastNotification(notification: any) {
    this.server.emit('notification', notification);
  }

  /**
   * Handle client subscribing to notifications (optional)
   */
  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, data: any) {
    const walletAddress = client.data.walletAddress;
    console.log(`User ${walletAddress} subscribed to notifications`);
    return { event: 'subscribed', data: { success: true } };
  }

  /**
   * Handle ping for connection health check
   */
  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    return { event: 'pong', data: { timestamp: Date.now() } };
  }
}
