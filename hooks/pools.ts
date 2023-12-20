'use client';

import { Position } from '@/types/common';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { erc20ABI, useAccount, useContractRead } from 'wagmi';
import { useSwapProtocolAddresses } from './swap-protocol-hooks';
import { zeroAddress } from 'viem';
import { uniswapV3FactoryABI, uniswapV3PoolABI } from '@/types/wagmi/uniswap-v3-core';

export function useLiquidityPosition(tokenId: bigint) {
  const { address } = useAccount();
  const { nfPositionManager, poolFactory } = useSwapProtocolAddresses();

  const {
    data: positionResult,
    isLoading: gettingPosition,
    refetch: refetchPosition,
  } = useContractRead({
    address: nfPositionManager,
    abi: nonfungiblePositionManagerABI,
    functionName: 'positions',
    args: [tokenId],
    enabled: Boolean(tokenId),
  });

  const position: Position = {
    tokenId,
    nonce: positionResult?.[0] || 0n,
    operator: positionResult?.[1] || zeroAddress,
    token0: positionResult?.[2] || zeroAddress,
    token1: positionResult?.[3] || zeroAddress,
    fee: positionResult?.[4] || 0,
    tickLower: positionResult?.[5] || 0,
    tickUpper: positionResult?.[6] || 0,
    liquidity: positionResult?.[7] || 0n,
    feeGrowthInside0LastX128: positionResult?.[8] || 0n,
    feeGrowthInside1LastX128: positionResult?.[9] || 0n,
    tokensOwed0: positionResult?.[10] || 0n,
    tokensOwed1: positionResult?.[11] || 0n,
  };

  const { data: tokenASymbol, isLoading: gettingToken0Symbol } = useContractRead({
    address: position.token0,
    abi: erc20ABI,
    functionName: 'symbol',
    enabled: Boolean(position) && Boolean(position.token0),
  });

  const { data: tokenADecimals, isLoading: gettingToken0Decimals } = useContractRead({
    address: position.token0,
    abi: erc20ABI,
    functionName: 'decimals',
    enabled: Boolean(position) && Boolean(position.token0),
  });

  const { data: tokenAName, isLoading: gettingToken0Name } = useContractRead({
    address: position.token0,
    abi: erc20ABI,
    functionName: 'name',
    enabled: Boolean(position) && Boolean(position.token0),
  });

  const { data: tokenBSymbol, isLoading: gettingToken1Symbol } = useContractRead({
    address: position.token1,
    abi: erc20ABI,
    functionName: 'symbol',
    enabled: Boolean(position) && Boolean(position.token1),
  });

  const { data: tokenBDecimals, isLoading: gettingToken1Decimals } = useContractRead({
    address: position.token1,
    abi: erc20ABI,
    functionName: 'decimals',
    enabled: Boolean(position) && Boolean(position.token1),
  });

  const { data: tokenBName, isLoading: gettingToken1Name } = useContractRead({
    address: position.token1,
    abi: erc20ABI,
    functionName: 'name',
    enabled: Boolean(position) && Boolean(position.token1),
  });

  const { data: pool, isLoading: gettingPool } = useContractRead({
    address: poolFactory,
    abi: uniswapV3FactoryABI,
    functionName: 'getPool',
    args: [position.token0, position.token1, position.fee],
    enabled: Boolean(position) && Boolean(position.token0) && Boolean(position.token1) && Boolean(position.fee),
  });

  const { data: slot0, isLoading: gettingSlot0 } = useContractRead({
    address: pool,
    abi: uniswapV3PoolABI,
    functionName: 'slot0',
    enabled: Boolean(pool),
  });

  return {
    position,
    gettingPosition,
    refetchPosition,
    tokenASymbol,
    gettingToken0Symbol,
    tokenADecimals,
    gettingToken0Decimals,
    tokenAName,
    gettingToken0Name,
    tokenBSymbol,
    gettingToken1Symbol,
    tokenBDecimals,
    gettingToken1Decimals,
    tokenBName,
    gettingToken1Name,
    pool,
    gettingPool,
    slot0,
    gettingSlot0,
  };
}
