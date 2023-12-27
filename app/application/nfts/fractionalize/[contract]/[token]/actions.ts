'use server';

import { db } from '@/lib/database';
import { erc20Token } from '@/lib/db-schemas/erc20-token';

export default async function saveErc20Token(contractAddress: string, name: string, symbol: string, decimals: number) {
  await db
    .insert(erc20Token)
    .values({
      contractAddress,
      name,
      symbol,
      decimals,
    })
    .onDuplicateKeyUpdate({
      set: {
        name,
        symbol,
        decimals,
      },
    })
    .execute();
}
