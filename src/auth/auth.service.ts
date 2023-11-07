import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadToken } from './interface/payload-token.interface';
import { ResponeLogin } from './interface/respone-login.interface';
import { ConfigService } from '@nestjs/config';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  async confirmEmail(confirmEmailDto: ConfirmEmailDto): Promise<void> {
    const { email, verifyToken } = confirmEmailDto;
    const user = await this.userRepository.findOne({
      where: { email, verifyToken },
    });

    if (!user) {
      throw new BadRequestException('Verify token invalid');
    }

    await this.userRepository.update(user.id, {
      status: 'active',
      verifyToken: null,
    });
  }

  async signIn(signInDto: SignInDto): Promise<ResponeLogin> {
    const { username, password } = signInDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username OR user.email = :username', {
        username,
      })
      .getOne();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Username or password invalid');
    }

    const payload = { userId: user.id };
    const accessToken = await this.generateToken(payload);

    return {
      accessToken,
    };
  }

  async generateToken(payload: PayloadToken): Promise<string> {
    const secret = this.configService.get('jwt.secret');
    const expiresIn = this.configService.get('jwt.expiresIn');

    const options = {
      secret,
      expiresIn,
    };

    return this.jwtService.signAsync(payload, options);
  }
}
