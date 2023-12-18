'use server';

import { AccountToken, AccountTokenListResponse, TokenHoldersListResponse } from '@/types/common';
import { eq } from 'drizzle-orm';
import { getContract } from 'viem';
import { db } from './database';
import { nftCacheRecord } from './db-schemas/nft-cache-record';
import { nftContractCachedLog } from './db-schemas/nft-contract-cached-log';
import { xrplDevnetPublicClient } from './viem-clients';
import PQueue from 'p-queue';
import { erc721ABI } from '@/types/wagmi/serpent-swap';
import { revalidatePath } from 'next/cache';

const sideChainRpcApiBaseUrl = 'https://evm-sidechain.xrpl.org/api';

export async function getNFTs(address: string, doSync: boolean = true, forceSync: boolean = false) {
  console.log('Getting NFTs for address', address, doSync, forceSync);
  let nftBalances: AccountToken[] = [];

  try {
    const response = await fetch(`${sideChainRpcApiBaseUrl}?module=account&action=tokenlist&address=${address}`);
    if (!response.ok) throw new Error('Failed to fetch account token list');

    const data = (await response.json()) as AccountTokenListResponse;
    if (data.message !== 'OK') throw new Error(data.message);

    const nftBalance = data.result.filter(
      (token) => token.type === 'ERC-721' && token.name !== 'Uniswap V3 Positions NFT-V1'
    );

    nftBalances.push(...nftBalance);
  } catch (error) {
    console.error(error);
  }

  if (doSync) {
    console.log(`Sync NFTs for ${address}`);
    for (const balance of nftBalances) {
      await cacheERC721Tokens(balance.contractAddress as `0x${string}`, balance.name, balance.symbol, forceSync);
    }
  }

  revalidatePath(`/application/nfts`, 'page');
  return nftBalances;
}

export async function cacheERC721Tokens(
  contractAddress: `0x${string}`,
  name: string,
  symbol: string,
  forceSync = false
) {
  // check if contract has been cached in the last 15 minutes
  const logs = await db
    .select()
    .from(nftContractCachedLog)
    .where(eq(nftContractCachedLog.nftContractAddress, contractAddress));

  let doSync = false;
  if (logs.length === 0) {
    doSync = true;
  } else {
    const log = logs[0];
    const lastCached = log.lastCached;
    const now = new Date();
    const diff = now.getTime() - lastCached.getTime();
    const minutes = Math.floor(diff / 1000 / 60);

    if (minutes > 30) {
      doSync = true;
    }
  }

  console.log(`forceSync: ${forceSync} doSync: ${doSync}`);
  if (!doSync && !forceSync) return;

  // set last cached to now at this point so that any other requests will not trigger a sync
  await db
    .insert(nftContractCachedLog)
    .values({
      nftContractAddress: contractAddress,
      nftContractName: name,
      nftContractSymbol: symbol,
      lastCached: new Date(),
    })
    .onDuplicateKeyUpdate({
      set: {
        lastCached: new Date(),
      },
    });

  // get total supply of tokens from Peersyst API (use token -> getTokenHolders action)
  let totalSupply = 0;
  try {
    const response = await fetch(
      `${sideChainRpcApiBaseUrl}?module=token&action=getTokenHolders&contractaddress=${contractAddress}`
    );
    if (!response.ok) throw new Error('Failed to fetch token supply');

    const data = (await response.json()) as TokenHoldersListResponse;
    if (data.message !== 'OK') throw new Error(data.message);

    // reduce the array of token balances to a single number
    totalSupply = data.result.reduce((acc, token) => acc + Number(token.value), 0);
  } catch (error) {
    console.error(error);
  }

  const contract = getContract({
    address: contractAddress,
    abi: [
      {
        constant: true,
        inputs: [{ name: '_tokenId', type: 'uint256' }],
        name: 'ownerOf',
        outputs: [{ name: 'owner', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: '_tokenId', type: 'uint256' }],
        name: 'tokenURI',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ],
    publicClient: xrplDevnetPublicClient,
  });

  // get owner of each token id via Viem publicClient
  const cacheToken = async (i: number) => {
    try {
      const tokenId = BigInt(i);
      const owner = await contract.read.ownerOf([tokenId]);
      const tokenURI = await contract.read.tokenURI([tokenId]);
      // console.log(`Contract ${contractAddress} Token ID ${tokenId} owned by ${owner}`);

      db.insert(nftCacheRecord)
        .values({
          nftContractAddress: contractAddress,
          tokenId: i,
          ownerAddress: owner,
          tokenURI,
          lastUpdated: new Date(),
        })
        .onDuplicateKeyUpdate({
          set: {
            ownerAddress: owner,
            tokenURI,
            lastUpdated: new Date(),
          },
        })
        .execute();
    } catch (error) {
      // console.error(error);
    }
  };

  const queue = new PQueue({ concurrency: 25 });

  for (let i = 0; i <= totalSupply; i++) {
    queue.add(() => cacheToken(i));
  }
}

export async function cacheERC721Token(contractAddress: `0x${string}`, tokenId: number) {
  const contract = getContract({
    address: contractAddress,
    abi: erc721ABI,
    publicClient: xrplDevnetPublicClient,
  });

  try {
    const owner = await contract.read.ownerOf([BigInt(tokenId)]);
    const tokenURI = await contract.read.tokenURI([BigInt(tokenId)]);

    const updateResult = await db
      .insert(nftCacheRecord)
      .values({
        nftContractAddress: contractAddress,
        tokenId,
        ownerAddress: owner,
        tokenURI,
        lastUpdated: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          ownerAddress: owner,
          tokenURI,
          lastUpdated: new Date(),
        },
      })
      .execute();
    console.log(updateResult);
    console.log(`Contract ${contractAddress} Token ID ${tokenId} owned by ${owner}`);
  } catch (error) {
    console.error(error);
  }
}
