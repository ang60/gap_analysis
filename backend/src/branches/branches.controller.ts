import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { BranchResponseDto } from './dto/branch-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantRoleGuard } from '../auth/guards/tenant-role.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Branches')
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get('public')
  @ApiOperation({ 
    summary: 'Get branches for registration (public)',
    description: 'Fetch all branches for a specific organization during user registration. This endpoint is public and does not require authentication.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Branches retrieved successfully',
    type: [BranchResponseDto]
  })
  async getBranchesForRegistration(@Query('organizationId') organizationId?: string) {
    const orgId = organizationId ? parseInt(organizationId) : 1; // Default to organization 1
    return this.branchesService.findByOrganization(orgId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, TenantRoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ 
    summary: 'Get branches for an organization',
    description: 'Fetch all branches for a specific organization. If no organizationId is provided, returns branches for the default organization.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Branches retrieved successfully',
    type: [BranchResponseDto],
    schema: {
      example: [
        {
          id: 4,
          name: 'Default Head Office',
          region: 'Nairobi',
          organizationId: 1
        },
        {
          id: 5,
          name: 'Nairobi CBD Branch',
          region: 'Nairobi',
          organizationId: 1
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBranches(@Request() req) {
    return this.branchesService.findByOrganization(req.user.organizationId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, TenantRoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ 
    summary: 'Create a new branch',
    description: 'Create a new branch for the organization. The branch ID will be auto-generated.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Branch created successfully',
    type: BranchResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid branch data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createBranch(@Body() createBranchDto: CreateBranchDto, @Request() req) {
    return this.branchesService.create(createBranchDto, req.user.organizationId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, TenantRoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ 
    summary: 'Get branch by ID',
    description: 'Fetch a specific branch by its ID'
  })
  @ApiParam({ name: 'id', description: 'Branch ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Branch retrieved successfully',
    type: BranchResponseDto
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBranchById(@Param('id') id: string, @Request() req) {
    return this.branchesService.findById(parseInt(id), req.user.organizationId);
  }
}
