import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { Position } from '@/types/common';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { Button, Divider, Link, Skeleton, Stack, Typography } from '@mui/material';
import { zeroAddress } from 'viem';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import Pool from './pool';
import { useState } from 'react';

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
  for (const positionResult of positionResults || []) {
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

  return (
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
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {hideClosedPositions ? (
              <Typography variant="h6">
                You have {positions.filter((p) => p.liquidity > 0n).length} open positions
              </Typography>
            ) : (
              <Typography variant="h6">You have {positions.length} positions</Typography>
            )}

            <Link
              onClick={toggleHideClosedPositions}
              sx={{ cursor: 'pointer', textDecoration: 'none', textAlign: 'right' }}
            >
              {hideClosedPositions ? 'Show Closed Positions' : 'Hide Closed Positions'}
            </Link>
          </Stack>

          <Divider />

          {positions.map((position, index) => {
            return (
              <Pool
                key={index}
                position={position}
                hideClosedPositions={hideClosedPositions}
              />
            );
          })}
        </>
      )}
    </Stack>
  );
};

export default PoolsList;
