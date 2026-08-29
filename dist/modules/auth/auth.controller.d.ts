import { AuthUser } from '@common/index';
import { UsersService } from '@modules/users/users.service';
import { RequestMagicLinkDto } from './dto/request-magic-link.dto';
import { VerifyMagicLinkDto } from './dto/verify-magic-link.dto';
import { MagicLinkService } from './services/magic-link.service';
export declare class AuthController {
    private readonly magicLinks;
    private readonly users;
    constructor(magicLinks: MagicLinkService, users: UsersService);
    requestMagicLink(dto: RequestMagicLinkDto, ip: string): Promise<{
        devToken?: string | undefined;
        devNote?: string | undefined;
        message: string;
        expiresAt: Date;
    }>;
    verifyMagicLink(dto: VerifyMagicLinkDto): Promise<{
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
    me(user: AuthUser): Promise<AuthUser | {
        id: string;
        email: string;
        name: string | null;
        role: string;
        isVerified: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
}
