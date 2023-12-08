'use client';

import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { NFTContractCachedLog } from '@/lib/db-schemas/nft-contract-cached-log';
import { NFTMetadata } from '@/types/common';
import { erc721ABI } from '@/types/wagmi/serpent-swap';
import { Skeleton, Stack, Typography, Button, Paper } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';

type FractionalizedNFTItemProps = {
  nftContractAddress: `0x${string}`;
  tokenId: bigint;
};

export default function FractionalizedNFTItem({ nftContractAddress, tokenId }: FractionalizedNFTItemProps) {
  const { address: userAddress } = useAccount();

  const { data: tokenURI, isLoading: gettingTokenURI } = useContractRead({
    address: nftContractAddress,
    abi: erc721ABI,
    functionName: 'tokenURI',
    args: [tokenId],
    enabled: Boolean(userAddress),
  });

  const { data: nftContractName, isLoading: gettingNFTContractName } = useContractRead({
    address: nftContractAddress,
    abi: erc721ABI,
    functionName: 'name',
    enabled: Boolean(userAddress),
  });

  const { data: nftContractSymbol, isLoading: gettingNFTContractSymbol } = useContractRead({
    address: nftContractAddress,
    abi: erc721ABI,
    functionName: 'symbol',
    enabled: Boolean(userAddress),
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<NFTMetadata>();
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    // load nft from metadata
    if (!tokenURI) {
      setLoading(false);
      return;
    }

    let metadataUri = tokenURI;
    if (tokenURI.startsWith('ipfs://')) {
      metadataUri = tokenURI.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
    }

    const fetchMetadata = async (uri: string) => {
      console.log('fetching metadata', uri);
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata(metadataUri);
  }, [tokenURI, nftContractName, nftContractSymbol]);

  return (
    <Stack
      direction="column"
      spacing={1}
      alignItems="center"
      justifyContent="center"
      sx={{
        padding: '10px',
      }}
    >
      {loading ? (
        <>
          <Skeleton
            variant="rounded"
            width="100%"
            height="160px"
          />

          <Stack
            direction="column"
            spacing={0}
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Skeleton
              variant="text"
              width="80%"
            />

            <Skeleton
              variant="text"
              width="60%"
            />

            <Skeleton
              variant="text"
              width="70%"
            />
          </Stack>

          <Skeleton
            variant="rounded"
            width="100%"
            height="40px"
          />
        </>
      ) : (
        <>
          <Paper
            component="img"
            variant="outlined"
            src={imageUrl || '/images/unknown-nft.webp'}
            style={{
              width: '100%',
              height: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              padding: '10px',
              borderRadius: '20px',
            }}
            onError={(e) => {
              setImageUrl('/images/unknown-nft.webp');
            }}
          />

          <Stack
            direction="column"
            spacing={0}
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="body1"
              sx={{ textAlign: 'center' }}
            >
              <b>{metadata?.name || 'Unknown NFT'}</b>
            </Typography>

            <Typography
              variant="body2"
              sx={{ textAlign: 'center' }}
            >
              {nftContractName || 'Unknown Contract'}
            </Typography>

            <Typography
              variant="body2"
              sx={{ textAlign: 'center' }}
            >
              {nftContractSymbol || 'Unknown Symbol'} #{tokenId.toString()}
            </Typography>
          </Stack>

          <Link
            href={`/app/nfts/fractionalize/${nftContractAddress}/${tokenId}`}
            passHref
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ width: '100%' }}
            >
              Go To Token Page
            </Button>
          </Link>
        </>
      )}
    </Stack>
  );
}
