import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Priority } from '@prisma/client';

export class CreateRequirementDto {
  @ApiProperty({ example: 'A.9.2.1', description: 'The clause identifier (e.g., A.9.2.1)' })
  @IsString()
  clause: string;

  @ApiProperty({ example: 'A.9.2.1.1', description: 'The sub-clause identifier if applicable', required: false })
  @IsString()
  @IsOptional()
  subClause?: string;

  @ApiProperty({ example: 'User access provisioning', description: 'Title of the requirement' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'The organization shall control the allocation and use of privileged access rights to information systems and services.', description: 'Detailed description of the requirement' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'ISO 27001', description: 'Category or framework this requirement belongs to', required: false })
  @IsString()
  @IsOptional()
  category?: string = 'ISO 27001';

  @ApiProperty({ example: 'ISO 27001:2022', description: 'The standard version this requirement is from', required: false })
  @IsString()
  @IsOptional()
  standard?: string = 'ISO 27001:2022';

  @ApiProperty({ example: 'Access Control', description: 'The section or domain this requirement belongs to' })
  @IsString()
  section: string;

  @ApiProperty({ example: true, description: 'Whether this requirement is mandatory for compliance', required: false })
  @IsBoolean()
  @IsOptional()
  isMandatory?: boolean = true;

  @ApiProperty({ example: Priority.MEDIUM, enum: Priority, description: 'Priority level of this requirement', required: false })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority = Priority.MEDIUM;
}
