'use client';

import { useState, useEffect } from 'react';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import SelectToken from '@/components/common/select-token';
import { Token } from '@/types/common';
import { ethers } from 'ethers';
import { useEthersProvider } from '@/lib/ethers';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { quoterV2ABI } from '@/types/wagmi/uniswap-v3-periphery';

const SwapClientPage = () => {
  const [tokenA, setTokenA] = useState<Token | null>(null);
  const [tokenB, setTokenB] = useState<Token | null>(null);

  const [amountA, setAmountA] = useState<number>(0);
  const [amountB, setAmountB] = useState<number>(0);

  const ethersProvider = useEthersProvider();
  const { quoterV2 } = useSwapProtocolAddresses();
  const quoterV2Contract = new ethers.Contract(quoterV2, quoterV2ABI, ethersProvider || ethers.getDefaultProvider());

  type Quote = {
    tokenIn: string;
    tokenOut: string;
    amountIn: ethers.BigNumber;
    amountOut: ethers.BigNumber;
    fee: number;
    sqrtPriceX96: ethers.BigNumber;
    sqrtPriceX96After: ethers.BigNumber;
  };

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const getQuote = async () => {
    const tokenIn = tokenA?.address;
    const tokenOut = tokenB?.address;

    if (!tokenIn || !tokenOut) throw new Error('Invalid token addresses');

    const amountIn = ethers.utils.parseUnits(amountA.toString(), tokenA?.decimals || 18);
    if (amountIn.isZero()) throw new Error('Invalid amount');

    const fees = [500, 3000, 10000];

    console.log(`Getting quotes for ${amountA} ${tokenA.symbol} -> ${tokenB.symbol}...`);
    console.log(`Token In: ${tokenIn}`);
    console.log(`Token Out: ${tokenOut}`);
    console.log(`Amount In: ${amountIn.toString()}`);

    const quotes = await Promise.all(
      fees.map((fee) => {
        const params = [tokenIn, tokenOut, amountIn, fee, 0];
        return quoterV2Contract.callStatic.quoteExactInputSingle(params);
      })
    );

    let maxAmountOut = -Infinity;
    for (const quote of quotes) {
      const amountOut: ethers.BigNumber = quote.amountOut;
      const amountOutParsed = parseFloat(ethers.utils.formatUnits(amountOut, tokenB?.decimals || 18));
      console.log(`Amount Out: ${amountOutParsed}`);
      if (amountOutParsed > maxAmountOut) {
        maxAmountOut = amountOutParsed;
      }
    }

    setAmountB(maxAmountOut);
    setQuotes(quotes.map((quote, i) => {
      return {
        tokenIn,
        tokenOut,
        fee: fees[i],
        amountIn: quote.amountIn,
        amountOut: quote.amountOut,
        sqrtPriceX96: quote.sqrtPriceX96,
        sqrtPriceX96After: quote.sqrtPriceX96After,
      };
    }));
  };

  useEffect(() => {
    if (tokenA && tokenB) {
      getQuote();
    }
  }, [tokenA, tokenB, amountA]);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        variant="elevation"
        sx={{ p: 2, width: { xs: '100%', md: 500 } }}
      >
        <Stack
          direction="column"
          spacing={2}
        >
          <Typography variant="h6">
            <strong>Swap</strong>
          </Typography>

          <Paper
            variant="outlined"
            sx={{ p: 2 }}
          >
            <Stack
              direction="row"
              spacing={2}
            >
              <Typography
                variant="body1"
                color="GrayText"
              >
                You Pay
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <TextField
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
                  }

                  setAmountA(parsed);
                }}
                sx={{
                  '& fieldset': { border: 'none' },
                }}
              />

              <SelectToken
                token={tokenA}
                setToken={setTokenA}
                inputLabel="Select a token"
              />
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={{ p: 2 }}
          >
            <Stack
              direction="row"
              spacing={2}
            >
              <Typography
                variant="body1"
                color="GrayText"
              >
                You Receive (Estimate)
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <TextField
                type="number"
                value={amountB}
                onChange={(e) => {
                  return;
                }}
                sx={{
                  '& fieldset': { border: 'none' },
                }}
              />

              <SelectToken
                token={tokenB}
                setToken={setTokenB}
                inputLabel="Select a token"
              />
            </Stack>
          </Paper>

          {amountA === 0 || amountB === 0 || !tokenA || !tokenB ? (
            <Alert severity="warning">Please enter valid amounts and select tokens</Alert>
          ) : (
            <Button
              variant="contained"
              size="large"
              fullWidth
            >
              Swap
            </Button>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SwapClientPage;
