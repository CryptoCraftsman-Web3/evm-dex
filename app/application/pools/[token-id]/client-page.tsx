'use client';

import AddLiquidity from '@/components/pools/add-liquidity';
import RemoveLiquidity from '@/components/pools/remove-liquidity';
import { useLiquidityPosition } from '@/hooks/pools';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { useEthersProvider } from '@/lib/ethers';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { Stack, Typography } from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import LiquidityCard from './liquidity-card';
import PriceCards from './price-cards';
import SkeletonLoading from './skeleton-loading';
import UnclaimedCard from './unclaimed-card';

type PositionByTokenIdClientPageProps = {
  tokenId: bigint;
};

const PositionByTokenIdClientPage = ({ tokenId }: PositionByTokenIdClientPageProps) => {
  const { address } = useAccount();
  const { nfPositionManager, poolFactory } = useSwapProtocolAddresses();

  const {
    position,
    gettingPosition,
    refetchPosition,
    pool,
    slot0,
    tokenAName,
    tokenBName,
    tokenASymbol,
    tokenBSymbol,
    tokenADecimals,
    tokenBDecimals,
    gettingToken0Symbol,
    gettingToken1Symbol,
    gettingToken0Decimals,
    gettingToken1Decimals,
    gettingToken0Name,
    gettingToken1Name,
    gettingPool,
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
  } = useLiquidityPosition(tokenId);

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
  const [gettingUnclaimedFees, setGettingUnclaimedFees] = useState<boolean>(false);

  const getUnclaimedTokens = () => {
    setGettingUnclaimedFees(true);
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
      })
      .finally(() => setGettingUnclaimedFees(false));
  };

  useEffect(() => {
    getUnclaimedTokens();
  }, []);

  const tokenAUnclaimedFeesFormatted = tokenAUnclaimedFees.toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  });

  const tokenBUnclaimedFeesFormatted = tokenBUnclaimedFees.toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  });

  const isLoading =
    gettingPosition ||
    gettingToken0Symbol ||
    gettingToken0Decimals ||
    gettingToken0Name ||
    gettingToken1Symbol ||
    gettingToken1Decimals ||
    gettingToken1Name ||
    gettingPool ||
    gettingSlot0 ||
    gettingUnclaimedFees;

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
        <SkeletonLoading />
      ) : (
        <>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent={{ xs: 'flex-start', md: 'space-between' }}
            alignItems="center"
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
              pt={{ xs: 2, md: 'initial' }}
            >
              <AddLiquidity
                positionTokenId={tokenId}
                tokenAAddress={position.token0}
                tokenBAddress={position.token1}
                tokenASymbol={tokenASymbol || ''}
                tokenBSymbol={tokenBSymbol || ''}
                tokenADecimals={tokenADecimals || 18}
                tokenBDecimals={tokenBDecimals || 18}
                amountAInWei={amountAInWei}
                amountBInWei={amountBInWei}
                fee={position.fee}
                minPrice={minPrice}
                maxPrice={maxPrice}
                currentPrice={price}
                refetchPosition={refetchPosition}
              />

              <RemoveLiquidity
                positionTokenId={tokenId}
                positionLiquidity={position.liquidity}
                tokenASymbol={tokenASymbol || ''}
                tokenBSymbol={tokenBSymbol || ''}
                tokenADecimals={tokenADecimals || 18}
                tokenBDecimals={tokenBDecimals || 18}
                tokenALiquidity={amountAInWei}
                tokenBLiquidity={amountBInWei}
                refetchPosition={refetchPosition}
                getUnclaimedTokens={getUnclaimedTokens}
              />
            </Stack>
          </Stack>

          <LiquidityCard
            position={position}
            tokenASymbol={tokenASymbol || ''}
            tokenAName={tokenAName || ''}
            tokenBSymbol={tokenBSymbol || ''}
            tokenBName={tokenBName || ''}
            amountAFormatted={amountAFormatted}
            amountBFormatted={amountBFormatted}
          />

          <UnclaimedCard
            tokenId={tokenId}
            position={position}
            getUnclaimedTokens={getUnclaimedTokens}
            tokenAName={tokenAName || ''}
            tokenBName={tokenBName || ''}
            tokenASymbol={tokenASymbol || ''}
            tokenBSymbol={tokenBSymbol || ''}
            tokenAUnclaimedFees={tokenAUnclaimedFees}
            tokenBUnclaimedFees={tokenBUnclaimedFees}
            tokenAUnclaimedFeesFormatted={tokenAUnclaimedFeesFormatted}
            tokenBUnclaimedFeesFormatted={tokenBUnclaimedFeesFormatted}
          />

          <PriceCards
            tokenASymbol={tokenASymbol || ''}
            tokenBSymbol={tokenBSymbol || ''}
            price={price}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </>
      )}
    </>
  );
};

export default PositionByTokenIdClientPage;
