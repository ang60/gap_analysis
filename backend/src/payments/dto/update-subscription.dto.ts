import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';
import { SubscriptionPlan } from '@prisma/client';

export class UpdateAutoRenewDto {
  @ApiProperty({ description: 'Auto-renewal setting' })
  @IsBoolean()
  autoRenew: boolean;
}

export class UpgradePlanDto {
  @ApiProperty({ enum: SubscriptionPlan, description: 'New subscription plan' })
  @IsEnum(SubscriptionPlan)
  planType: SubscriptionPlan;
}
