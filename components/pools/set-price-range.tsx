import { Token } from '@/types/common';
import { FormControl, FormLabel, Stack, TextField, Typography } from '@mui/material';

type SetPriceRangeProps = {
  minPrice: number;
  setMinPrice: (minPrice: number) => void;
  maxPrice: number;
  setMaxPrice: (maxPrice: number) => void;
  tokenA: Token | null;
  tokenB: Token | null;
};

const SetPriceRange = ({ minPrice, setMinPrice, maxPrice, setMaxPrice, tokenA, tokenB }: SetPriceRangeProps) => {
  const disabled = tokenA === null || tokenB === null;
  return (
    <FormControl fullWidth disabled={disabled}>
      <FormLabel sx={{ mb: 2 }}>Set Price Range</FormLabel>
      <Stack
        direction="column"
        spacing={2}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
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
            disabled={disabled}
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
            disabled={disabled}
          />
        </Stack>
      </Stack>
    </FormControl>
  );
};

export default SetPriceRange;
