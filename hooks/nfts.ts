'use client';

import { useAccount, useContractRead, useContractReads } from 'wagmi';
import { useSwapProtocolAddresses } from './swap-protocol-hooks';
import { serpentSwapNftABI, serpentSwapNftManagerABI } from '@/types/wagmi/serpent-swap';
import { FractionalNFT } from '@/types/common';

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
