"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const transaction_1 = require("./transaction");
class BaseRepository {
    constructor(pool, tableName) {
        this.pool = pool;
        this.tableName = tableName;
    }
    async findOne(where) {
        const keys = Object.keys(where);
        if (keys.length === 0)
            throw new Error('findOne requires at least one condition');
        const values = keys.map((k) => where[k]);
        const whereSql = keys.map((k, i) => `"${String(k)}" = $${i + 1}`).join(' AND ');
        const result = await this.pool.query(`SELECT * FROM ${this.tableName} WHERE ${whereSql} LIMIT 1`, values);
        return result.rows[0] ?? null;
    }
    async findMany(where, limit = 100, offset = 0) {
        const keys = Object.keys(where);
        const values = keys.map((k) => where[k]);
        const whereSql = keys.length
            ? keys.map((k, i) => `"${String(k)}" = $${i + 1}`).join(' AND ')
            : 'TRUE';
        const result = await this.pool.query(`SELECT * FROM ${this.tableName}
       WHERE ${whereSql}
       ORDER BY created_at DESC
       LIMIT $${values.length + 1}
       OFFSET $${values.length + 2}`, [...values, Math.max(1, Math.min(limit, 500)), Math.max(0, offset)]);
        return result.rows;
    }
    async findById(id) {
        const result = await this.pool.query(`SELECT * FROM ${this.tableName} WHERE id = $1 LIMIT 1`, [id]);
        return result.rows[0] ?? null;
    }
    async create(data, client) {
        const keys = Object.keys(data);
        const values = keys.map((k) => data[k]);
        const columns = keys.map(String).join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const executor = client ?? this.pool;
        const result = await executor.query(`INSERT INTO ${this.tableName} (${columns})
       VALUES (${placeholders})
       RETURNING *`, values);
        return result.rows[0];
    }
    async update(id, data) {
        const keys = Object.keys(data);
        if (keys.length === 0)
            return this.findById(id);
        const values = keys.map((k) => data[k]);
        const setSql = keys.map((k, i) => `"${String(k)}" = $${i + 2}`).join(', ');
        const result = await this.pool.query(`UPDATE ${this.tableName}
       SET ${setSql}, updated_at = NOW()
       WHERE id = $1
       RETURNING *`, [id, ...values]);
        return result.rows[0] ?? null;
    }
    async delete(id) {
        const result = await this.pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
        return (result.rowCount ?? 0) > 0;
    }
    async count(where = {}) {
        const keys = Object.keys(where);
        const values = keys.map((k) => where[k]);
        const whereSql = keys.length
            ? keys.map((k, i) => `"${String(k)}" = $${i + 1}`).join(' AND ')
            : 'TRUE';
        const result = await this.pool.query(`SELECT COUNT(*)::int AS count FROM ${this.tableName} WHERE ${whereSql}`, values);
        return Number(result.rows[0]?.count ?? 0);
    }
    withTransaction(handler) {
        return (0, transaction_1.withTransaction)(this.pool, handler);
    }
    async raw(sql, params = []) {
        return this.pool.query(sql, params);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map