import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityCondition } from 'src/common/types/entity-condition.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(this.userRepository.create(createUserDto));
  }

  async findOne(fields: EntityCondition<User>): Promise<User | null> {
    return this.userRepository.findOne({
      where: fields,
    });
  }
}
