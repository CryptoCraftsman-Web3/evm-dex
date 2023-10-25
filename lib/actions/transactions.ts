'use server';

import 'server-only';

import { db } from '../database';
import { NewTransaction, transactions } from '../db-schemas/transaction';
import { publicClients } from '../viem-clients';

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

  const transaction = await publicClient.getTransaction({
    hash,
  });

  const txReceipt = await publicClient.getTransactionReceipt({
    hash,
  });

  const transactionRecord: NewTransaction = {
    hash,
    blockHash: transaction.blockHash,
    blockNumber: transaction.blockNumber,
    chainId,
    from: transaction.from,
    to: transaction.to as string,
    gas: transaction.gas,
    gasPrice: transaction.gasPrice || 0n,
    maxFeePerGas: transaction.maxFeePerGas || 0n,
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas || 0n,
    nonce: transaction.nonce,
    type: transaction.type,
    value: transaction.value,
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
