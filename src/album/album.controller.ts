import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'src/common/decorators/user-request.decorator';
import { JoinAlbumDto } from './dto/join-album.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Album')
@Controller('api/v1/albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  async getAllAlbums(): Promise<Album[]> {
    return this.albumService.getAllAlbums();
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User)
  @Post()
  async createAlbum(
    @UserRequest() user,
    @Body() createAlbumDto: CreateAlbumDto,
  ): Promise<Album> {
    return this.albumService.createAlbum(user.userId, createAlbumDto);
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

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User)
  @Post('join')
  async joinAlbum(
    @UserRequest() user,
    @Body() joinAlbumDto: JoinAlbumDto,
  ): Promise<Album> {
    return this.albumService.joinAlbum(user.userId, joinAlbumDto.albumId);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User)
  @Get('user')
  async getAlbumUser(@UserRequest() user): Promise<Album[]> {
    return this.albumService.getAlbumsUser(user.userId);
  }
}
