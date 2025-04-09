import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import { validate } from './app.config.validator';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validate,
    }),
  ],
})
export class ConfigModule {}
