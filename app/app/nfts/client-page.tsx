'use client';

import FractionalizedNFTItem from '@/components/nfts/fractionalized-nft-item';
import NFTItem from '@/components/nfts/nft-item';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { NFTContractCachedLog } from '@/lib/db-schemas/nft-contract-cached-log';
import { getNFTs } from '@/lib/nfts';
import { serpentSwapNftABI, serpentSwapNftManagerABI } from '@/types/wagmi/serpent-swap';
import { LoadingButton } from '@mui/lab';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useContractRead, useContractReads } from 'wagmi';

type NFTsClientPageProps = {
  userNFTs: NFTCacheRecord[];
  nftContracts: { [key: string]: NFTContractCachedLog };
};

export default function NFTsClientPage({ userNFTs, nftContracts }: NFTsClientPageProps) {
  const { address: userAddress } = useAccount();
  const { serpentSwapNFTManager } = useSwapProtocolAddresses();

  const { data: fractionalContracts, isLoading: gettingFractionalContracts } = useContractRead({
    address: serpentSwapNFTManager,
    abi: serpentSwapNftManagerABI,
    functionName: 'getUserSerpentSwapNFTContracts',
    args: [userAddress!],
    enabled: Boolean(userAddress),
  });

  const fractionalContractsCount = fractionalContracts?.length || 0;

  const nftContractReads = fractionalContracts?.map((contractAddress: `0x${string}`) => ({
    address: contractAddress,
    abi: serpentSwapNftABI,
    functionName: 'nftContract',
    enabled: Boolean(userAddress),
  }));

  const tokenIdReads = fractionalContracts?.map((contractAddress: `0x${string}`) => ({
    address: contractAddress,
    abi: serpentSwapNftABI,
    functionName: 'tokenId',
    enabled: Boolean(userAddress),
  }));

  const nftReads = [...(nftContractReads || []), ...(tokenIdReads || [])];

  const { data: fractionalNFTsData } = useContractReads({
    contracts: nftReads,
    enabled: Boolean(userAddress),
  });

  const fractionalNFTs: {
    fractionalContractAddress: `0x${string}`;
    nftContractAddress: `0x${string}`;
    tokenId: bigint;
  }[] = [];
  for (let i = 0; i < fractionalContractsCount; i++) {
    fractionalNFTs.push({
      fractionalContractAddress: fractionalContracts?.[i] as `0x${string}`,
      nftContractAddress: fractionalNFTsData?.[i].result as `0x${string}`,
      tokenId: fractionalNFTsData?.[i + fractionalContractsCount].result as bigint,
    });
  }

  const [refreshingNFTs, setRefreshingNFTs] = useState<boolean>(false);
  const refreshNFTs = async () => {
    setRefreshingNFTs(true);
    try {
      await getNFTs(userAddress!, true, true);
      toast.success('Initiated NFT refresh. It may take a while for your NFTs to appear.');
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshingNFTs(false);
    }
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4">
        <b>NFTs</b>
      </Typography>

      <Paper
        variant="outlined"
        sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Your NFTs</Typography>
          <LoadingButton
            variant="contained"
            loading={refreshingNFTs}
            onClick={refreshNFTs}
          >
            Refresh NFTs
          </LoadingButton>
        </Stack>
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
          {fractionalNFTs.map((nft) => (
            <Grid
              item
              key={`${nft.nftContractAddress}-${nft.tokenId}`}
              xs={6}
              md={3}
              lg={2}
            >
              <FractionalizedNFTItem
                nftContractAddress={nft.nftContractAddress}
                tokenId={nft.tokenId}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Stack>
  );
}
