import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { Position } from '@/types/common';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { Skeleton, Stack, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import { useAccount, useContractReads } from 'wagmi';
import Pool from './pool';
import TokenIdModal from './token-id-modal';

type PoolsListProps = {
  poolsCount: bigint;
  isGettingPoolsCount: boolean;
  refetchPoolsCount: () => void;
};

const PoolsList = ({ poolsCount, isGettingPoolsCount, refetchPoolsCount }: PoolsListProps) => {
  const { nfPositionManager } = useSwapProtocolAddresses();
  const { address } = useAccount();

  const tokenIdContracts = Array(Number(poolsCount))
    .fill(0)
    .map((_, i) => {
      return {
        address: nfPositionManager,
        abi: nonfungiblePositionManagerABI,
        functionName: 'tokenOfOwnerByIndex',
        args: [address || zeroAddress, i],
      };
    })
    .reverse();

  const { data: tokenIdResults, isLoading: isGettingTokenIds } = useContractReads({
    contracts: tokenIdContracts,
    enabled: address !== undefined,
  });

  const tokenIds =
    tokenIdResults !== undefined
      ? (tokenIdResults
          .map((t) => {
            return t.status === 'success' ? (t.result as bigint) : undefined;
          })
          .filter((t) => t !== undefined) as bigint[])
      : [];

  const { data: positionResults, isLoading: isGettingPositions } = useContractReads({
    contracts: tokenIds.map((tokenId) => {
      return {
        address: nfPositionManager,
        abi: nonfungiblePositionManagerABI,
        functionName: 'positions',
        args: [tokenId],
      };
    }),
    enabled: tokenIds.length > 0,
  });

  const positions: Position[] = [];
  for (let i = 0; i < tokenIds.length; i++) {
    const tokenId = tokenIds[i];
    const positionResult = positionResults?.[i];
    if (positionResult === undefined) continue;
    if (positionResult.status === 'failure') continue;

    const result = positionResult.result as [
      bigint,
      '0x${string}',
      '0x${string}',
      '0x${string}',
      number,
      number,
      number,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint
    ];

    positions.push({
      tokenId,
      nonce: result[0],
      operator: result[1],
      token0: result[2],
      token1: result[3],
      fee: result[4],
      tickLower: result[5],
      tickUpper: result[6],
      liquidity: result[7],
      feeGrowthInside0LastX128: result[8],
      feeGrowthInside1LastX128: result[9],
      tokensOwed0: result[10],
      tokensOwed1: result[11],
    });
  }

  const [hideClosedPositions, setHideClosedPositions] = useState<boolean>(
    window?.localStorage?.getItem('hideClosedPositions') === 'true' || false
  );

  const toggleHideClosedPositions = () => {
    // persist in local storage
    window?.localStorage?.setItem('hideClosedPositions', (!hideClosedPositions).toString());
    setHideClosedPositions(!hideClosedPositions);
  };

  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | null>(null);

  useEffect(() => {
    if (selectedTokenId !== null) {
      setIsTokenModalOpen(true);
    }
  }, [selectedTokenId]);

  useEffect(() => {
    if (!isTokenModalOpen) {
      setSelectedTokenId(null);
    }
  }, [isTokenModalOpen]);

  return (
    <>
      <Stack
        direction="column"
        spacing={2}
      >
        {isGettingPoolsCount || isGettingTokenIds || isGettingPositions ? (
          <>
            {Array(14)
              .fill(0)
              .map((_, index) => {
                return (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    width="100%"
                  />
                );
              })}
          </>
        ) : (
          <>
            <Stack
              direction="column"
              spacing="17px"
            >
              {positions.map((position, index) => {
                return (
                  <Pool
                    key={index}
                    tokenId={position.tokenId}
                    position={position}
                    hideClosedPositions={hideClosedPositions}
                    setSelectedTokenId={setSelectedTokenId}
                  />
                );
              })}
            </Stack>
          </>
        )}
      </Stack>
      {selectedTokenId !== null && (
        <TokenIdModal
          isModalOpen={isTokenModalOpen}
          setIsModalOpen={setIsTokenModalOpen}
          tokenId={selectedTokenId}
        />
      )}
    </>
  );
};

export default PoolsList;
