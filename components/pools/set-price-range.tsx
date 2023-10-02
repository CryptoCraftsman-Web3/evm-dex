import { useEffect } from 'react';
import { FeeTier, Token } from '@/types/common';
import { Box, FormControl, FormLabel, Stack, TextField, Typography } from '@mui/material';
import { IoFileTrayStackedOutline } from 'react-icons/io5';
import { Token as UniswapToken } from '@uniswap/sdk-core';
import { useContractRead, useContractReads, useNetwork } from 'wagmi';
import { computePoolAddress } from '@uniswap/v3-sdk';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { uniswapV3PoolABI } from '@/types/wagmi/uniswap-v3-core';
import { zeroAddress } from 'viem';

type SetPriceRangeProps = {
  minPrice: number;
  setMinPrice: (minPrice: number) => void;
  maxPrice: number;
  setMaxPrice: (maxPrice: number) => void;
  tokenA: Token | null;
  tokenB: Token | null;
  feeTier: FeeTier;
  isPoolInitialized: boolean;
  currentPrice: number;
  setCurrentPrice: (currentPrice: number) => void;
};

const SetPriceRange = ({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  tokenA,
  tokenB,
  feeTier,
  isPoolInitialized,
  currentPrice,
  setCurrentPrice,
}: SetPriceRangeProps) => {
  const disabled = tokenA === null || tokenB === null;
  const { poolFactory } = useSwapProtocolAddresses();
  const { chain } = useNetwork();

  const uniswapTokenA = new UniswapToken(
    chain?.id || 1,
    tokenA?.address || zeroAddress,
    tokenA?.decimals || 18,
    tokenA?.symbol || 'A',
    tokenA?.name || 'A'
  );
  const uniswapTokenB = new UniswapToken(
    chain?.id || 1,
    tokenB?.address || zeroAddress,
    tokenB?.decimals || 18,
    tokenB?.symbol || 'B',
    tokenB?.name || 'B'
  );

  const poolAddress =
    tokenA !== null && tokenB !== null && tokenA?.address !== tokenB?.address
      ? (computePoolAddress({
          factoryAddress: poolFactory,
          tokenA: uniswapTokenA,
          tokenB: uniswapTokenB,
          fee: feeTier.value,
        }) as `0x${string}`)
      : zeroAddress;

  const poolContract = {
    address: poolAddress,
    abi: uniswapV3PoolABI,
  };

  const { data: slot0 } = useContractRead({
    address: poolAddress,
    abi: uniswapV3PoolABI,
    functionName: 'slot0',
    enabled: poolAddress !== zeroAddress,
  });

  useEffect(() => {
    const _currentPrice = slot0?.[0] ? Math.pow(Number(slot0[0]) / 2 ** 96, 2) : 0;
    setCurrentPrice(_currentPrice);
  }, [slot0]);

  return (
    <FormControl
      fullWidth
      disabled={disabled}
    >
      <FormLabel sx={{ mb: 2 }}>Set Price Range</FormLabel>
      <Stack
        direction="column"
        spacing={3}
      >
        {isPoolInitialized && (
          <>
            <Typography textAlign="center">
              Current Price: {currentPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })} {tokenB?.symbol} /{' '}
              {tokenA?.symbol}
            </Typography>
            <Box
              p={1}
              textAlign="center"
            >
              <IoFileTrayStackedOutline size={96} />
            </Box>
            <Typography
              variant="h6"
              textAlign="center"
              pb={2}
            >
              Your position will appear here
            </Typography>
          </>
        )}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
        >
          <TextField
            label="Minimum Price"
            InputProps={{
              endAdornment:
                tokenA && tokenB ? (
                  <>
                    {tokenB.symbol} / {tokenA.symbol}
                  </>
                ) : null,
              inputProps: {
                min: 0,
                style: { textAlign: 'right', paddingRight: '1rem' },
              },
            }}
            type="number"
            value={minPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setMinPrice(0);
                return;
              }
              const parsed = parseFloat(value);
              if (isNaN(parsed)) setMinPrice(0);
              setMinPrice(parsed);
            }}
            disabled={disabled}
            sx={{ whiteSpace: 'nowrap' }}
          />

          <TextField
            label="Maximum Price"
            InputProps={{
              endAdornment:
                tokenA && tokenB ? (
                  <>
                    {tokenB.symbol} / {tokenA.symbol}
                  </>
                ) : null,
              inputProps: {
                min: 0,
                style: { textAlign: 'right', paddingRight: '1rem' },
              },
            }}
            type="number"
            value={maxPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setMaxPrice(0);
                return;
              }
              const parsed = parseFloat(value);
              if (isNaN(parsed)) setMaxPrice(0);
              setMaxPrice(parsed);
            }}
            disabled={disabled}
            sx={{ whiteSpace: 'nowrap' }}
          />
        </Stack>
      </Stack>
    </FormControl>
  );
};

export default SetPriceRange;
