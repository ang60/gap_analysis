import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantRoleGuard } from '../auth/guards/tenant-role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateAutoRenewDto, UpgradePlanDto } from './dto/update-subscription.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard, TenantRoleGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get all subscriptions for organization' })
  @ApiResponse({ status: 200, description: 'Subscriptions retrieved successfully', type: [SubscriptionResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSubscriptions(@Request() req) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { organizationId: req.user.organizationId },
      include: {
        organization: {
          select: { name: true }
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return subscriptions;
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get subscription by ID' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Subscription retrieved successfully', type: SubscriptionResponseDto })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSubscriptionById(@Param('id') id: string, @Request() req) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { 
        id: parseInt(id),
        organizationId: req.user.organizationId 
      },
      include: {
        organization: {
          select: { name: true }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return subscription;
  }

  @Patch(':id/auto-renew')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Toggle auto-renewal for subscription' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Auto-renewal updated successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async toggleAutoRenew(@Param('id') id: string, @Body() body: UpdateAutoRenewDto, @Request() req) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { 
        id: parseInt(id),
        organizationId: req.user.organizationId 
      },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const updatedSubscription = await this.prisma.subscription.update({
      where: { id: parseInt(id) },
      data: { autoRenew: body.autoRenew },
    });

    return updatedSubscription;
  }

  @Patch(':id/upgrade')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Upgrade subscription plan' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Plan upgraded successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async upgradePlan(@Param('id') id: string, @Body() body: UpgradePlanDto, @Request() req) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { 
        id: parseInt(id),
        organizationId: req.user.organizationId 
      },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const updatedSubscription = await this.prisma.subscription.update({
      where: { id: parseInt(id) },
      data: { planType: body.planType },
    });

    return updatedSubscription;
  }

  @Patch(':id/cancel')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async cancelSubscription(@Param('id') id: string, @Request() req) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { 
        id: parseInt(id),
        organizationId: req.user.organizationId 
      },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const updatedSubscription = await this.prisma.subscription.update({
      where: { id: parseInt(id) },
      data: { 
        status: SubscriptionStatus.CANCELLED,
        autoRenew: false 
      },
    });

    return updatedSubscription;
  }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid subscription data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSubscription(@Body() body: CreateSubscriptionDto, @Request() req) {
    const subscription = await this.prisma.subscription.create({
      data: {
        planType: body.planType,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        autoRenew: true,
        organizationId: req.user.organizationId,
      },
    });

    return subscription;
  }
}
