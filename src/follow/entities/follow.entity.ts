import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Follow extends BaseEntity {
  @PrimaryColumn()
  followerId: string;
  @ManyToOne(() => User, (user) => user.followers)
  follower: User;

  @PrimaryColumn()
  followingId: string;
  @ManyToOne(() => User, (user) => user.followings)
  following: User;
}
