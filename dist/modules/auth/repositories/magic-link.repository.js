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
exports.MagicLinkRepository = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const index_1 = require("../../../database/index");
let MagicLinkRepository = class MagicLinkRepository extends index_1.BaseRepository {
    constructor(pool) {
        super(pool, 'magic_links');
    }
    async findActiveByTokenHash(tokenHash) {
        const result = await this.raw(`SELECT * FROM ${this.tableName}
       WHERE token_hash = $1
         AND used_at IS NULL
         AND expires_at > NOW()
       LIMIT 1`, [tokenHash]);
        return result.rows[0] ?? null;
    }
    async markUsed(id) {
        await this.raw(`UPDATE ${this.tableName} SET used_at = NOW() WHERE id = $1`, [id]);
    }
    async invalidateByEmail(email) {
        await this.raw(`UPDATE ${this.tableName}
       SET used_at = NOW()
       WHERE email = $1 AND used_at IS NULL`, [email.toLowerCase()]);
    }
};
exports.MagicLinkRepository = MagicLinkRepository;
exports.MagicLinkRepository = MagicLinkRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(index_1.DATABASE_POOL)),
    __metadata("design:paramtypes", [pg_1.Pool])
], MagicLinkRepository);
//# sourceMappingURL=magic-link.repository.js.map