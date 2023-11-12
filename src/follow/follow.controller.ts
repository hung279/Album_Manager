import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FollowService } from './follow.service';
import { UserRequest } from 'src/common/decorators/user-request.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';

@ApiTags('Follows')
@Controller('api/v1/follows')
export class FollowController {
  constructor(private followService: FollowService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Post(':followingId')
  async followUser(
    @UserRequest() user,
    @Param('followingId') follwingId: string,
  ) {
    return this.followService.followUser(user.userId, follwingId);
  }
}
