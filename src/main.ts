/**
 * ===========================================================
 *   APP ENTRY POINT
 * ===========================================================
 */
import 'reflect-metadata';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionsFilter, ResponseInterceptor } from '@common/index';
import { AppConfig } from '@config/index';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const config = app.get(ConfigService);
  const appConfig = config.get<AppConfig>('app')!;

  app.use(helmet());
  app.enableCors({
    origin: appConfig.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  if (!appConfig.isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(appConfig.name)
      .setDescription('E-commerce backend API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(appConfig.port);
  const logger = new Logger('Bootstrap');
  logger.log(`🚀 ${appConfig.name} running on ${appConfig.baseUrl}/api`);
  logger.log(`📘 Swagger docs: ${appConfig.baseUrl}/api/docs`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
