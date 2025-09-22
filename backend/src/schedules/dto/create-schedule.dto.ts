import { IsString, IsInt, IsOptional, IsEnum, IsDateString, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduleType, ScheduleFrequency, Priority } from '@prisma/client';

export class CreateScheduleDto {
  @ApiProperty({ example: ScheduleType.RISK_ASSESSMENT, enum: ScheduleType, description: 'Type of schedule' })
  @IsEnum(ScheduleType)
  type: ScheduleType;

  @ApiProperty({ example: 'Annual Risk Assessment', description: 'Title of the schedule' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Conduct comprehensive risk assessment for all business processes', description: 'Description of what needs to be done' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2024-12-31T23:59:59.000Z', description: 'Due date for the schedule' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: ScheduleFrequency.ANNUAL, enum: ScheduleFrequency, description: 'How often this schedule repeats', required: false })
  @IsEnum(ScheduleFrequency)
  @IsOptional()
  frequency?: ScheduleFrequency = ScheduleFrequency.ANNUAL;

  @ApiProperty({ example: 30, description: 'Custom interval in days (used when frequency is CUSTOM)', required: false })
  @IsInt()
  @IsOptional()
  customInterval?: number;

  @ApiProperty({ example: Priority.MEDIUM, enum: Priority, description: 'Priority level of this schedule', required: false })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority = Priority.MEDIUM;

  @ApiProperty({ example: true, description: 'Whether this schedule repeats automatically', required: false })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean = false;

  @ApiProperty({ example: [7, 3, 1], description: 'Days before due date to send reminders', required: false })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  reminderDays?: number[] = [7, 3, 1];

  @ApiProperty({ example: 1, description: 'ID of the branch this schedule applies to' })
  @IsInt()
  branchId: number;

  @ApiProperty({ example: 2, description: 'ID of the user responsible for this schedule' })
  @IsInt()
  responsibleId: number;
}
