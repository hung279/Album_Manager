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
import { UserRequest } from 'src/common/decorators/user-request.decorator';
import { JoinAlbumDto } from './dto/join-album.dto';

@ApiTags('Album')
@Controller('api/v1/albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  async getAllAlbums(): Promise<Album[]> {
    return this.albumService.getAllAlbums();
  }

  @Post()
  async createAlbum(
    @UserRequest() userId,
    @Body() createAlbumDto: CreateAlbumDto,
  ): Promise<Album> {
    return this.albumService.createAlbum(userId, createAlbumDto);
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

  @Post('join')
  async joinAlbum(
    @UserRequest() userId,
    @Body() joinAlbumDto: JoinAlbumDto,
  ): Promise<Album> {
    return this.albumService.joinAlbum(userId, joinAlbumDto.albumId);
  }
}
