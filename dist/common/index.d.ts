export * from './decorators/public.decorator';
export * from './filters/all-exceptions.filter';
export * from './interceptors/response.interceptor';
export * from './decorators/current-user.decorator';
import { HttpException } from '@nestjs/common';
export interface AuthUser {
    id: string;
    email: string;
    role: string;
}
export declare class BadRequestException extends HttpException {
    constructor(message?: string);
}
export declare class NotFoundException extends HttpException {
    constructor(message?: string);
}
export declare class ForbiddenException extends HttpException {
    constructor(message?: string);
}
export declare class UnauthorizedException extends HttpException {
    constructor(message?: string);
}
