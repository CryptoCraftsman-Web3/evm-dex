'use server';

import { db } from "@/lib/database";
import { tokenTransfers } from "@/lib/db-schemas/token-transfer";
import { eq } from "drizzle-orm";

export async function getTokenTransfers(txHash: `0x${string}`) {
  const transfers = await db.select().from(tokenTransfers).where(eq(tokenTransfers.txHash, txHash));
  return transfers;
}