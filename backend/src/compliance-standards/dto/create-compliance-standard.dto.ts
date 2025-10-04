import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateComplianceStandardDto {
  @ApiProperty({ description: 'Name of the compliance standard (e.g., ISO 27001, PCI DSS, SOX)' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Version of the standard (e.g., 2022, 3.2.1, 2018)', required: false })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({ description: 'Brief description of the compliance standard', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Category of the standard (e.g., Information Security, Financial, Privacy, Quality)' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Whether this standard is active', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Whether this is the default standard for new organizations', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ description: 'Additional metadata for the standard', required: false })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
