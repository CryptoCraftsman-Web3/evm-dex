'use client';

import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { AccountToken } from '@/types/common';

type NFTsClientPageProps = {
  userNFTs: NFTCacheRecord[];
};

export default function NFTsClientPage({ userNFTs }: NFTsClientPageProps) {
  console.log(userNFTs);

  return (
    <div>
      <h1>NFTs</h1>
    </div>
  );
}
