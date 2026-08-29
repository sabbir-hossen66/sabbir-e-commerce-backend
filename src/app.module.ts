/**
 * ===========================================================
 *   ROOT APP MODULE
 * ===========================================================
 *
 * নতুন module যোগ করতে:
 *   1. src/modules/<feature>/<feature>.module.ts বানাও
 *   2. নিচের imports array তে add করো
 *   3. (যদি globally দরকার) @Global() decorator ব্যবহার করো
 *
 * Config module এ @config/index থেকে allConfigs load হচ্ছে।
 * ===========================================================
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { allConfigs } from './config';
import { DatabaseModule } from './database';
import { SharedModule } from './shared';
import { AuthModule } from './modules/auth';
import { UsersModule } from './modules/users';

import { AppController } from './app.controller';

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: allConfigs,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    SharedModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}