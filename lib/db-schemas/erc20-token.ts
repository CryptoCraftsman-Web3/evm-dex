import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const erc20Token = mysqlTable('erc20_token', {
  contractAddress: varchar('contract_address', { length: 42 }).primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  symbol: varchar('symbol', { length: 255 }).notNull(),
  decimals: int('decimals').notNull(),
});

export type ERC20Token = typeof erc20Token.$inferSelect;
