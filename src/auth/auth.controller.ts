import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponeLogin } from './interface/respone-login.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from 'src/user/entities/user.entity';
import { UserRequest } from 'src/common/decorators/user-request.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SkipAuth } from 'src/common/decorators/skip-auth.decotator';
@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto);
  }

  @SkipAuth()
  @Post('confirm-email')
  async confirmEmail(@Body() confirmEmail: ConfirmEmailDto) {
    return this.authService.confirmEmail(confirmEmail);
  }

  @SkipAuth()
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<ResponeLogin> {
    return this.authService.signIn(signInDto);
  }

  @SkipAuth()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @SkipAuth()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('me')
  async getMe(@UserRequest() userId): Promise<User> {
    return this.authService.getMe(userId);
  }

  @Patch('me')
  async updateProfile(
    @UserRequest() userId,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.authService.updateProfile(userId, updateProfileDto);
  }

  @Patch('change-password')
  async changePassword(
    @UserRequest() userId,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changePassword(userId, changePasswordDto);
  }
}
