"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const index_1 = require("../../common/index");
const users_service_1 = require("../users/users.service");
const request_magic_link_dto_1 = require("./dto/request-magic-link.dto");
const verify_magic_link_dto_1 = require("./dto/verify-magic-link.dto");
const magic_link_service_1 = require("./services/magic-link.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthController = class AuthController {
    constructor(magicLinks, users) {
        this.magicLinks = magicLinks;
        this.users = users;
    }
    async requestMagicLink(dto, ip) {
        const { expiresAt, devToken } = await this.magicLinks.requestMagicLink(dto.email, ip, dto.userAgent);
        return {
            message: 'If an account exists for this email, a login link has been sent.',
            expiresAt,
            ...(devToken ? { devToken, devNote: 'Token visible only in development.' } : {}),
        };
    }
    async verifyMagicLink(dto) {
        return this.magicLinks.verifyMagicLink(dto.token);
    }
    async me(user) {
        const fullUser = await this.users.findById(user.id);
        if (!fullUser)
            return user;
        return {
            id: fullUser.id,
            email: fullUser.email,
            name: fullUser.name,
            role: fullUser.role,
            isVerified: fullUser.is_verified,
            lastLoginAt: fullUser.last_login_at,
            createdAt: fullUser.created_at,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, index_1.Public)(),
    (0, common_1.Post)('magic-link'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_magic_link_dto_1.RequestMagicLinkDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestMagicLink", null);
__decorate([
    (0, index_1.Public)(),
    (0, common_1.Post)('magic-link/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_magic_link_dto_1.VerifyMagicLinkDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyMagicLink", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, index_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [magic_link_service_1.MagicLinkService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map