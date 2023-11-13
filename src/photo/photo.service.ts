import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';
import { EntityCondition } from 'src/common/types/entity-condition.type';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { User } from 'src/user/entities/user.entity';
import { Album } from 'src/album/entities/album.entity';
import { PhotoToAlbumDto } from './dto/photo-to-album.dto';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    private albumService: AlbumService,
  ) {}

  async createPhoto(
    userId: string,
    createPhotoDto: CreatePhotoDto,
  ): Promise<Photo> {
    const photo = this.photoRepository.create(createPhotoDto);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['photos'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    photo.user = user;
    await this.photoRepository.save(photo);

    return photo;
  }

  async getAllPhotos(): Promise<Photo[]> {
    return this.photoRepository.find();
  }

  async findOne(
    fields: EntityCondition<Photo>,
    relationOptions?: string[],
  ): Promise<Photo | null> {
    return this.photoRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }

  async addPhotoToAlbum(
    userId: string,
    photoToAlbumDto: PhotoToAlbumDto,
  ): Promise<Album> {
    const { photoIds, albumId } = photoToAlbumDto;

    const album = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['photos'],
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    const checkUserExistAlbum = await this.albumService.hasUserExistedAlbum(
      userId,
      album.id,
    );
    if (!checkUserExistAlbum) {
      throw new BadRequestException('User has not existed in this album');
    }

    let photos: Photo | Photo[] = [];
    if (Array.isArray(photoIds)) {
      photos = await Promise.all(
        photoIds.map(async (photoId) => {
          const photo = await this.findOne({ id: photoId }, ['user']);
          if (!photo) {
            throw new NotFoundException('Photo not found');
          }

          if (photo.user.id !== userId) {
            throw new BadRequestException(
              'This photo is not belong to this user',
            );
          }

          return photo;
        }),
      );

      album.photos = [...album.photos, ...photos];
    } else {
      photos = await this.findOne({ id: photoIds }, ['user']);
      if (!photos) {
        throw new NotFoundException('Photo not found');
      }

      if (photos.user.id !== userId) {
        throw new BadRequestException('This photo is not belong to this user');
      }

      album.photos.push(photos);
    }

    await this.albumRepository.save(album);
    return album;
  }

  async getPhotosUser(userId: string): Promise<Photo[]> {
    const photos = await this.photoRepository
      .createQueryBuilder('photo')
      .innerJoinAndSelect('photo.user', 'user')
      .groupBy('user.id')
      .addGroupBy('photo.id')
      .having('user.id = :userId', { userId })
      .getMany();

    return photos;
  }
}
