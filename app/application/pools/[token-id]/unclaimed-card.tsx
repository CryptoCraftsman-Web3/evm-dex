import ClaimTokens from '@/components/pools/claim-tokens';
import { Position } from '@/types/common';
import { Paper, Stack, Typography } from '@mui/material';
import { IoLink } from 'react-icons/io5';
import { useNetwork } from 'wagmi';

type UnclaimedCardProps = {
  position: Position;
  tokenASymbol: string;
  tokenAName: string;
  tokenBSymbol: string;
  tokenBName: string;
  tokenAUnclaimedFees: number;
  tokenBUnclaimedFees: number;
  tokenAUnclaimedFeesFormatted: string;
  tokenBUnclaimedFeesFormatted: string;
  tokenId: bigint;
  getUnclaimedTokens: () => void;
};

export default function UnclaimedCard({
  position,
  tokenASymbol,
  tokenAName,
  tokenBSymbol,
  tokenBName,
  tokenAUnclaimedFees,
  tokenBUnclaimedFees,
  tokenAUnclaimedFeesFormatted,
  tokenBUnclaimedFeesFormatted,
  tokenId,
  getUnclaimedTokens,
}: UnclaimedCardProps) {
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Unclaimed Tokens</Typography>

          <ClaimTokens
            tokenASymbol={tokenASymbol}
            tokenBSymbol={tokenBSymbol}
            tokenAUnclaimedAmount={tokenAUnclaimedFees}
            tokenBUnclaimedAmount={tokenBUnclaimedFees}
            positionTokenId={tokenId}
            getUnclaimedTokens={getUnclaimedTokens}
          />
        </Stack>

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

          <Typography variant="body1">{tokenAUnclaimedFeesFormatted}</Typography>
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

          <Typography variant="body1">{tokenBUnclaimedFeesFormatted}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
