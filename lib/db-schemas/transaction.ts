import { bigint, int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const transactions = mysqlTable('transactions', {
  hash: varchar('hash', { length: 66 }).notNull().primaryKey(),
  blockHash: varchar('block_hash', { length: 66 }),
  blockNumber: bigint('block_number', { mode: 'bigint' }),
  chainId: int('chain_id').notNull(),
  from: varchar('from', { length: 42 }).notNull(),
  to: varchar('to', { length: 42 }).notNull(),
  gas: bigint('gas', { mode: 'bigint' }).notNull(),
  gasPrice: bigint('gas_price', { mode: 'bigint' }).notNull(),
  maxFeePerGas: bigint('max_fee_per_gas', { mode: 'bigint' }).notNull(),
  maxPriorityFeePerGas: bigint('max_priority_fee_per_gas', { mode: 'bigint' }).notNull(),
  nonce: int('nonce').notNull(),
  type: varchar('type', { length: 12 }).notNull(),
  value: bigint('value', { mode: 'bigint' }).notNull(),
  status: mysqlEnum('status', ['pending', 'success', 'reverted', 'other'] as const).notNull(),
  functionName: varchar('function_name', { length: 255 }),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;