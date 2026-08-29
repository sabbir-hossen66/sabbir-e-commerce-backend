"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = exports.DATABASE_POOL = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pg_1 = require("pg");
exports.DATABASE_POOL = 'DATABASE_POOL';
const databaseProvider = {
    provide: exports.DATABASE_POOL,
    inject: [config_1.ConfigService],
    useFactory: (config) => {
        const logger = new common_1.Logger('Database');
        const pool = new pg_1.Pool({
            connectionString: config.get('DATABASE_URL'),
        });
        pool.on('connect', () => {
            logger.log('Connected to Neon PostgreSQL');
        });
        pool.on('error', (err) => {
            logger.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
        return pool;
    },
};
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [databaseProvider],
        exports: [databaseProvider],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map