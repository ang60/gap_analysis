import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({
    description: 'The role to assign to the user',
    enum: UserRole,
    example: UserRole.MANAGER
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
