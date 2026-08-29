/**
 * JWT strategy — access token verify করে req.user সেট করে।
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthConfig } from '@config/index';
import { AuthUser } from '@common/decorators/current-user.decorator';

import { JwtPayload } from '../services/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const cfg = configService.get<AuthConfig>('auth');
    if (!cfg) throw new Error('Auth config not loaded');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
