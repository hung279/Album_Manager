import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { AuthGuard } from './guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleGuard } from './guards/role.guard';
import { Role } from 'src/common/enums/role.enum';
@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto);
  }

  @Post('confirm-email')
  async confirmEmail(@Body() confirmEmail: ConfirmEmailDto) {
    return this.authService.confirmEmail(confirmEmail);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<ResponeLogin> {
    return this.authService.signIn(signInDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User)
  @Get('me')
  async getMe(@UserRequest() user): Promise<User> {
    return this.authService.getMe(user.userId);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User)
  @Patch('me')
  async updateProfile(
    @UserRequest() user,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.authService.updateProfile(user.userId, updateProfileDto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User)
  @Patch('change-password')
  async changePassword(
    @UserRequest() user,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changePassword(user.userId, changePasswordDto);
  }
}
