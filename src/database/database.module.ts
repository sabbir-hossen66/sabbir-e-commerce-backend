import { Global, Module, Provider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolConfig } from 'pg';

export const DATABASE_POOL = 'DATABASE_POOL';

const databaseProvider: Provider = {
  provide: DATABASE_POOL,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const logger = new Logger('Database');
    const pool = new Pool({
      connectionString: config.get<string>('DATABASE_URL'),
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

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
