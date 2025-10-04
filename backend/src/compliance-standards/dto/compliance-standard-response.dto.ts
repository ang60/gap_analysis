import { ApiProperty } from '@nestjs/swagger';

export class ComplianceStandardResponseDto {
  @ApiProperty({ description: 'Unique identifier of the compliance standard' })
  id: number;

  @ApiProperty({ description: 'Name of the compliance standard' })
  name: string;

  @ApiProperty({ description: 'Version of the standard', required: false })
  version?: string | null;

  @ApiProperty({ description: 'Brief description of the standard', required: false })
  description?: string | null;

  @ApiProperty({ description: 'Category of the standard' })
  category: string;

  @ApiProperty({ description: 'Whether the standard is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Whether this is the default standard' })
  isDefault: boolean;

  @ApiProperty({ description: 'Additional metadata', required: false })
  metadata?: any;

  @ApiProperty({ description: 'Organization ID' })
  organizationId: number;

  @ApiProperty({ description: 'Date when the standard was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the standard was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'Organization details', required: false })
  organization?: {
    id: number;
    name: string;
  };

  @ApiProperty({ description: 'Number of requirements under this standard', required: false })
  requirementsCount?: number;
}
