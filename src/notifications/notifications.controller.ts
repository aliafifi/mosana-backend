import { Controller, Get, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /api/notifications
   * List user's notifications with pagination
   */
  @Get()
  async getNotifications(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const result = await this.notificationsService.getNotifications(
      req.user.walletAddress,
      Number(page),
      Number(limit),
    );

    return {
      success: true,
      page: Number(page),
      limit: Number(limit),
      ...result,
    };
  }

  /**
   * GET /api/notifications/unread
   * Get unread notification count
   */
  @Get('unread')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.walletAddress);
    return {
      success: true,
      count,
    };
  }

  /**
   * PUT /api/notifications/:id/read
   * Mark a notification as read
   */
  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    const notification = await this.notificationsService.markAsRead(id, req.user.walletAddress);
    
    if (!notification) {
      return {
        success: false,
        message: 'Notification not found',
      };
    }

    return {
      success: true,
      message: 'Notification marked as read',
      data: notification,
    };
  }

  /**
   * PUT /api/notifications/read-all
   * Mark all notifications as read
   */
  @Put('read-all')
  async markAllAsRead(@Request() req) {
    const result = await this.notificationsService.markAllAsRead(req.user.walletAddress);
    return {
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      count: result.modifiedCount,
    };
  }

  /**
   * DELETE /api/notifications/:id
   * Delete a notification
   */
  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Request() req) {
    const deleted = await this.notificationsService.deleteNotification(id, req.user.walletAddress);
    
    if (!deleted) {
      return {
        success: false,
        message: 'Notification not found',
      };
    }

    return {
      success: true,
      message: 'Notification deleted',
    };
  }

  /**
   * GET /api/notifications/preferences
   * Get user's notification preferences
   */
  @Get('preferences')
  async getPreferences(@Request() req) {
    const preferences = await this.notificationsService.getUserPreferences(req.user.walletAddress);
    return {
      success: true,
      data: preferences,
    };
  }

  /**
   * PUT /api/notifications/preferences
   * Update user's notification preferences
   */
  @Put('preferences')
  async updatePreferences(@Request() req, @Body() updates: any) {
    const preferences = await this.notificationsService.updatePreferences(
      req.user.walletAddress,
      updates,
    );
    return {
      success: true,
      message: 'Preferences updated',
      data: preferences,
    };
  }
}
