import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { AuthUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '../services/token.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<AuthUser>;
}
export {};
