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
import { ActionPlansService } from './action-plans.service';
import { CreateActionPlanDto } from './dto/create-action-plan.dto';
import { UpdateActionPlanDto } from './dto/update-action-plan.dto';
import { CompleteActionPlanDto } from './dto/complete-action-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, ActionStatus, ActionPriority } from '@prisma/client';

@ApiTags('action-plans')
@Controller('action-plans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActionPlansController {
  constructor(private readonly actionPlansService: ActionPlansService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new action plan' })
  @ApiResponse({ status: 201, description: 'Action plan created successfully' })
  async create(
    @Body() createActionPlanDto: CreateActionPlanDto,
    @CurrentUser() user: User
  ) {
    return this.actionPlansService.create(createActionPlanDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all action plans' })
  @ApiResponse({ status: 200, description: 'List of action plans' })
  async findAll() {
    return this.actionPlansService.findAll();
  }

  @Get('gap/:gapId')
  @ApiOperation({ summary: 'Get action plans by gap assessment' })
  @ApiResponse({ status: 200, description: 'Action plans found' })
  async findByGap(@Param('gapId', ParseIntPipe) gapId: number) {
    return this.actionPlansService.findByGap(gapId);
  }

  @Get('responsible/:responsibleId')
  @ApiOperation({ summary: 'Get action plans by responsible user' })
  @ApiResponse({ status: 200, description: 'Action plans found' })
  async findByResponsible(@Param('responsibleId', ParseIntPipe) responsibleId: number) {
    return this.actionPlansService.findByResponsible(responsibleId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get action plans by status' })
  @ApiResponse({ status: 200, description: 'Action plans found' })
  async findByStatus(@Param('status') status: ActionStatus) {
    return this.actionPlansService.findByStatus(status);
  }

  @Get('priority/:priority')
  @ApiOperation({ summary: 'Get action plans by priority' })
  @ApiResponse({ status: 200, description: 'Action plans found' })
  async findByPriority(@Param('priority') priority: ActionPriority) {
    return this.actionPlansService.findByPriority(priority);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get overdue action plans' })
  @ApiResponse({ status: 200, description: 'Overdue action plans' })
  async getOverdueActions() {
    return this.actionPlansService.getOverdueActions();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming action plans' })
  @ApiResponse({ status: 200, description: 'Upcoming action plans' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to look ahead (default: 7)' })
  async getUpcomingActions(@Query('days') days?: number) {
    return this.actionPlansService.getUpcomingActions(days ? parseInt(days.toString()) : 7);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get action plan statistics' })
  @ApiResponse({ status: 200, description: 'Action plan statistics' })
  async getStatistics() {
    return this.actionPlansService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get action plan by ID' })
  @ApiResponse({ status: 200, description: 'Action plan found' })
  @ApiResponse({ status: 404, description: 'Action plan not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.actionPlansService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update action plan' })
  @ApiResponse({ status: 200, description: 'Action plan updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActionPlanDto: UpdateActionPlanDto
  ) {
    return this.actionPlansService.update(id, updateActionPlanDto);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete action plan' })
  @ApiResponse({ status: 200, description: 'Action plan completed successfully' })
  async complete(
    @Param('id', ParseIntPipe) id: number,
    @Body() completeActionPlanDto: CompleteActionPlanDto
  ) {
    return this.actionPlansService.complete(id, completeActionPlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete action plan' })
  @ApiResponse({ status: 200, description: 'Action plan deleted successfully' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.actionPlansService.delete(id);
  }
}
