import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5439,
  username: 'postgres',
  password: 'hungyb123',
  database: 'album_manager',
  entities: [__dirname + '/../**/entities/*.entity.ts'],
  autoLoadEntities: true,
  synchronize: true,
};
