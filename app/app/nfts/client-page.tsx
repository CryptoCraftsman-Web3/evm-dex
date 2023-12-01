'use client';

import NFTItem from '@/components/nfts/nft-item';
import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { Grid, Paper, Stack, Typography } from '@mui/material';

type NFTsClientPageProps = {
  userNFTs: NFTCacheRecord[];
};

export default function NFTsClientPage({ userNFTs }: NFTsClientPageProps) {
  console.log(userNFTs);

  return (
    <Stack spacing={4}>
      <Typography variant="h4">
        <b>NFTs</b>
      </Typography>

      <Paper
        variant="outlined"
        sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4  }}
      >
        <Typography variant="h5">Your NFTs</Typography>
        <Grid
          container
          spacing={3}
        >
          {userNFTs.map((nft) => (
            <Grid
              item
              key={nft.tokenId}
              xs={6}
              md={3}
              lg={2}
            >
              <NFTItem nftCacheRecord={nft} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Stack>
  );
}
