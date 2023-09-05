'use client';

import { useState } from 'react';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import SelectToken from '@/components/pools/select-token';
import { Token } from '@/types/common';

const SwapClientPage = () => {
  const [tokenA, setTokenA] = useState<Token | null>(null);
  const [tokenB, setTokenB] = useState<Token | null>(null);

  const [amountA, setAmountA] = useState<number>(0);
  const [amountB, setAmountB] = useState<number>(0);
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        variant="outlined"
        sx={{ p: 2, width: { xs: '100%', md: 500 } }}
      >
        <Stack
          direction="column"
          spacing={2}
        >
          <Typography variant="h6">
            <strong>Swap</strong>
          </Typography>

          <Paper
            // variant="outlined"
            sx={{ p: 2 }}
          >
            <Stack
              direction="row"
              spacing={2}
            >
              <Typography
                variant="body1"
                color="GrayText"
              >
                You Pay
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <TextField
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

                  if (parsed < 0) {
                    setAmountA(0);
                  }

                  setAmountA(parsed);
                }}
                sx={{
                  '& fieldset': { border: 'none' },
                }}
              />

              <SelectToken
                token={tokenA}
                setToken={setTokenA}
                inputLabel="Select a token"
              />
            </Stack>
          </Paper>

          <Paper
            // variant="outlined"
            sx={{ p: 2 }}
          >
            <Stack
              direction="row"
              spacing={2}
            >
              <Typography
                variant="body1"
                color="GrayText"
              >
                You Receive
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <TextField
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

                  if (parsed < 0) {
                    setAmountB(0);
                  }

                  setAmountB(parsed);
                }}
                sx={{
                  '& fieldset': { border: 'none' },
                }}
              />

              <SelectToken
                token={tokenB}
                setToken={setTokenB}
                inputLabel="Select a token"
              />
            </Stack>
          </Paper>

          {amountA === 0 || amountB === 0 || !tokenA || !tokenB ? (
            <Alert severity="warning">Please enter valid amounts and select tokens</Alert>
          ) : (
            <Button
              variant="contained"
              size="large"
              fullWidth
            >
              Swap
            </Button>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SwapClientPage;
