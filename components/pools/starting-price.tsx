import { Token } from "@/types/common";
import { Alert, FormControl, FormLabel, Stack, TextField, Typography } from "@mui/material";

type StartingPriceProps = {
  startingPrice: number;
  setStartingPrice: (startingPrice: number) => void;
  tokenA: Token | null;
  tokenB: Token | null;
};

const StartingPrice = ({ startingPrice, setStartingPrice, tokenA, tokenB }: StartingPriceProps) => {
  return (
    <FormControl fullWidth>
      <FormLabel sx={{ mb: 2 }}>Set Starting Price</FormLabel>
      <Stack
        direction="column"
        spacing={2}
      >
        <Alert
          severity="warning"
          variant="outlined"
          icon={false}
        >
          This pool has not been initialized yet. You will need to set the starting price. Gas fees will be higher than
          usual.
        </Alert>
        <TextField
          label={`${tokenA?.symbol ?? ''} Price`}
          InputProps={{
            endAdornment: <>{tokenB?.symbol ?? ''}</>,
            inputProps: {
              min: 0,
              style: { textAlign: 'right', paddingRight: '1rem' },
            }
          }}
          type="number"
          value={startingPrice}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              setStartingPrice(0);
              return;
            }
            const parsed = parseFloat(value);
            if (isNaN(parsed)) setStartingPrice(0);
            if (parsed < 0) setStartingPrice(0);
            setStartingPrice(parsed);
          }}
        />
      </Stack>
    </FormControl>
  );
};

export default StartingPrice;
