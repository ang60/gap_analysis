import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrganizationDto): Promise<Organization> {
    // Check if domain or subdomain already exists
    const existingOrg = await this.prisma.organization.findFirst({
      where: {
        OR: [
          { domain: data.domain },
          { subdomain: data.subdomain },
        ],
      },
    });

    if (existingOrg) {
      throw new ConflictException('Organization with this domain or subdomain already exists');
    }

    return this.prisma.organization.create({
      data,
      include: {
        users: true,
        branches: true,
      },
    });
  }

  async findById(id: number): Promise<Organization> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            branch: true,
          },
        },
        branches: {
          include: {
            manager: true,
            users: true,
          },
        },
        requirements: true,
        gapAssessments: true,
        actionPlans: true,
        risks: true,
        schedules: true,
        notifications: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async findByDomain(domain: string): Promise<Organization | null> {
    return this.prisma.organization.findUnique({
      where: { domain },
      include: {
        users: true,
        branches: true,
      },
    });
  }

  async findBySubdomain(subdomain: string): Promise<Organization | null> {
    return this.prisma.organization.findUnique({
      where: { subdomain },
      include: {
        users: true,
        branches: true,
      },
    });
  }

  async getOrganizationsForRegistration(): Promise<Partial<Organization>[]> {
    return this.prisma.organization.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        domain: true,
        subdomain: true,
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAll(): Promise<Organization[]> {
    return this.prisma.organization.findMany({
      include: {
        users: true,
        branches: true,
        _count: {
          select: {
            users: true,
            requirements: true,
            branches: true,
            risks: true,
            schedules: true,
            notifications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, data: UpdateOrganizationDto): Promise<Organization> {
    // Check if domain or subdomain conflicts with other organizations
    if (data.domain || data.subdomain) {
      const existingOrg = await this.prisma.organization.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                ...(data.domain ? [{ domain: data.domain }] : []),
                ...(data.subdomain ? [{ subdomain: data.subdomain }] : []),
              ],
            },
          ],
        },
      });

      if (existingOrg) {
        throw new ConflictException('Organization with this domain or subdomain already exists');
      }
    }

    return this.prisma.organization.update({
      where: { id },
      data,
      include: {
        users: true,
        branches: true,
      },
    });
  }

  async delete(id: number): Promise<Organization> {
    return this.prisma.organization.delete({
      where: { id },
    });
  }

  async getStats(id: number) {
    const organization = await this.findById(id);
    
    // Get counts from database
    const [
      totalUsers,
      totalBranches,
      totalRequirements,
      totalGapAssessments,
      totalActionPlans,
      totalRisks,
      totalSchedules,
      totalNotifications,
      activeUsers,
      highPriorityRequirements,
      highRiskCount,
      overdueTasks
    ] = await Promise.all([
      this.prisma.user.count({ where: { organizationId: id } }),
      this.prisma.branch.count({ where: { organizationId: id } }),
      this.prisma.requirement.count({ where: { organizationId: id } }),
      this.prisma.gapAssessment.count({ where: { organizationId: id } }),
      this.prisma.actionPlan.count({ where: { organizationId: id } }),
      this.prisma.risk.count({ where: { organizationId: id } }),
      this.prisma.schedule.count({ where: { organizationId: id } }),
      this.prisma.notification.count({ where: { organizationId: id } }),
      this.prisma.user.count({ where: { organizationId: id, isActive: true } }),
      this.prisma.requirement.count({ where: { organizationId: id, priority: { in: ['HIGH', 'CRITICAL'] } } }),
      this.prisma.risk.count({ where: { organizationId: id, status: 'ACTIVE' } }),
      this.prisma.schedule.count({ 
        where: { 
          organizationId: id, 
          dueDate: { lt: new Date() },
          status: { not: 'COMPLETED' }
        } 
      })
    ]);
    
    // Get recent activity
    const recentUsers = await this.prisma.user.findMany({
      where: { organizationId: id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    const recentRequirements = await this.prisma.requirement.findMany({
      where: { organizationId: id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        clause: true,
        title: true,
        priority: true,
        createdAt: true,
      },
    });
    
    return {
      organization: {
        id: organization.id,
        name: organization.name,
        domain: organization.domain,
        subdomain: organization.subdomain,
        isActive: organization.isActive,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
      },
      statistics: {
        totalUsers,
        totalBranches,
        totalRequirements,
        totalGapAssessments,
        totalActionPlans,
        totalRisks,
        totalSchedules,
        totalNotifications,
        activeUsers,
        highPriorityRequirements,
        highRiskCount,
        overdueTasks,
        completionRate: totalRequirements > 0 ? Math.round((highPriorityRequirements / totalRequirements) * 100) : 0,
      },
      recentActivity: {
        recentUsers,
        recentRequirements,
      },
    };
  }
}
