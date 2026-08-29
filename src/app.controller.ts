import { Controller, Get } from '@nestjs/common';

import { Public } from '@common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  root() {
    return {
      name: 'E-Commerce Backend API',
      status: 'ok',
      docs: '/api/docs',
    };
  }

  @Public()
  @Get('health')
  health() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}