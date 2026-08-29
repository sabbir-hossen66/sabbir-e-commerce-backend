"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allConfigs = exports.mailConfig = exports.authConfig = exports.appConfig = void 0;
const config_1 = require("@nestjs/config");
exports.appConfig = (0, config_1.registerAs)('app', () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    name: process.env.APP_NAME || 'E-commerce API',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
    isProduction: process.env.NODE_ENV === 'production',
}));
exports.authConfig = (0, config_1.registerAs)('auth', () => ({
    jwtSecret: process.env.JWT_SECRET || 'super-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    magicLinkTokenExpiresIn: process.env.MAGIC_LINK_EXPIRES_IN || '15m',
}));
exports.mailConfig = (0, config_1.registerAs)('mail', () => ({
    magicLinkFrontendUrl: process.env.FRONTEND_MAGIC_LINK_URL || 'http://localhost:3001/auth/verify',
}));
exports.allConfigs = [exports.appConfig, exports.authConfig, exports.mailConfig];
//# sourceMappingURL=index.js.map