import { Position } from '@/types/common';
import { Paper, Stack, Typography } from '@mui/material';
import { IoLink } from 'react-icons/io5';
import { useNetwork } from 'wagmi';

type LiquidityCardProps = {
  position: Position;
  tokenASymbol: string;
  tokenAName: string;
  tokenBSymbol: string;
  tokenBName: string;
  amountAFormatted: string;
  amountBFormatted: string;
};

export default function LiquidityCard({
  position,
  tokenASymbol,
  tokenAName,
  tokenBSymbol,
  tokenBName,
  amountAFormatted,
  amountBFormatted,
}: LiquidityCardProps) {
  const { chain } = useNetwork();

  return (
    <Paper
      variant="outlined"
      sx={{
        padding: 2,
      }}
    >
      <Stack
        direction="column"
        spacing={2}
      >
        <Typography variant="h6">Liquidity</Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <a
            href={`${chain?.blockExplorers?.default.url}/address/${position.token0}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              variant="body1"
              display="flex"
              alignItems="center"
              sx={{
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {tokenASymbol} ({tokenAName}) &nbsp; <IoLink />
            </Typography>
          </a>

          <Typography variant="body1">{amountAFormatted}</Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <a
            href={`${chain?.blockExplorers?.default.url}/address/${position.token1}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              variant="body1"
              display="flex"
              alignItems="center"
              sx={{
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {tokenBSymbol} ({tokenBName}) &nbsp; <IoLink />
            </Typography>
          </a>

          <Typography variant="body1">{amountBFormatted}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
