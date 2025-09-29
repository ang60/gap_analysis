import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards, ParseIntPipe, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantRoleGuard } from '../auth/guards/tenant-role.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, UserRole } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, TenantRoleGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async createUser(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    const newUser = await this.usersService.create(createUserDto, 1); // Default organization for now
    return await this.authService.login(newUser, response);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Get all users in the current organization. Requires ADMIN or MANAGER role.'
  })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient role' })
  async getUsers(@CurrentUser() user: User) {
    return this.usersService.findAll(user.organizationId);
  }

  @Get('branches')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get all branches',
    description: 'Retrieve all branches for the current user\'s organization. Only users within the same organization can see these branches.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of branches retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          name: 'Head Office',
          region: 'Nairobi',
          organizationId: 1,
          managerId: 2,
          createdAt: '2025-09-25T10:00:00.000Z',
          updatedAt: '2025-09-25T10:00:00.000Z',
          manager: {
            id: 2,
            firstName: 'John',
            lastName: 'Manager',
            email: 'manager@bank.co.ke'
          },
          users: [
            {
              id: 3,
              firstName: 'Jane',
              lastName: 'Staff',
              email: 'staff@bank.co.ke'
            }
          ]
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  async getBranches(@CurrentUser() user: User) {
    return this.usersService.getBranches(user.organizationId);
  }

  @Post('branches')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new branch',
    description: 'Create a new branch for the current user\'s organization. The branch will be automatically associated with the user\'s organization.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Branch created successfully',
    schema: {
      example: {
        id: 2,
        name: 'Mombasa Branch',
        region: 'Mombasa',
        organizationId: 1,
        managerId: 2,
        createdAt: '2025-09-25T10:00:00.000Z',
        updatedAt: '2025-09-25T10:00:00.000Z',
        manager: {
          id: 2,
          firstName: 'John',
          lastName: 'Manager',
          email: 'manager@bank.co.ke'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiBody({
    description: 'Branch creation data',
    schema: {
      example: {
        name: 'Mombasa Branch',
        region: 'Mombasa',
        managerId: 2
      },
      required: ['name', 'region'],
      properties: {
        name: {
          type: 'string',
          description: 'Branch name',
          example: 'Mombasa Branch',
          minLength: 2,
          maxLength: 100
        },
        region: {
          type: 'string',
          description: 'Branch region/location',
          example: 'Mombasa',
          minLength: 2,
          maxLength: 50
        },
        managerId: {
          type: 'integer',
          description: 'ID of the user who will manage this branch (optional)',
          example: 2
        }
      }
    }
  })
  async createBranch(@Body() data: { name: string; region: string; managerId?: number }, @CurrentUser() user: User) {
    return this.usersService.createBranch(data, user.organizationId);
  }

  @Get('branches/:branchId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get branch by ID',
    description: 'Retrieve a specific branch by its ID. Only branches within the user\'s organization are accessible.'
  })
  @ApiParam({ 
    name: 'branchId', 
    description: 'Branch ID', 
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Branch found',
    schema: {
      example: {
        id: 1,
        name: 'Head Office',
        region: 'Nairobi',
        organizationId: 1,
        managerId: 2,
        createdAt: '2025-09-25T10:00:00.000Z',
        updatedAt: '2025-09-25T10:00:00.000Z',
        manager: {
          id: 2,
          firstName: 'John',
          lastName: 'Manager',
          email: 'manager@bank.co.ke'
        },
        users: [
          {
            id: 3,
            firstName: 'Jane',
            lastName: 'Staff',
            email: 'staff@bank.co.ke',
            role: 'STAFF'
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  async getBranchById(@Param('branchId', ParseIntPipe) branchId: number, @CurrentUser() user: User) {
    return this.usersService.getBranchById(branchId, user.organizationId);
  }

  @Put('branches/:branchId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update branch',
    description: 'Update an existing branch. Only branches within the user\'s organization can be updated.'
  })
  @ApiParam({ 
    name: 'branchId', 
    description: 'Branch ID', 
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Branch updated successfully',
    schema: {
      example: {
        id: 1,
        name: 'Head Office Updated',
        region: 'Nairobi',
        organizationId: 1,
        managerId: 2,
        createdAt: '2025-09-25T10:00:00.000Z',
        updatedAt: '2025-09-25T11:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiBody({
    description: 'Branch update data',
    schema: {
      example: {
        name: 'Head Office Updated',
        region: 'Nairobi',
        managerId: 3
      },
      properties: {
        name: {
          type: 'string',
          description: 'Branch name',
          example: 'Head Office Updated',
          minLength: 2,
          maxLength: 100
        },
        region: {
          type: 'string',
          description: 'Branch region/location',
          example: 'Nairobi',
          minLength: 2,
          maxLength: 50
        },
        managerId: {
          type: 'integer',
          description: 'ID of the user who will manage this branch',
          example: 3
        }
      }
    }
  })
  async updateBranch(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Body() data: { name?: string; region?: string; managerId?: number },
    @CurrentUser() user: User
  ) {
    return this.usersService.updateBranch(branchId, data, user.organizationId);
  }

  @Delete('branches/:branchId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete branch',
    description: 'Delete a branch. Only branches within the user\'s organization can be deleted. This action cannot be undone.'
  })
  @ApiParam({ 
    name: 'branchId', 
    description: 'Branch ID', 
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Branch deleted successfully',
    schema: {
      example: {
        message: 'Branch deleted successfully',
        deletedBranch: {
          id: 1,
          name: 'Head Office',
          region: 'Nairobi'
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  async deleteBranch(@Param('branchId', ParseIntPipe) branchId: number, @CurrentUser() user: User) {
    return this.usersService.deleteBranch(branchId, user.organizationId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.usersService.findById(id, user.organizationId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: User) {
    return this.usersService.update(id, updateUserDto, user.organizationId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.usersService.delete(id, user.organizationId);
  }

  @Put(':id/assign-role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Assign role to user',
    description: 'Assign a specific role to a user. Only ADMIN users can assign roles.'
  })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only ADMIN users can assign roles' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: AssignRoleDto })
  async assignRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignRoleDto: AssignRoleDto,
    @CurrentUser() user: User
  ) {
    return this.usersService.assignRole(id, assignRoleDto.role, user.organizationId);
  }

  @Get('organization/:organizationId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get all users in an organization',
    description: 'Get all users in a specific organization. Only ADMIN users can access this endpoint.'
  })
  @ApiResponse({ status: 200, description: 'List of users in organization' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only ADMIN users can access this endpoint' })
  @ApiParam({ name: 'organizationId', description: 'Organization ID' })
  async getUsersByOrganization(@Param('organizationId', ParseIntPipe) organizationId: number) {
    return this.usersService.findByOrganization(organizationId);
  }
}
