import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationPreferencesDocument = NotificationPreferences & Document;

@Schema({ timestamps: true })
export class NotificationPreferences {
  @Prop({ required: true, unique: true, index: true })
  userWallet: string;

  // In-app notification preferences
  @Prop({ default: true })
  postLiked: boolean;

  @Prop({ default: true })
  postCommented: boolean;

  @Prop({ default: true })
  tipReceived: boolean;

  @Prop({ default: true })
  ventureInvitation: boolean;

  @Prop({ default: true })
  ventureAccepted: boolean;

  @Prop({ default: true })
  followNew: boolean;

  @Prop({ default: true })
  mention: boolean;

  @Prop({ default: true })
  reputationMilestone: boolean;

  @Prop({ default: true })
  daoProposalCreated: boolean;

  @Prop({ default: true })
  daoProposalPassed: boolean;

  // Push notification preferences
  @Prop({ default: true })
  pushEnabled: boolean;

  // Quiet hours (don't send push notifications during these hours)
  @Prop({ default: 22 }) // 10 PM
  quietHoursStart: number;

  @Prop({ default: 8 }) // 8 AM
  quietHoursEnd: number;

  @Prop({ default: 'UTC' })
  timezone: string;
}

export const NotificationPreferencesSchema = SchemaFactory.createForClass(NotificationPreferences);
