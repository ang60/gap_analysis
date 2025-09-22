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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GapAssessmentsService } from './gap-assessments.service';
import { CreateGapAssessmentDto } from './dto/create-gap-assessment.dto';
import { UpdateGapAssessmentDto } from './dto/update-gap-assessment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('gap-assessments')
@Controller('gap-assessments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GapAssessmentsController {
  constructor(private readonly gapAssessmentsService: GapAssessmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gap assessment' })
  @ApiResponse({ status: 201, description: 'Gap assessment created successfully' })
  async create(
    @Body() createGapAssessmentDto: CreateGapAssessmentDto,
    @CurrentUser() user: User
  ) {
    return this.gapAssessmentsService.create(createGapAssessmentDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gap assessments' })
  @ApiResponse({ status: 200, description: 'List of gap assessments' })
  async findAll() {
    return this.gapAssessmentsService.findAll();
  }

  @Get('branch/:branchId')
  @ApiOperation({ summary: 'Get gap assessments by branch' })
  @ApiResponse({ status: 200, description: 'Gap assessments found' })
  async findByBranch(@Param('branchId', ParseIntPipe) branchId: number) {
    return this.gapAssessmentsService.findByBranch(branchId);
  }

  @Get('requirement/:requirementId')
  @ApiOperation({ summary: 'Get gap assessments by requirement' })
  @ApiResponse({ status: 200, description: 'Gap assessments found' })
  async findByRequirement(@Param('requirementId', ParseIntPipe) requirementId: number) {
    return this.gapAssessmentsService.findByRequirement(requirementId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get gap assessments by status' })
  @ApiResponse({ status: 200, description: 'Gap assessments found' })
  async findByStatus(@Param('status', ParseIntPipe) status: number) {
    return this.gapAssessmentsService.findByStatus(status);
  }

  @Get('evidence/statistics')
  @ApiOperation({ summary: 'Get evidence statistics' })
  @ApiResponse({ status: 200, description: 'Evidence statistics' })
  async getEvidenceStatistics() {
    return this.gapAssessmentsService.getEvidenceStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gap assessment by ID' })
  @ApiResponse({ status: 200, description: 'Gap assessment found' })
  @ApiResponse({ status: 404, description: 'Gap assessment not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.gapAssessmentsService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update gap assessment' })
  @ApiResponse({ status: 200, description: 'Gap assessment updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGapAssessmentDto: UpdateGapAssessmentDto
  ) {
    return this.gapAssessmentsService.update(id, updateGapAssessmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete gap assessment' })
  @ApiResponse({ status: 200, description: 'Gap assessment deleted successfully' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.gapAssessmentsService.delete(id);
  }
}
