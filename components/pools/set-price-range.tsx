import { Token } from '@/types/common';
import { Alert, FormControl, FormLabel, Stack, TextField, Typography } from '@mui/material';

type SetPriceRangeProps = {
  minPrice: number;
  setMinPrice: (minPrice: number) => void;
  maxPrice: number;
  setMaxPrice: (maxPrice: number) => void;
  tokenA: Token | null;
  tokenB: Token | null;
};

const SetPriceRange = ({ minPrice, setMinPrice, maxPrice, setMaxPrice, tokenA, tokenB }: SetPriceRangeProps) => {
  return (
    <FormControl fullWidth>
      <FormLabel sx={{ mb: 2 }}>Set Price Range</FormLabel>
      <Stack
        direction="column"
        spacing={2}
      >
        <Stack
          direction="row"
          spacing={2}
        >
          <TextField
            label="Minimum Price"
            InputProps={{
              endAdornment: tokenA ? <>per {tokenA.symbol}</> : null,
              inputProps: {
                style: { textAlign: 'right', paddingRight: '1rem' },
              },
            }}
            type="number"
            value={minPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setMinPrice(0);
                return;
              }
              const parsed = parseFloat(value);
              if (isNaN(parsed)) setMinPrice(0);
              setMinPrice(parsed);
            }}
          />

          <TextField
            label="Maximum Price"
            InputProps={{
              endAdornment: tokenA ? <>per {tokenA.symbol}</> : null,
              inputProps: {
                style: { textAlign: 'right', paddingRight: '1rem' },
              },
            }}
            type="number"
            value={maxPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setMaxPrice(0);
                return;
              }
              const parsed = parseFloat(value);
              if (isNaN(parsed)) setMaxPrice(0);
              setMaxPrice(parsed);
            }}
          />
        </Stack>
      </Stack>
    </FormControl>
  );
};

export default SetPriceRange;
