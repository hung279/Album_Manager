import { BaseEntity } from 'src/common/entities/base.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Album extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @OneToMany(() => Photo, (photo) => photo.album)
  photos: Photo[];

  @ManyToMany(() => User)
  users: User[];
}
