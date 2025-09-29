import { IsString, IsOptional, IsBoolean, IsObject, IsEmail, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Bank of Kenya',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Organization domain',
    example: 'bankofkenya.com',
    pattern: '^[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
  })
  @IsString()
  domain: string;

  @ApiPropertyOptional({
    description: 'Organization subdomain for tenant access',
    example: 'bok',
    minLength: 2,
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  subdomain?: string;

  @ApiPropertyOptional({
    description: 'Whether the organization is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Organization-specific settings and configuration',
    example: {
      theme: 'blue',
      logo: 'bok-logo.png',
      timezone: 'Africa/Nairobi',
      currency: 'KES',
      language: 'en',
      maxUsers: 100,
      features: ['compliance', 'risk_management', 'audit_trail']
    }
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
