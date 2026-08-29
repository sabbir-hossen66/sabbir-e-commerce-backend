import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
export declare class TokenService {
    private readonly jwtService;
    private readonly config;
    constructor(jwtService: JwtService, configService: ConfigService);
    signAccessToken(payload: JwtPayload): {
        token: string;
        expiresIn: number;
    };
    verify(token: string): JwtPayload;
    get magicLinkTtlMs(): number;
}
