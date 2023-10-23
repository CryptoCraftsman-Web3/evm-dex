import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db-schemas',
  out: './drizzle',
} satisfies Config;