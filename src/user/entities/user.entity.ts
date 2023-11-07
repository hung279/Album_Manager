import { BaseEntity } from 'src/common/entities/base.entity';
import { Status } from 'src/common/enums/status-user.enum';
import { Photo } from 'src/photo/entities/photo.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: [Status.ACTIVE, Status.INACTIVE],
    default: Status.INACTIVE,
  })
  status: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @Column({
    name: 'verify_token',
    nullable: true,
  })
  verifyToken: string;

  @Column({
    name: 'password_reset_token',
    nullable: true,
  })
  passwordResetToken: string;

  @Column({
    name: 'password_reset_expires',
    nullable: true,
    type: 'bigint',
  })
  passwordResetExpires: number;
}
