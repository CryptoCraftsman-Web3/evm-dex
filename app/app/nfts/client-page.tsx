'use client';

import NFTItem from '@/components/nfts/nft-item';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { NFTContractCachedLog } from '@/lib/db-schemas/nft-contract-cached-log';
import { serpentSwapNftManagerABI } from '@/types/wagmi/serpent-swap';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useAccount, useContractRead } from 'wagmi';

type NFTsClientPageProps = {
  userNFTs: NFTCacheRecord[];
  nftContracts: { [key: string]: NFTContractCachedLog };
};

export default function NFTsClientPage({ userNFTs, nftContracts }: NFTsClientPageProps) {
  const { address: userAddress } = useAccount();
  const { serpentSwapNFTManager } = useSwapProtocolAddresses();
  const { data: fracContracts } = useContractRead({
    address: serpentSwapNFTManager,
    abi: serpentSwapNftManagerABI,
    functionName: 'getUserSerpentSwapNFTContracts',
    args: [userAddress!],
    enabled: Boolean(userAddress)
  });


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

      <Paper
        variant="outlined"
        sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        <Typography variant="h5">NFTs you have fractionalized</Typography>
        <Grid
          container
          spacing={3}
        >

        </Grid>
      </Paper>
    </Stack>
  );
}
