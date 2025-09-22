import { IsString, IsInt, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RiskStatus } from '@prisma/client';

export class CreateRiskDto {
  @ApiProperty({ example: 'Unauthorized access to customer data due to weak authentication mechanisms', description: 'Description of the risk' })
  @IsString()
  description: string;

  @ApiProperty({ example: 3, description: 'Likelihood of the risk occurring (1=Very Low, 2=Low, 3=Medium, 4=High, 5=Very High)', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  likelihood: number; // 1-5 scale

  @ApiProperty({ example: 4, description: 'Impact if the risk occurs (1=Very Low, 2=Low, 3=Medium, 4=High, 5=Very High)', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  impact: number; // 1-5 scale

  @ApiProperty({ example: RiskStatus.ACTIVE, enum: RiskStatus, description: 'Current status of the risk', required: false })
  @IsEnum(RiskStatus)
  @IsOptional()
  status?: RiskStatus = RiskStatus.ACTIVE;

  @ApiProperty({ example: 'Implement multi-factor authentication and regular access reviews', description: 'Mitigation strategies for this risk', required: false })
  @IsString()
  @IsOptional()
  mitigation?: string;

  @ApiProperty({ example: 1, description: 'ID of the user who owns this risk' })
  @IsInt()
  ownerId: number;

  @ApiProperty({ example: 1, description: 'ID of the branch this risk applies to' })
  @IsInt()
  branchId: number;
}
