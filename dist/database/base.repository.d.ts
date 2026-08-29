import { Pool, QueryResultRow } from 'pg';
import { DbClient } from './database.provider';
export declare class BaseRepository<T extends QueryResultRow> {
    protected readonly pool: Pool;
    protected readonly tableName: string;
    constructor(pool: Pool, tableName: string);
    findOne(where: Partial<T>): Promise<T | null>;
    findMany(where: Partial<T>, limit?: number, offset?: number): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(data: Partial<T>, client?: DbClient): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    count(where?: Partial<T>): Promise<number>;
    withTransaction<R>(handler: (client: import('pg').PoolClient) => Promise<R>): Promise<R>;
    raw<R extends QueryResultRow = QueryResultRow>(sql: string, params?: unknown[]): Promise<import("pg").QueryResult<R>>;
}
