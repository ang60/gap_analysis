import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  UseGuards, 
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RisksService } from './risks.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RiskStatus } from '@prisma/client';

@ApiTags('risks')
@Controller('risks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RisksController {
  constructor(private readonly risksService: RisksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new risk' })
  @ApiResponse({ status: 201, description: 'Risk created successfully' })
  async create(@Body() createRiskDto: CreateRiskDto) {
    return this.risksService.create(createRiskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all risks' })
  @ApiResponse({ status: 200, description: 'List of risks' })
  async findAll() {
    return this.risksService.findAll();
  }

  @Get('branch/:branchId')
  @ApiOperation({ summary: 'Get risks by branch' })
  @ApiResponse({ status: 200, description: 'Risks found' })
  async findByBranch(@Param('branchId', ParseIntPipe) branchId: number) {
    return this.risksService.findByBranch(branchId);
  }

  @Get('owner/:ownerId')
  @ApiOperation({ summary: 'Get risks by owner' })
  @ApiResponse({ status: 200, description: 'Risks found' })
  async findByOwner(@Param('ownerId', ParseIntPipe) ownerId: number) {
    return this.risksService.findByOwner(ownerId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get risks by status' })
  @ApiResponse({ status: 200, description: 'Risks found' })
  async findByStatus(@Param('status') status: RiskStatus) {
    return this.risksService.findByStatus(status);
  }

  @Get('high-risk')
  @ApiOperation({ summary: 'Get high-risk risks' })
  @ApiResponse({ status: 200, description: 'High-risk risks' })
  async getHighRiskRisks() {
    return this.risksService.getHighRiskRisks();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get risk statistics' })
  @ApiResponse({ status: 200, description: 'Risk statistics' })
  async getStatistics() {
    return this.risksService.getRiskStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get risk by ID' })
  @ApiResponse({ status: 200, description: 'Risk found' })
  @ApiResponse({ status: 404, description: 'Risk not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.risksService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update risk' })
  @ApiResponse({ status: 200, description: 'Risk updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRiskDto: UpdateRiskDto
  ) {
    return this.risksService.update(id, updateRiskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete risk' })
  @ApiResponse({ status: 200, description: 'Risk deleted successfully' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.risksService.delete(id);
  }
}
