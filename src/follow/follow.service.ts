import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
  ) {}

  async followUser(followerId: string, followingId: string): Promise<void> {
    await this.followRepository.save(
      this.followRepository.create({ followerId, followingId }),
    );
  }
}
