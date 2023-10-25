import * as dotenv from 'dotenv';
dotenv.config();
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db-schemas',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'evm-dex',
  },
} satisfies Config;