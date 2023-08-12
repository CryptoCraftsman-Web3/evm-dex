import { Button, FormControl, FormLabel, Link, Stack, TextField, Typography } from '@mui/material';
import { Token } from '@/types/common';
import { useState } from 'react';

type DepositAmountProps = {
  tokenA: Token | null;
  tokenB: Token | null;
  amountA: number;
  setAmountA: (amountA: number) => void;
  amountB: number;
  setAmountB: (amountB: number) => void;
};

const DepositAmounts = ({ tokenA, tokenB, amountA, setAmountA, amountB, setAmountB }: DepositAmountProps) => {
  const [balanceA, setBalanceA] = useState<number>(0);
  const [balanceB, setBalanceB] = useState<number>(0);

  return (
    <FormControl fullWidth>
      <FormLabel sx={{ mb: 2 }}>Deposit Amounts</FormLabel>
      <Stack
        direction="column"
        spacing={2}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
        >
          <Stack direction="column">
            <TextField
              label={`${tokenA?.symbol ?? 'Token A'} Deposit`}
              InputProps={{
                endAdornment: tokenA ? <>{tokenA.symbol}</> : null,
                inputProps: {
                  style: { textAlign: 'right', paddingRight: '1rem', whiteSpace: 'nowrap' },
                },
              }}
              type="number"
              value={amountA}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setAmountA(0);
                  return;
                }
                const parsed = parseFloat(value);
                if (isNaN(parsed)) setAmountA(0);
                setAmountA(parsed);
              }}
            />

            {tokenA && (
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={1}
                alignItems="flex-end"
              >
                <Typography
                  variant="caption"
                  color="GrayText"
                >
                  Balance: {balanceA}
                </Typography>
                <Link>
                  <Typography
                    variant="caption"
                    color="primary"
                  >
                    Max
                  </Typography>
                </Link>
              </Stack>
            )}
          </Stack>

          <Stack direction="column">
            <TextField
              label={`${tokenB?.symbol ?? 'Token B'} Deposit`}
              InputProps={{
                endAdornment: tokenB ? <>{tokenB.symbol}</> : null,
                inputProps: {
                  style: { textAlign: 'right', paddingRight: '1rem' },
                },
              }}
              type="number"
              value={amountB}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setAmountB(0);
                  return;
                }
                const parsed = parseFloat(value);
                if (isNaN(parsed)) setAmountB(0);
                setAmountB(parsed);
              }}
            />

            {tokenB && (
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={1}
                alignItems="flex-end"
              >
                <Typography
                  variant="caption"
                  color="GrayText"
                >
                  Balance: {balanceB}
                </Typography>
                <Link>
                  <Typography
                    variant="caption"
                    color="primary"
                  >
                    Max
                  </Typography>
                </Link>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </FormControl>
  );
};

export default DepositAmounts;
