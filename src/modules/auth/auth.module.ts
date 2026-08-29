import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthConfig } from '@config/index';
import { UsersModule } from '@modules/users/users.module';

import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MagicLinkRepository } from './repositories/magic-link.repository';
import { MagicLinkService } from './services/magic-link.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const cfg = configService.get<AuthConfig>('auth');
        if (!cfg) throw new Error('Auth config not loaded');
        return {
          secret: cfg.jwtSecret,
          signOptions: { expiresIn: cfg.jwtExpiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, MagicLinkRepository, MagicLinkService, TokenService],
  exports: [TokenService],
})
export class AuthModule {}