import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto);
  }

  @Post('confirm-email')
  async confirmEmail(@Query() confirmEmail: ConfirmEmailDto) {
    return this.authService.confirmEmail(confirmEmail.verifyToken);
  }
}
