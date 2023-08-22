import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { Position } from '@/types/common';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { Stack } from '@mui/material';
import { zeroAddress } from 'viem';
import { useAccount, useContractRead, useContractReads } from 'wagmi';
import Pool from './pool';

const PoolsList = () => {
  const { nfPositionManager } = useSwapProtocolAddresses();
  const { address } = useAccount();

  const { data: poolsCount, isLoading: isGettingPoolsCount, refetch: getPoolsCount } = useContractRead({
    address: nfPositionManager,
    abi: nonfungiblePositionManagerABI,
    functionName: 'balanceOf',
    args: [address!],
    enabled: address !== undefined,
  });

  const tokenIdContracts = Array(Number(poolsCount))
    .fill(0)
    .map((_, i) => {
      return {
        address: nfPositionManager,
        abi: nonfungiblePositionManagerABI,
        functionName: 'tokenOfOwnerByIndex',
        args: [address || zeroAddress, i],
      };
    });

  const { data: tokenIdResults, isLoading: isGettingTokenIds } = useContractReads({
    contracts: tokenIdContracts,
    enabled: address !== undefined,
  });

  const tokenIds = tokenIdResults !== undefined ? tokenIdResults
    .map((t) => {
      return t.status === 'success' ? (t.result as bigint) : undefined;
    })
    .filter((t) => t !== undefined) as bigint[] : [];

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
  console.log(positionResults);

  const positions: Position[] = [];
  for (const positionResult of positionResults?.reverse() || []) {
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

  return (
    <Stack direction="column" spacing={2}>
      {positions.map((position, index) => {
        return <Pool key={index} position={position} />;
      })}
    </Stack>
  );
};

export default PoolsList;
