import { Token } from '@/types/common';
import { Box, FormControl, FormLabel, Stack, TextField, Typography } from '@mui/material';
import { IoFileTrayStackedOutline } from 'react-icons/io5';

type SetPriceRangeProps = {
  minPrice: number;
  setMinPrice: (minPrice: number) => void;
  maxPrice: number;
  setMaxPrice: (maxPrice: number) => void;
  tokenA: Token | null;
  tokenB: Token | null;
  hasInitializedPool: boolean;
};

const SetPriceRange = ({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  tokenA,
  tokenB,
  hasInitializedPool,
}: SetPriceRangeProps) => {
  const disabled = tokenA === null || tokenB === null;
  return (
    <FormControl
      fullWidth
      disabled={disabled}
    >
      <FormLabel sx={{ mb: 2 }}>Set Price Range</FormLabel>
      <Stack
        direction="column"
        spacing={3}
      >
        {hasInitializedPool && (
          <>
            <Box p={1} textAlign="center">
              <IoFileTrayStackedOutline size={96} />
            </Box>
            <Typography variant="h6" textAlign="center" pb={2}>Your position will appear here</Typography>
          </>
        )}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
        >
          <TextField
            label="Minimum Price"
            InputProps={{
              endAdornment: tokenA && tokenB ? <>{tokenB.symbol} / {tokenA.symbol}</> : null,
              inputProps: {
                min: 0,
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
            sx={{ whiteSpace: 'nowrap' }}
          />

          <TextField
            label="Maximum Price"
            InputProps={{
              endAdornment: tokenA && tokenB ? <>{tokenB.symbol} / {tokenA.symbol}</> : null,
              inputProps: {
                min: 0,
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
            sx={{ whiteSpace: 'nowrap' }}
          />
        </Stack>
      </Stack>
    </FormControl>
  );
};

export default SetPriceRange;
