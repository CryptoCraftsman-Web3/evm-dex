import { getSession } from '@/lib/auth';
import NFTsClientPage from './client-page';
import NotSignedIn from '@/components/common/not-signed-in';
import { AccountToken, AccountTokenListResponse } from '@/types/common';
import { getNFTs } from '@/lib/nfts';

export default async function NFTsPage() {
  const session = await getSession();
  if (!session) return <NotSignedIn />;

  const { address } = session;
  await getNFTs(address);

  return <NFTsClientPage />;
}