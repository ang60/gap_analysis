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
  Query 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RequirementsService } from './requirements.service';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, Priority } from '@prisma/client';

@ApiTags('requirements')
@Controller('requirements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new requirement' })
  @ApiResponse({ status: 201, description: 'Requirement created successfully' })
  async create(
    @Body() createRequirementDto: CreateRequirementDto,
    @CurrentUser() user: User
  ) {
    return this.requirementsService.create(createRequirementDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all requirements' })
  @ApiResponse({ status: 200, description: 'List of requirements' })
  async findAll() {
    return this.requirementsService.findAll();
  }

  @Get('clause/:clause')
  @ApiOperation({ summary: 'Get requirements by clause' })
  @ApiResponse({ status: 200, description: 'Requirements found' })
  async findByClause(@Param('clause') clause: string) {
    return this.requirementsService.findByClause(clause);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get requirements by category' })
  @ApiResponse({ status: 200, description: 'Requirements found' })
  async findByCategory(@Param('category') category: string) {
    return this.requirementsService.findByCategory(category);
  }

  @Get('section/:section')
  @ApiOperation({ summary: 'Get requirements by section' })
  @ApiResponse({ status: 200, description: 'Requirements found' })
  async findBySection(@Param('section') section: string) {
    return this.requirementsService.findBySection(section);
  }

  @Get('priority/:priority')
  @ApiOperation({ summary: 'Get requirements by priority' })
  @ApiResponse({ status: 200, description: 'Requirements found' })
  async findByPriority(@Param('priority') priority: Priority) {
    return this.requirementsService.findByPriority(priority);
  }

  @Get('clause/:clause/branch/:branchId/assessments')
  @ApiOperation({ summary: 'Get requirements with gap assessments for a branch' })
  @ApiResponse({ status: 200, description: 'Requirements with assessments' })
  async getRequirementsWithAssessments(
    @Param('clause') clause: string,
    @Param('branchId', ParseIntPipe) branchId: number
  ) {
    return this.requirementsService.getRequirementsWithAssessments(clause, branchId);
  }

  @Get('clause/:clause/branch/:branchId/compliance-stats')
  @ApiOperation({ summary: 'Get compliance statistics for requirements' })
  @ApiResponse({ status: 200, description: 'Compliance statistics' })
  async getComplianceStats(
    @Param('clause') clause: string,
    @Param('branchId', ParseIntPipe) branchId: number
  ) {
    return this.requirementsService.getComplianceStats(clause, branchId);
  }

  @Get('clause/:clause/branch/:branchId/whats-missing')
  @ApiOperation({ summary: 'Get what\'s missing for requirements' })
  @ApiResponse({ status: 200, description: 'Missing items report' })
  async getWhatsMissing(
    @Param('clause') clause: string,
    @Param('branchId', ParseIntPipe) branchId: number
  ) {
    return this.requirementsService.getWhatsMissing(clause, branchId);
  }

  @Get('incomplete/branch/:branchId')
  @ApiOperation({ summary: 'Get incomplete requirements for a branch' })
  @ApiResponse({ status: 200, description: 'Incomplete requirements' })
  async getIncompleteRequirements(@Param('branchId', ParseIntPipe) branchId: number) {
    return this.requirementsService.getIncompleteRequirements(branchId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get requirement by ID' })
  @ApiResponse({ status: 200, description: 'Requirement found' })
  @ApiResponse({ status: 404, description: 'Requirement not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.requirementsService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update requirement' })
  @ApiResponse({ status: 200, description: 'Requirement updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRequirementDto: UpdateRequirementDto
  ) {
    return this.requirementsService.update(id, updateRequirementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete requirement' })
  @ApiResponse({ status: 200, description: 'Requirement deleted successfully' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.requirementsService.delete(id);
  }
}
