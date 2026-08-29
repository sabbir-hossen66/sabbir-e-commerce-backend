import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL, BaseRepository } from '@database/index';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@Inject(DATABASE_POOL) pool: Pool) {
    super(pool, 'users');
  }

  async upsertByEmail(email: string, data: Partial<User>): Promise<User> {
    const existing = await this.findOne({ email });
    if (existing) {
      return this.update(existing.id, data) as Promise<User>;
    }
    
    // Default role 'customer' if not provided
    const newRecord = {
      email,
      role: data.role || 'customer',
      ...data,
    };
    return this.create(newRecord);
  }

  async markLogin(id: string): Promise<void> {
    await this.update(id, { last_login_at: new Date() } as Partial<User>);
  }
}
