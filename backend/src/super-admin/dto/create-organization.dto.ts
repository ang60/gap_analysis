import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Equity Bank Kenya'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Organization domain',
    example: 'equitybank.com'
  })
  @IsString()
  @IsNotEmpty()
  domain: string;

  @ApiProperty({
    description: 'Organization subdomain (optional)',
    example: 'equity',
    required: false
  })
  @IsString()
  @IsOptional()
  subdomain?: string;

  @ApiProperty({
    description: 'Whether the organization is active',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
