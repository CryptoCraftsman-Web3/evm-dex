import { useEffect } from 'react';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { FeeTier, Token } from '@/types/common';
import { Button, Stack } from '@mui/material';
import { formatEther, formatUnits, parseUnits, zeroAddress } from 'viem';
import { erc20ABI, useAccount, useContractReads, useContractWrite } from 'wagmi';
import PreviewPosition from './preview-position';

type PoolButtonsProps = {
  tokenA: Token | null;
  tokenB: Token | null;
  feeTier: FeeTier;
  amountA: number;
  amountB: number;
  minPrice: number;
  maxPrice: number;
  price: number;
};

const PoolButtons = ({ tokenA, tokenB, feeTier, amountA, amountB, minPrice, maxPrice, price }: PoolButtonsProps) => {
  const { address: userAddress } = useAccount();
  const { nonfungiblePositionManagerAddress } = useSwapProtocolAddresses();
  const tokenAContract = {
    address: tokenA?.address ?? zeroAddress,
    abi: erc20ABI,
  };

  const tokenBContract = {
    address: tokenB?.address ?? zeroAddress,
    abi: erc20ABI,
  };

  const { data: allowances, refetch: refetchAllowances } = useContractReads({
    contracts: [
      {
        ...tokenAContract,
        functionName: 'allowance',
        args: [userAddress ?? zeroAddress, nonfungiblePositionManagerAddress],
      },
      {
        ...tokenBContract,
        functionName: 'allowance',
        args: [userAddress ?? zeroAddress, nonfungiblePositionManagerAddress],
      },
    ],
  });

  const allowanceA = (allowances?.[0].result as bigint) || 0n;
  const allowanceB = (allowances?.[1].result as bigint) || 0n;

  const amountAInWei = amountA ? BigInt(amountA * 10 ** (tokenA?.decimals ?? 18)) : 0n;
  const amountBInWei = amountB ? BigInt(amountB * 10 ** (tokenB?.decimals ?? 18)) : 0n;

  const {
    data: approveTokenAResult,
    isLoading: isApprovingTokenA,
    isSuccess: isTokenAApproved,
    write: approveTokenA,
  } = useContractWrite({
    ...tokenAContract,
    functionName: 'approve',
    args: [nonfungiblePositionManagerAddress, amountAInWei],
  });

  const {
    data: approveTokenBResult,
    isLoading: isApprovingTokenB,
    isSuccess: isTokenBApproved,
    write: approveTokenB,
  } = useContractWrite({
    ...tokenBContract,
    functionName: 'approve',
    args: [nonfungiblePositionManagerAddress, amountBInWei],
  });

  useEffect(() => {
    if (isTokenAApproved) refetchAllowances();
    if (isTokenBApproved) refetchAllowances();
  }, [isTokenAApproved, isTokenBApproved]);

  const canSpendTokens = tokenA !== null && tokenB !== null && allowanceA >= amountAInWei && allowanceB >= amountBInWei;

  return (
    <Stack
      direction="column"
      spacing={2}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="stretch"
      >
        {tokenA !== null && allowanceA < amountAInWei && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => approveTokenA()}
          >
            Approve {tokenA.symbol}
          </Button>
        )}

        {tokenB !== null && allowanceB < amountBInWei && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => approveTokenB()}
          >
            Approve {tokenB.symbol}
          </Button>
        )}
      </Stack>

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
      />
    </Stack>
  );
};

export default PoolButtons;
