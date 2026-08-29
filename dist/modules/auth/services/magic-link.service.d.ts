import { ConfigService } from '@nestjs/config';
import { MailService } from '@shared/services/mail.service';
import { UserRepository } from '@modules/users/repositories/user.repository';
import { MagicLinkRepository } from '../repositories/magic-link.repository';
import { TokenService } from './token.service';
export interface IssuedMagicLink {
    expiresAt: Date;
    devToken?: string;
}
export declare class MagicLinkService {
    private readonly magicLinks;
    private readonly users;
    private readonly mail;
    private readonly tokenService;
    private readonly logger;
    private readonly mailConfig;
    constructor(magicLinks: MagicLinkRepository, users: UserRepository, mail: MailService, tokenService: TokenService, configService: ConfigService);
    requestMagicLink(email: string, ip: string | null, userAgent?: string): Promise<IssuedMagicLink>;
    verifyMagicLink(rawToken: string): Promise<{
        accessToken: string;
        expiresIn: number;
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
            isVerified: boolean;
        };
    }>;
    private renderEmail;
}
