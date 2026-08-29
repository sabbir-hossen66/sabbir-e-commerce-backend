import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  name: process.env.APP_NAME || 'E-commerce API',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
  isProduction: process.env.NODE_ENV === 'production',
}));

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'super-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  magicLinkTokenExpiresIn: process.env.MAGIC_LINK_EXPIRES_IN || '15m',
}));

export const mailConfig = registerAs('mail', () => ({
  magicLinkFrontendUrl: process.env.FRONTEND_MAGIC_LINK_URL || 'http://localhost:3001/auth/verify',
}));

export interface AppConfig {
  port: number;
  name: string;
  baseUrl: string;
  frontendUrl: string;
  isProduction: boolean;
}


export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  magicLinkTokenExpiresIn: string;
}

export interface MailConfig {
  magicLinkFrontendUrl: string;
}

export const allConfigs = [appConfig, authConfig, mailConfig];
