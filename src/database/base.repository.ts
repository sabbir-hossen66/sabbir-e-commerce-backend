/**
 * ===========================================================
 *   BASE REPOSITORY (REUSABLE)
 * ===========================================================
 *
 * প্রতিটা module এর repository এই BaseRepository extend করবে।
 * এতে করে common CRUD methods বারবার লিখতে হবে না।
 *
 * যেমন:
 *   class UserRepository extends BaseRepository<User> {
 *     constructor(pool: Pool) { super(pool, 'users'); }
 *   }
 * ===========================================================
 */
import { Pool, QueryResultRow } from 'pg';

import { withTransaction } from './transaction';
import { DbClient } from './database.provider';

export class BaseRepository<T extends QueryResultRow> {
  constructor(
    protected readonly pool: Pool,
    protected readonly tableName: string,
  ) {}

  /** SELECT * FROM table WHERE ... LIMIT 1 */
  async findOne(where: Partial<T>): Promise<T | null> {
    const keys = Object.keys(where) as (keyof T)[];
    if (keys.length === 0) throw new Error('findOne requires at least one condition');

    const values = keys.map((k) => where[k] as unknown);
    const whereSql = keys.map((k, i) => `"${String(k)}" = $${i + 1}`).join(' AND ');

    const result = await this.pool.query<T>(
      `SELECT * FROM ${this.tableName} WHERE ${whereSql} LIMIT 1`,
      values,
    );
    return result.rows[0] ?? null;
  }

  /** SELECT * FROM table WHERE ... */
  async findMany(where: Partial<T>, limit = 100, offset = 0): Promise<T[]> {
    const keys = Object.keys(where) as (keyof T)[];
    const values = keys.map((k) => where[k] as unknown);
    const whereSql = keys.length
      ? keys.map((k, i) => `"${String(k)}" = $${i + 1}`).join(' AND ')
      : 'TRUE';

    const result = await this.pool.query<T>(
      `SELECT * FROM ${this.tableName}
       WHERE ${whereSql}
       ORDER BY created_at DESC
       LIMIT $${values.length + 1}
       OFFSET $${values.length + 2}`,
      [...values, Math.max(1, Math.min(limit, 500)), Math.max(0, offset)],
    );
    return result.rows;
  }

  /** SELECT * FROM table WHERE id = $1 */
  async findById(id: string): Promise<T | null> {
    const result = await this.pool.query<T>(
      `SELECT * FROM ${this.tableName} WHERE id = $1 LIMIT 1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  /** INSERT INTO table (...) RETURNING * */
  async create(data: Partial<T>, client?: DbClient): Promise<T> {
    const keys = Object.keys(data) as (keyof T)[];
    const values = keys.map((k) => data[k] as unknown);
    const columns = keys.map(String).join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const executor = client ?? this.pool;
    const result = await executor.query<T>(
      `INSERT INTO ${this.tableName} (${columns})
       VALUES (${placeholders})
       RETURNING *`,
      values,
    );
    return result.rows[0];
  }

  /** UPDATE table SET ... WHERE id = $1 RETURNING * */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data) as (keyof T)[];
    if (keys.length === 0) return this.findById(id);

    const values = keys.map((k) => data[k] as unknown);
    const setSql = keys.map((k, i) => `"${String(k)}" = $${i + 2}`).join(', ');

    const result = await this.pool.query<T>(
      `UPDATE ${this.tableName}
       SET ${setSql}, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, ...values],
    );
    return result.rows[0] ?? null;
  }

  /** DELETE FROM table WHERE id = $1 */
  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }

  /** COUNT(*) WHERE ... */
  async count(where: Partial<T> = {}): Promise<number> {
    const keys = Object.keys(where) as (keyof T)[];
    const values = keys.map((k) => where[k] as unknown);
    const whereSql = keys.length
      ? keys.map((k, i) => `"${String(k)}" = $${i + 1}`).join(' AND ')
      : 'TRUE';

    const result = await this.pool.query<{ count: string }>(
      `SELECT COUNT(*)::int AS count FROM ${this.tableName} WHERE ${whereSql}`,
      values,
    );
    return Number(result.rows[0]?.count ?? 0);
  }

  /** Transaction support — atomic operations এর জন্য */
  withTransaction<R>(handler: (client: import('pg').PoolClient) => Promise<R>): Promise<R> {
    return withTransaction(this.pool, handler);
  }

  /** Raw query access (custom complex queries এর জন্য) */
  async raw<R extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = [],
  ) {
    return this.pool.query<R>(sql, params);
  }
}
