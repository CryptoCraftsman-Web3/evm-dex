'use client';

import { NFTCacheRecord } from '@/lib/db-schemas/nft-cache-record';
import { useState, useEffect } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';

type NFTItemProps = {
  nftCacheRecord: NFTCacheRecord;
};

type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
};

export default function NFTItem({ nftCacheRecord }: NFTItemProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<NFTMetadata>();
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    // load nft from metadata
    const { tokenURI } = nftCacheRecord;
    if (!tokenURI) return;

    let metadataUri = tokenURI;
    if (tokenURI.startsWith('ipfs://')) {
      metadataUri = tokenURI.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
    }
    setLoading(true);
    fetch(metadataUri)
      .then((res) => res.json())
      .then((metadata) => {
        setMetadata(metadata);

        // process image url
        let imageUrl = metadata.image;
        if (metadata.image.startsWith('ipfs://')) {
          imageUrl = metadata.image.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
        }
        setImageUrl(imageUrl);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Stack direction="column" >
      <Avatar
        variant="rounded"
        src={imageUrl}
        sx={{
          width: '100%',
          height: '100%',
          aspectRatio: '1 / 1',
          objectFit: 'cover',
        }}
      />

      <Typography variant="body1" sx={{ textAlign: 'center' }}>
        {metadata?.name || 'Unknown NFT'}
      </Typography>

    </Stack>
  );
}
