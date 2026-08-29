"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const users_module_1 = require("../users/users.module");
const auth_controller_1 = require("./auth.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const magic_link_repository_1 = require("./repositories/magic-link.repository");
const magic_link_service_1 = require("./services/magic-link.service");
const token_service_1 = require("./services/token.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const cfg = configService.get('auth');
                    if (!cfg)
                        throw new Error('Auth config not loaded');
                    return {
                        secret: cfg.jwtSecret,
                        signOptions: { expiresIn: cfg.jwtExpiresIn },
                    };
                },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [jwt_strategy_1.JwtStrategy, magic_link_repository_1.MagicLinkRepository, magic_link_service_1.MagicLinkService, token_service_1.TokenService],
        exports: [token_service_1.TokenService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map