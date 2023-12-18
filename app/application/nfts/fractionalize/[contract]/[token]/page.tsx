import { db } from "@/lib/database";
import FractionalizeNFTClientPage from "./client-page";
import { nftCacheRecord } from "@/lib/db-schemas/nft-cache-record";
import { getSession } from "@/lib/auth";
import NotSignedIn from "@/components/common/not-signed-in";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { nftContractCachedLog } from "@/lib/db-schemas/nft-contract-cached-log";

export type FractionalizeNFTPageProps = {
  params: {
    contract: string;
    token: string;
  };
};

export default async function FractionalizeNFTPage({ params }: FractionalizeNFTPageProps) {
  const session = await getSession();
  if (!session) return <NotSignedIn />;

  const nfts = await db.select().from(nftCacheRecord).where(
    and(
      eq(nftCacheRecord.nftContractAddress, params.contract),
      eq(nftCacheRecord.tokenId, Number(params.token)),
    )
  );

  if (nfts.length === 0) return notFound();
  const nft = nfts[0];

  const contracts = await db.select().from(nftContractCachedLog).where(
    eq(nftContractCachedLog.nftContractAddress, params.contract)
  );
  if (contracts.length === 0) return notFound();
  const contract = contracts[0];

  return (
    <FractionalizeNFTClientPage
      nft={nft}
      contract={contract}
    />
  );
}
