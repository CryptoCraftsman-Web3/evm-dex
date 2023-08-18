import { useEffect } from 'react';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { FeeTier, Token } from '@/types/common';
import { Button, Stack } from '@mui/material';
import { formatEther, formatUnits, parseUnits, zeroAddress } from 'viem';
import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import PreviewPosition from './preview-position';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

type PoolButtonsProps = {
  tokenA: Token | null;
  tokenB: Token | null;
  feeTier: FeeTier;
  amountA: number;
  amountB: number;
  minPrice: number;
  maxPrice: number;
  price: number;
  isPoolInitialized: boolean;
};

const PoolButtons = ({
  tokenA,
  tokenB,
  feeTier,
  amountA,
  amountB,
  minPrice,
  maxPrice,
  price,
  isPoolInitialized,
}: PoolButtonsProps) => {
  const { address: userAddress } = useAccount();
  const { nfPositionManager } = useSwapProtocolAddresses();
  const tokenAContract = {
    address: tokenA?.address ?? zeroAddress,
    abi: erc20ABI,
  };

  const tokenBContract = {
    address: tokenB?.address ?? zeroAddress,
    abi: erc20ABI,
  };

  const {
    data: allowances,
    refetch: refetchAllowances,
    isRefetching: refetchingAllowances,
  } = useContractReads({
    contracts: [
      {
        ...tokenAContract,
        functionName: 'allowance',
        args: [userAddress ?? zeroAddress, nfPositionManager],
      },
      {
        ...tokenBContract,
        functionName: 'allowance',
        args: [userAddress ?? zeroAddress, nfPositionManager],
      },
    ],
  });

  const allowanceA = (allowances?.[0].result as bigint) || 0n;
  const allowanceB = (allowances?.[1].result as bigint) || 0n;

  const amountAInWei = amountA ? BigInt(amountA * 10 ** (tokenA?.decimals ?? 18)) : 0n;
  const amountBInWei = amountB ? BigInt(amountB * 10 ** (tokenB?.decimals ?? 18)) : 0n;

  const { config: tokenAConfig } = usePrepareContractWrite({
    ...tokenAContract,
    functionName: 'approve',
    args: [nfPositionManager, amountAInWei],
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
  });

  const { config: tokenBConfig } = usePrepareContractWrite({
    ...tokenBContract,
    functionName: 'approve',
    args: [nfPositionManager, amountBInWei],
  });

  const {
    data: approveTokenBResult,
    isLoading: isApprovingTokenB,
    isSuccess: isTokenBApproved,
    write: approveTokenB,
  } = useContractWrite(tokenBConfig);

  const {
    data: approveTokenBTxReceipt,
    isLoading: isApproveTokenBTxPending,
    isSuccess: isApproveTokenBTxSuccess,
    isError: isApproveTokenBTxError,
  } = useWaitForTransaction({
    hash: approveTokenBResult?.hash,
  });

  useEffect(() => {
    refetchAllowances();

    if (isApproveTokenATxSuccess)
      toast.success(`You have approved ${tokenA?.symbol} to be spent by the Swap Protocol.`);

    if (isApproveTokenBTxSuccess)
      toast.success(`You have approved ${tokenB?.symbol} to be spent by the Swap Protocol.`);
  }, [isTokenAApproved, isTokenBApproved, isApproveTokenATxSuccess, isApproveTokenBTxSuccess]);

  const canSpendTokens = tokenA !== null && tokenB !== null && allowanceA >= amountAInWei && allowanceB >= amountBInWei;

  return (
    <Stack
      direction="column"
      spacing={2}
    >
      {((tokenA !== null && allowanceA < amountAInWei) || (tokenB !== null && allowanceB < amountBInWei)) && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="stretch"
        >
          {tokenA !== null && allowanceA < amountAInWei && (
            <LoadingButton
              variant="contained"
              size="large"
              fullWidth
              onClick={async () => {
                if (approveTokenA) await approveTokenA();
              }}
              loading={isApprovingTokenA || isApproveTokenATxPending}
            >
              Approve {tokenA.symbol}
            </LoadingButton>
          )}

          {tokenB !== null && allowanceB < amountBInWei && (
            <LoadingButton
              variant="contained"
              size="large"
              fullWidth
              onClick={async () => {
                if (approveTokenB) await approveTokenB();
              }}
              loading={isApprovingTokenB || isApproveTokenBTxPending}
            >
              Approve {tokenB.symbol}
            </LoadingButton>
          )}
        </Stack>
      )}

      <PreviewPosition
        canSpendTokens={canSpendTokens}
        tokenA={tokenA}
        tokenB={tokenB}
        feeTier={feeTier}
        amountA={amountA}
        amountB={amountB}
        minPrice={minPrice}
        maxPrice={maxPrice}
        price={price}
        isPoolInitialized={isPoolInitialized}
      />
    </Stack>
  );
};

export default PoolButtons;
