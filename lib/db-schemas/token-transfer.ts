import { bigint, float, int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const tokenTransfers = mysqlTable('token_transfers', {
  id: int('id').notNull().autoincrement().primaryKey(),
  chainId: int('chain_id').notNull(),
  address: varchar('from', { length: 42 }).notNull(),
  direction: mysqlEnum('direction', ['in', 'out']).notNull(),
  amount: float('amount').notNull(),
  tokenContractAddress: varchar('token_contract_address', { length: 42 }).notNull(),
  tokenDecimals: int('token_decimals').notNull(),
  tokenName: varchar('token_name', { length: 255 }).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 25 }).notNull(),
  transactionIndex: int('transaction_index').notNull(),
});

export type TokenTransfer = typeof tokenTransfers.$inferSelect;
export type NewTokenTransfer = typeof tokenTransfers.$inferInsert;