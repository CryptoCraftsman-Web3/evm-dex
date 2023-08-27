'use client';

import { useState, useEffect } from 'react';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { Position } from '@/types/common';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { Button, Grid, Paper, Skeleton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { formatUnits, zeroAddress } from 'viem';
import { erc20ABI, useAccount, useContractRead, useNetwork, usePublicClient } from 'wagmi';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { uniswapV3FactoryABI, uniswapV3PoolABI } from '@/types/wagmi/uniswap-v3-core';
import { IoLink } from 'react-icons/io5';
import { useEthersProvider } from '@/lib/ethers';
import { ethers, BigNumber } from 'ethers';
import { isConstructorDeclaration } from 'typescript';

type PositionByTokenIdClientPageProps = {
  tokenId: bigint;
};

const PositionByTokenIdClientPage = ({ tokenId }: PositionByTokenIdClientPageProps) => {
  const { chain } = useNetwork();
  const { address } = useAccount();
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
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
  const amountBFormatted = (amountBInWei / 10 ** (tokenBDecimals || 18)).toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

  // we need to use ethers.js to get the amount of uncollected fees
  // this is because wagmi/viem does not have callstatic support

  const provider = useEthersProvider();
  const nfPositionManagerContract = new ethers.Contract(
    nfPositionManager,
    nonfungiblePositionManagerABI,
    provider || ethers.getDefaultProvider()
  );

  const [tokenAUnclaimedFees, setTokenAUnclaimedFees] = useState<number>(0);
  const [tokenBUnclaimedFees, setTokenBUnclaimedFees] = useState<number>(0);

  useEffect(() => {
    nfPositionManagerContract.callStatic
      .collect({
        tokenId,
        recipient: address,
        amount0Max: BigNumber.from(2).pow(128).sub(1),
        amount1Max: BigNumber.from(2).pow(128).sub(1),
      })
      .then((result: { amount0: BigNumber; amount1: BigNumber }) => {
        setTokenAUnclaimedFees(Number(formatUnits(result.amount0.toBigInt(), tokenADecimals || 18)));
        setTokenBUnclaimedFees(Number(formatUnits(result.amount1.toBigInt(), tokenBDecimals || 18)));
      });
  }, []);

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

          <Skeleton
            variant="rounded"
            width="100%"
            height={150}
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

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <a
                  href={`${chain?.blockExplorers?.default.url}/address/${position.token0}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography
                    variant="body1"
                    display="flex"
                    alignItems="center"
                    sx={{
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {tokenASymbol} ({tokenAName}) &nbsp; <IoLink />
                  </Typography>
                </a>

                <Typography variant="body1">{amountAFormatted}</Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <a
                  href={`${chain?.blockExplorers?.default.url}/address/${position.token1}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography
                    variant="body1"
                    display="flex"
                    alignItems="center"
                    sx={{
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {tokenBSymbol} ({tokenBName}) &nbsp; <IoLink />
                  </Typography>
                </a>

                <Typography variant="body1">{amountBFormatted}</Typography>
              </Stack>
            </Stack>
          </Paper>
        </>
      )}
    </>
  );
};

export default PositionByTokenIdClientPage;
