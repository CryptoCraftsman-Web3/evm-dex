'use client';

import { getNFTs } from '@/lib/nfts';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { toast } from 'react-toastify';

type RefreshNFTsButtonProps = {
  userAddress: string;
};

export default function RefreshNFTsButton({ userAddress }: RefreshNFTsButtonProps) {
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
    <LoadingButton
      variant="contained"
      loading={refreshingNFTs}
      onClick={refreshNFTs}
    >
      Refresh NFTs
    </LoadingButton>
  );
}
