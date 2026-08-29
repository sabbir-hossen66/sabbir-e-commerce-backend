export * from './decorators/public.decorator';
export * from './filters/all-exceptions.filter';
export * from './interceptors/response.interceptor';
export * from './decorators/current-user.decorator';

import { HttpException, HttpStatus } from '@nestjs/common';

export interface AuthUser {

  id: string;
  email: string;
  role: string;
}


export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad Request') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
