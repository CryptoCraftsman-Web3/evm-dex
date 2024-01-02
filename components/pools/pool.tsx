import { Position, Token } from '@/types/common';
import { Paper, Stack, Typography, Box } from '@mui/material';
import Link from 'next/link';
import { erc20ABI, useContractReads } from 'wagmi';
import Tag from '@/components/tag';

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
    <Paper>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        onClick={() => { }}
      >
        <Stack
          direction="column"
          gap={{ xs: '16px', md: '20px' }}
        >
          <Stack
            sx={{ display: { xs: 'flex', md: 'none' } }}
            direction="row"
            justifyContent={'space-between'}
          >
            <Tag color="green">{position.fee / 10_000}%</Tag>
            <Tag color={position.liquidity > 0n ? 'darkGreen' : 'red'}>
              {position.liquidity > 0n ? 'Open' : 'Closed'}
            </Tag>
          </Stack>

          <Stack
            direction="row"
            gap="16px"
            alignItems="center"
          >
            <Link href={`/application/pools/${tokenId.toString()}`} style={{ textDecoration: 'none' }}>
              <Typography variant="subtitle1">
                {tokenA.symbol} - {tokenB.symbol}
              </Typography>
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'initial' } }}>
              <Tag color="green">{position.fee / 10_000}%</Tag>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Typography variant="body2">
              {`Min ${minPrice.toFixed(4)} ${tokenB.symbol} per ${tokenA.symbol} / Max ${maxPrice.toFixed(4)} ${tokenB.symbol} per ${tokenA.symbol}`}
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ display: { xs: 'none', md: 'initial' } }}>
          <Tag color={position.liquidity > 0n ? 'darkGreen' : 'red'}>
            {position.liquidity > 0n ? 'Open' : 'Closed'}
          </Tag>
        </Box>
      </Stack>
    </Paper>
  );
};

export default Pool;
