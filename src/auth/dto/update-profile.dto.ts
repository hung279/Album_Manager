import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly username?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly email?: string;
}
