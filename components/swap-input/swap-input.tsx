'use client';

import { Box, Typography, Stack, Button, Input } from '@mui/material';
import { colors } from '@/theme/default-colors';
import { Token } from '@/types/common';

type SwapInputProps = {
  side: 'A' | 'B';
  token: Token | null;
  onTokenChange: (token: Token | null) => void;
  onClick: () => void;
  amount: number | null;
  setAmount: (amount: number) => void;
  disabled?: boolean;
  fixedDecimals?: number;
  readOnly?: boolean;
};

const SwapInput = ({
  side,
  token,
  onTokenChange,
  onClick,
  amount,
  setAmount,
  disabled,
  fixedDecimals,
  readOnly,
}: SwapInputProps) => {
  let inputValue = "";

  if (amount !== null && fixedDecimals) {
    inputValue = amount.toFixed(fixedDecimals);
  }

  if (amount !== null && !fixedDecimals) {
    inputValue = amount.toString();
  }

  return (
    <Box
      sx={{
        p: '25px 20px',
        borderRadius: '12px',
        backgroundColor: colors.tertiaryBG,
        height: '100px',
        width: '100%',
        display: 'inline-flex',
        justifyContent: 'space-between',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Stack gap={'2px'}>
        <Typography variant="footnote">{side === 'A' ? 'You pay' : 'You get'}</Typography>
        <Input
          type="number"
          fullWidth
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            height: '100%',
            borderBottom: 'none',
          }}
          value={inputValue}
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
          disabled={disabled}
          readOnly={readOnly}
        />
      </Stack>
      <Box
        sx={{
          alignSelf: 'center',
        }}
      >
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: token && colors.secBG,
            p: token && '9px 12px',
          }}
          onClick={onClick}
          startIcon={
            token && (
              <img
                style={{ width: '24px', height: '24px' }}
                src={'/icons/unknown-token.svg'}
                alt="unknown token icon"
              />
            )
          }
          endIcon={
            <img
              src={'/icons/keyboard_arrow_down.svg'}
              style={{ filter: 'invert(1)' }}
              alt="drop down icon"
            />
          }
        >
          {token ? token.symbol : 'Select token'}
        </Button>
      </Box>
    </Box>
  );
};

export default SwapInput;
