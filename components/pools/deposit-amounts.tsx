import { Box, Button, FormControl, FormLabel, Link, Stack, TextField, Typography } from '@mui/material';
import { Token } from '@/types/common';
import { useEffect } from 'react';
import { erc20ABI, useAccount, useContractRead } from 'wagmi';
import { formatUnits, parseUnits, zeroAddress } from 'viem';

type DepositAmountProps = {
  tokenA: Token | null;
  tokenB: Token | null;
  amountA: number;
  setAmountA: (amountA: number) => void;
  amountB: number;
  setAmountB: (amountB: number) => void;
  startingPrice: number;
  currentPrice: number;
  isPoolInitialized: boolean;
  validPriceRange: boolean;
  minPrice: number;
  maxPrice: number;
  isPairReversed: boolean;
  showLabel?: boolean;
  layout?: 'column' | 'row' | 'auto';
};

const DepositAmounts = ({
  tokenA,
  tokenB,
  amountA,
  setAmountA,
  amountB,
  setAmountB,
  startingPrice,
  currentPrice,
  isPoolInitialized,
  validPriceRange,
  minPrice,
  maxPrice,
  isPairReversed,
  showLabel = true,
  layout = 'auto',
}: DepositAmountProps) => {
  const { address: userAddress } = useAccount();

  const { data: tokenABalance } = useContractRead({
    address: tokenA?.address ?? zeroAddress,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [userAddress ?? zeroAddress],
    enabled: tokenA !== null && userAddress !== undefined,
  });

  const { data: tokenBBalance, isLoading } = useContractRead({
    address: tokenB?.address ?? zeroAddress,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [userAddress ?? zeroAddress],
    enabled: tokenB !== null && userAddress !== undefined,
  });

  console.log('isPairReversed', isPairReversed);
  console.log('startingPrice', startingPrice);
  console.log('currentPrice', currentPrice);
  console.log('minPrice', minPrice);
  console.log('maxPrice', maxPrice);
  const liquidityAtOneOfA =
    (1 * Math.sqrt(currentPrice) * Math.sqrt(1 / maxPrice)) / (Math.sqrt(1 / maxPrice) - Math.sqrt(currentPrice));
  const amountBAtOneA = liquidityAtOneOfA * (Math.sqrt(currentPrice) - Math.sqrt(1 / minPrice));

  const initializedPrice = amountBAtOneA;
  const exchangeRate = isPoolInitialized ? initializedPrice : startingPrice;
  console.log('exchangeRate', exchangeRate);

  const tokenABalanceFormatted = tokenABalance ? formatUnits(tokenABalance as bigint, tokenA?.decimals ?? 18) : '0';
  const tokenABalanceParsed = parseFloat(tokenABalanceFormatted);
  const tokenAMax = isPairReversed
    ? Math.min(tokenABalanceParsed, tokenABalanceParsed * exchangeRate)
    : Math.min(tokenABalanceParsed, tokenABalanceParsed / exchangeRate);

  const tokenBBalanceFormatted = tokenBBalance ? formatUnits(tokenBBalance as bigint, tokenB?.decimals ?? 18) : '0';
  const tokenBBalanceParsed = parseFloat(tokenBBalanceFormatted);
  const tokenBMax = isPairReversed
    ? Math.min(tokenBBalanceParsed, tokenBBalanceParsed * exchangeRate)
    : Math.min(tokenBBalanceParsed, tokenBBalanceParsed / exchangeRate);

  useEffect(() => {
    const newAmountA = amountA > tokenAMax ? tokenAMax : amountA;
    let newAmountB = newAmountA * exchangeRate;
    if (newAmountB > tokenBMax) newAmountB = tokenBMax;

    setAmountA(newAmountA);
    setAmountB(newAmountB);
  }, [exchangeRate, tokenABalance, tokenBBalance]);

  return (
    <FormControl
      fullWidth
      disabled={!validPriceRange}
    >
      {showLabel ? <FormLabel sx={{ mb: 2 }}>Deposit Amounts</FormLabel> : <Box sx={{ mb: 1 }} />}
      <Stack
        direction="column"
        spacing={2}
      >
        <Stack
          direction={layout === 'auto' ? { xs: 'column', md: 'row' } : layout}
          spacing={2}
        >
          <Stack direction="column">
            <TextField
              label={`${tokenA?.symbol ?? 'Token A'} Deposit`}
              InputProps={{
                endAdornment: tokenA ? <>{tokenA.symbol}</> : null,
                inputProps: {
                  style: { textAlign: 'right', paddingRight: '1rem', whiteSpace: 'nowrap' },
                },
              }}
              type="number"
              value={amountA}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setAmountA(0);
                  return;
                }
                const parsed = parseFloat(value);
                if (isNaN(parsed)) setAmountA(0);

                if (parsed < 0) {
                  setAmountA(0);
                } else {
                  setAmountA(parsed);
                  const amountInB = parsed * exchangeRate;
                  setAmountB(Math.min(amountInB, tokenBMax));
                }
              }}
              disabled={!validPriceRange}
            />

            {tokenA && validPriceRange && (
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={1}
                alignItems="flex-end"
              >
                <Typography
                  variant="caption"
                  color="GrayText"
                >
                  Balance:{' '}
                  {tokenABalanceParsed.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 5,
                  })}
                </Typography>
                <Link
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setAmountA(tokenAMax);
                    const amountInB = tokenAMax * exchangeRate;
                    setAmountB(Math.min(amountInB, tokenBMax));
                  }}
                >
                  <Typography
                    variant="caption"
                    color="primary"
                  >
                    Max
                  </Typography>
                </Link>
              </Stack>
            )}
          </Stack>

          <Stack direction="column">
            <TextField
              label={`${tokenB?.symbol ?? 'Token B'} Deposit`}
              InputProps={{
                endAdornment: tokenB ? <>{tokenB.symbol}</> : null,
                inputProps: {
                  style: { textAlign: 'right', paddingRight: '1rem' },
                },
              }}
              type="number"
              value={amountB}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setAmountB(0);
                  return;
                }
                const parsed = parseFloat(value);
                if (isNaN(parsed)) setAmountB(0);

                if (parsed < 0) {
                  setAmountB(0);
                } else {
                  setAmountB(parsed);
                  const amountInA = parsed / exchangeRate;
                  setAmountA(Math.min(amountInA, tokenAMax));
                }
              }}
              disabled={!validPriceRange}
            />

            {tokenB && validPriceRange && (
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={1}
                alignItems="flex-end"
              >
                <Typography
                  variant="caption"
                  color="GrayText"
                >
                  Balance:{' '}
                  {tokenBBalanceParsed.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 5,
                  })}
                </Typography>
                <Link
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setAmountB(tokenBMax);
                    const amountInA = tokenBMax / exchangeRate;
                    setAmountA(Math.min(amountInA, tokenAMax));
                  }}
                >
                  <Typography
                    variant="caption"
                    color="primary"
                  >
                    Max
                  </Typography>
                </Link>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </FormControl>
  );
};

export default DepositAmounts;
