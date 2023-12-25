import { Quote } from '@/app/application/swap/swap-types';
import { useEthersProvider } from '@/lib/ethers';
import { Token } from '@/types/common';
import { quoterV2ABI } from '@/types/wagmi/uniswap-v3-periphery';
import { useDebounce } from '@uidotdev/usehooks';
import { ethers } from 'ethers';
import { useState } from 'react';
import { zeroAddress } from 'viem';
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
import { useSwapProtocolAddresses } from './swap-protocol-hooks';
import { useWrappedNativeToken } from './token-hooks';
import { serpentSwapUtilityABI } from '@/types/wagmi/serpent-swap';
import { uniswapV3FactoryABI, uniswapV3PoolABI } from '@/types/wagmi/uniswap-v3-core';

export function useTokenAmounts(
  tokenA: Token | null,
  tokenB: Token | null,
  setTokenA: (token: Token) => void,
  setTokenB: (token: Token) => void
) {
  const { chain } = useNetwork();
  const { address: userAddress, isConnected: isUserWalletConnected } = useAccount();
  const { serpentSwapUtility, poolFactory } = useSwapProtocolAddresses();

  const isTokenANative = tokenA?.isNative;
  const isTokenBNative = tokenB?.isNative;

  const wrappedNativeToken = useWrappedNativeToken();

  const [amountA, setAmountA] = useState<number>(1);
  const debouncedAmountA = useDebounce(amountA, 500);

  const [amountB, setAmountB] = useState<number>(1);

  return {
    chain,
    userAddress,
    isUserWalletConnected,
    serpentSwapUtility,
    poolFactory,
    isTokenANative,
    isTokenBNative,
    wrappedNativeToken,
    tokenA,
    tokenB,
    setTokenA,
    setTokenB,
    amountA,
    setAmountA,
    debouncedAmountA,
    amountB,
    setAmountB,
  };
}

export function useQuoterV2(
  tokenA: Token | null,
  tokenB: Token | null,
  debouncedAmountA: number,
  isTokenANative: boolean | undefined,
  isTokenBNative: boolean | undefined,
  setAmountB: (amount: number) => void
) {
  const ethersProvider = useEthersProvider();
  const { quoterV2 } = useSwapProtocolAddresses();
  const wrappedNativeToken = useWrappedNativeToken();
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

  return {
    isFetchingQuotes,
    quotes,
    selectedQuote,
    getQuote,
    setSelectedQuote,
    tokenInAddress,
    tokenOutAddress,
  };
}

export function useTokenAllowance(
  token: Token | null,
  ownerAddress: `0x${string}` | undefined,
  spenderAddress: `0x${string}` | undefined,
  tokenAmount: number
) {
  const tokenContract = {
    address: token?.address ?? zeroAddress,
    abi: erc20ABI,
  };

  const {
    data: tokenUserDetails,
    refetch: refetchTokenUserDetails,
    isRefetching: refetchingTokenUserDetails,
  } = useContractReads({
    contracts: [
      {
        ...tokenContract,
        functionName: 'balanceOf',
        args: [ownerAddress ?? zeroAddress],
      },
      {
        ...tokenContract,
        functionName: 'allowance',
        args: [ownerAddress ?? zeroAddress, spenderAddress ?? zeroAddress],
      },
    ],
    enabled: Boolean(token) && Boolean(ownerAddress) && Boolean(spenderAddress),
  });

  const { data: userNativeTokenBalance, refetch: refetchUserNativeTokenBalance } = useBalance({
    address: ownerAddress ?? zeroAddress,
    enabled: Boolean(ownerAddress),
  });

  const tokenUserBalance = (tokenUserDetails?.[0].result as bigint) || 0n;
  const tokenUserAllowance = (tokenUserDetails?.[1].result as bigint) || 0n;
  const amountInBaseUnits = ethers.utils.parseUnits(tokenAmount.toString(), token?.decimals || 18).toBigInt();

  const notEnoughTokenBalance = token?.isNative
    ? (userNativeTokenBalance?.value || 0n) < amountInBaseUnits
    : tokenUserBalance < amountInBaseUnits;
  const notEnoughTokenAllowance = token?.isNative
    ? (userNativeTokenBalance?.value || 0n) < amountInBaseUnits
    : tokenUserAllowance < amountInBaseUnits;

  const { config: tokenConfig } = usePrepareContractWrite({
    ...tokenContract,
    functionName: 'approve',
    args: [spenderAddress || zeroAddress, amountInBaseUnits],
    enabled: Boolean(token) && Boolean(ownerAddress) && Boolean(spenderAddress),
  });

  const {
    data: approveTokenResult,
    status: approveTokenStatus,
    isLoading: isApprovingToken,
    isSuccess: isTokenApproved,
    write: approveToken,
  } = useContractWrite(tokenConfig);

  const {
    data: approveTokenTxReceipt,
    isLoading: isApproveTokenTxPending,
    isSuccess: isApproveTokenTxSuccess,
    isError: isApproveTokenTxError,
  } = useWaitForTransaction({
    hash: approveTokenResult?.hash,
    enabled: isTokenApproved,
  });

  return {
    tokenContract,
    tokenUserDetails,
    refetchTokenUserDetails,
    refetchingTokenUserDetails,
    userNativeTokenBalance,
    refetchUserNativeTokenBalance,
    notEnoughTokenBalance,
    notEnoughTokenAllowance,
    amountInBaseUnits,
    tokenUserBalance,
    tokenUserAllowance,
    approveTokenResult,
    approveTokenStatus,
    isApprovingToken,
    isTokenApproved,
    approveToken,
    approveTokenTxReceipt,
    isApproveTokenTxPending,
    isApproveTokenTxSuccess,
    isApproveTokenTxError,
  };
}

export function useErc20ToErc20Swap(selectedQuote: Quote | null, amountInBaseUnits: bigint) {
  const { address: userAddress } = useAccount();
  const { serpentSwapUtility } = useSwapProtocolAddresses();
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
      amountInBaseUnits,
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

  return {
    swapTokensConfig,
    swapTokensResult,
    isSwappingTokens,
    isSwapTokensSuccess,
    swapTokens,
    isSwapTokensTxPending,
    isSwapTokensTxSuccess,
    isSwapTokensTxError,
  };
}

export function useNativeToErc20Swap(selectedQuote: Quote | null, amountInBaseUnits: bigint) {
  const { address: userAddress } = useAccount();
  const { serpentSwapUtility } = useSwapProtocolAddresses();

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
    value: amountInBaseUnits,
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

  return {
    swapNativeForTokenConfig,
    swapNativeForTokenResult,
    isSwappingNativeForToken,
    isSwapNativeForTokenSuccess,
    swapNativeForToken,
    isSwapNativeForTokenTxPending,
    isSwapNativeForTokenTxSuccess,
    isSwapNativeForTokenTxError,
  };
}

export function useErc20ToNativeSwap(selectedQuote: Quote | null, amountInBaseUnits: bigint) {
  const { address: userAddress } = useAccount();
  const { serpentSwapUtility } = useSwapProtocolAddresses();

  const { config: swapTokenForNativeConfig } = usePrepareContractWrite({
    address: serpentSwapUtility,
    abi: serpentSwapUtilityABI,
    functionName: 'swapTokenForNative',
    args: [
      selectedQuote?.tokenIn ?? zeroAddress,
      selectedQuote?.fee ?? 0,
      BigInt(Math.floor(Date.now() / 1000) + 60 * 60),
      amountInBaseUnits,
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

  const {
    isLoading: isSwapTokenForNativeTxPending,
    isSuccess: isSwapTokenForNativeTxSuccess,
    isError: isSwapTokenForNativeTxError,
  } = useWaitForTransaction({
    hash: swapTokenForNativeResult?.hash,
    enabled: isSwapTokenForNativeSuccess,
  });

  return {
    swapTokenForNativeConfig,
    swapTokenForNativeResult,
    isSwappingTokenForNative,
    isSwapTokenForNativeSuccess,
    swapTokenForNative,
    isSwapTokenForNativeTxPending,
    isSwapTokenForNativeTxSuccess,
    isSwapTokenForNativeTxError,
  };
}

export function useSwapPool(
  selectedQuote: Quote | null,
  tokenInAddress: string,
  tokenOutAddress: string,
  debouncedAmountA: number,
  amountB: number
) {
  const { poolFactory } = useSwapProtocolAddresses();

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

  return {
    poolAddress,
    slot0,
    isPairReversed,
    sqrtPriceX96,
    price,
    expectedAmountOut,
    amountOutDifferencePercentage,
    amountOutDiffTooGreat,
  };
}
