import { Pool } from 'pg';
import { BaseRepository } from '@database/index';
import { User } from '../entities/user.entity';
export declare class UserRepository extends BaseRepository<User> {
    constructor(pool: Pool);
    upsertByEmail(email: string, data: Partial<User>): Promise<User>;
    markLogin(id: string): Promise<void>;
}
