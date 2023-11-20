import { getSession } from '@/lib/auth';
import NFTsClientPage from './client-page';
import NotSignedIn from '@/components/common/not-signed-in';
import { AccountToken, AccountTokenListResponse } from '@/types/common';

export default async function NFTsPage() {
  const session = await getSession();
  if (!session) return <NotSignedIn />;

  const { address } = session;
  const nfts: AccountToken[] = [];

  try {
    const response = await fetch(
      `https://evm-sidechain.xrpl.org/api?module=account&action=tokenlist&address=${address}`
    );
    if (!response.ok) throw new Error('Failed to fetch account token list');

    const data = (await response.json()) as AccountTokenListResponse;
    if (data.message !== 'OK') throw new Error(data.message);

    const nftBalances = data.result.filter((token) => token.type === 'ERC-721');
    nfts.push(...nftBalances);
  } catch (error) {
    console.error(error);
  }

  return <NFTsClientPage nftBalances={nfts} />;
}
