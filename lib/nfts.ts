import { AccountToken, AccountTokenListResponse } from '@/types/common';

export async function getNFTs(address: string) {
  let nftBalances: AccountToken[] = [];

  try {
    const response = await fetch(
      `https://evm-sidechain.xrpl.org/api?module=account&action=tokenlist&address=${address}`
    );
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

  console.clear();
  console.log(nftBalances);
}
