import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'hashed_refresh_token', description: 'The refresh token for the user', required: false })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
