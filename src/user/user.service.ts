import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityCondition } from 'src/common/types/entity-condition.type';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(this.userRepository.create(createUserDto));
  }

  async findOne(fields: EntityCondition<User>): Promise<User | null> {
    return this.userRepository.findOne({
      where: fields,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { email, username } = updateUserDto;

    if (email || username) {
      const existEmailorUsernam = await this.findOne([{ email }, { username }]);

      if (existEmailorUsernam) {
        throw new BadRequestException('Email or username is used');
      }
    }

    await this.userRepository.update(id, updateUserDto);
  }

  async softDelete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
