import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

export class SubscriptionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: SubscriptionPlan })
  planType: SubscriptionPlan;

  @ApiProperty({ enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  autoRenew: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  organizationId: number;

  @ApiProperty({ required: false })
  organization?: {
    name: string;
  };

  @ApiProperty({ required: false })
  payments?: any[];
}
