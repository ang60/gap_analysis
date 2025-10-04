import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-organization.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @ApiPropertyOptional({
    description: 'Organization name',
    example: 'Acme Corporation Updated',
    minLength: 2,
    maxLength: 100
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Organization domain',
    example: 'acme.com',
    pattern: '^[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
  })
  domain?: string;

  @ApiPropertyOptional({
    description: 'Organization subdomain for tenant access',
    example: 'bok',
    minLength: 2,
    maxLength: 20
  })
  subdomain?: string;

  @ApiPropertyOptional({
    description: 'Whether the organization is active',
    example: true
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Organization-specific settings and configuration',
    example: {
      theme: 'green',
      logo: 'bok-logo-new.png',
      timezone: 'Africa/Nairobi',
      currency: 'KES',
      language: 'en',
      maxUsers: 150,
      features: ['compliance', 'risk_management', 'audit_trail', 'advanced_reporting']
    }
  })
  settings?: Record<string, any>;
}
