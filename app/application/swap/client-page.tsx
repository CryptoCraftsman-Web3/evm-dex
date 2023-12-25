'use client';

import { Paper, Typography, Box, Grid, Button, Modal, IconButton, Input, Divider, colors } from '@mui/material';
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
import Tag from '@/components/tag';
import { useErc20ToErc20Swap, useErc20ToNativeSwap, useNativeToErc20Swap, useQuoterV2, useTokenAllowance, useTokenAmounts } from '@/hooks/swap';

const SwapClientPage = () => {
  const { tokenA, tokenB, setTokenA, setTokenB } = useTokenManager();

  const {
    chain,
    userAddress,
    isUserWalletConnected,
    serpentSwapUtility,
    poolFactory,
    isTokenANative,
    isTokenBNative,
    wrappedNativeToken,
    amountA,
    setAmountA,
    debouncedAmountA,
    amountB,
    setAmountB,
  } = useTokenAmounts(tokenA, tokenB, setTokenA, setTokenB);

  const { isFetchingQuotes, quotes, selectedQuote, getQuote, setSelectedQuote, tokenInAddress, tokenOutAddress } =
    useQuoterV2(tokenA, tokenB, debouncedAmountA, isTokenANative, isTokenBNative, setAmountB);

  useEffect(() => {
    console.log(`tokenA: ${tokenA?.symbol}, tokenB: ${tokenB?.symbol}, debouncedAmountA: ${debouncedAmountA}`);
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

  const {
    tokenContract: tokenAContract,
    amountInBaseUnits: amountAInBaseUnits,
    tokenUserDetails,
    refetchTokenUserDetails: refetchTokenAUserDetails,
    refetchingTokenUserDetails,
    userNativeTokenBalance,
    refetchUserNativeTokenBalance,
    notEnoughTokenBalance: notEnoughTokenABalance,
    notEnoughTokenAllowance: notEnoughTokenAAllowance,
    approveTokenResult: approveTokenAResult,
    approveTokenStatus: approveTokenAStatus,
    isApprovingToken: isApprovingTokenA,
    isTokenApproved: isTokenAApproved,
    approveToken: approveTokenA,
    isApproveTokenTxPending: isApproveTokenATxPending,
    isApproveTokenTxSuccess: isApproveTokenATxSuccess,
    isApproveTokenTxError: isApproveTokenATxError,
  } = useTokenAllowance(tokenA, userAddress, serpentSwapUtility, debouncedAmountA);

  useEffect(() => {
    if (approveTokenAResult?.hash && chain?.id) {
      syncTransaction(chain.id, approveTokenAResult.hash, 'approve');
    }
  }, [approveTokenAResult, chain]);

  useEffect(() => {
    refetchTokenAUserDetails();
    if (isApproveTokenATxSuccess) toast.success(`Successfully approved ${tokenA?.symbol} allowance`);
    if (isApproveTokenATxError) toast.error(`Failed to approve ${tokenA?.symbol} allowance`);
  }, [isApproveTokenATxSuccess, isApproveTokenATxError]);

  const {
    swapTokensConfig,
    swapTokensResult,
    isSwappingTokens,
    isSwapTokensSuccess,
    swapTokens,
    isSwapTokensTxPending,
    isSwapTokensTxSuccess,
    isSwapTokensTxError,
  } = useErc20ToErc20Swap(selectedQuote, amountAInBaseUnits);

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

  const {
    swapNativeForTokenConfig,
    swapNativeForTokenResult,
    isSwappingNativeForToken,
    isSwapNativeForTokenSuccess,
    swapNativeForToken,
    isSwapNativeForTokenTxPending,
    isSwapNativeForTokenTxSuccess,
    isSwapNativeForTokenTxError,
  } = useNativeToErc20Swap(selectedQuote, amountAInBaseUnits);

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

  const {
    swapTokenForNativeConfig,
    swapTokenForNativeResult,
    isSwappingTokenForNative,
    isSwapTokenForNativeSuccess,
    swapTokenForNative,
    isSwapTokenForNativeTxPending,
    isSwapTokenForNativeTxSuccess,
    isSwapTokenForNativeTxError,
  } = useErc20ToNativeSwap(selectedQuote, amountAInBaseUnits);

  useEffect(() => {
    if (swapTokenForNativeResult?.hash && chain?.id) {
      syncTransaction(chain.id, swapTokenForNativeResult.hash, 'swapTokenForNative');
    }
  }, [swapTokenForNativeResult, chain]);

  useEffect(() => {
    refetchTokenAUserDetails();
    if (isSwapTokenForNativeTxSuccess)
      toast.success(`Successfully swapped ${tokenA?.symbol} for ${chain?.nativeCurrency.symbol}`);
    if (isSwapTokenForNativeTxError)
      toast.error(`Failed to swap ${tokenA?.symbol} for ${chain?.nativeCurrency.symbol}`);
  }, [isSwapTokenForNativeTxSuccess, isSwapTokenForNativeTxError]);

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

  const [tokenModalOpen, setTokenModalOpen] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [activeTokenInput, setActiveTokenInput] = useState<'A' | 'B'>('A');

  const swap = async () => {
    try {
      if (!tokenA || !tokenB) throw new Error('Please select tokens to swap');
      if (!isUserWalletConnected) throw new Error('Please connect your wallet');

      if (isTokenANative && !isTokenBNative && swapNativeForToken) {
        swapNativeForToken();
      }

      if (!isTokenANative && isTokenBNative && swapTokenForNative) {
        swapTokenForNative();
      }

      if (!isTokenANative && !isTokenBNative && swapTokens) {
        swapTokens();
      }
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <>
      <Box sx={{ height: { xs: '60px', md: '120px' } }} />
      <Grid
        container
        justifyContent={'center'}
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          <Paper
            sx={{
              width: { xs: '100%', md: '650px' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '20px',
                width: '100%',
              }}
            >
              <Typography variant="button">Swap</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '9px',
                }}
              >
                <Typography
                  variant="button"
                  sx={{ opacity: 0.3 }}
                >
                  Buy
                </Typography>
                <Tag color="green">Coming soon</Tag>
              </Box>
            </Box>
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
                side="A"
                token={tokenA}
                onTokenChange={setTokenA}
                onClick={() => {
                  setTokenModalOpen(true);
                  setSelectedToken(tokenA);
                  setActiveTokenInput('A');
                }}
                amount={amountA}
                setAmount={setAmountA}
                disabled={isFetchingQuotes}
              />
              <SwapInput
                side="B"
                token={tokenB}
                onTokenChange={setTokenB}
                onClick={() => {
                  setTokenModalOpen(true);
                  setSelectedToken(tokenB);
                  setActiveTokenInput('B');
                }}
                amount={amountB}
                setAmount={setAmountB}
                disabled={isFetchingQuotes}
                fixedDecimals={6}
              />
            </Box>
            {notEnoughTokenAAllowance && tokenA && tokenB ? (
              <LoadingButton
                variant="widget"
                fullWidth
                disabled={isFetchingQuotes}
                loading={isApprovingTokenA || isApproveTokenATxPending}
                onClick={approveTokenA}
              >
                {isFetchingQuotes ? 'Fetching quotes...' : `Approve ${tokenA?.symbol}`}
              </LoadingButton>
            ) : (
              <LoadingButton
                variant="widget"
                fullWidth
                disabled={isFetchingQuotes}
                loading={
                  isSwappingTokens ||
                  isSwapTokensTxPending ||
                  isSwappingNativeForToken ||
                  isSwapNativeForTokenTxPending ||
                  isSwappingTokenForNative ||
                  isSwapTokenForNativeTxPending
                }
                onClick={swap}
              >
                {isFetchingQuotes ? 'Fetching quotes...' : <>{isUserWalletConnected ? 'Swap' : 'Connect Wallet'}</>}
              </LoadingButton>
            )}
          </Paper>
        </Grid>
      </Grid>
      <SelectToken
        tokenModalOpen={tokenModalOpen}
        setTokenModalOpen={setTokenModalOpen}
        selectedToken={selectedToken}
        setSelectedToken={activeTokenInput === 'A' ? setTokenA : setTokenB}
      />
    </>
  );
};

export default SwapClientPage;
