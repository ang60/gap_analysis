import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGapAssessmentDto {
  @ApiProperty({ example: 2, description: 'Implementation status (0=Not Implemented, 1=Partially, 2=Mostly, 3=Fully)', minimum: 0, maximum: 3 })
  @IsInt()
  @Min(0)
  @Max(3)
  status: number; // 0-3 scale: 0=Not Implemented, 1=Partially, 2=Mostly, 3=Fully

  @ApiProperty({ example: 'Multi-factor authentication is partially implemented. Some systems have MFA enabled but not all user accounts.', description: 'Description of the current implementation status' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'https://docs.company.com/mfa-implementation', description: 'Link to evidence or documentation supporting this assessment', required: false })
  @IsString()
  @IsOptional()
  evidenceLink?: string;

  @ApiProperty({ example: 2, description: 'Risk score (0=Low, 1=Medium, 2=High, 3=Critical)', minimum: 0, maximum: 3, required: false })
  @IsInt()
  @Min(0)
  @Max(3)
  @IsOptional()
  riskScore?: number = 0; // 0-3 scale

  @ApiProperty({ example: 1, description: 'ID of the requirement being assessed' })
  @IsInt()
  requirementId: number;

  @ApiProperty({ example: 1, description: 'ID of the branch this assessment applies to' })
  @IsInt()
  branchId: number;
}
