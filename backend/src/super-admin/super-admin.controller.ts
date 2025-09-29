import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  UseGuards, 
  ParseIntPipe, 
  Query,
  Res 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantRoleGuard } from '../auth/guards/tenant-role.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CreateSuperAdminUserDto } from './dto/create-super-admin-user.dto';
import { Response } from 'express';

@ApiTags('super-admin')
@Controller('super-admin')
@UseGuards(JwtAuthGuard, TenantRoleGuard)
@ApiBearerAuth()
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  // System Overview
  @Get('dashboard')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Get system-wide dashboard data',
    description: 'Get comprehensive system statistics and overview. Only SUPER_ADMIN users can access this endpoint.'
  })
  @ApiResponse({ status: 200, description: 'System dashboard data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN users can access this endpoint' })
  async getSystemDashboard() {
    return this.superAdminService.getSystemDashboard();
  }

  // Organization Management
  @Get('organizations')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Get all organizations',
    description: 'Get all organizations in the system. Only SUPER_ADMIN users can access this endpoint.'
  })
  @ApiResponse({ status: 200, description: 'List of all organizations' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN users can access this endpoint' })
  async getAllOrganizations() {
    return this.superAdminService.getAllOrganizations();
  }

  @Post('organizations')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Create a new organization',
    description: 'Create a new organization/tenant. Only SUPER_ADMIN users can create organizations.'
  })
  @ApiResponse({ status: 201, description: 'Organization created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN users can create organizations' })
  async createOrganization(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.superAdminService.createOrganization(createOrganizationDto);
  }

  @Put('organizations/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Update organization',
    description: 'Update an existing organization. Only SUPER_ADMIN users can update organizations.'
  })
  @ApiResponse({ status: 200, description: 'Organization updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN users can update organizations' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  async updateOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ) {
    return this.superAdminService.updateOrganization(id, updateOrganizationDto);
  }

  @Delete('organizations/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Delete organization',
    description: 'Delete an organization and all its data. Only SUPER_ADMIN users can delete organizations.'
  })
  @ApiResponse({ status: 200, description: 'Organization deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN users can delete organizations' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  async deleteOrganization(@Param('id', ParseIntPipe) id: number) {
    return this.superAdminService.deleteOrganization(id);
  }

  // User Management Across Organizations
  @Get('users')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Get all users across all organizations',
    description: 'Get all users in the system. Only SUPER_ADMIN users can access this endpoint.'
  })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN users can access this endpoint' })
  @ApiQuery({ name: 'organizationId', required: false, type: Number, description: 'Filter users by organization ID' })
  async getAllUsers(@Query('organizationId', ParseIntPipe) organizationId?: number) {
    return this.superAdminService.getAllUsers(organizationId);
  }

  @Post('users')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Create a new user in any organization',
    description: 'Create a new user in any organization. Only SUPER_ADMIN users can create users across organizations.'
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN users can create users' })
  async createUser(@Body() createUserDto: CreateSuperAdminUserDto) {
    return this.superAdminService.createUser(createUserDto);
  }

  @Put('users/:id/assign-role')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Assign role to any user',
    description: 'Assign a role to any user in any organization. Only SUPER_ADMIN users can assign roles across organizations.'
  })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN users can assign roles' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async assignRoleToUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignRoleDto: { role: UserRole }
  ) {
    return this.superAdminService.assignRoleToUser(id, assignRoleDto.role);
  }

  @Delete('users/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Delete any user',
    description: 'Delete any user from any organization. Only SUPER_ADMIN users can delete users across organizations.'
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN users can delete users' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.superAdminService.deleteUser(id);
  }

  // System Statistics
  @Get('statistics')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Get system-wide statistics',
    description: 'Get comprehensive system statistics. Only SUPER_ADMIN users can access this endpoint.'
  })
  @ApiResponse({ status: 200, description: 'System statistics' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN users can access this endpoint' })
  async getSystemStatistics() {
    return this.superAdminService.getSystemStatistics();
  }

  // Organization-specific data access
  @Get('organizations/:id/data')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Get organization data',
    description: 'Get all data for a specific organization. Only SUPER_ADMIN users can access organization data.'
  })
  @ApiResponse({ status: 200, description: 'Organization data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN users can access organization data' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  async getOrganizationData(@Param('id', ParseIntPipe) id: number) {
    return this.superAdminService.getOrganizationData(id);
  }
}
