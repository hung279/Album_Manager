import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

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
    });
  }
}
