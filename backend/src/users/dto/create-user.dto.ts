import { IsEmail, IsString, IsOptional, IsEnum, IsInt, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123', description: 'The password of the user' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: UserRole.STAFF, enum: UserRole, description: 'The role of the user' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.STAFF;

  @ApiProperty({ example: 1, description: 'The ID of the branch the user belongs to (optional)', required: false })
  @IsInt()
  @IsOptional()
  branchId?: number;
}
