import { ApiProperty } from '@nestjs/swagger';

export class BranchResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: 'Organization-specific branch ID (1, 2, 3, etc. per organization)' })
  branchId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  organizationId: number;

  @ApiProperty({ required: false })
  managerId?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
