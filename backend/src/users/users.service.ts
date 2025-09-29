import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { TenantAwareService } from '../common/tenant-aware.service';

@Injectable()
export class UsersService extends TenantAwareService {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateUserDto, organizationId: number): Promise<User> {
    const hashedPassword = await hash(data.password, 10);
    
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    
    if (existingUser) {
      throw new BadRequestException(`User with email ${data.email} already exists`);
    }
    
    // If branchId is provided, verify it exists and belongs to the organization
    if (data.branchId) {
      const branch = await this.prisma.branch.findFirst({
        where: {
          id: data.branchId,
          organizationId: organizationId,
        },
      });
      
      if (!branch) {
        throw new BadRequestException(`Branch with ID ${data.branchId} not found or does not belong to organization ${organizationId}`);
      }
    }
    
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        organizationId,
      },
      include: {
        branch: true,
        organization: true,
      },
    });
  }

  async findById(id: number, organizationId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { 
        id,
        organizationId,
      },
      include: {
        branch: true,
        organization: true,
      },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findByEmail(email: string, organizationId?: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { 
        email,
        ...(organizationId ? { organizationId } : {}),
      },
      include: {
        branch: true,
        organization: true,
      },
    });
  }

  async findAll(organizationId: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { organizationId },
      include: {
        branch: true,
        organization: true,
      },
    });
  }

  async update(id: number, data: UpdateUserDto, organizationId: number): Promise<User> {
    const updateData: any = { ...data };
    
    if (data.password) {
      updateData.password = await hash(data.password, 10);
    }
    
    return this.prisma.user.update({
      where: { 
        id,
        organizationId,
      },
      data: updateData,
      include: {
        branch: true,
        organization: true,
      },
    });
  }

  async delete(id: number, organizationId: number): Promise<User> {
    return this.prisma.user.delete({
      where: { 
        id,
        organizationId,
      },
    });
  }

  async getOrCreateUser(data: CreateUserDto, organizationId: number): Promise<User> {
    const existingUser = await this.findByEmail(data.email, organizationId);
    if (existingUser) {
      return existingUser;
    }
    return this.create(data, organizationId);
  }

  async getBranches(organizationId: number) {
    return this.prisma.branch.findMany({
      where: { organizationId },
      include: {
        manager: true,
        users: true,
        organization: true,
      },
    });
  }

  async getBranchById(branchId: number, organizationId: number) {
    const branch = await this.prisma.branch.findFirst({
      where: { 
        id: branchId,
        organizationId 
      },
      include: {
        manager: true,
        users: true,
        organization: true,
      },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async updateBranch(branchId: number, data: { name?: string; region?: string; managerId?: number }, organizationId: number) {
    // Verify branch exists and belongs to organization
    const branch = await this.getBranchById(branchId, organizationId);

    // If managerId is provided, verify the manager exists and belongs to the organization
    if (data.managerId) {
      const manager = await this.prisma.user.findFirst({
        where: {
          id: data.managerId,
          organizationId: organizationId,
        },
      });

      if (!manager) {
        throw new BadRequestException(`Manager with ID ${data.managerId} not found or does not belong to organization ${organizationId}`);
      }
    }

    return this.prisma.branch.update({
      where: { id: branchId },
      data,
      include: {
        manager: true,
        users: true,
        organization: true,
      },
    });
  }

  async deleteBranch(branchId: number, organizationId: number) {
    // Verify branch exists and belongs to organization
    const branch = await this.getBranchById(branchId, organizationId);

    // Check if branch has users
    const usersInBranch = await this.prisma.user.count({
      where: { branchId },
    });

    if (usersInBranch > 0) {
      throw new BadRequestException(`Cannot delete branch. It has ${usersInBranch} users assigned. Please reassign users first.`);
    }

    const deletedBranch = await this.prisma.branch.delete({
      where: { id: branchId },
    });

    return {
      message: 'Branch deleted successfully',
      deletedBranch: {
        id: deletedBranch.id,
        name: deletedBranch.name,
        region: deletedBranch.region,
      },
    };
  }

  async createBranch(data: { name: string; region: string; managerId?: number }, organizationId: number) {
    return this.prisma.branch.create({
      data: {
        ...data,
        organizationId,
      },
      include: {
        manager: true,
        users: true,
        organization: true,
      },
    });
  }

  async findOrganizationByDomain(domain: string) {
    return this.prisma.organization.findUnique({
      where: { domain },
    });
  }

  async assignRole(userId: number, role: UserRole, organizationId: number): Promise<User> {
    // Check if user exists and belongs to the organization
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: organizationId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found or does not belong to this organization');
    }

    // Update user role
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      include: {
        organization: true,
        branch: true,
      },
    });
  }

  async findByOrganization(organizationId: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { organizationId },
      include: {
        organization: true,
        branch: true,
      },
      orderBy: [
        { role: 'asc' },
        { firstName: 'asc' },
      ],
    });
  }
}
