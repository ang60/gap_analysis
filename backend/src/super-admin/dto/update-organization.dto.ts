import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Equity Bank Kenya',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Organization domain',
    example: 'equitybank.com',
    required: false
  })
  @IsString()
  @IsOptional()
  domain?: string;

  @ApiProperty({
    description: 'Organization subdomain',
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
