import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { UserModule } from 'src/user/user.module';
import { AlbumModule } from 'src/album/album.module';
import { User } from 'src/user/entities/user.entity';
import { Album } from 'src/album/entities/album.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo, User, Album]),
    UserModule,
    AlbumModule,
  ],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {}
