import { IsString, IsInt, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActionPriority } from '@prisma/client';

export class CreateActionPlanDto {
  @ApiProperty({ example: 'Implement multi-factor authentication for all user accounts', description: 'The action to be taken' })
  @IsString()
  actionText: string;

  @ApiProperty({ example: ActionPriority.MEDIUM, enum: ActionPriority, description: 'Priority level of the action', required: false })
  @IsEnum(ActionPriority)
  @IsOptional()
  priority?: ActionPriority = ActionPriority.MEDIUM;

  @ApiProperty({ example: '2024-12-31T23:59:59.000Z', description: 'Deadline for completing the action', required: false })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiProperty({ example: 1, description: 'ID of the gap assessment this action addresses' })
  @IsInt()
  gapId: number;

  @ApiProperty({ example: 2, description: 'ID of the user responsible for this action' })
  @IsInt()
  responsibleId: number;

  @ApiProperty({ example: 3, description: 'ID of the requirement this action relates to' })
  @IsInt()
  requirementId: number;
}
