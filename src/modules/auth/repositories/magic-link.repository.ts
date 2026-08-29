import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import { DATABASE_POOL, BaseRepository } from '@database/index';

import { MagicLink } from '../entities/magic-link.entity';

@Injectable()
export class MagicLinkRepository extends BaseRepository<MagicLink> {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'magic_links');
  }

  async findActiveByTokenHash(tokenHash: string): Promise<MagicLink | null> {
    const result = await this.raw<MagicLink>(
      `SELECT * FROM ${this.tableName}
       WHERE token_hash = $1
         AND used_at IS NULL
         AND expires_at > NOW()
       LIMIT 1`,
      [tokenHash],
    );
    return result.rows[0] ?? null;
  }

  async markUsed(id: string): Promise<void> {
    await this.raw(`UPDATE ${this.tableName} SET used_at = NOW() WHERE id = $1`, [id]);
  }

  async invalidateByEmail(email: string): Promise<void> {
    await this.raw(
      `UPDATE ${this.tableName}
       SET used_at = NOW()
       WHERE email = $1 AND used_at IS NULL`,
      [email.toLowerCase()],
    );
  }
}