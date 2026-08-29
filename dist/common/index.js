"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = exports.ForbiddenException = exports.NotFoundException = exports.BadRequestException = void 0;
__exportStar(require("./decorators/public.decorator"), exports);
__exportStar(require("./filters/all-exceptions.filter"), exports);
__exportStar(require("./interceptors/response.interceptor"), exports);
__exportStar(require("./decorators/current-user.decorator"), exports);
const common_1 = require("@nestjs/common");
class BadRequestException extends common_1.HttpException {
    constructor(message = 'Bad Request') {
        super(message, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends common_1.HttpException {
    constructor(message = 'Not Found') {
        super(message, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.NotFoundException = NotFoundException;
class ForbiddenException extends common_1.HttpException {
    constructor(message = 'Forbidden') {
        super(message, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.ForbiddenException = ForbiddenException;
class UnauthorizedException extends common_1.HttpException {
    constructor(message = 'Unauthorized') {
        super(message, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.UnauthorizedException = UnauthorizedException;
//# sourceMappingURL=index.js.map