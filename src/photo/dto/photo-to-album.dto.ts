import { IsNotEmpty, IsString } from 'class-validator';

export class PhotoToAlbumDto {
  @IsNotEmpty()
  readonly photoIds: string | string[];

  @IsString()
  @IsNotEmpty()
  readonly albumId: string;
}
