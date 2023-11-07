import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Album')
@Controller('api/v1/albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  async getAllAlbums(): Promise<Album[]> {
    return this.albumService.getAllAlbums();
  }

  @Post()
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumService.createAlbum(createAlbumDto);
  }

  @Patch(':id')
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<void> {
    await this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: string): Promise<void> {
    await this.albumService.softDelete(id);
  }
}
