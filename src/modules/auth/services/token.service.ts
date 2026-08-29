import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthConfig } from '@config/index';
import { parseDuration } from '@shared/utils/time.util';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class TokenService {
  private readonly config: AuthConfig;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    const cfg = configService.get<AuthConfig>('auth');
    if (!cfg) throw new Error('Auth config not loaded');
    this.config = cfg;
  }

  /** Short-lived access token (default 15 min) */
  signAccessToken(payload: JwtPayload): { token: string; expiresIn: number } {
    const ttl = parseDuration(this.config.jwtExpiresIn);
    const expiresInSec = Math.floor(ttl / 1000);
    const token = this.jwtService.sign(payload, {
      expiresIn: expiresInSec,
    });
    return { token, expiresIn: expiresInSec };
  }

  verify(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  get magicLinkTtlMs(): number {
    return parseDuration(this.config.magicLinkTokenExpiresIn);
  }
}