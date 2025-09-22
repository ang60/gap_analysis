import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Your risk assessment is due in 3 days. Please complete it by the deadline.', description: 'The notification message' })
  @IsString()
  message: string;

  @ApiProperty({ example: NotificationType.EMAIL, enum: NotificationType, description: 'Type of notification to send', required: false })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType = NotificationType.EMAIL;

  @ApiProperty({ example: 1, description: 'ID of the user to send the notification to' })
  @IsInt()
  userId: number;
}
