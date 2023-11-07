import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAlbumDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly status?: string;
}
