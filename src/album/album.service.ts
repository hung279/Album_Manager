import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { EntityCondition } from 'src/common/types/entity-condition.type';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createAlbum(
    userId: string,
    createAlbumDto: CreateAlbumDto,
  ): Promise<Album> {
    const album = await this.albumRepository.save(createAlbumDto);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['albums'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.albums.push(album);

    await this.userRepository.save(user);

    return album;
  }

  async getAllAlbums(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async findOne(fields: EntityCondition<Album>): Promise<Album | null> {
    return this.albumRepository.findOne({
      where: fields,
    });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<void> {
    const Album = await this.findOne({ id });

    if (!Album) {
      throw new NotFoundException('Album not found');
    }

    await this.albumRepository.update(id, updateAlbumDto);
  }

  async softDelete(id: string): Promise<void> {
    await this.albumRepository.softDelete(id);
  }

  async joinAlbum(userId: string, albumId: string): Promise<Album> {
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['albums'],
    });

    const hasUserExisted = await this.hasUserExistedAlbum(user.id, albumId);

    if (hasUserExisted) {
      throw new BadRequestException('User has existed in this ablum');
    }

    user.albums.push(album);
    await this.userRepository.save(user);

    return album;
  }

  async hasUserExistedAlbum(userId: string, albumId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['albums'],
    });

    return user.albums.some((album) => album.id === albumId);
  }

  async getAlbumsUser(userId: string): Promise<Album[]> {
    const userHasAlbums = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.albums', 'album')
      .groupBy('user.id')
      .addGroupBy('album.id')
      .having('user.id = :userId', { userId })
      .getOne();

    const albums = userHasAlbums.albums;
    return albums;
  }
}
