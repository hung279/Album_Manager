import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Photo } from './entities/photo.entity';
import { UserRequest } from 'src/common/decorators/user-request.decorator';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { PhotoToAlbumDto } from './dto/photo-to-album.dto';
import { Album } from 'src/album/entities/album.entity';

@ApiTags('Photos')
@Controller('api/v1/photos')
export class PhotoController {
  constructor(private photoService: PhotoService) {}
  @Get()
  async getAllPhotos(): Promise<Photo[]> {
    return this.photoService.getAllPhotos();
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  async createPhoto(
    @UserRequest() user,
    @Body() createPhotoDto: CreatePhotoDto,
  ): Promise<Photo> {
    return this.photoService.createPhoto(user.userId, createPhotoDto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User)
  @Get('user')
  async getAlbumUser(@UserRequest() user): Promise<Photo[]> {
    return this.photoService.getPhotosUser(user.userId);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User)
  @Post('album')
  async addPhotoToAlbum(
    @UserRequest() user,
    @Body() photoToAlbumDto: PhotoToAlbumDto,
  ): Promise<Album> {
    return this.photoService.addPhotoToAlbum(user.userId, photoToAlbumDto);
  }
}
