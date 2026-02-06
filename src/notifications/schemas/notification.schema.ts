import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  POST_LIKED = 'post_liked',
  POST_COMMENTED = 'post_commented',
  TIP_RECEIVED = 'tip_received',
  VENTURE_INVITATION = 'venture_invitation',
  VENTURE_ACCEPTED = 'venture_accepted',
  FOLLOW_NEW = 'follow_new',
  MENTION = 'mention',
  REPUTATION_MILESTONE = 'reputation_milestone',
  DAO_PROPOSAL_CREATED = 'dao_proposal_created',
  DAO_PROPOSAL_PASSED = 'dao_proposal_passed',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, index: true })
  recipientWallet: string; // Who receives this notification

  @Prop({ required: true })
  actorWallet: string; // Who triggered this notification

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true })
  title: string; // "New tip received!"

  @Prop({ required: true })
  message: string; // "@alice tipped you 10 USDC"

  @Prop({ type: Object })
  data: {
    postId?: string;
    commentId?: string;
    tipAmount?: number;
    ventureId?: string;
    daoId?: string;
    proposalId?: string;
    reputationTier?: string; // Bronze, Silver, Gold, Platinum
    [key: string]: any; // Flexible for future data
  };

  @Prop({ default: false })
  read: boolean;

  @Prop()
  actionUrl: string; // Deep link: mosana://post/123, mosana://venture/456

  @Prop({ default: 'normal', enum: ['low', 'normal', 'high', 'urgent'] })
  priority: string;

  @Prop()
  imageUrl: string; // Actor's avatar or post image

  @Prop()
  readAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Indexes for performance
NotificationSchema.index({ recipientWallet: 1, createdAt: -1 });
NotificationSchema.index({ recipientWallet: 1, read: 1 });
NotificationSchema.index({ recipientWallet: 1, type: 1 });
