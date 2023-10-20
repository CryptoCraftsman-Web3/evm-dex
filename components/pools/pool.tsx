import { Position, Token } from '@/types/common';
import { Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { erc20ABI, useContractReads } from 'wagmi';

type PoolProps = {
  tokenId: bigint;
  position: Position;
  hideClosedPositions: boolean;
};

const Pool = ({ tokenId, position, hideClosedPositions }: PoolProps) => {
  const tokenAAddress = position.token0;
  const tokenBAddress = position.token1;

  const { data: tokenPairDetailsResult, isLoading: isGettingTokenPairDetails } = useContractReads({
    contracts: [
      {
        address: tokenAAddress,
        abi: erc20ABI,
        functionName: 'symbol',
      },
      {
        address: tokenAAddress,
        abi: erc20ABI,
        functionName: 'decimals',
      },
      {
        address: tokenAAddress,
        abi: erc20ABI,
        functionName: 'name',
      },
      {
        address: tokenBAddress,
        abi: erc20ABI,
        functionName: 'symbol',
      },
      {
        address: tokenBAddress,
        abi: erc20ABI,
        functionName: 'decimals',
      },
      {
        address: tokenBAddress,
        abi: erc20ABI,
        functionName: 'name',
      },
    ],
    enabled: tokenAAddress !== undefined && tokenBAddress !== undefined,
  });

  const tokenA: Token = {
    address: tokenAAddress,
    symbol: tokenPairDetailsResult?.[0].result as string,
    decimals: tokenPairDetailsResult?.[1].result as number,
    name: tokenPairDetailsResult?.[2].result as string,
    isNative: false,
  };

  const tokenB: Token = {
    address: tokenBAddress,
    symbol: tokenPairDetailsResult?.[3].result as string,
    decimals: tokenPairDetailsResult?.[4].result as number,
    name: tokenPairDetailsResult?.[5].result as string,
    isNative: false,
  };

  const minPrice = 1.0001 ** position.tickLower / 10 ** (tokenB.decimals - tokenA.decimals);
  const maxPrice = 1.0001 ** position.tickUpper / 10 ** (tokenB.decimals - tokenA.decimals);

  return hideClosedPositions && position.liquidity === 0n ? null : (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      onClick={() => {}}
    >
      <Link href={`/pools/${tokenId.toString()}`} style={{ textDecoration: 'none' }}>
        <Stack
          direction="column"
          spacing={0}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Typography variant="h6">
              {tokenA.symbol}/{tokenB.symbol}
            </Typography>
            <Typography variant="body2">{position.fee / 10_000}% Fee</Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Typography
              variant="body2"
              color="GrayText"
            >
              Min:
            </Typography>

            <Typography variant="body2">
              {minPrice.toFixed(4)} {tokenB.symbol} per {tokenA.symbol}
            </Typography>

            <Typography
              variant="body2"
              color="GrayText"
            >
              ↔
            </Typography>

            <Typography
              variant="body2"
              color="GrayText"
            >
              Max:
            </Typography>

            <Typography variant="body2">
              {maxPrice.toFixed(4)} {tokenB.symbol} per {tokenA.symbol}
            </Typography>
          </Stack>
        </Stack>
      </Link>

      <Typography
        variant="body1"
        sx={{
          color: position.liquidity > 0n ? 'success.main' : 'error.main',
        }}
      >
        {position.liquidity > 0n ? 'Open' : 'Closed'}
      </Typography>
    </Stack>
  );
};

export default Pool;
