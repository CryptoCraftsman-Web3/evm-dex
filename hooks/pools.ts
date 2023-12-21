'use client';

import { Position } from '@/types/common';
import { uniswapV3FactoryABI, uniswapV3PoolABI } from '@/types/wagmi/uniswap-v3-core';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { zeroAddress } from 'viem';
import { erc20ABI, useContractRead } from 'wagmi';
import { useSwapProtocolAddresses } from './swap-protocol-hooks';

export function useLiquidityPosition(tokenId: bigint) {
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

  const sqrtPriceX96 = slot0?.[0] || 0n;
  const currentTick = slot0?.[1] || 0;

  const price = Math.pow(Number(sqrtPriceX96) / 2 ** 96, 2);

  const minPrice =
    tokenADecimals && tokenBDecimals ? 1.0001 ** position.tickLower / 10 ** (tokenBDecimals - tokenADecimals) : 0;
  const maxPrice =
    tokenADecimals && tokenBDecimals ? 1.0001 ** position.tickUpper / 10 ** (tokenBDecimals - tokenADecimals) : 0;

  const sqrtRatioA = Math.sqrt(1.0001 ** position.tickLower);
  const sqrtRatioB = Math.sqrt(1.0001 ** position.tickUpper);
  const sqrtPrice = Number(sqrtPriceX96) / 2 ** 96;

  let amountAInWei = 0;
  let amountBInWei = 0;
  if (currentTick <= position.tickLower) {
    amountAInWei = Math.floor(Number(position.liquidity) * ((sqrtRatioB - sqrtRatioA) / (sqrtRatioA * sqrtRatioB)));
  } else if (currentTick > position.tickUpper) {
    amountBInWei = Math.floor(Number(position.liquidity) * (sqrtRatioB - sqrtRatioA));
  } else if (currentTick >= position.tickLower && currentTick < position.tickUpper) {
    amountAInWei = Math.floor(Number(position.liquidity) * ((sqrtRatioB - sqrtPrice) / (sqrtPrice * sqrtRatioB)));
    amountBInWei = Math.floor(Number(position.liquidity) * (sqrtPrice - sqrtRatioA));
  }

  const amountAFormatted = (amountAInWei / 10 ** (tokenADecimals || 18)).toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  });
  const amountBFormatted = (amountBInWei / 10 ** (tokenBDecimals || 18)).toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
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
    sqrtPriceX96,
    currentTick,
    price,
    minPrice,
    maxPrice,
    sqrtRatioA,
    sqrtRatioB,
    sqrtPrice,
    amountAInWei,
    amountBInWei,
    amountAFormatted,
    amountBFormatted,
  };
}
