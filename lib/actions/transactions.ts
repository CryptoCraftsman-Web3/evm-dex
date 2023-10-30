'use server';

import 'server-only';

import { TokenTransfers } from '@/types/xrpl-evm';
import { and, eq, ilike } from 'drizzle-orm';
import { formatUnits } from 'viem';
import { db } from '../database';
import { NewTokenTransfer, tokenTransfers } from '../db-schemas/token-transfer';
import { NewTransaction, transactions } from '../db-schemas/transaction';
import { users } from '../db-schemas/user';
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
      timestamp: new Date(),
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
    timestamp: new Date(),
  };

  await db
    .insert(transactions)
    .values(transactionRecord)
    .onDuplicateKeyUpdate({
      set: {
        status: transactionRecord.status,
      },
    });

  syncTokenTransfers(chainId, tx.from);
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

export const syncTokenTransfers = async (chainId: number, address: `0x${string}`) => {
  const user = (await db.select().from(users).where(eq(users.address, address)))[0];
  const lastTokenTransferTxHash = user?.lastTokenTransferTxHash;

  const apiEndpointUrl = `https://evm-sidechain.xrpl.org/api?module=account&action=tokentx&address=${address}`;

  const tokenTransfersResponse = await fetch(apiEndpointUrl);
  const tokenTransfersFromApi = (await tokenTransfersResponse.json()) as TokenTransfers;

  let tokenTransferRecords: NewTokenTransfer[] = [];
  for (const tokenTransfer of tokenTransfersFromApi.result) {
    if (tokenTransfer.hash === lastTokenTransferTxHash) break;

    const tokenTransferRecord: NewTokenTransfer = {
      chainId,
      address,
      txHash: tokenTransfer.hash,
      direction: tokenTransfer.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in',
      amount: parseFloat(formatUnits(BigInt(tokenTransfer.value || 1n), Number(tokenTransfer.tokenDecimal || 0))),
      tokenContractAddress: tokenTransfer.contractAddress,
      tokenDecimals: Number(tokenTransfer.tokenDecimal),
      tokenName: tokenTransfer.tokenName,
      tokenSymbol: tokenTransfer.tokenSymbol,
      transactionIndex: Number(tokenTransfer.transactionIndex),
    };

    tokenTransferRecords.push(tokenTransferRecord);
  }

  if (tokenTransferRecords.length === 0) return;

  await db.insert(tokenTransfers).values(tokenTransferRecords);
  const lastTokenTransferTxHashFromApi = tokenTransfersFromApi.result[0]?.hash;
  console.log('lastTokenTransferTxHashFromApi', lastTokenTransferTxHashFromApi);
  await db
    .insert(users)
    .values({ address, lastTokenTransferTxHash: lastTokenTransferTxHashFromApi })
    .onDuplicateKeyUpdate({
      set: {
        lastTokenTransferTxHash: lastTokenTransferTxHashFromApi,
      },
    });
};
