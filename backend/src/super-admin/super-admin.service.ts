import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CreateSuperAdminUserDto } from './dto/create-super-admin-user.dto';
import { UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getSystemDashboard() {
    const [
      totalOrganizations,
      totalUsers,
      totalRequirements,
      totalGapAssessments,
      totalActionPlans,
      totalRisks,
      totalSchedules,
      recentOrganizations,
      recentUsers
    ] = await Promise.all([
      this.prisma.organization.count(),
      this.prisma.user.count(),
      this.prisma.requirement.count(),
      this.prisma.gapAssessment.count(),
      this.prisma.actionPlan.count(),
      this.prisma.risk.count(),
      this.prisma.schedule.count(),
      this.prisma.organization.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              users: true,
              requirements: true,
              gapAssessments: true,
              actionPlans: true,
              risks: true,
              schedules: true
            }
          }
        }
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: true,
          branch: true
        }
      })
    ]);

    return {
      statistics: {
        totalOrganizations,
        totalUsers,
        totalRequirements,
        totalGapAssessments,
        totalActionPlans,
        totalRisks,
        totalSchedules
      },
      recentOrganizations,
      recentUsers
    };
  }

  async getAllOrganizations() {
    return this.prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            requirements: true,
            gapAssessments: true,
            actionPlans: true,
            risks: true,
            schedules: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createOrganization(createOrganizationDto: CreateOrganizationDto) {
    // Check if domain already exists
    const existingOrg = await this.prisma.organization.findUnique({
      where: { domain: createOrganizationDto.domain }
    });

    if (existingOrg) {
      throw new BadRequestException('Organization with this domain already exists');
    }

    // Check if subdomain already exists (if provided)
    if (createOrganizationDto.subdomain) {
      const existingSubdomain = await this.prisma.organization.findUnique({
        where: { subdomain: createOrganizationDto.subdomain }
      });

      if (existingSubdomain) {
        throw new BadRequestException('Organization with this subdomain already exists');
      }
    }

    return this.prisma.organization.create({
      data: createOrganizationDto,
      include: {
        _count: {
          select: {
            users: true,
            requirements: true,
            gapAssessments: true,
            actionPlans: true,
            risks: true,
            schedules: true
          }
        }
      }
    });
  }

  async updateOrganization(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { id }
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if new domain already exists (if being updated)
    if (updateOrganizationDto.domain && updateOrganizationDto.domain !== organization.domain) {
      const existingOrg = await this.prisma.organization.findUnique({
        where: { domain: updateOrganizationDto.domain }
      });

      if (existingOrg) {
        throw new BadRequestException('Organization with this domain already exists');
      }
    }

    // Check if new subdomain already exists (if being updated)
    if (updateOrganizationDto.subdomain && updateOrganizationDto.subdomain !== organization.subdomain) {
      const existingSubdomain = await this.prisma.organization.findUnique({
        where: { subdomain: updateOrganizationDto.subdomain }
      });

      if (existingSubdomain) {
        throw new BadRequestException('Organization with this subdomain already exists');
      }
    }

    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
      include: {
        _count: {
          select: {
            users: true,
            requirements: true,
            gapAssessments: true,
            actionPlans: true,
            risks: true,
            schedules: true
          }
        }
      }
    });
  }

  async deleteOrganization(id: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { id }
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Delete all related data
    await this.prisma.$transaction(async (tx) => {
      // Delete notifications
      await tx.notification.deleteMany({
        where: { organizationId: id }
      });

      // Delete schedules
      await tx.schedule.deleteMany({
        where: { organizationId: id }
      });

      // Delete risks
      await tx.risk.deleteMany({
        where: { organizationId: id }
      });

      // Delete action plans
      await tx.actionPlan.deleteMany({
        where: { organizationId: id }
      });

      // Delete gap assessments
      await tx.gapAssessment.deleteMany({
        where: { organizationId: id }
      });

      // Delete requirements
      await tx.requirement.deleteMany({
        where: { organizationId: id }
      });

      // Delete branches
      await tx.branch.deleteMany({
        where: { organizationId: id }
      });

      // Delete users
      await tx.user.deleteMany({
        where: { organizationId: id }
      });

      // Delete organization
      await tx.organization.delete({
        where: { id }
      });
    });

    return { message: 'Organization and all related data deleted successfully' };
  }

  async getAllUsers(organizationId?: number) {
    const where = organizationId ? { organizationId } : {};
    
    return this.prisma.user.findMany({
      where,
      include: {
        organization: true,
        branch: true
      },
      orderBy: [
        { organizationId: 'asc' },
        { role: 'asc' },
        { firstName: 'asc' }
      ]
    });
  }

  async createUser(createUserDto: CreateSuperAdminUserDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Check if organization exists
    const organization = await this.prisma.organization.findUnique({
      where: { id: createUserDto.organizationId }
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if branch exists (if provided)
    if (createUserDto.branchId) {
      const branch = await this.prisma.branch.findUnique({
        where: { id: createUserDto.branchId }
      });

      if (!branch) {
        throw new NotFoundException('Branch not found');
      }
    }

    const hashedPassword = await hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword
      },
      include: {
        organization: true,
        branch: true
      }
    });
  }

  async assignRoleToUser(userId: number, role: UserRole) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      include: {
        organization: true,
        branch: true
      }
    });
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id: userId }
    });

    return { message: 'User deleted successfully' };
  }

  async getSystemStatistics() {
    const [
      organizationsByStatus,
      usersByRole,
      usersByOrganization,
      recentActivity
    ] = await Promise.all([
      this.prisma.organization.groupBy({
        by: ['isActive'],
        _count: true
      }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: true
      }),
      this.prisma.user.groupBy({
        by: ['organizationId'],
        _count: true
      }),
      this.prisma.user.findMany({
        take: 10,
        orderBy: { updatedAt: 'desc' },
        include: {
          organization: {
            select: { name: true }
          }
        }
      })
    ]);

    return {
      organizationsByStatus,
      usersByRole,
      usersByOrganization,
      recentActivity
    };
  }

  async getOrganizationData(organizationId: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        users: {
          include: {
            branch: true
          }
        },
        branches: true,
        requirements: true,
        gapAssessments: {
          include: {
            requirement: true
          }
        },
        actionPlans: true,
        risks: true,
        schedules: true,
        notifications: true
      }
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }
}
