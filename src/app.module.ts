import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration, { configValidationSchema } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
