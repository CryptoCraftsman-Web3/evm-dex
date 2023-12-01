'use client';

import NFTItem from '@/components/nfts/nft-item';
import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { NFTContractCachedLog } from '@/lib/db-schemas/nft-contract-cached-log';
import { Grid, Paper, Stack, Typography } from '@mui/material';

type NFTsClientPageProps = {
  userNFTs: NFTCacheRecord[];
  nftContracts: { [key: string]: NFTContractCachedLog };
};

export default function NFTsClientPage({ userNFTs, nftContracts }: NFTsClientPageProps) {
  return (
    <Stack spacing={4}>
      <Typography variant="h4">
        <b>NFTs</b>
      </Typography>

      <Paper
        variant="outlined"
        sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        <Typography variant="h5">Your NFTs</Typography>
        <Grid
          container
          spacing={3}
        >
          {userNFTs.map((nft) => (
            <Grid
              item
              key={`${nft.nftContractAddress}-${nft.tokenId}`}
              xs={6}
              md={3}
              lg={2}
            >
              <NFTItem
                nftCacheRecord={nft}
                nftContract={nftContracts[nft.nftContractAddress]}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Stack>
  );
}
