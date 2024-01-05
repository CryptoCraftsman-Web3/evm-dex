import { Alert, Box, Button, FormControl, FormLabel, Link, Stack, TextField, Typography } from '@mui/material';
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

  const reciprocalMinPrice = 1 / (minPrice || 1);
  const reciprocalMaxPrice = 1 / (maxPrice || 1);

  const reversedMinPrice = Math.min(reciprocalMinPrice, reciprocalMaxPrice);
  const reversedMaxPrice = Math.max(reciprocalMinPrice, reciprocalMaxPrice);

  const currentPriceToUse = isPairReversed ? 1 / currentPrice : currentPrice;
  const minPriceToUse = isPairReversed ? minPrice : reversedMinPrice;
  const maxPriceToUse = isPairReversed ? maxPrice : reversedMaxPrice;

  console.log(currentPriceToUse, minPriceToUse, maxPriceToUse);

  const liquidityAtOneOfA =
    (1 * Math.sqrt(currentPrice) * Math.sqrt(reversedMaxPrice)) /
    (Math.sqrt(reversedMaxPrice) - Math.sqrt(currentPrice));
  const amountBAtOneA = liquidityAtOneOfA * (Math.sqrt(currentPrice) - Math.sqrt(reversedMinPrice));

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

  const isMinPriceLargerThanMaxPrice = minPrice > maxPrice;
  const isExchangeRateZeroOrLess = exchangeRate <= 0;
  const enableDepositAmounts = !isMinPriceLargerThanMaxPrice && validPriceRange && !isExchangeRateZeroOrLess;

  useEffect(() => {
    if (isExchangeRateZeroOrLess) {
      setAmountA(0);
      setAmountB(0);
    } else {
      const newAmountA = amountA > tokenAMax ? tokenAMax : amountA;
      let newAmountB = newAmountA * exchangeRate;
      if (newAmountB > tokenBMax) newAmountB = tokenBMax;

      setAmountA(newAmountA);
      setAmountB(newAmountB);
    }
  }, [exchangeRate, tokenABalance, tokenBBalance, isExchangeRateZeroOrLess]);

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
              value={enableDepositAmounts ? amountA : ' '}
              onChange={(e) => {
                if (isExchangeRateZeroOrLess) {
                  setAmountA(0);
                  setAmountB(0);
                  return;
                }

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
              disabled={!enableDepositAmounts}
            />

            {tokenA && enableDepositAmounts && (
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
                    if (isExchangeRateZeroOrLess) {
                      setAmountA(0);
                      setAmountB(0);
                      return;
                    }

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
              value={enableDepositAmounts ? amountB : ' '}
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
              disabled={!enableDepositAmounts}
            />

            {tokenB && enableDepositAmounts && (
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

        {(isMinPriceLargerThanMaxPrice || isExchangeRateZeroOrLess || !validPriceRange) && (
          <Alert
            severity="error"
            variant="standard"
          >
            The price range you have selected is invalid. Please adjust the price range.
          </Alert>
        )}
      </Stack>
    </FormControl>
  );
};

export default DepositAmounts;
