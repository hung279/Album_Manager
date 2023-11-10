import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration, { configValidationSchema } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PhotoModule } from './photo/photo.module';
import { AlbumModule } from './album/album.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UserModule,
    AuthModule,
    PhotoModule,
    AlbumModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
