import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  UseGuards, 
  ParseIntPipe 
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantRoleGuard } from '../auth/guards/tenant-role.guard';
import { NotificationType, NotificationStatus, UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, TenantRoleGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  async create(@Body() createNotificationDto: CreateNotificationDto, @CurrentUser() user: any) {
    return this.notificationsService.create(user.organizationId, createNotificationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.COMPLIANCE_OFFICER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'List of notifications' })
  async findAll() {
    return this.notificationsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications by user' })
  @ApiResponse({ status: 200, description: 'Notifications found' })
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationsService.findByUser(userId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get notifications by type' })
  @ApiResponse({ status: 200, description: 'Notifications found' })
  async findByType(@Param('type') type: NotificationType) {
    return this.notificationsService.findByType(type);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get notifications by status' })
  @ApiResponse({ status: 200, description: 'Notifications found' })
  async findByStatus(@Param('status') status: NotificationStatus) {
    return this.notificationsService.findByStatus(status);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending notifications' })
  @ApiResponse({ status: 200, description: 'Pending notifications' })
  async getPendingNotifications() {
    return this.notificationsService.getPendingNotifications();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get notification statistics' })
  @ApiResponse({ status: 200, description: 'Notification statistics' })
  async getStatistics() {
    return this.notificationsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({ status: 200, description: 'Notification found' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.findById(id);
  }

  @Put(':id/sent')
  @ApiOperation({ summary: 'Mark notification as sent' })
  @ApiResponse({ status: 200, description: 'Notification marked as sent' })
  async markAsSent(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsSent(id);
  }

  @Put(':id/failed')
  @ApiOperation({ summary: 'Mark notification as failed' })
  @ApiResponse({ status: 200, description: 'Notification marked as failed' })
  async markAsFailed(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsFailed(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.delete(id);
  }
}
