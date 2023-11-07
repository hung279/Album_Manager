import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { EntityCondition } from 'src/common/types/entity-condition.type';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
  ) {}

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumRepository.save(
      this.albumRepository.create(createAlbumDto),
    );
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
}
