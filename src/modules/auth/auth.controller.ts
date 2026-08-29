/**
 * ===========================================================
 *   AUTH CONTROLLER — Magic Link endpoints
 * ===========================================================
 *
 * POST /auth/magic-link        → request a login link
 * POST /auth/magic-link/verify → verify token, get JWT
 * GET  /auth/me                → current user (protected)
 * ===========================================================
 */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser, AuthUser, Public } from '@common/index';
import { UsersService } from '@modules/users/users.service';

import { RequestMagicLinkDto } from './dto/request-magic-link.dto';
import { VerifyMagicLinkDto } from './dto/verify-magic-link.dto';
import { MagicLinkService } from './services/magic-link.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly magicLinks: MagicLinkService,
    private readonly users: UsersService,
  ) {}

  /**
   * Request a magic login link.
   * Always returns the same response shape regardless of user existence.
   */
  @Public()
  @Post('magic-link')
  @HttpCode(HttpStatus.OK)
  async requestMagicLink(
    @Body() dto: RequestMagicLinkDto,
    @Ip() ip: string,
  ) {
    const { expiresAt, devToken } = await this.magicLinks.requestMagicLink(
      dto.email,
      ip,
      dto.userAgent,
    );

    return {
      message: 'If an account exists for this email, a login link has been sent.',
      expiresAt,
      // শুধু dev mode এ raw token দেখানো হয়
      ...(devToken ? { devToken, devNote: 'Token visible only in development.' } : {}),
    };
  }

  /**
   * Verify magic link token → JWT access token.
   */
  @Public()
  @Post('magic-link/verify')
  @HttpCode(HttpStatus.OK)
  async verifyMagicLink(@Body() dto: VerifyMagicLinkDto) {
    return this.magicLinks.verifyMagicLink(dto.token);
  }

  /**
   * Current authenticated user — useful for the frontend.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const fullUser = await this.users.findById(user.id);
    if (!fullUser) return user;

    return {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      role: fullUser.role,
      isVerified: fullUser.is_verified,
      lastLoginAt: fullUser.last_login_at,
      createdAt: fullUser.created_at,
    };
  }
}