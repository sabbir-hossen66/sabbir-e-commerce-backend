import { Pool } from 'pg';
import { BaseRepository } from '@database/index';
import { MagicLink } from '../entities/magic-link.entity';
export declare class MagicLinkRepository extends BaseRepository<MagicLink> {
    constructor(pool: Pool);
    findActiveByTokenHash(tokenHash: string): Promise<MagicLink | null>;
    markUsed(id: string): Promise<void>;
    invalidateByEmail(email: string): Promise<void>;
}
