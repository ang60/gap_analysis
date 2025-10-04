import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsDateString } from 'class-validator';
import { SubscriptionPlan } from '@prisma/client';

export class CreateSubscriptionDto {
  @ApiProperty({ enum: SubscriptionPlan, description: 'Subscription plan type' })
  @IsEnum(SubscriptionPlan)
  planType: SubscriptionPlan;

  @ApiProperty({ description: 'Subscription start date (ISO string)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Subscription end date (ISO string)' })
  @IsDateString()
  endDate: string;
}
