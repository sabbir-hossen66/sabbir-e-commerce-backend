"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MagicLinkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicLinkService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const index_1 = require("../../../common/index");
const crypto_util_1 = require("../../../shared/utils/crypto.util");
const mail_service_1 = require("../../../shared/services/mail.service");
const user_repository_1 = require("../../users/repositories/user.repository");
const magic_link_repository_1 = require("../repositories/magic-link.repository");
const token_service_1 = require("./token.service");
let MagicLinkService = MagicLinkService_1 = class MagicLinkService {
    constructor(magicLinks, users, mail, tokenService, configService) {
        this.magicLinks = magicLinks;
        this.users = users;
        this.mail = mail;
        this.tokenService = tokenService;
        this.logger = new common_1.Logger(MagicLinkService_1.name);
        const cfg = configService.get('mail');
        if (!cfg)
            throw new Error('Mail config not loaded');
        this.mailConfig = cfg;
    }
    async requestMagicLink(email, ip, userAgent) {
        const normalized = email.toLowerCase();
        const rawToken = (0, crypto_util_1.generateSecureToken)(32);
        const tokenHash = (0, crypto_util_1.hashToken)(rawToken);
        const expiresAt = (0, crypto_util_1.minutesFromNow)(Math.max(5, Math.floor(this.tokenService.magicLinkTtlMs / 60_000)));
        await this.magicLinks.invalidateByEmail(normalized);
        const link = await this.magicLinks.create({
            email: normalized,
            token_hash: tokenHash,
            expires_at: expiresAt,
            ip_address: ip,
            user_agent: userAgent ?? null,
        });
        const url = `${this.mailConfig.magicLinkFrontendUrl}?token=${encodeURIComponent(rawToken)}`;
        await this.mail.send({
            to: normalized,
            subject: 'Your secure login link',
            html: this.renderEmail(url, expiresAt),
        });
        this.logger.log(`Magic link issued for ${normalized} (id=${link.id})`);
        if (process.env.NODE_ENV !== 'production') {
            return { expiresAt, devToken: rawToken };
        }
        return { expiresAt };
    }
    async verifyMagicLink(rawToken) {
        if (!rawToken || rawToken.length < 16) {
            throw new index_1.BadRequestException('Invalid token');
        }
        const tokenHash = (0, crypto_util_1.hashToken)(rawToken);
        const link = await this.magicLinks.findActiveByTokenHash(tokenHash);
        if (!link) {
            throw new index_1.NotFoundException('Token is invalid or expired');
        }
        await this.magicLinks.markUsed(link.id);
        const user = await this.users.upsertByEmail(link.email, {
            is_verified: true,
            last_login_at: new Date(),
        });
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
    renderEmail(url, expiresAt) {
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
};
exports.MagicLinkService = MagicLinkService;
exports.MagicLinkService = MagicLinkService = MagicLinkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [magic_link_repository_1.MagicLinkRepository,
        user_repository_1.UserRepository,
        mail_service_1.MailService,
        token_service_1.TokenService,
        config_1.ConfigService])
], MagicLinkService);
//# sourceMappingURL=magic-link.service.js.map