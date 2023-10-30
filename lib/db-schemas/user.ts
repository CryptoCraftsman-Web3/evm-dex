import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('user', {
  address: varchar('address', { length: 42 }).notNull().primaryKey(),
  lastTokenTransferTxHash: varchar('last_token_transfer_tx_hash', { length: 66 }),
});

export type User = typeof users.$inferSelect;
