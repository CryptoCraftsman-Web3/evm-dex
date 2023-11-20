'use client';

import { AccountToken } from "@/types/common";

type NFTsClientPageProps = {
  nftBalances: AccountToken[];
};

export default function NFTsClientPage({ nftBalances }: NFTsClientPageProps) {
  console.log(nftBalances);

  return (
    <div>
      <h1>NFTs Client Page</h1>
    </div>
  );
}
