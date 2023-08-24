import { Position, Token } from '@/types/common';
import { Stack, Typography } from '@mui/material';
import { erc20ABI, useContractReads } from 'wagmi';

type PoolProps = {
  position: Position;
  hideClosedPositions: boolean;
};

const Pool = ({ position, hideClosedPositions }: PoolProps) => {
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
  };

  const tokenB: Token = {
    address: tokenBAddress,
    symbol: tokenPairDetailsResult?.[3].result as string,
    decimals: tokenPairDetailsResult?.[4].result as number,
    name: tokenPairDetailsResult?.[5].result as string,
  };

  return hideClosedPositions && position.liquidity === 0n ? null : (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack
        direction="column"
        spacing={1}
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
      </Stack>

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
