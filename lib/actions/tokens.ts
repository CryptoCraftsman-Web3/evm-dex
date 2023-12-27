'use server';

import { eq } from 'drizzle-orm';
import { db } from '../database';
import { erc20Token } from '../db-schemas/erc20-token';

export async function saveErc20Token(contractAddress: string, name: string, symbol: string, decimals: number) {
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

export async function deleteErc20Token(contractAddress: string) {
  await db.delete(erc20Token).where(eq(erc20Token.contractAddress, contractAddress)).execute();
}
