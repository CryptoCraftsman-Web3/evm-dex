'use server';

import 'server-only';

import { db } from '../database';
import { NewTransaction, transactions } from '../db-schemas/transaction';
import { publicClients } from '../viem-clients';
import { and, eq } from 'drizzle-orm';

// this function will usually be called from client-side code right after a transaction is sent
export const saveNewTransaction = async (
  chainId: number,
  transaction: NewTransaction,
  functionName: string | null = null
) => {
  transaction.status = 'pending';
  await db.insert(transactions).values(transaction);
};

// this function will mostly be called to update the status of a transaction
export const syncTransaction = async (chainId: number, hash: `0x${string}`, functionName: string | null = null) => {
  const publicClient = publicClients[chainId];
  if (!publicClient) throw new Error(`No public client for chainId ${chainId}`);

  if (hash.length !== 66) throw new Error(`Invalid hash ${hash}`);

  const tx = await publicClient.getTransaction({
    hash,
  });

  if (tx.blockHash === null) {
    const transactionRecord: NewTransaction = {
      hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      chainId,
      from: tx.from,
      to: tx.to as string,
      gas: tx.gas,
      gasPrice: tx.gasPrice || 0n,
      maxFeePerGas: tx.maxFeePerGas || 0n,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas || 0n,
      nonce: tx.nonce,
      type: tx.type,
      value: tx.value,
      status: 'pending',
      functionName,
    };
  }

  const txReceipt = await publicClient.waitForTransactionReceipt({
    hash,
  });

  const transactionRecord: NewTransaction = {
    hash,
    blockHash: txReceipt.blockHash,
    blockNumber: txReceipt.blockNumber,
    chainId,
    from: tx.from,
    to: tx.to as string,
    gas: tx.gas,
    gasPrice: tx.gasPrice || 0n,
    maxFeePerGas: tx.maxFeePerGas || 0n,
    maxPriorityFeePerGas: tx.maxPriorityFeePerGas || 0n,
    nonce: tx.nonce,
    type: tx.type,
    value: tx.value,
    status: txReceipt.status,
    functionName,
  };

  await db
    .insert(transactions)
    .values(transactionRecord)
    .onDuplicateKeyUpdate({
      set: {
        status: transactionRecord.status,
      },
    });
};

export const updatePendingTransactions = async (address: `0x${string}`) => {
  const pendingTxs = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.from, address), eq(transactions.status, 'pending')));

  for (const tx of pendingTxs) {
    await syncTransaction(tx.chainId, tx.hash as `0x${string}`, tx.functionName);
  }
};
