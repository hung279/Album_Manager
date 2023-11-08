import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinAlbumDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly albumId: string;
}
