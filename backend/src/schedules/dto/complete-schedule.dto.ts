import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteScheduleDto {
  @ApiProperty({ example: 'Risk assessment completed successfully. All identified risks have been documented and mitigation plans are in place.', description: 'Notes about the schedule completion', required: false })
  @IsString()
  @IsOptional()
  completionNotes?: string;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z', description: 'Next due date for recurring schedules', required: false })
  @IsDateString()
  @IsOptional()
  nextDueDate?: string;
}
