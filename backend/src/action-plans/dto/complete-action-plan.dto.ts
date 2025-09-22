import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteActionPlanDto {
  @ApiProperty({ example: 'Action completed successfully. MFA has been implemented across all user accounts.', description: 'Notes about the action completion', required: false })
  @IsString()
  @IsOptional()
  completionNotes?: string;

  @ApiProperty({ example: '2024-12-15T10:30:00.000Z', description: 'Date and time when the action was completed', required: false })
  @IsDateString()
  @IsOptional()
  completedAt?: string;
}
