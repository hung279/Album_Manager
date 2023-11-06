import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { name, username, password, email } = signUpDto;
    const user = await this.userService.findByUsernameOrEmail(username, email);

    if (user) {
      throw new BadRequestException('User existed');
    }

    const hashPassword = await bcrypt.hash(password, 7);

    await this.userService.createUser({
      name,
      username,
      password: hashPassword,
      email,
      verifyToken: '111111',
    });

    // This is mailService
    // TODO something
  }

  async confirmEmail(verifyToken: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { verifyToken } });

    if (!user) {
      throw new BadRequestException('Verify token invalid');
    }

    await this.userRepository.update(user.id, {
      status: 'active',
      verifyToken: null,
    });
  }
}
