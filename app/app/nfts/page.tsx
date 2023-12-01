import NotSignedIn from '@/components/common/not-signed-in';
import { getSession } from '@/lib/auth';
import NFTsClientPage from './client-page';
import { db } from '@/lib/database';
import { nftCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { eq, inArray } from 'drizzle-orm';
import { NFTContractCachedLog, nftContractCachedLog } from '@/lib/db-schemas/nft-contract-cached-log';

export default async function NFTsPage() {
  const session = await getSession();
  if (!session) return <NotSignedIn />;

  const userNFTs = await db.select().from(nftCacheRecord).where(eq(nftCacheRecord.ownerAddress, session.address));

  // get set of nft contract addresses
  const nftContractAddresses = new Set<string>();
  userNFTs.forEach((nft) => nftContractAddresses.add(nft.nftContractAddress));

  // fetch nft contract cache log from db
  const nftContracts = await db
    .select()
    .from(nftContractCachedLog)
    .where(inArray(nftContractCachedLog.nftContractAddress, Array.from(nftContractAddresses)));

  // map nft contract cache log to nft contract address
  const nftContractsMap: { [key: string]: NFTContractCachedLog } = {};
  nftContracts.forEach((nftContract) => {
    nftContractsMap[nftContract.nftContractAddress] = nftContract;
  });

  return (
    <NFTsClientPage
      userNFTs={userNFTs}
      nftContracts={nftContractsMap}
    />
  );
}
