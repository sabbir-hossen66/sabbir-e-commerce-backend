import { Pool, PoolClient } from 'pg';
export declare function withTransaction<T>(pool: Pool, callback: (client: PoolClient) => Promise<T>): Promise<T>;
