import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { LessThan, Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadToken } from './interface/payload-token.interface';
import { ResponeLogin } from './interface/respone-login.interface';
import { ConfigService } from '@nestjs/config';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import sha256 from 'crypto-js/sha256';
import { Status } from 'src/common/enums/status-user.enum';

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
    const user = await this.userService.findOne([{ username }, { email }]);

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
      status: Status.ACTIVE,
      verifyToken: null,
    });
  }

  async signIn(signInDto: SignInDto): Promise<ResponeLogin> {
    const { username, password } = signInDto;
    const user = await this.userService.findOne([
      { username },
      { email: username },
    ]);

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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findOne(forgotPasswordDto);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordResetToken = sha256(user.email);
    const passwordResetExpires = this.configService.get('reset_pass.expires');

    await this.userRepository.update(user.id, {
      passwordResetToken,
      passwordResetExpires: Date.now() + passwordResetExpires * 60000,
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { password, token } = resetPasswordDto;
    const userForgot = await this.userService.findOne({
      passwordResetToken: token,
      passwordResetExpires: LessThan(Date.now()),
    });

    if (!userForgot) {
      throw new BadRequestException('Reset password token is invalid');
    }

    const newPassword = await bcrypt.hash(password, 7);
    await this.userRepository.update(userForgot.id, {
      password: newPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }
}
