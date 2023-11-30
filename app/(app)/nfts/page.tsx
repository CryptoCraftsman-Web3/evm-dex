import NotSignedIn from '@/components/common/not-signed-in';
import { getSession } from '@/lib/auth';
import NFTsClientPage from './client-page';
import { db } from '@/lib/database';
import { nftCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { eq } from 'drizzle-orm';

export default async function NFTsPage() {
  const session = await getSession();
  if (!session) return <NotSignedIn />;

  const userNFTs = await db.select().from(nftCacheRecord).where(eq(nftCacheRecord.ownerAddress, session.address));

  return <NFTsClientPage userNFTs={userNFTs} />;
}
