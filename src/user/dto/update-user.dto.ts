import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Status } from 'src/common/enums/status-user.enum';

export class UpdateUserDto {
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
  @MaxLength(30)
  @MinLength(8)
  @IsOptional()
  readonly password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({ enum: [Status.ACTIVE, Status.INACTIVE] })
  @IsString()
  @IsOptional()
  readonly status?: Status;
}
