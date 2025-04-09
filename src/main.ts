import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppConfig } from './config/app.config';
import { acceptedDomains } from './lib/utils';
import { Environment } from './config/app.config.validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const configService = app.get(ConfigService);
  const { version, isDev, port, baseUrl, globalPrefix, nodeEnv } =
    configService.get<AppConfig>('app') as AppConfig;

  app.use(cookieParser());

  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: acceptedDomains[nodeEnv as Environment],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('Beam server v1 Api')
      .setDescription('The Beam API description')
      .setVersion(version)
      .addBearerAuth({
        type: 'http',
      })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);
  }

  await app.listen(port, () => {
    logger.log(`App listening on ${baseUrl}${globalPrefix}`);
    logger.log(`📜 Doc available at: ${baseUrl}/api/docs`);
  });
}
bootstrap();
