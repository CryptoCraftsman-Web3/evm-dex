'use client';

import { Box, Typography, Stack, Button, Input } from '@mui/material';
import { colors } from '@/theme/default-colors';
import { Token } from '@/types/common';

type SelectTokenButtonProps = {
  token: Token | null;
  onClick: () => void;
};

const SelectTokenButton = ({ token, onClick }: SelectTokenButtonProps) => {
  return (
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
  );
};

export default SelectTokenButton;
