import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';
import { EntityCondition } from 'src/common/types/entity-condition.type';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createPhoto(
    userId: string,
    createPhotoDto: CreatePhotoDto,
  ): Promise<Photo> {
    const photo = this.photoRepository.create(createPhotoDto);

    const user = await this.userRepository.findOne({
      where: { id: userId },
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

  async findOne(fields: EntityCondition<Photo>): Promise<Photo | null> {
    return this.photoRepository.findOne({
      where: fields,
    });
  }
}
