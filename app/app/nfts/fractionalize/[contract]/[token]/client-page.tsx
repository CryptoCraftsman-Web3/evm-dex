'use client';

import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { NFTContractCachedLog } from '@/lib/db-schemas/nft-contract-cached-log';
import { NFTMetadata } from '@/types/common';
import { serpentSwapNftManagerABI } from '@/types/wagmi/serpent-swap';
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
  const [supply, setSupply] = useState<string>('');

  const { serpentSwapNFTManager } = useSwapProtocolAddresses();
  const { address: owner } = useAccount();

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
  });

  const { data: fractionalizeData, isLoading: isSubmittingFractionalizeTx } = useContractWrite(config);

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

  const { data: isApproved, isLoading: isCheckingApproval } = useContractRead({
    address: contract.nftContractAddress as `0x${string}`,
    abi: ['function ']
  });

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

          <Grid container>
            <Grid
              item
              xs={12}
              md={6}
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
            >
              <Stack
                direction="column"
                spacing={{ xs: 1, md: 3 }}
              >
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
                  onChange={(e) => setSupply(e.target.value)}
                />

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  Fractionalize
                </Button>

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
