import { datetime, int, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core';

export const nftCacheRecord = mysqlTable(
  'nft_cache_record',
  {
    nftContractAddress: varchar('nft_contract_address', { length: 42 }).notNull(),
    tokenId: int('token_id').notNull(),
    ownerAddress: varchar('owner_address', { length: 42 }).notNull(),
    tokenURI: varchar('token_uri', { length: 1024 }).notNull(),
    lastUpdated: datetime('last_updated').notNull(),
  },
  (table) => {
    return {
      primaryKey: primaryKey({
        columns: [table.nftContractAddress, table.tokenId],
      }),
    };
  }
);

export type NFTCacheRecord = typeof nftCacheRecord.$inferSelect;
export type NewNFTCacheRecord = typeof nftCacheRecord.$inferInsert;
