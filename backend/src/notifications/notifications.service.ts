import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification, NotificationStatus, NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: number, data: CreateNotificationDto): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        ...data,
        organizationId,
      },
      include: {
        user: true,
      },
    });
  }

  async findAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByType(type: NotificationType): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { type },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByStatus(status: NotificationStatus): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { status },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPendingNotifications(): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { status: NotificationStatus.PENDING },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async markAsSent(id: number): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.SENT,
        sentAt: new Date(),
      },
      include: {
        user: true,
      },
    });
  }

  async markAsFailed(id: number): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.FAILED,
      },
      include: {
        user: true,
      },
    });
  }

  async getStatistics() {
    const total = await this.prisma.notification.count();
    const pending = await this.prisma.notification.count({
      where: { status: NotificationStatus.PENDING },
    });
    const sent = await this.prisma.notification.count({
      where: { status: NotificationStatus.SENT },
    });
    const failed = await this.prisma.notification.count({
      where: { status: NotificationStatus.FAILED },
    });

    return {
      total,
      pending,
      sent,
      failed,
      successRate: total > 0 ? Math.round((sent / total) * 100) : 0,
    };
  }

  async delete(id: number): Promise<Notification> {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
