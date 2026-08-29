/**
 * ===========================================================
 *   MAGIC LINK SERVICE
 * ===========================================================
 *
 * Flow:
 *  1. Client email দেয় → backend secure token generate করে
 *  2. Token hash DB তে save হয় (raw token কখনো save হয় না)
 *  3. Magic link email এ পাঠানো হয়
 *  4. User click করলে token verify → JWT access token দেয়
 * ===========================================================
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailConfig } from '@config/index';
import {
  BadRequestException,
  NotFoundException,
} from '@common/index';
import { generateSecureToken, hashToken, minutesFromNow } from '@shared/utils/crypto.util';
import { MailService } from '@shared/services/mail.service';
import { UserRepository } from '@modules/users/repositories/user.repository';

import { MagicLinkRepository } from '../repositories/magic-link.repository';
import { TokenService } from './token.service';

export interface IssuedMagicLink {
  expiresAt: Date;
  // Dev mode এ raw token ফেরত দেওয়া হয় (testing এর জন্য)
  devToken?: string;
}

@Injectable()
export class MagicLinkService {
  private readonly logger = new Logger(MagicLinkService.name);
  private readonly mailConfig: MailConfig;

  constructor(
    private readonly magicLinks: MagicLinkRepository,
    private readonly users: UserRepository,
    private readonly mail: MailService,
    private readonly tokenService: TokenService,
    configService: ConfigService,
  ) {
    const cfg = configService.get<MailConfig>('mail');
    if (!cfg) throw new Error('Mail config not loaded');
    this.mailConfig = cfg;
  }

  /**
   * Email এ magic link পাঠানো হবে।
   * User না থাকলেও same response দেওয়া হয় (account enumeration protection)।
   */
  async requestMagicLink(email: string, ip: string | null, userAgent?: string): Promise<IssuedMagicLink> {
    const normalized = email.toLowerCase();
    const rawToken = generateSecureToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = minutesFromNow(Math.max(5, Math.floor(this.tokenService.magicLinkTtlMs / 60_000)));

    // পুরাতন unused tokens invalidate করে দাও
    await this.magicLinks.invalidateByEmail(normalized);

    const link = await this.magicLinks.create({
      email: normalized,
      token_hash: tokenHash,
      expires_at: expiresAt,
      ip_address: ip,
      user_agent: userAgent ?? null,
    } as never);

    // URL build করা হচ্ছে — frontend এই URL এ visit করবে
    const url = `${this.mailConfig.magicLinkFrontendUrl}?token=${encodeURIComponent(rawToken)}`;

    await this.mail.send({
      to: normalized,
      subject: 'Your secure login link',
      html: this.renderEmail(url, expiresAt),
    });

    this.logger.log(`Magic link issued for ${normalized} (id=${link.id})`);

    // Dev convenience — controller dev token return করতে পারে
    if (process.env.NODE_ENV !== 'production') {
      return { expiresAt, devToken: rawToken };
    }
    return { expiresAt };
  }

  /** Magic link verify করে JWT access token দেয়। */
  async verifyMagicLink(rawToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
    user: { id: string; email: string; name: string | null; role: string; isVerified: boolean };
  }> {
    if (!rawToken || rawToken.length < 16) {
      throw new BadRequestException('Invalid token');
    }

    const tokenHash = hashToken(rawToken);
    const link = await this.magicLinks.findActiveByTokenHash(tokenHash);
    if (!link) {
      throw new NotFoundException('Token is invalid or expired');
    }

    // Atomic: mark used + upsert user + issue token
    await this.magicLinks.markUsed(link.id);

    const user = await this.users.upsertByEmail(link.email, {
      is_verified: true,
      last_login_at: new Date(),
    } as never);

    await this.users.markLogin(user.id);

    const { token, expiresIn } = this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: token,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.is_verified,
      },
    };
  }

  private renderEmail(url: string, expiresAt: Date): string {
    const minutes = Math.max(1, Math.round((expiresAt.getTime() - Date.now()) / 60_000));
    return `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: auto;">
        <h2>Sign in</h2>
        <p>Click the button below to securely sign in. The link expires in ${minutes} minutes.</p>
        <p style="margin: 24px 0;">
          <a href="${url}" style="background:#111;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
            Sign in to your account
          </a>
        </p>
        <p>If the button doesn't work, copy this URL:</p>
        <p style="word-break: break-all; color:#555;">${url}</p>
        <p style="color:#999;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `;
  }
}