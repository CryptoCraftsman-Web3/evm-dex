'use client';

import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { Position } from '@/types/common';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { Alert, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { zeroAddress } from 'viem';
import { erc20ABI, useContractRead } from 'wagmi';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { uniswapV3FactoryABI, uniswapV3PoolABI } from '@/types/wagmi/uniswap-v3-core';

type PositionByTokenIdClientPageProps = {
  tokenId: bigint;
};

const PositionByTokenIdClientPage = ({ tokenId }: PositionByTokenIdClientPageProps) => {
  const { nfPositionManager, poolFactory } = useSwapProtocolAddresses();

  const { data: positionResult, isLoading: gettingPosition } = useContractRead({
    address: nfPositionManager,
    abi: nonfungiblePositionManagerABI,
    functionName: 'positions',
    args: [tokenId],
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
  });

  const { data: tokenADecimals, isLoading: gettingToken0Decimals } = useContractRead({
    address: position.token0,
    abi: erc20ABI,
    functionName: 'decimals',
  });

  const { data: tokenAName, isLoading: gettingToken0Name } = useContractRead({
    address: position.token0,
    abi: erc20ABI,
    functionName: 'name',
  });

  const { data: tokenBSymbol, isLoading: gettingToken1Symbol } = useContractRead({
    address: position.token1,
    abi: erc20ABI,
    functionName: 'symbol',
  });

  const { data: tokenBDecimals, isLoading: gettingToken1Decimals } = useContractRead({
    address: position.token1,
    abi: erc20ABI,
    functionName: 'decimals',
  });

  const { data: tokenBName, isLoading: gettingToken1Name } = useContractRead({
    address: position.token1,
    abi: erc20ABI,
    functionName: 'name',
  });

  const { data: pool, isLoading: gettingPool } = useContractRead({
    address: poolFactory,
    abi: uniswapV3FactoryABI,
    functionName: 'getPool',
    args: [position.token0, position.token1, position.fee],
  });

  const { data: slot0, isLoading: gettingSlot0 } = useContractRead({
    address: pool,
    abi: uniswapV3PoolABI,
    functionName: 'slot0',
  });

  const sqrtPriceX96 = slot0?.[0] || 0n;
  const currentTick = slot0?.[1] || 0;

  const price = Math.pow(Number(sqrtPriceX96) / 2 ** 96, 2)
  console.log(sqrtPriceX96, currentTick, price);

  const minPrice =
    tokenADecimals && tokenBDecimals ? 1.0001 ** position.tickLower / 10 ** (tokenBDecimals - tokenADecimals) : 0;
  const maxPrice =
    tokenADecimals && tokenBDecimals ? 1.0001 ** position.tickUpper / 10 ** (tokenBDecimals - tokenADecimals) : 0;

  const isLoading =
    gettingPosition ||
    gettingToken0Symbol ||
    gettingToken0Decimals ||
    gettingToken0Name ||
    gettingToken1Symbol ||
    gettingToken1Decimals ||
    gettingToken1Name ||
    gettingPool;

  return (
    <>
      <Stack direction="row">
        <Link href="/pools">
          <Typography
            variant="body1"
            sx={{
              color: 'GrayText',
              '&:hover': {
                color: 'text.primary',
              },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IoMdArrowRoundBack />
            &nbsp; Go back to pools
          </Typography>
        </Link>
      </Stack>

      {isLoading ? (
        <>
          <Skeleton
            variant="rounded"
            width="100%"
            height={50}
          />
        </>
      ) : (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Typography variant="h4">
                <b>
                  {tokenASymbol}/{tokenBSymbol}
                </b>
              </Typography>

              <Typography variant="body1">
                <b>{position.fee / 10_000}% Fee</b>
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: position.liquidity === 0n ? 'error.main' : 'success.main' }}
              >
                {position.liquidity === 0n ? 'Closed' : 'Open'}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                size="large"
              >
                Add Liquidity
              </Button>

              <Button
                variant="contained"
                size="large"
              >
                Remove Liquidity
              </Button>
            </Stack>
          </Stack>

          <Paper
            variant="outlined"
            sx={{
              padding: 2,
            }}
          >
            <Stack
              direction="column"
              spacing={2}
            >
              <Typography variant="h6">Liquidity</Typography>

              <Typography variant="body1"></Typography>
            </Stack>
          </Paper>
        </>
      )}
    </>
  );
};

export default PositionByTokenIdClientPage;
