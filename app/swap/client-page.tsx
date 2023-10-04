'use client';

import { useState, useEffect, useRef } from 'react';
import { Alert, Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import SelectToken from '@/components/common/select-token';
import { Token } from '@/types/common';
import { ethers } from 'ethers';
import { useEthersProvider } from '@/lib/ethers';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { quoterV2ABI, swapRouterABI } from '@/types/wagmi/uniswap-v3-periphery';
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { zeroAddress } from 'viem';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { uniswapV3FactoryABI, uniswapV3PoolABI } from '@/types/wagmi/uniswap-v3-core';

const SwapClientPage = () => {
  const { address: userAddress } = useAccount();
  const { swapRouter, poolFactory } = useSwapProtocolAddresses();

  const [tokenA, setTokenA] = useState<Token | null>(null);
  const [tokenB, setTokenB] = useState<Token | null>(null);

  const [amountA, setAmountA] = useState<number>(1);
  const [amountB, setAmountB] = useState<number>(1);

  const ethersProvider = useEthersProvider();
  const { quoterV2 } = useSwapProtocolAddresses();
  const quoterV2Contract = new ethers.Contract(quoterV2, quoterV2ABI, ethersProvider || ethers.getDefaultProvider());

  type Quote = {
    tokenIn: `0x${string}`;
    tokenOut: `0x${string}`;
    amountIn: ethers.BigNumber;
    amountOut: ethers.BigNumber;
    fee: number;
    sqrtPriceX96: ethers.BigNumber;
    sqrtPriceX96After: ethers.BigNumber;
  };

  const [isFetchingQuotes, setIsFetchingQuotes] = useState<boolean>(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const getQuote = async () => {
    const tokenIn = tokenA?.address || zeroAddress;
    const tokenOut = tokenB?.address || zeroAddress;

    if (!tokenIn || !tokenOut) throw new Error('Invalid token addresses');

    const amountIn = ethers.utils.parseUnits(amountA.toString(), tokenA?.decimals || 18);
    if (amountIn.isZero()) throw new Error('Invalid amount');

    setIsFetchingQuotes(true);

    try {
      const fees = [500, 3000, 10000];

      const retrievedQuotes: any[] = [];
      for (const fee of fees) {
        try {
          const retrievedQuote = await quoterV2Contract.callStatic.quoteExactInputSingle([
            tokenIn,
            tokenOut,
            amountIn,
            fee,
            0,
          ]);
          console.log('retrievedQuote', retrievedQuote);
          retrievedQuotes.push(retrievedQuote);
        } catch (err) {
          // console.error(err);
          console.log(`Pool or liquidity does not exist for fee ${fee}`);
        }
      }

      console.log('retrievedQuotes', retrievedQuotes);

      let maxAmountOut = -Infinity;
      let maxAmountOutIndex = -1;
      retrievedQuotes.forEach((quote, i) => {
        const amountOut: ethers.BigNumber = quote.amountOut;
        const amountOutParsed = parseFloat(ethers.utils.formatUnits(amountOut, tokenB?.decimals || 18));
        if (amountOutParsed > maxAmountOut) {
          maxAmountOut = amountOutParsed;
          maxAmountOutIndex = i;
        }
      }); console.log('maxAmountOut', maxAmountOut); console.log('maxAmountOutIndex', maxAmountOutIndex);

      setAmountB(maxAmountOut);

      const mappedQuotes = retrievedQuotes.map((quote, i) => {
        return {
          tokenIn,
          tokenOut,
          fee: fees[i],
          amountIn: quote.amountIn,
          amountOut: quote.amountOut,
          sqrtPriceX96: quote.sqrtPriceX96,
          sqrtPriceX96After: quote.sqrtPriceX96After,
        };
      });
      setQuotes(mappedQuotes);
      setSelectedQuote(mappedQuotes[maxAmountOutIndex]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingQuotes(false);
    }
  };

  useEffect(() => {
    if (tokenA && tokenB) {
      getQuote();
    }
  }, [tokenA, tokenB, amountA]);

  // monitor tokenA allowance
  // if user wallet's tokenA allowance is less than amountA, then call approve

  const tokenAContract = {
    address: tokenA?.address ?? zeroAddress,
    abi: erc20ABI,
  };

  const {
    data: tokenAUserDetails,
    refetch: refetchTokenAUserDetails,
    isRefetching: refetchingTokenAUserDetails,
  } = useContractReads({
    contracts: [
      {
        ...tokenAContract,
        functionName: 'balanceOf',
        args: [userAddress ?? zeroAddress],
      },
      {
        ...tokenAContract,
        functionName: 'allowance',
        args: [userAddress ?? zeroAddress, swapRouter],
      },
    ],
    enabled: Boolean(tokenA) && Boolean(userAddress),
  });

  const tokenAUserBalance = (tokenAUserDetails?.[0].result as bigint) || 0n;
  const tokenAUserAllowance = (tokenAUserDetails?.[1].result as bigint) || 0n;
  const amountAInBaseUnits = ethers.utils.parseUnits(amountA.toString(), tokenA?.decimals || 18).toBigInt();

  const notEnoughTokenABalance = tokenAUserBalance < amountAInBaseUnits;
  const notEnoughTokenAAllowance = tokenAUserAllowance < amountAInBaseUnits;

  const { config: tokenAConfig } = usePrepareContractWrite({
    ...tokenAContract,
    functionName: 'approve',
    args: [swapRouter, amountAInBaseUnits],
    enabled: Boolean(tokenA) && Boolean(userAddress),
  });

  const {
    data: approveTokenAResult,
    status: approveTokenAStatus,
    isLoading: isApprovingTokenA,
    isSuccess: isTokenAApproved,
    write: approveTokenA,
  } = useContractWrite(tokenAConfig);

  const {
    data: approveTokenATxReceipt,
    isLoading: isApproveTokenATxPending,
    isSuccess: isApproveTokenATxSuccess,
    isError: isApproveTokenATxError,
  } = useWaitForTransaction({
    hash: approveTokenAResult?.hash,
    enabled: isTokenAApproved,
  });

  useEffect(() => {
    refetchTokenAUserDetails();
    if (isApproveTokenATxSuccess) toast.success(`Successfully approved ${tokenA?.symbol} allowance`);
    if (isApproveTokenATxError) toast.error(`Failed to approve ${tokenA?.symbol} allowance`);
  }, [isApproveTokenATxSuccess, isApproveTokenATxError]);

  // the code section below deals with SwapRouter to swap ERC20 tokens
  const { config: exactInputSingleConfig } = usePrepareContractWrite({
    address: swapRouter,
    abi: swapRouterABI,
    functionName: 'exactInputSingle',
    args: [
      {
        tokenIn: selectedQuote?.tokenIn ?? zeroAddress,
        tokenOut: selectedQuote?.tokenOut ?? zeroAddress,
        fee: selectedQuote?.fee ?? 0,
        recipient: userAddress ?? zeroAddress,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 60), // 10 minutes from the current Unix time
        amountIn: amountAInBaseUnits,
        amountOutMinimum: 0n,
        sqrtPriceLimitX96: 0n,
      },
    ],
    value: 0n,
    enabled: Boolean(userAddress) && Boolean(selectedQuote),
  });

  const {
    data: exactInputSingleResult,
    status: exactInputSingleStatus,
    isLoading: isExactInputSingle,
    isSuccess: isExactInputSingleSuccess,
    isError: isExactInputSingleError,
    write: exactInputSingle,
  } = useContractWrite(exactInputSingleConfig);

  const {
    data: exactInputSingleTxReceipt,
    isLoading: isExactInputSingleTxPending,
    isSuccess: isExactInputSingleTxSuccess,
    isError: isExactInputSingleTxError,
  } = useWaitForTransaction({
    hash: exactInputSingleResult?.hash,
    enabled: isExactInputSingleSuccess,
  });

  useEffect(() => {
    refetchTokenAUserDetails();
    if (isExactInputSingleTxSuccess) toast.success(`Successfully swapped ${tokenA?.symbol} for ${tokenB?.symbol}`);
    if (isExactInputSingleTxError) toast.error(`Failed to swap ${tokenA?.symbol} for ${tokenB?.symbol}`);
  }, [isExactInputSingleTxSuccess, isExactInputSingleTxError]);

  // focus on respective amount input field when token is selected, and select all text
  const amountAInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tokenA) {
      amountAInputRef.current?.focus();
      amountAInputRef.current?.select();
    }
  }, [tokenA, tokenB]);

  // pool-related code
  const { data: poolAddress } = useContractRead({
    address: poolFactory,
    abi: uniswapV3FactoryABI,
    functionName: 'getPool',
    args: [selectedQuote?.tokenIn || zeroAddress, selectedQuote?.tokenOut || zeroAddress, selectedQuote?.fee || 500],
    enabled: Boolean(selectedQuote),
  });

  const { data: slot0 } = useContractRead({
    address: poolAddress || zeroAddress,
    abi: uniswapV3PoolABI,
    functionName: 'slot0',
    enabled: Boolean(selectedQuote) && Boolean(poolAddress),
  });

  const tokenInAddress = tokenA?.address || zeroAddress;
  const tokenOutAddress = tokenB?.address || zeroAddress;

  const isPairReversed = BigInt(tokenInAddress) > BigInt(tokenOutAddress);

  const sqrtPriceX96 = slot0?.[0] || 0n;
  let price = Math.pow(Number(sqrtPriceX96) / 2 ** 96, 2);
  if (!isPairReversed) price = 1 / price;
  const expectedAmountOut = amountA * price;
  console.log('quotes', quotes);
  console.log('selectedQuote', selectedQuote);
  console.log('expectedAmountOut', expectedAmountOut);
  const amountOutDifferencePercentage =
    amountA > 0 ? Math.abs(((amountB - expectedAmountOut) / expectedAmountOut) * 100) : 0;
  const amountOutDiffTooGreat = amountOutDifferencePercentage > 5; // 5% difference

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
                inputRef={amountAInputRef}
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
              {isFetchingQuotes ? (
                <Typography
                  color="GrayText"
                  sx={{ minWidth: '41%' }}
                >
                  Fetching quotes...
                </Typography>
              ) : (
                <TextField
                  type="number"
                  value={amountB.toFixed(4)}
                  onChange={(e) => {
                    return;
                  }}
                  sx={{
                    '& fieldset': { border: 'none' },
                  }}
                />
              )}

              <SelectToken
                token={tokenB}
                setToken={setTokenB}
                inputLabel="Select a token"
              />
            </Stack>
          </Paper>

          {!userAddress ? (
            <Alert severity="error">Please connect your wallet first</Alert>
          ) : (
            <>
              {!tokenA && !tokenB ? (
                <Alert severity="error">Please select tokens</Alert>
              ) : (
                <>
                  {notEnoughTokenABalance ? (
                    <Alert severity="error">You do not have enough {tokenA?.symbol} to swap</Alert>
                  ) : (
                    <>
                      {notEnoughTokenAAllowance ? (
                        <>
                          <Alert severity="warning">
                            You have not approved the SerpentSwap to spend and swap your {tokenA?.symbol}
                          </Alert>

                          <LoadingButton
                            variant="contained"
                            size="large"
                            onClick={() => {
                              if (approveTokenA) approveTokenA();
                            }}
                            loading={isApprovingTokenA || isApproveTokenATxPending}
                            fullWidth
                          >
                            Approve {tokenA?.symbol}
                          </LoadingButton>
                        </>
                      ) : (
                        <>
                          {amountOutDiffTooGreat && (
                            <Alert severity="warning">
                              The amount you receive is {amountOutDifferencePercentage.toFixed(2)}% different from the
                              expected amount based on the current price. This may be due to lack of liquidity in the
                              pool. Please proceed with caution.
                            </Alert>
                          )}

                          <LoadingButton
                            disabled={amountA === 0}
                            variant="contained"
                            size="large"
                            onClick={() => {
                              if (exactInputSingle) exactInputSingle();
                            }}
                            loading={isExactInputSingle || isExactInputSingleTxPending}
                            fullWidth
                          >
                            Swap
                          </LoadingButton>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SwapClientPage;
