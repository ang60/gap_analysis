import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateActionPlanDto } from './create-action-plan.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ActionStatus } from '@prisma/client';

export class UpdateActionPlanDto extends PartialType(CreateActionPlanDto) {
  @ApiProperty({ example: ActionStatus.IN_PROGRESS, enum: ActionStatus, description: 'Current status of the action', required: false })
  @IsOptional()
  @IsEnum(ActionStatus)
  status?: ActionStatus;

  @ApiProperty({ example: 'Action is 50% complete. MFA system has been installed.', description: 'Notes about the action completion', required: false })
  @IsOptional()
  @IsString()
  completionNotes?: string;
}
