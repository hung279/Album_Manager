import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Photo extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 500,
  })
  name: string;

  @Column()
  link: string;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @Column()
  status: string;
}
