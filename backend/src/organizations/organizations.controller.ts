import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Create a new organization',
    description: 'Create a new banking organization for multitenancy. Only ADMIN users can create organizations.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Organization created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Bank of Kenya',
        domain: 'bankofkenya.com',
        subdomain: 'bok',
        isActive: true,
        settings: { theme: 'blue', logo: 'bok-logo.png' },
        createdAt: '2025-09-25T10:00:00.000Z',
        updatedAt: '2025-09-25T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiBody({
    description: 'Organization creation data',
    schema: {
      example: {
        name: 'Bank of Kenya',
        domain: 'bankofkenya.com',
        subdomain: 'bok',
        isActive: true,
        settings: {
          theme: 'blue',
          logo: 'bok-logo.png',
          timezone: 'Africa/Nairobi',
          currency: 'KES'
        }
      }
    }
  })
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get all organizations',
    description: 'Retrieve all banking organizations. Only ADMIN users can access this endpoint.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of organizations retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          name: 'Default Organization',
          domain: 'default.local',
          subdomain: 'default',
          isActive: true,
          settings: {},
          createdAt: '2025-09-25T10:00:00.000Z',
          updatedAt: '2025-09-25T10:00:00.000Z',
          _count: {
            users: 5,
            requirements: 57,
            branches: 3,
            risks: 12
          }
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get organization by ID',
    description: 'Retrieve a specific organization by its ID. Only ADMIN users can access this endpoint.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Organization ID', 
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Organization found',
    schema: {
      example: {
        id: 1,
        name: 'Bank of Kenya',
        domain: 'bankofkenya.com',
        subdomain: 'bok',
        isActive: true,
        settings: { theme: 'blue', logo: 'bok-logo.png' },
        createdAt: '2025-09-25T10:00:00.000Z',
        updatedAt: '2025-09-25T10:00:00.000Z',
        users: [
          {
            id: 1,
            email: 'admin@bankofkenya.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'ADMIN'
          }
        ],
        requirements: [
          {
            id: 1,
            clause: 'A.1.1',
            title: 'Access Control Policy',
            priority: 'HIGH'
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.findById(id);
  }

  @Get('domain/:domain')
  @ApiOperation({
    summary: 'Get organization by domain',
    description: 'Retrieve an organization by its domain. This endpoint is public and used for domain-based login.'
  })
  @ApiParam({
    name: 'domain',
    description: 'Organization domain',
    example: 'default.local',
    type: 'string'
  })
  @ApiResponse({
    status: 200,
    description: 'Organization found',
    schema: {
      example: {
        id: 1,
        name: 'Default Organization',
        domain: 'default.local',
        subdomain: 'default',
        isActive: true,
        settings: {},
        createdAt: '2025-09-25T10:00:00.000Z',
        updatedAt: '2025-09-25T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getByDomain(@Param('domain') domain: string) {
    return this.organizationsService.findByDomain(domain);
  }

  @Get(':id/stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get organization statistics',
    description: 'Get detailed statistics for a specific organization including user count, requirements, branches, and risks.'
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: 1,
    type: 'integer'
  })
  @ApiResponse({
    status: 200,
    description: 'Organization statistics retrieved successfully',
    schema: {
      example: {
        organization: {
          id: 1,
          name: 'Bank of Kenya',
          domain: 'bankofkenya.com'
        },
        statistics: {
          totalUsers: 15,
          totalRequirements: 57,
          totalBranches: 3,
          totalRisks: 12,
          activeUsers: 12,
          completedRequirements: 45,
          highRiskCount: 3,
          overdueTasks: 2
        },
        recentActivity: [
          {
            type: 'user_created',
            description: 'New user John Doe created',
            timestamp: '2025-09-25T10:00:00.000Z'
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getStats(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.getStats(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Update organization',
    description: 'Update an existing organization. Only ADMIN users can update organizations.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Organization ID', 
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Organization updated successfully',
    schema: {
      example: {
        id: 1,
        name: 'Bank of Kenya Updated',
        domain: 'bankofkenya.com',
        subdomain: 'bok',
        isActive: true,
        settings: { theme: 'green', logo: 'bok-logo-new.png' },
        createdAt: '2025-09-25T10:00:00.000Z',
        updatedAt: '2025-09-25T11:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiBody({
    description: 'Organization update data',
    schema: {
      example: {
        name: 'Bank of Kenya Updated',
        isActive: true,
        settings: {
          theme: 'green',
          logo: 'bok-logo-new.png',
          timezone: 'Africa/Nairobi',
          currency: 'KES'
        }
      }
    }
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Delete organization',
    description: 'Delete an organization and all its associated data. This action cannot be undone. Only ADMIN users can delete organizations.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Organization ID', 
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Organization deleted successfully',
    schema: {
      example: {
        message: 'Organization deleted successfully',
        deletedOrganization: {
          id: 1,
          name: 'Bank of Kenya',
          domain: 'bankofkenya.com'
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.delete(id);
  }
}
