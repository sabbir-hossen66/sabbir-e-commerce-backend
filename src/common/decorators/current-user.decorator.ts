import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthUser } from '../index';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export { AuthUser };
