'use client';

import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { NFTContractCachedLog } from '@/lib/db-schemas/nft-contract-cached-log';
import { NFTMetadata } from '@/types/common';
import { Skeleton, Stack, Typography, Button, Paper } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type NFTItemProps = {
  nftCacheRecord: NFTCacheRecord;
  nftContract: NFTContractCachedLog;
};

export default function NFTItem({ nftCacheRecord, nftContract }: NFTItemProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<NFTMetadata>();
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    // load nft from metadata
    const { tokenURI } = nftCacheRecord;
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
  }, []);

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
              {nftContract?.nftContractName || 'Unknown Contract'}
            </Typography>

            <Typography
              variant="body2"
              sx={{ textAlign: 'center' }}
            >
              {nftContract?.nftContractSymbol || 'Unknown Symbol'} #{nftCacheRecord.tokenId}
            </Typography>
          </Stack>

          <Link
            href={`/application/nfts/fractionalize/${nftCacheRecord.nftContractAddress}/${nftCacheRecord.tokenId}`}
            passHref
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ width: '100%' }}
            >
              Fractionalize
            </Button>
          </Link>
        </>
      )}
    </Stack>
  );
}
