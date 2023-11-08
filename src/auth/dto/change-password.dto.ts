import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MaxLength(30)
  @MinLength(8)
  @IsNotEmpty()
  readonly newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;
}
