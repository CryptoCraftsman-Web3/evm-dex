'use client';

import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useSwapProtocolAddresses } from './swap-protocol-hooks';
import { erc721ABI, serpentSwapNftABI, serpentSwapNftManagerABI } from '@/types/wagmi/serpent-swap';
import { FractionalNFT, NFTMetadata } from '@/types/common';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { parseUnits, zeroAddress } from 'viem';

export function useFractionalNFTs() {
  const { address: userAddress } = useAccount();
  const { serpentSwapNFTManager } = useSwapProtocolAddresses();

  // get fractionalized NFT contract addresses (by user address)
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

  // prepare reads for tokenId and nftContract so we can query them in one call
  const tokenIdReads = fractionalContracts?.map((contractAddress: `0x${string}`) => ({
    address: contractAddress,
    abi: serpentSwapNftABI,
    functionName: 'tokenId',
    enabled: Boolean(userAddress),
  }));

  const nftReads = [...(nftContractReads || []), ...(tokenIdReads || [])];

  const { data: fractionalNFTsData, isLoading: gettingFractionalNFTsData } = useContractReads({
    contracts: nftReads,
    enabled: Boolean(userAddress),
  });

  // combine fractionalized NFT contract addresses with their tokenIds and nftContract addresses

  const fractionalNFTs: FractionalNFT[] = [];

  for (let i = 0; i < fractionalContractsCount; i++) {
    fractionalNFTs.push({
      fractionalContractAddress: fractionalContracts?.[i] as `0x${string}`,
      nftContractAddress: fractionalNFTsData?.[i].result as `0x${string}`,
      tokenId: fractionalNFTsData?.[i + fractionalContractsCount].result as bigint,
    });
  }

  return {
    fractionalNFTs,
    isLoading: gettingFractionalContracts || gettingFractionalNFTsData,
  };
}

export function useNFTMetadataLoader(tokenURI: string) {
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<NFTMetadata>();
  const [imageUrl, setImageUrl] = useState<string>();

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
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata(metadataUri);
  }, [metadataUri]);

  return {
    isError,
    error,
    loading,
    metadata,
    imageUrl,
    setImageUrl,
  };
}

export function useNFTApproval(nftContractAddress: `0x${string}`, tokenId: bigint) {
  const { serpentSwapNFTManager } = useSwapProtocolAddresses();
  const { address: userAddress } = useAccount();

  const { data: getApprovedData, refetch: checkApproval } = useContractRead({
    address: nftContractAddress,
    abi: erc721ABI,
    functionName: 'getApproved',
    args: [BigInt(tokenId)],
  });

  const isApproved = getApprovedData === serpentSwapNFTManager;

  const { config: approveConfig } = usePrepareContractWrite({
    address: nftContractAddress,
    abi: erc721ABI,
    functionName: 'approve',
    args: [serpentSwapNFTManager, tokenId],
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

  return {
    isApproved,
    approveNft,
    isSubmittingApproval,
    isApproving,
    approvalSucceeded,
    approvalFailed,
    checkApproval,
  };
}

export function useDeployAndFractionalize(
  name: string,
  symbol: string,
  supply: number,
  nftContractAddress: `0x${string}`,
  tokenId: bigint,
  enabled: boolean
) {
  const { address: userAddress } = useAccount();
  const { serpentSwapNFTManager } = useSwapProtocolAddresses();

  const { config } = usePrepareContractWrite({
    address: serpentSwapNFTManager,
    abi: serpentSwapNftManagerABI,
    functionName: 'deployAndFractionalize',
    args: [name, symbol, parseUnits(supply.toString(), 18), userAddress || zeroAddress, nftContractAddress, tokenId],
    enabled,
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

  return {
    fractionalize,
    isSubmittingFractionalizeTx,
    isFractionalizing,
    fractionalizeSucceeded,
    fractionalizeFailed,
  };
}

export function useFractionalContract(nftContractAddress: `0x${string}`, tokenId: bigint) {
  const { address: userAddress } = useAccount();
  const { serpentSwapNFTManager } = useSwapProtocolAddresses();
  const { data: serpentSwapNFTContractAddress, refetch: refetchSerpentSwapNFTContractAddress } = useContractRead({
    address: serpentSwapNFTManager,
    abi: serpentSwapNftManagerABI,
    functionName: 'getUserSerpentSwapNFTContractForNFT',
    args: [nftContractAddress, tokenId],
  });

  const isFractionalized = Boolean(serpentSwapNFTContractAddress) && serpentSwapNFTContractAddress !== zeroAddress;

  const serpentSwapNFTContract = {
    address: serpentSwapNFTContractAddress,
    abi: serpentSwapNftABI,
  };

  const { data: fracTokenData, refetch: refetchFracTokenData } = useContractReads({
    contracts: [
      {
        ...serpentSwapNFTContract,
        functionName: 'totalSupply',
      },
      {
        ...serpentSwapNFTContract,
        functionName: 'balanceOf',
        args: [userAddress || zeroAddress],
      },
      {
        ...serpentSwapNFTContract,
        functionName: 'symbol',
      },
      {
        ...serpentSwapNFTContract,
        functionName: 'name',
      },
      {
        ...serpentSwapNFTContract,
        functionName: 'allowance',
        args: [userAddress || zeroAddress, serpentSwapNFTManager],
      },
      {
        ...serpentSwapNFTContract,
        functionName: 'isUnlocked',
      },
      {
        ...serpentSwapNFTContract,
        functionName: 'unlockPercentageSupplyHeld',
      }
    ],
  });

  const fracTokenTotalSupply = (fracTokenData?.at(0)?.result as bigint) || BigInt(0);
  const fracTokenUserBalance = (fracTokenData?.at(1)?.result as bigint) || BigInt(0);
  const fracTokenSymbol = (fracTokenData?.at(2)?.result as string) || '';
  const fracTokenName = (fracTokenData?.at(3)?.result as string) || '';
  const fracTokenAllowance = (fracTokenData?.at(4)?.result as bigint) || BigInt(0);
  const fracContractIsUnlocked = (fracTokenData?.at(5)?.result as boolean) || false;
  const unlockPercentageSupplyHeld = (fracTokenData?.at(6)?.result as bigint) || BigInt(0);
  const isApprovedToRedeem = fracTokenAllowance >= fracTokenTotalSupply;
  const isRedeemed = fracTokenTotalSupply === BigInt(0);

  return {
    serpentSwapNFTContractAddress,
    refetchSerpentSwapNFTContractAddress,
    isFractionalized,
    fracTokenTotalSupply,
    fracTokenUserBalance,
    fracTokenSymbol,
    fracTokenName,
    fracTokenAllowance,
    fracContractIsUnlocked,
    unlockPercentageSupplyHeld,
    refetchFracTokenData,
    isApprovedToRedeem,
    isRedeemed,
  };
}
