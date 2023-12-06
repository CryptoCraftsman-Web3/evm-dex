'use client';

import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { NFTContractCachedLog } from '@/lib/db-schemas/nft-contract-cached-log';
import { NFTMetadata } from '@/types/common';
import { erc721ABI, serpentSwapNftManagerABI } from '@/types/wagmi/serpent-swap';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Paper, Skeleton, Stack, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { zeroAddress } from 'viem';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

type FractionalizeNFTClientPageProps = {
  nft: NFTCacheRecord;
  contract: NFTContractCachedLog;
};

export default function FractionalizeNFTClientPage({ nft, contract }: FractionalizeNFTClientPageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<NFTMetadata>();
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    // load nft from metadata
    const { tokenURI } = nft;
    if (!tokenURI) {
      setLoading(false);
      return;
    }

    let metadataUri = tokenURI;
    if (tokenURI.startsWith('ipfs://')) {
      metadataUri = tokenURI.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
    }

    const fetchMetadata = async (uri: string) => {
      setLoading(true);
      try {
        const res = await fetch(uri);
        if (!res.ok) throw new Error('Failed to fetch metadata');

        const metadata = await res.json();
        setMetadata(metadata);

        // process image url
        let imageUrl = metadata.image;
        if (metadata.image.startsWith('ipfs://')) {
          imageUrl = metadata.image.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
        }
        setImageUrl(imageUrl);
      } catch (err) {
        setImageUrl('/images/unknown-nft.webp');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata(metadataUri);
  }, []);

  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [supply, setSupply] = useState<number>(100);

  const { serpentSwapNFTManager } = useSwapProtocolAddresses();
  const { address: owner } = useAccount();

  const { data: getApprovedData, refetch: checkApproval } = useContractRead({
    address: contract.nftContractAddress as `0x${string}`,
    abi: erc721ABI,
    functionName: 'getApproved',
    args: [BigInt(nft.tokenId)],
  });

  const isApproved = getApprovedData === serpentSwapNFTManager;

  const { config: approveConfig } = usePrepareContractWrite({
    address: contract.nftContractAddress as `0x${string}`,
    abi: erc721ABI,
    functionName: 'approve',
    args: [serpentSwapNFTManager, BigInt(nft.tokenId)],
  });

  const {
    data: approveData,
    writeAsync: approveNft,
    isLoading: isSubmittingApproval,
  } = useContractWrite(approveConfig);
  const {
    isLoading: isApproving,
    isSuccess: approvalSucceeded,
    isError: approvalFailed,
  } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  useEffect(() => {
    if (approvalSucceeded) {
      toast.success(`Approved ${metadata?.name} successfully`);
    }

    if (approvalFailed) {
      toast.error(`Failed to approve ${metadata?.name}`);
    }

    checkApproval();
  }, [approvalSucceeded, approvalFailed]);

  const { config } = usePrepareContractWrite({
    address: serpentSwapNFTManager,
    abi: serpentSwapNftManagerABI,
    functionName: 'deployAndFractionalize',
    args: [
      name,
      symbol,
      BigInt(supply),
      owner || zeroAddress,
      contract.nftContractAddress as `0x${string}`,
      BigInt(nft.tokenId),
    ],
    enabled: isApproved && Boolean(name) && Boolean(symbol) && supply > 0,
  });

  const {
    data: fractionalizeData,
    isLoading: isSubmittingFractionalizeTx,
    writeAsync: fractionalize,
  } = useContractWrite(config);

  const {
    isLoading: isFractionalizing,
    isSuccess: fractionalizeSucceeded,
    isError: fractionalizeFailed,
  } = useWaitForTransaction({
    hash: fractionalizeData?.hash,
  });

  useEffect(() => {
    if (fractionalizeSucceeded) {
      toast.success(`Fractionalized ${metadata?.name} successfully`);
    }

    if (fractionalizeFailed) {
      toast.error(`Failed to fractionalize ${metadata?.name}`);
    }
  }, [fractionalizeSucceeded, fractionalizeFailed]);

  return (
    <>
      {loading ? (
        <Stack
          direction="column"
          spacing={4}
        >
          <Stack
            direction="column"
            spacing={1}
          >
            <Skeleton
              variant="rounded"
              width="50%"
              height="48px"
            />
            <Skeleton
              variant="rounded"
              width="40%"
              height="18px"
            />
          </Stack>

          <Grid
            container
            spacing={6}
          >
            <Grid
              item
              xs={12}
              md={6}
            >
              <Skeleton
                variant="rounded"
                sx={{
                  width: '70%',
                  height: '100%',
                  aspectRatio: '1 / 1',
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
            >
              <Stack
                direction="column"
                spacing={3}
              >
                <Skeleton
                  variant="rounded"
                  height="40px"
                  width="100%"
                />

                <Skeleton
                  variant="rounded"
                  height="40px"
                  width="100%"
                />

                <Skeleton
                  variant="rounded"
                  height="40px"
                  width="100%"
                />

                <Skeleton
                  variant="rounded"
                  height="40px"
                  width="100%"
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      ) : (
        <Stack spacing={4}>
          <Stack
            direction="column"
            spacing={0}
          >
            <Typography variant="h4">
              <b>Fractionalize {metadata?.name}</b>
            </Typography>
            <Typography variant="body1">
              {contract.nftContractSymbol} #{nft.tokenId}
            </Typography>
          </Stack>

          <Grid
            container
            alignItems="stretch"
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{ height: '100%' }}
            >
              <Paper
                variant="outlined"
                component="img"
                src={imageUrl || '/images/unknown-nft.webp'}
                sx={{
                  width: '70%',
                  aspectRatio: '1 / 1',
                  borderRadius: '10px',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  setImageUrl('/images/unknown-nft.webp');
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{ height: '100%' }}
            >
              <Stack
                direction="column"
                spacing={{ xs: 1, md: 3 }}
                justifyContent="center"
                alignContent="center"
                sx={{ height: '100%' }}
              >
                {!isApproved && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ textAlign: 'center' }}
                    >
                      This NFT needs to be approved for fractionalization
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ textAlign: 'center' }}
                    >
                      This will allow the SerpentSwap NFT Manager contract to transfer this NFT on your behalf and mint
                      fractional tokens for you.
                    </Typography>

                    <LoadingButton
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={() => {
                        if (approveNft) approveNft();
                      }}
                      loading={isSubmittingApproval || isApproving}
                    >
                      Approve NFT for Fractionalization
                    </LoadingButton>
                  </>
                )}

                {isApproved && (
                  <>
                    <TextField
                      label="Fractional Token Name"
                      variant="outlined"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                      label="Fractional Token Symbol"
                      variant="outlined"
                      fullWidth
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                    />

                    <TextField
                      label="Fractional Token Supply"
                      variant="outlined"
                      fullWidth
                      value={supply}
                      onChange={(e) => setSupply(parseInt(e.target.value))}
                    />
                    <LoadingButton
                      variant="contained"
                      size="large"
                      fullWidth
                      loading={isSubmittingFractionalizeTx || isFractionalizing}
                      onClick={() => {
                        if (fractionalize) fractionalize();
                      }}
                    >
                      Fractionalize
                    </LoadingButton>
                  </>
                )}

                <Link
                  href="/app/nfts"
                  passHref
                >
                  <Button
                    variant="text"
                    size="large"
                    fullWidth
                  >
                    Go Back To NFTs List
                  </Button>
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      )}
    </>
  );
}
