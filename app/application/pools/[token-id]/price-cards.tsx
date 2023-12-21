import { Paper, Stack, Typography } from '@mui/material';

type PriceCardsProps = {
  tokenASymbol: string;
  tokenBSymbol: string;
  price: number;
  minPrice: number;
  maxPrice: number;
};

export default function PriceCards({ tokenASymbol, tokenBSymbol, price, minPrice, maxPrice }: PriceCardsProps) {
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Paper
          variant="outlined"
          sx={{
            padding: 2,
            minWidth: { xs: '47%', md: '49%' },
          }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant="body1"
              color="GrayText"
            >
              Min Price
            </Typography>

            <Typography variant="body1">
              <strong>
                {minPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 8,
                  maximumFractionDigits: 8,
                })}
              </strong>
            </Typography>

            <Typography
              variant="body1"
              color="GrayText"
            >
              {tokenBSymbol} per {tokenASymbol}
            </Typography>
          </Stack>
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            padding: 2,
            minWidth: { xs: '47%', md: '49%' },
          }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant="body1"
              color="GrayText"
            >
              Max Price
            </Typography>

            <Typography variant="body1">
              <strong>
                {maxPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 8,
                  maximumFractionDigits: 8,
                })}
              </strong>
            </Typography>

            <Typography
              variant="body1"
              color="GrayText"
            >
              {tokenBSymbol} per {tokenASymbol}
            </Typography>
          </Stack>
        </Paper>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          padding: 2,
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="body1"
            color="GrayText"
          >
            Current Price
          </Typography>

          <Typography variant="body1">
            <strong>
              {price.toLocaleString(undefined, {
                minimumFractionDigits: 8,
                maximumFractionDigits: 8,
              })}
            </strong>
          </Typography>

          <Typography
            variant="body1"
            color="GrayText"
          >
            {tokenBSymbol} per {tokenASymbol}
          </Typography>
        </Stack>
      </Paper>
    </>
  );
}
