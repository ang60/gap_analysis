import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ComplianceStandardsService } from './compliance-standards.service';
import { CreateComplianceStandardDto } from './dto/create-compliance-standard.dto';
import { UpdateComplianceStandardDto } from './dto/update-compliance-standard.dto';
import { ComplianceStandardResponseDto } from './dto/compliance-standard-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantRoleGuard } from '../auth/guards/tenant-role.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Compliance Standards')
@Controller('compliance-standards')
@UseGuards(JwtAuthGuard, TenantRoleGuard)
@ApiBearerAuth()
export class ComplianceStandardsController {
  constructor(private readonly complianceStandardsService: ComplianceStandardsService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ 
    summary: 'Create a new compliance standard',
    description: 'Create a new compliance standard for the organization. Only ADMIN and MANAGER roles can create standards.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Compliance standard created successfully', 
    type: ComplianceStandardResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid compliance standard data' })
  @ApiResponse({ status: 409, description: 'Compliance standard with same name and version already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied. Required role: ADMIN or MANAGER' })
  async create(@Body() createComplianceStandardDto: CreateComplianceStandardDto, @Request() req) {
    return this.complianceStandardsService.create(createComplianceStandardDto, req.user.organizationId);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'COMPLIANCE_OFFICER')
  @ApiOperation({ 
    summary: 'Get all compliance standards',
    description: 'Retrieve all compliance standards for the organization. Available to ADMIN, MANAGER, and COMPLIANCE_OFFICER roles.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Compliance standards retrieved successfully', 
    type: [ComplianceStandardResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied. Required role: ADMIN, MANAGER, or COMPLIANCE_OFFICER' })
  async findAll(@Request() req) {
    return this.complianceStandardsService.findAll(req.user.organizationId);
  }

  @Get('categories')
  @Roles('ADMIN', 'MANAGER', 'COMPLIANCE_OFFICER')
  @ApiOperation({ 
    summary: 'Get compliance standard categories',
    description: 'Retrieve all unique categories of compliance standards for the organization.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Categories retrieved successfully',
    schema: {
      type: 'array',
      items: { type: 'string' },
      example: ['Information Security', 'Financial', 'Privacy', 'Quality']
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied. Required role: ADMIN, MANAGER, or COMPLIANCE_OFFICER' })
  async getCategories(@Request() req) {
    const categories = await this.complianceStandardsService.getCategories(req.user.organizationId);
    return { categories };
  }

  @Get('default')
  @Roles('ADMIN', 'MANAGER', 'COMPLIANCE_OFFICER')
  @ApiOperation({ 
    summary: 'Get default compliance standard',
    description: 'Retrieve the default compliance standard for the organization.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Default compliance standard retrieved successfully', 
    type: ComplianceStandardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'No default compliance standard found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied. Required role: ADMIN, MANAGER, or COMPLIANCE_OFFICER' })
  async getDefault(@Request() req) {
    return this.complianceStandardsService.getDefaultStandard(req.user.organizationId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'COMPLIANCE_OFFICER')
  @ApiOperation({ 
    summary: 'Get compliance standard by ID',
    description: 'Retrieve a specific compliance standard by its ID.'
  })
  @ApiParam({ name: 'id', description: 'Compliance standard ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Compliance standard retrieved successfully', 
    type: ComplianceStandardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Compliance standard not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied. Required role: ADMIN, MANAGER, or COMPLIANCE_OFFICER' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.complianceStandardsService.findOne(+id, req.user.organizationId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ 
    summary: 'Update compliance standard',
    description: 'Update an existing compliance standard. Only ADMIN and MANAGER roles can update standards.'
  })
  @ApiParam({ name: 'id', description: 'Compliance standard ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Compliance standard updated successfully', 
    type: ComplianceStandardResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid compliance standard data' })
  @ApiResponse({ status: 404, description: 'Compliance standard not found' })
  @ApiResponse({ status: 409, description: 'Compliance standard with same name and version already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied. Required role: ADMIN or MANAGER' })
  async update(
    @Param('id') id: string, 
    @Body() updateComplianceStandardDto: UpdateComplianceStandardDto, 
    @Request() req
  ) {
    return this.complianceStandardsService.update(+id, updateComplianceStandardDto, req.user.organizationId);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete compliance standard',
    description: 'Delete a compliance standard. Only ADMIN role can delete standards. Cannot delete if standard has associated requirements or assessments.'
  })
  @ApiParam({ name: 'id', description: 'Compliance standard ID' })
  @ApiResponse({ status: 204, description: 'Compliance standard deleted successfully' })
  @ApiResponse({ status: 404, description: 'Compliance standard not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete standard with associated requirements or assessments' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied. Required role: ADMIN' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.complianceStandardsService.remove(+id, req.user.organizationId);
  }
}
