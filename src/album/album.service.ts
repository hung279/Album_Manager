import { Injectable, NotFoundException } from '@nestjs/common';
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
    const album = this.albumRepository.create(createAlbumDto);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    album.users = [user];

    await this.albumRepository.save(album);

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
      relations: ['users'],
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    album.users.push(user);
    await this.albumRepository.save(album);

    return album;
  }
}
