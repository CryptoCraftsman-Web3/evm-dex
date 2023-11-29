import { datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const nftContractCachedLog = mysqlTable('nft_contract_cached_log', {
  nftContractAddress: varchar('nft_contract_address', { length: 42 }).notNull().primaryKey(),
  nftContractName: varchar('nft_contract_name', { length: 1000 }).notNull(),
  nftContractSymbol: varchar('nft_contract_symbol', { length: 20 }).notNull(),
  lastCached: datetime('last_cached').notNull(),
});

export type NFTContractCachedLog = typeof nftContractCachedLog.$inferSelect;