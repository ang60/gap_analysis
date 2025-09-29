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
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CompleteScheduleDto } from './dto/complete-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantRoleGuard } from '../auth/guards/tenant-role.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, ScheduleType, ScheduleStatus, UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('schedules')
@Controller('schedules')
@UseGuards(JwtAuthGuard, TenantRoleGuard)
@ApiBearerAuth()
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @Roles(UserRole.MANAGER, UserRole.COMPLIANCE_OFFICER)
  @ApiOperation({ summary: 'Create a new schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  async create(
    @Body() createScheduleDto: CreateScheduleDto,
    @CurrentUser() user: User
  ) {
    return this.schedulesService.create(user.organizationId, createScheduleDto, user.id);
  }

  @Post('recurring')
  @ApiOperation({ summary: 'Create a new recurring schedule' })
  @ApiResponse({ status: 201, description: 'Recurring schedule created successfully' })
  async createRecurring(
    @Body() createScheduleDto: CreateScheduleDto,
    @CurrentUser() user: User
  ) {
    return this.schedulesService.createRecurring(user.organizationId, createScheduleDto, user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.COMPLIANCE_OFFICER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all schedules' })
  @ApiResponse({ status: 200, description: 'List of schedules' })
  async findAll() {
    return this.schedulesService.findAll();
  }

  @Get('branch/:branchId')
  @ApiOperation({ summary: 'Get schedules by branch' })
  @ApiResponse({ status: 200, description: 'Schedules found' })
  async findByBranch(@Param('branchId', ParseIntPipe) branchId: number) {
    return this.schedulesService.findByBranch(branchId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get schedules by type' })
  @ApiResponse({ status: 200, description: 'Schedules found' })
  async findByType(@Param('type') type: ScheduleType) {
    return this.schedulesService.findByType(type);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get schedules by status' })
  @ApiResponse({ status: 200, description: 'Schedules found' })
  async findByStatus(@Param('status') status: ScheduleStatus) {
    return this.schedulesService.findByStatus(status);
  }

  @Get('upcoming/:branchId')
  @ApiOperation({ summary: 'Get upcoming schedules for a branch' })
  @ApiResponse({ status: 200, description: 'Upcoming schedules' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to look ahead (default: 30)' })
  async getUpcomingSchedules(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Query('days') days?: number
  ) {
    return this.schedulesService.getUpcomingSchedules(branchId, days ? parseInt(days.toString()) : 30);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get overdue schedules' })
  @ApiResponse({ status: 200, description: 'Overdue schedules' })
  async getOverdueSchedules() {
    return this.schedulesService.getOverdueSchedules();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get schedule statistics' })
  @ApiResponse({ status: 200, description: 'Schedule statistics' })
  async getStatistics() {
    return this.schedulesService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule by ID' })
  @ApiResponse({ status: 200, description: 'Schedule found' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.schedulesService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.MANAGER, UserRole.COMPLIANCE_OFFICER)
  @ApiOperation({ summary: 'Update schedule' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto
  ) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete schedule' })
  @ApiResponse({ status: 200, description: 'Schedule completed successfully' })
  async complete(
    @Param('id', ParseIntPipe) id: number,
    @Body() completeScheduleDto: CompleteScheduleDto
  ) {
    return this.schedulesService.complete(id, completeScheduleDto);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER, UserRole.COMPLIANCE_OFFICER)
  @ApiOperation({ summary: 'Delete schedule' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.schedulesService.delete(id);
  }
}
