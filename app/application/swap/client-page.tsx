'use client';

import { Alert, Paper, Stack, TextField, Typography, Box, Grid, Button } from '@mui/material';
import SelectToken from '@/components/common/select-token';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { useWrappedNativeToken } from '@/hooks/token-hooks';
import { syncTransaction } from '@/lib/actions/transactions';
import { useEthersProvider } from '@/lib/ethers';
import { Token } from '@/types/common';
import { serpentSwapUtilityABI } from '@/types/wagmi/serpent-swap';
import { uniswapV3FactoryABI, uniswapV3PoolABI } from '@/types/wagmi/uniswap-v3-core';
import { quoterV2ABI } from '@/types/wagmi/uniswap-v3-periphery';
import { LoadingButton } from '@mui/lab';
import { useDebounce } from '@uidotdev/usehooks';
import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { IoWalletSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { zeroAddress } from 'viem';
import type { Quote } from './swap-types';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import SwapInput from '../../../components/swap-input/swap-input';
import { useTokenManager } from './token';

const SwapClientPage = () => {
  const { chain } = useNetwork();
  const { address: userAddress, isConnected: isUserWalletConnected } = useAccount();
  const { serpentSwapUtility, poolFactory } = useSwapProtocolAddresses();

  const { tokenA, tokenB, setTokenA, setTokenB } = useTokenManager();

  const isTokenANative = tokenA?.isNative;
  const isTokenBNative = tokenB?.isNative;

  const wrappedNativeToken = useWrappedNativeToken();

  const [amountA, setAmountA] = useState<number>(1);
  const debouncedAmountA = useDebounce(amountA, 500);

  const [amountB, setAmountB] = useState<number>(1);

  const ethersProvider = useEthersProvider();
  const { quoterV2 } = useSwapProtocolAddresses();
  const quoterV2Contract = new ethers.Contract(quoterV2, quoterV2ABI, ethersProvider || ethers.getDefaultProvider());

  const [isFetchingQuotes, setIsFetchingQuotes] = useState<boolean>(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const tokenInAddress = isTokenANative ? wrappedNativeToken.address : tokenA?.address || zeroAddress;
  const tokenOutAddress = isTokenBNative ? wrappedNativeToken.address : tokenB?.address || zeroAddress;

  const getQuote = async () => {
    if (!tokenInAddress || !tokenOutAddress) throw new Error('Invalid token addresses');

    const amountIn = ethers.utils.parseUnits(debouncedAmountA.toString(), tokenA?.decimals || 18);
    if (amountIn.isZero()) throw new Error('Invalid amount');

    setIsFetchingQuotes(true);

    try {
      const fees = [500, 3000, 10000];

      let maxAmountOut = -Infinity;
      const mappedQuotes: Quote[] = [];
      for (const [index, fee] of fees.entries()) {
        try {
          const retrievedQuote = await quoterV2Contract.callStatic.quoteExactInputSingle([
            tokenInAddress,
            tokenOutAddress,
            amountIn,
            fee,
            0,
          ]);

          const amountOut: ethers.BigNumber = retrievedQuote.amountOut;
          const amountOutParsed = parseFloat(ethers.utils.formatUnits(amountOut, tokenB?.decimals || 18));

          const quote: Quote = {
            tokenIn: tokenInAddress,
            tokenOut: tokenOutAddress,
            fee,
            amountIn: amountIn,
            amountOut: amountOut,
            sqrtPriceX96: retrievedQuote.sqrtPriceX96,
            sqrtPriceX96After: retrievedQuote.sqrtPriceX96After,
          };

          if (amountOutParsed > maxAmountOut) {
            maxAmountOut = amountOutParsed;
            setSelectedQuote(quote);
          }

          mappedQuotes.push(quote);
        } catch (err) {
          console.error(err);
          console.error(`Pool or liquidity does not exist for fee ${fee}`);
        }
      }

      setAmountB(maxAmountOut);
      setQuotes(mappedQuotes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingQuotes(false);
    }
  };

  useEffect(() => {
    if (tokenA && tokenB) {
      console.log(debouncedAmountA);
      if (debouncedAmountA > 0) {
        getQuote();
      } else {
        setAmountB(0);
        setSelectedQuote(null);
      }
    }
  }, [tokenA, tokenB, debouncedAmountA]);

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
        args: [userAddress ?? zeroAddress, serpentSwapUtility],
      },
    ],
    enabled: Boolean(tokenA) && Boolean(userAddress),
  });

  const { data: userNativeTokenBalance, refetch: refetchUserNativeTokenBalance } = useBalance({
    address: userAddress ?? zeroAddress,
    enabled: Boolean(userAddress),
  });

  const tokenAUserBalance = (tokenAUserDetails?.[0].result as bigint) || 0n;
  const tokenAUserAllowance = (tokenAUserDetails?.[1].result as bigint) || 0n;
  const amountAInBaseUnits = ethers.utils.parseUnits(debouncedAmountA.toString(), tokenA?.decimals || 18).toBigInt();

  const notEnoughTokenABalance = isTokenANative
    ? (userNativeTokenBalance?.value || 0n) < amountAInBaseUnits
    : tokenAUserBalance < amountAInBaseUnits;
  const notEnoughTokenAAllowance = isTokenANative
    ? (userNativeTokenBalance?.value || 0n) < amountAInBaseUnits
    : tokenAUserAllowance < amountAInBaseUnits;

  const { config: tokenAConfig } = usePrepareContractWrite({
    ...tokenAContract,
    functionName: 'approve',
    args: [serpentSwapUtility, amountAInBaseUnits],
    enabled: Boolean(tokenA) && Boolean(userAddress),
  });

  const {
    data: approveTokenAResult,
    status: approveTokenAStatus,
    isLoading: isApprovingTokenA,
    isSuccess: isTokenAApproved,
    write: approveTokenA,
  } = useContractWrite(tokenAConfig);

  useEffect(() => {
    if (approveTokenAResult?.hash && chain?.id) {
      syncTransaction(chain.id, approveTokenAResult.hash, 'approve');
    }
  }, [approveTokenAResult, chain]);

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
  const { config: swapTokensConfig } = usePrepareContractWrite({
    address: serpentSwapUtility,
    abi: serpentSwapUtilityABI,
    functionName: 'swapTokens',
    args: [
      selectedQuote?.tokenIn ?? zeroAddress,
      selectedQuote?.tokenOut ?? zeroAddress,
      selectedQuote?.fee ?? 0,
      BigInt(Math.floor(Date.now() / 1000) + 60 * 60),
      amountAInBaseUnits,
      0n,
      0n,
    ],
    enabled: Boolean(userAddress) && Boolean(selectedQuote),
  });

  const {
    data: swapTokensResult,
    isLoading: isSwappingTokens,
    isSuccess: isSwapTokensSuccess,
    write: swapTokens,
  } = useContractWrite(swapTokensConfig);

  const {
    isLoading: isSwapTokensTxPending,
    isSuccess: isSwapTokensTxSuccess,
    isError: isSwapTokensTxError,
  } = useWaitForTransaction({
    hash: swapTokensResult?.hash,
    enabled: isSwapTokensSuccess,
  });

  useEffect(() => {
    if (swapTokensResult?.hash && chain?.id) {
      syncTransaction(chain.id, swapTokensResult.hash, 'swapTokens');
    }
  }, [swapTokensResult, chain]);

  useEffect(() => {
    refetchTokenAUserDetails();
    if (isSwapTokensTxSuccess) toast.success(`Successfully swapped ${tokenA?.symbol} for ${tokenB?.symbol}`);
    if (isSwapTokensTxError) toast.error(`Failed to swap ${tokenA?.symbol} for ${tokenB?.symbol}`);
  }, [isSwapTokensTxSuccess, isSwapTokensTxError]);

  const { config: swapNativeForTokenConfig } = usePrepareContractWrite({
    address: serpentSwapUtility,
    abi: serpentSwapUtilityABI,
    functionName: 'swapNativeForToken',
    args: [
      selectedQuote?.tokenOut ?? zeroAddress,
      selectedQuote?.fee ?? 0,
      BigInt(Math.floor(Date.now() / 1000) + 60 * 60),
      0n,
      0n,
    ],
    value: amountAInBaseUnits,
    enabled: Boolean(userAddress) && Boolean(selectedQuote),
  });

  const {
    data: swapNativeForTokenResult,
    isLoading: isSwappingNativeForToken,
    isSuccess: isSwapNativeForTokenSuccess,
    write: swapNativeForToken,
  } = useContractWrite(swapNativeForTokenConfig);

  const {
    isLoading: isSwapNativeForTokenTxPending,
    isSuccess: isSwapNativeForTokenTxSuccess,
    isError: isSwapNativeForTokenTxError,
  } = useWaitForTransaction({
    hash: swapNativeForTokenResult?.hash,
    enabled: isSwapNativeForTokenSuccess,
  });

  useEffect(() => {
    if (swapNativeForTokenResult?.hash && chain?.id) {
      syncTransaction(chain.id, swapNativeForTokenResult.hash, 'swapNativeForToken');
    }
  }, [swapNativeForTokenResult, chain]);

  useEffect(() => {
    refetchTokenAUserDetails();
    if (isSwapNativeForTokenTxSuccess)
      toast.success(`Successfully swapped ${chain?.nativeCurrency.symbol} for ${tokenB?.symbol}`);
    if (isSwapNativeForTokenTxError)
      toast.error(`Failed to swap ${chain?.nativeCurrency.symbol} for ${tokenB?.symbol}`);
  }, [isSwapNativeForTokenTxSuccess, isSwapNativeForTokenTxError]);

  const { config: swapTokenForNativeConfig } = usePrepareContractWrite({
    address: serpentSwapUtility,
    abi: serpentSwapUtilityABI,
    functionName: 'swapTokenForNative',
    args: [
      selectedQuote?.tokenIn ?? zeroAddress,
      selectedQuote?.fee ?? 0,
      BigInt(Math.floor(Date.now() / 1000) + 60 * 60),
      amountAInBaseUnits,
      0n,
      0n,
    ],
    enabled: Boolean(userAddress) && Boolean(selectedQuote),
  });

  const {
    data: swapTokenForNativeResult,
    isLoading: isSwappingTokenForNative,
    isSuccess: isSwapTokenForNativeSuccess,
    write: swapTokenForNative,
  } = useContractWrite(swapTokenForNativeConfig);

  useEffect(() => {
    if (swapTokenForNativeResult?.hash && chain?.id) {
      syncTransaction(chain.id, swapTokenForNativeResult.hash, 'swapTokenForNative');
    }
  }, [swapTokenForNativeResult, chain]);

  const {
    isLoading: isSwapTokenForNativeTxPending,
    isSuccess: isSwapTokenForNativeTxSuccess,
    isError: isSwapTokenForNativeTxError,
  } = useWaitForTransaction({
    hash: swapTokenForNativeResult?.hash,
    enabled: isSwapTokenForNativeSuccess,
  });

  useEffect(() => {
    refetchTokenAUserDetails();
    if (isSwapTokenForNativeTxSuccess)
      toast.success(`Successfully swapped ${tokenA?.symbol} for ${chain?.nativeCurrency.symbol}`);
    if (isSwapTokenForNativeTxError)
      toast.error(`Failed to swap ${tokenA?.symbol} for ${chain?.nativeCurrency.symbol}`);
  }, [isSwapTokenForNativeTxSuccess, isSwapTokenForNativeTxError]);

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

  const isPairReversed = BigInt(tokenInAddress) > BigInt(tokenOutAddress);

  const sqrtPriceX96 = slot0?.[0] || 0n;
  let price = Math.pow(Number(sqrtPriceX96) / 2 ** 96, 2);
  if (isPairReversed) price = 1 / price;
  const expectedAmountOut = debouncedAmountA * price;

  const amountOutDifferencePercentage =
    debouncedAmountA > 0 ? Math.abs(((amountB - expectedAmountOut) / expectedAmountOut) * 100) : 0;
  const amountOutDiffTooGreat = amountOutDifferencePercentage > 5; // 5% difference

  return (
    <>
      <Box sx={{ height: { xs: '60px', md: '120px' } }} />
      <Grid container justifyContent={'center'}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              width: { xs: '100%', md: '650px' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
                width: '100%',
              }}
            >
              <SwapInput
                token={tokenA}
                onTokenChange={setTokenA}
                onClick={() => {
                  console.log('clicked');
                }}
              />
              <SwapInput
                token={tokenB}
                onTokenChange={setTokenB}
                onClick={() => {
                  console.log('clicked');
                }}
              />
            </Box>
            <Button
              variant='widget'
              fullWidth
            >{isUserWalletConnected ? 'Swap' : 'Connect Wallet'}</Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default SwapClientPage;