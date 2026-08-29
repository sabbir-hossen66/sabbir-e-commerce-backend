/**
 * Roles guard — @Roles('admin', 'vendor') decorator এর সাথে ব্যবহার।
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthUser } from '@common/decorators/current-user.decorator';
import { ForbiddenException, UnauthorizedException } from '@common/index';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) =>
  Reflect.metadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = req.user;
    if (!user) throw new UnauthorizedException();

    if (!required.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}