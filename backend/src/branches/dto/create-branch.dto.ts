import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ description: 'Branch name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Branch region' })
  @IsString()
  region: string;

  @ApiProperty({ description: 'Manager user ID (optional)', required: false })
  @IsOptional()
  @IsNumber()
  managerId?: number;
}
