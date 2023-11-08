import { Body, Controller, Get, Post } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Photo } from './entities/photo.entity';
import { UserRequest } from 'src/common/decorators/user-request.decorator';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Photos')
@Controller('api/v1/photos')
export class PhotoController {
  constructor(private photoService: PhotoService) {}
  @Get()
  async getAllPhotos(): Promise<Photo[]> {
    return this.photoService.getAllPhotos();
  }

  @Post()
  async createPhoto(
    @UserRequest() userId,
    @Body() createPhotoDto: CreatePhotoDto,
  ): Promise<Photo> {
    return this.photoService.createPhoto(userId, createPhotoDto);
  }
}
